const array = require('@barchart/common-js/lang/array'),
	assert = require('@barchart/common-js/lang/assert'),
	ComparatorBuilder = require('@barchart/common-js/collections/sorting/ComparatorBuilder'),
	comparators = require('@barchart/common-js/collections/sorting/comparators'),
	Currency = require('@barchart/common-js/lang/Currency'),
	Decimal = require('@barchart/common-js/lang/Decimal'),
	DisposableStack = require('@barchart/common-js/collections/specialized/DisposableStack'),
	Event = require('@barchart/common-js/messaging/Event'),
	is = require('@barchart/common-js/lang/is'),
	Rate = require('@barchart/common-js/lang/Rate'),
	Tree = require('@barchart/common-js/collections/Tree');

const PositionSummaryFrame = require('./../data/PositionSummaryFrame');

const PositionLevelDefinition = require('./definitions/PositionLevelDefinition'),
	PositionLevelType = require('./definitions/PositionLevelType'),
	PositionTreeDefinition = require('./definitions/PositionTreeDefinition');

const PositionGroup = require('./PositionGroup'),
	PositionItem = require('./PositionItem');

module.exports = (() => {
	'use strict';

	const DEFAULT_CURRENCY = Currency.CAD;

	/**
	 * A container for positions which groups the positions into one or more
	 * trees for aggregation and display purposes. For example, positions could be
	 * grouped first by asset class then by position.
	 *
	 * Furthermore, the container performs aggregation (driven primarily by price
	 * changes) for each level of grouping.
	 *
	 * @public
	 * @param {Array.<PositionTreeDefinition>} definitions
	 * @param {Array.<Object>} portfolios
	 * @param {Array.<Object>} positions
	 * @param {Array.<Object>} summaries
	 */
	class PositionContainer {
		constructor(definitions, portfolios, positions, summaries) {
			assert.argumentIsArray(definitions, 'definitions', PositionTreeDefinition, 'PositionTreeDefinition');
			assert.argumentIsArray(portfolios, 'portfolios');
			assert.argumentIsArray(positions, 'positions');
			assert.argumentIsArray(summaries, 'summaries');

			this._definitions = definitions;

			this._groupBindings = { };

			this._positionSymbolAddedEvent = new Event(this);
			this._positionSymbolRemovedEvent = new Event(this);

			this._portfolios = portfolios.reduce((map, portfolio) => {
				map[portfolio.portfolio] = portfolio;

				return map;
			}, { });

			this._currentSummaryFrame = PositionSummaryFrame.YTD;
			this._currentSummaryRange = array.last(this._currentSummaryFrame.getRecentRanges(0));

			this._summariesCurrent = summaries.reduce((map, summary) => {
				addSummaryCurrent(map, summary, this._currentSummaryFrame, this._currentSummaryRange);

				return map;
			}, { });

			this._previousSummaryFrame = PositionSummaryFrame.YEARLY;
			this._previousSummaryRanges = this._previousSummaryFrame.getRecentRanges(0);

			this._summariesPrevious = summaries.reduce((map, summary) => {
				addSummaryPrevious(map, summary, this._previousSummaryFrame, this._previousSummaryRanges);

				return map;
			}, { });

			this._items = positions.reduce((items, position) => {
				const item = createPositionItem.call(this, position);

				if (item) {
					items.push(item);
				}

				return items;
			}, [ ]);

			this._symbols = this._items.reduce((map, item) => {
				addBarchartSymbol(map, item);

				return map;
			}, { });

			this._symbolsDisplay = this._items.reduce((map, item) => {
				addDisplaySymbol(map, item);

				return map;
			}, { });

			this._currencies = this._items.reduce((map, item) => {
				const currency = extractCurrency(item.position);

				if (currency) {
					const code = currency.code;

					if (!map.hasOwnProperty(code)) {
						map[code] = [ ];
					}

					map[code].push(item);
				}

				return map;
			}, { });

			this._forexSymbols = Object.keys(this._currencies).reduce((symbols, code) => {
				if (code !== DEFAULT_CURRENCY.code) {
					symbols.push(`^${DEFAULT_CURRENCY.code}${code}`);
				}

				return symbols;
			}, [ ]);

			this._forexQuotes = this._forexSymbols.map((symbol) => {
				return Rate.fromPair(Decimal.ONE, symbol);
			});
			
			this._trees = this._definitions.reduce((map, treeDefinition) => {
				const tree = new Tree();

				createGroups.call(this, tree, this._items, treeDefinition, treeDefinition.definitions);
				
				map[treeDefinition.name] = tree;

				return map;
			}, { });
		}

		/**
		 * Adds a new portfolio to the container, injecting it into aggregation
		 * trees, as necessary.
		 *
		 * @public
		 * @param {Object} portfolio
		 */
		addPortfolio(portfolio) {
			assert.argumentIsRequired(portfolio, 'portfolio', Object);
			assert.argumentIsRequired(portfolio.portfolio, 'portfolio.portfolio', String);
			assert.argumentIsRequired(portfolio.name, 'portfolio.name', String);

			const key = portfolio.portfolio;

			if (!this._portfolios.hasOwnProperty(key)) {
				this._portfolios[key] = portfolio;

				this._definitions.forEach((treeDefinition) => {
					const tree = this._trees[treeDefinition.name];
					const levelDefinitions = treeDefinition.definitions;

					let portfolioRequiredGroup = null;

					let portfolioLevelDefinition = null;
					let portfolioLevelDefinitionIndex = null;

					levelDefinitions.forEach((levelDefinition, i) => {
						if (portfolioRequiredGroup === null) {
							portfolioRequiredGroup = levelDefinition.generateRequiredGroup(portfolio);

							if (portfolioRequiredGroup !== null) {
								portfolioLevelDefinition = levelDefinition;
								portfolioLevelDefinitionIndex = i;
							}
						}
					});

					if (portfolioRequiredGroup !== null) {
						let parentTrees = [ ];

						if (portfolioLevelDefinitionIndex === 0) {
							parentTrees.push(tree);
						} else {
							const parentLevelDefinition = levelDefinitions[ portfolioLevelDefinitionIndex - 1 ];

							tree.walk((group, groupTree) => {
								if (group.definition === parentLevelDefinition) {
									parentTrees.push(groupTree);
								}
							}, false, false);
						}

						const overrideRequiredGroups = [ portfolioRequiredGroup ];

						parentTrees.forEach((t) => {
							createGroups.call(this, t, [ ], treeDefinition, levelDefinitions.slice(portfolioLevelDefinitionIndex), overrideRequiredGroups);
						});
					}
				});
			}
		}

		/**
		 * Removes an existing portfolio, and all of it's positions, from the container. This
		 * also triggers removal of the portfolio and it's positions from any applicable
		 * aggregation trees.
		 *
		 * @public
		 * @param {Object} portfolio
		 */
		removePortfolio(portfolio) {
			assert.argumentIsRequired(portfolio, 'portfolio', Object);
			assert.argumentIsRequired(portfolio.portfolio, 'portfolio.portfolio', String);

			this.startTransaction(() => {
				getPositionItemsForPortfolio(this._items, portfolio.portfolio).forEach(item => removePositionItem.call(this, item));

				delete this._portfolios[portfolio.portfolio];

				Object.keys(this._trees).forEach((key) => {
					this._trees[key].walk((group, groupNode) => {
						if (group.definition.type === PositionLevelType.PORTFOLIO && group.key === PositionLevelDefinition.getKeyForPortfolioGroup(portfolio)) {
							groupNode.sever();
						}
					}, true, false);
				});
			});
		}

		/**
		 * Adds a new position to the container or updates an existing position already
		 * in the container.
		 *
		 * @public
		 * @param {Object} position
		 * @param {Array.<Object>} summaries
		 */
		updatePosition(position, summaries) {
			assert.argumentIsRequired(position, 'position', Object);
			assert.argumentIsRequired(position.position, 'position.position', String);
			assert.argumentIsRequired(position.portfolio, 'position.portfolio', String);
			assert.argumentIsArray(summaries, 'summaries');

			if (!this._portfolios.hasOwnProperty(position.portfolio)) {
				return;
			}

			this.startTransaction(() => {
				const existingBarchartSymbols = this.getPositionSymbols(false);

				removePositionItem.call(this, this._items.find((item) => item.position.position === position.position));

				summaries.forEach((summary) => {
					addSummaryCurrent(this._summariesCurrent, summary, this._currentSummaryFrame, this._currentSummaryRange);
					addSummaryPrevious(this._summariesPrevious, summary, this._previousSummaryFrame, this._previousSummaryRanges);
				});

				const item = createPositionItem.call(this, position);

				addBarchartSymbol(this._symbols, item);
				addDisplaySymbol(this._symbolsDisplay, item);

				this._items.push(item);

				const createGroupOrInjectItem = (parentTree, treeDefinition, levelDefinitions) => {
					if (levelDefinitions.length === 0) {
						return;
					}

					const levelDefinition = levelDefinitions[0];
					const levelKey = levelDefinition.keySelector(item);

					let groupTree;

					if (parentTree.getChildren().length > 0) {
						groupTree = parentTree.findChild(childGroup => childGroup.key === levelKey) || null;
					} else {
						groupTree = null;
					}

					if (groupTree !== null) {
						groupTree.getValue().addItem(item);

						createGroupOrInjectItem(groupTree, treeDefinition, array.dropLeft(levelDefinitions));
					} else {
						createGroups.call(this, parentTree, [ item ], treeDefinition, levelDefinitions, [ ]);
					}
				};

				this._definitions.forEach(definition => createGroupOrInjectItem(this._trees[definition.name], definition, definition.definitions));

				const addedBarchartSymbol = extractSymbolForBarchart(item.position);

				if (!existingBarchartSymbols.some(existingBarchartSymbol => existingBarchartSymbol === addedBarchartSymbol)) {
					this._positionSymbolAddedEvent.fire(addedBarchartSymbol);
				}
			});
		}

		/**
		 * Removes a single position from the container.
		 *
		 * @public
		 * @param {Object} position
		 */
		removePosition(position) {
			assert.argumentIsRequired(position, 'position', Object);
			assert.argumentIsRequired(position.position, 'position.position', String);

			removePositionItem.call(this, this._items.find((item) => item.position.position === position.position));
		}

		/**
		 * Returns a distinct list of all symbols used by the positions
		 * within the container.
		 *
		 * @public
		 * @param {Boolean} display - If true, all "display" symbols are returned; otherwise Barchart symbols are returned.
		 * @returns {Array.<String>}
		 */
		getPositionSymbols(display) {
			const symbols = this._items.reduce((symbols, item) => {
				const position = item.position;

				let symbol;

				if (display) {
					symbol = extractSymbolForDisplay(position);
				} else {
					symbol = extractSymbolForBarchart(position);
				}

				if (symbol !== null) {
					symbols.push(symbol);
				}

				return symbols;
			}, [ ]);

			return array.unique(symbols);
		}

		/**
		 * Updates the quote for a single symbol; causing updates to any grouping
		 * level that contains the position(s) for the symbol.
		 *
		 * @public
		 * @param {String} symbol
		 * @param {Object} quote
		 */
		setPositionQuote(symbol, quote) {
			assert.argumentIsRequired(symbol, 'symbol', String);
			assert.argumentIsRequired(quote, 'quote', Object);

			if (this._symbols.hasOwnProperty(symbol)) {
				this._symbols[symbol].forEach(item => item.setQuote(quote));
			}
		}

		/**
		 * Returns all forex symbols that are required to do currency translations.
		 *
		 * @public
		 * @returns {Array.<String>}
		 */
		getForexSymbols() {
			return this._forexSymbols;
		}

		/**
		 * Returns all current forex quotes.
		 *
		 * @public
		 * @returns {Array.<Object>}
		 */
		getForexQuotes() {
			return this._forexQuotes;
		}

		/**
		 * Updates the forex quote for a single currency pair; causing updates to
		 * any grouping level that contains that requires translation.
		 *
		 * @public
		 * @param {String} symbol
		 * @param {Object} quote
		 */
		setForexQuote(symbol, quote) {
			assert.argumentIsRequired(symbol, 'symbol', String);
			assert.argumentIsRequired(quote, 'quote', Object);

			const rate = Rate.fromPair(quote.lastPrice, symbol);
			const index = this._forexQuotes.findIndex(existing => existing.formatPair() === rate.formatPair());

			if (index < 0) {
				this._forexQuotes.push(rate);
			} else {
				this._forexQuotes[index] = rate;
			}

			Object.keys(this._trees).forEach(key => this._trees[key].walk(group => group.setForexRate(rate), true, false));
		}

		/**
		 * Updates fundamental data for a single symbol.
		 *
		 * @public
		 * @param {String} symbol
		 * @param {Object} data
		 */
		setPositionFundamentalData(symbol, display, data) {
			assert.argumentIsRequired(symbol, 'symbol', String);
			assert.argumentIsRequired(display, 'display', Boolean);
			assert.argumentIsRequired(data, 'data', Object);

			let map;

			if (display) {
				map = this._symbolsDisplay;
			} else {
				map = this._symbols;
			}

			if (map.hasOwnProperty(symbol)) {
				map[symbol].forEach(item => item.setPositionFundamentalData(data));
			}
		}

		/**
		 * Indicates if a news article exists for a symbol.
		 *
		 * @public
		 * @param {String} symbol
		 * @param {Boolean} display
		 * @param {Boolean} exists
		 */
		setNewsArticleExists(symbol, display, exists) {
			assert.argumentIsRequired(symbol, 'symbol', String);
			assert.argumentIsRequired(display, 'display', Boolean);
			assert.argumentIsRequired(exists, 'exists', Boolean);

			let map;

			if (display) {
				map = this._symbolsDisplay;
			} else {
				map = this._symbols;
			}

			if (map.hasOwnProperty(symbol)) {
				map[symbol].forEach(item => item.setNewsArticleExists(exists));
			}
		}

		/**
		 * Returns a single level of grouping from one of the internal trees.
		 *
		 * @public
		 * @param {String} name
		 * @param {Array.<String>} keys
		 * @returns {PositionGroup}
		 */
		getGroup(name, keys) {
			assert.argumentIsRequired(name, 'name', String);
			assert.argumentIsArray(keys, 'keys', Number);

			return findNode(this._trees[name], keys).getValue();
		}

		/**
		 * Returns all child groups from a level of grouping within one of
		 * the internal trees.
		 *
		 * @public
		 * @param {String} name
		 * @param {Array.<String>} keys
		 * @returns {Array.<PositionGroup>}
		 */
		getGroups(name, keys) {
			assert.argumentIsRequired(name, 'name', String);
			assert.argumentIsArray(keys, 'keys', Number);

			return findNode(this._trees[name], keys).getChildren().map(node => node.getValue());
		}

		/**
		 * Returns all portfolios in the container.
		 *
		 * @public
		 * @return {Array.<Object>}
		 */
		getPortfolios() {
			return Object.keys(this._portfolios).map(id => this._portfolios[id]);
		}

		/**
		 * Returns all positions for the given portfolio.
		 *
		 * @public
		 * @param {String} portfolio
		 * @return {Array.<Object>}
		 */
		getPositions(portfolio) {
			assert.argumentIsRequired(portfolio, 'portfolio', String);

			return getPositionItemsForPortfolio(this._items, portfolio)
				.map((item) => {
					return item.position;
				});
		}

		/**
		 * Pauses aggregation calculations during the processing of an action.
		 *
		 * @public
		 * @param {Function} executor
		 * @param {String=|Array.<String>=} names
		 */
		startTransaction(executor, names) {
			let namesToUse;

			if (is.array(names)) {
				assert.argumentIsArray(names, 'names', String);

				namesToUse = names;
			} else {
				assert.argumentIsOptional(names, 'names', String);

				if (names) {
					namesToUse = [ names ];
				} else {
					namesToUse = Object.keys(this._trees);
				}
			}

			assert.argumentIsRequired(executor, 'executor', Function);

			namesToUse.forEach((name) => this._trees[name].walk(group => group.setSuspended(true), false, false));

			executor(this);

			namesToUse.forEach((name) => this._trees[name].walk(group => group.setSuspended(false), false, false));
		}

		/**
		 * Registers an observer for symbol addition (this occurs when a new position is added
		 * for a symbol that does not already exist in the container).
		 *
		 * @public
		 * @param {Function} handler
		 * @returns {Disposable}
		 */
		registerPositionSymbolAddedHandler(handler) {
			return this._positionSymbolAddedEvent.register(handler);
		}

		/**
		 * Registers an observer for symbol removal (this occurs when the last position for a
		 * symbol is removed from the container).
		 *
		 * @public
		 * @param {Function} handler
		 * @returns {Disposable}
		 */
		registerPositionSymbolAddedHandler(handler) {
			return this._positionSymbolRemovedEvent.register(handler);
		}

		toString() {
			return '[PositionContainer]';
		}
	}

	function findNode(tree, keys) {
		return keys.reduce((tree, key) => tree.findChild(group => group.key === key), tree);
	}

	function extractSymbolForBarchart(position) {
		if (position.instrument && position.instrument.symbol && position.instrument.symbol.barchart) {
			return position.instrument.symbol.barchart;
		} else {
			return null;
		}
	}

	function extractSymbolForDisplay(position) {
		if (position.instrument && position.instrument.symbol && position.instrument.symbol.display) {
			return position.instrument.symbol.display;
		} else {
			return null;
		}
	}

	function extractCurrency(position) {
		if (position.instrument && position.instrument.currency) {
			return position.instrument.currency;
		} else {
			return null;
		}
	}

	function addGroupBinding(group, dispoable) {
		const id = group.id;

		if (!this._groupBindings.hasOwnProperty(id)) {
			this._groupBindings[id] = new DisposableStack();
		}

		this._groupBindings[id].push(dispoable);
	}

	function initializeGroupObservers(groupTree, treeDefinition) {
		const group = groupTree.getValue();

		addGroupBinding.call(this, group, group.registerGroupExcludedChangeHandler(() => {
			groupTree.climb((parentGroup, parentTree) => {
				if (parentGroup) {
					let excludedItems = [];

					parentTree.walk((childGroup) => {
						if (childGroup.excluded) {
							excludedItems = excludedItems.concat(childGroup.items);
						}
					}, false, false);

					parentGroup.setExcludedItems(array.unique(excludedItems));
				}
			}, false);

			if (treeDefinition.exclusionDependencies.length > 0) {
				const dependantTrees = treeDefinition.exclusionDependencies.reduce((trees, name) => {
					if (this._trees.hasOwnProperty(name)) {
						trees.push(this._trees[name]);
					}

					return trees;
				}, [ ]);

				if (dependantTrees.length > 0) {
					let excludedItems = [ ];

					groupTree.getRoot().walk((childGroup) => {
						if (childGroup.excluded) {
							excludedItems = excludedItems.concat(childGroup.items);
						}
					}, false, false);

					dependantTrees.forEach((dependantTrees) => {
						dependantTrees.walk((childGroup) => {
							childGroup.setExcludedItems(excludedItems);
						}, false, false);
					});
				}
			}
		}));

		addGroupBinding.call(this, group, group.registerMarketPercentChangeHandler(() => {
			if (!groupTree.getIsRoot()) {
				groupTree.getParent().walk((childGroup) => childGroup.refreshMarketPercent());
			}
		}));
	}

	function createGroups(parentTree, items, treeDefinition, levelDefinitions, overrideRequiredGroups) {
		if (levelDefinitions.length === 0) {
			return;
		}

		const parent = parentTree.getValue() || null;

		const levelDefinition = levelDefinitions[0];

		const populatedObjects = array.groupBy(items, levelDefinition.keySelector);
		const populatedGroups = Object.keys(populatedObjects).reduce((list, key) => {
			const items = populatedObjects[key];
			const first = items[0];

			list.push(new PositionGroup(this, parent, levelDefinition, items, levelDefinition.currencySelector(first), key, levelDefinition.descriptionSelector(first), levelDefinition.aggregateCash));

			return list;
		}, [ ]);

		const requiredGroupsToUse = overrideRequiredGroups || levelDefinition.requiredGroups;

		const missingGroups = array.difference(requiredGroupsToUse.map(group => group.key), populatedGroups.map(group => group.key))
			.map((key) => {
				return requiredGroupsToUse.find(g => g.key === key);
			});

		const empty = missingGroups.map((group) => {
			return new PositionGroup(this, parent, levelDefinition, [ ], group.currency, group.key, group.description);
		});

		const compositeGroups = populatedGroups.concat(empty);

		let builder;

		if (requiredGroupsToUse.length !== 0) {
			const ordering = requiredGroupsToUse.reduce((map, group, index) => {
				map[group.description] = index;

				return map;
			}, { });

			const getIndex = (description) => {
				if (ordering.hasOwnProperty(description)) {
					return ordering[description];
				} else {
					return Number.MAX_VALUE;
				}
			};

			builder = ComparatorBuilder.startWith((a, b) => {
				return comparators.compareNumbers(getIndex(a.description), getIndex(b.description));
			}).thenBy((a, b) => {
				return comparators.compareStrings(a.description, b.description);
			});
		} else {
			builder = ComparatorBuilder.startWith((a, b) => {
				return comparators.compareStrings(a.description, b.description);
			});
		}

		compositeGroups.sort(builder.toComparator());

		compositeGroups.forEach((group) => {
			const childTree = parentTree.addChild(group);

			initializeGroupObservers.call(this, childTree, treeDefinition);

			createGroups.call(this, childTree, group.items, treeDefinition, array.dropLeft(levelDefinitions));
		});
	}

	function getPositionItemsForPortfolio(items, portfolio) {
		return items.reduce((positionItems, item) => {
			if (item.position.portfolio === portfolio) {
				positionItems.push(item);
			}

			return positionItems;
		}, [ ]);
	}

	function getSummaryArray(ranges) {
		return ranges.map(range => null);
	}

	function addSummaryCurrent(map, summary, currentSummaryFrame, currentSummaryRange) {
		if (summary.frame === currentSummaryFrame && currentSummaryRange.start.getIsEqual(summary.start.date) && currentSummaryRange.end.getIsEqual(summary.end.date)) {
			const key = summary.position;

			map[key] = summary;
		}
	}

	function addSummaryPrevious(map, summary, previousSummaryFrame, previousSummaryRanges) {
		if (summary.frame === previousSummaryFrame) {
			const key = summary.position;

			if (!map.hasOwnProperty(key)) {
				map[key] = getSummaryArray(previousSummaryRanges);
			}

			const index = previousSummaryRanges.findIndex(r => r.start.getIsEqual(summary.start.date) && r.end.getIsEqual(summary.end.date));

			if (!(index < 0)) {
				map[key][index] = summary;
			}
		}
	}

	function addBarchartSymbol(map, item) {
		const barchartSymbol = extractSymbolForBarchart(item.position);

		if (barchartSymbol) {
			if (!map.hasOwnProperty(barchartSymbol)) {
				map[barchartSymbol] = [ ];
			}

			map[barchartSymbol].push(item);
		}
	}

	function addDisplaySymbol(map, item) {
		const displaySymbol = extractSymbolForDisplay(item.position);

		if (displaySymbol) {
			if (!map.hasOwnProperty(displaySymbol)) {
				map[displaySymbol] = [ ];
			}

			map[displaySymbol].push(item);
		}
	}

	function createPositionItem(position) {
		const portfolio = this._portfolios[position.portfolio];

		let returnRef;

		if (portfolio) {
			const currentSummary = this._summariesCurrent[ position.position ] || null;
			const previousSummaries = this._summariesPrevious[ position.position ] || getSummaryArray(this._previousSummaryRanges);

			returnRef = new PositionItem(portfolio, position, currentSummary, previousSummaries);
		} else {
			returnRef = null;
		}

		return returnRef;
	}

	function removePositionItem(positionItem) {
		if (!positionItem) {
			return;
		}

		delete this._summariesCurrent[positionItem.position.position];
		delete this._summariesPrevious[positionItem.position.position];

		array.remove(this._items, i => i === positionItem);

		const barchartSymbol = extractSymbolForBarchart(positionItem.position);

		if (this._symbols.hasOwnProperty(barchartSymbol)) {
			array.remove(this._symbols[barchartSymbol], i => i === positionItem);
		}

		const displaySymbol = extractSymbolForDisplay(positionItem.position);

		if (this._symbolsDisplay.hasOwnProperty(displaySymbol)) {
			array.remove(this._symbolsDisplay[displaySymbol], i => i === positionItem);
		}

		const currency = extractCurrency(positionItem.position);

		if (currency && this._currencies.hasOwnProperty(currency.code)) {
			array.remove(this._currencies[currency.code], i => i === positionItem);
		}

		Object.keys(this._trees).forEach((key) => {
			this._trees[key].walk((group, groupNode) => {
				if (group.definition.type === PositionLevelType.POSITION && group.key === positionItem.position.position) {
					groupNode.sever();
				}
			}, true, false);
		});

		positionItem.dispose();
	}

	return PositionContainer;
})();
