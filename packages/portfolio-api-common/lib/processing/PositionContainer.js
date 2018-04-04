const array = require('@barchart/common-js/lang/array'),
	assert = require('@barchart/common-js/lang/assert'),
	ComparatorBuilder = require('@barchart/common-js/collections/sorting/ComparatorBuilder'),
	comparators = require('@barchart/common-js/collections/sorting/comparators'),
	Currency = require('@barchart/common-js/lang/Currency'),
	Decimal = require('@barchart/common-js/lang/Decimal'),
	DisposableStack = require('@barchart/common-js/collections/specialized/DisposableStack'),
	is = require('@barchart/common-js/lang/is'),
	Rate = require('@barchart/common-js/lang/Rate'),
	Tree = require('@barchart/common-js/collections/Tree');

const PositionSummaryFrame = require('./../data/PositionSummaryFrame');

const PositionTreeDefinition = require('./definitions/PositionTreeDefinition');

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

			const previousSummaryFrame = PositionSummaryFrame.YEARLY;
			const previousSummaryRanges = previousSummaryFrame.getRecentRanges(0);

			const currentSummaryFrame = PositionSummaryFrame.YTD;
			const currentSummaryRange = array.last(currentSummaryFrame.getRecentRanges(0));

			this._definitions = definitions;

			this._groupBindings = { };

			this._portfolios = portfolios.reduce((map, portfolio) => {
				map[portfolio.portfolio] = portfolio;

				return map;
			}, { });

			this._summariesCurrent = summaries.reduce((map, summary) => {
				if (summary.frame === currentSummaryFrame && currentSummaryRange.start.getIsEqual(summary.start.date) && currentSummaryRange.end.getIsEqual(summary.end.date)) {
					const key = summary.position;

					map[key] = summary;
				}

				return map;
			}, { });
			
			this._summariesPrevious = summaries.reduce((map, summary) => {
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

				return map;
			}, { });

			this._items = positions.reduce((items, position) => {
				const portfolio = this._portfolios[position.portfolio];

				if (position) {
					const currentSummary = this._summariesCurrent[position.position] || null;
					const previousSummaries = this._summariesPrevious[position.position] || getSummaryArray(previousSummaryRanges);

					items.push(new PositionItem(portfolio, position, currentSummary, previousSummaries));
				}

				return items;
			}, [ ]);

			this._symbols = this._items.reduce((map, item) => {
				const symbol = extractSymbolForBarchart(item.position);

				if (symbol) {
					if (!map.hasOwnProperty(symbol)) {
						map[symbol] = [ ];
					}

					map[symbol].push(item);
				}

				return map;
			}, { });

			this._symbolsDisplay = this._items.reduce((map, item) => {
				const symbol = extractSymbolForDisplay(item.position);

				if (symbol) {
					if (!map.hasOwnProperty(symbol)) {
						map[symbol] = [ ];
					}

					map[symbol].push(item);
				}

				return map;
			}, { });

			this._currencies = this._items.reduce((map, item) => {
				const position = item.position;

				if (position.instrument && position.instrument.currency) {
					const currency = position.instrument.currency;
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

				createGroups.call(this, tree, tree, this._items, treeDefinition, treeDefinition.definitions);
				
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
							createGroups.call(this, tree, t, [ ], treeDefinition, levelDefinitions.slice(portfolioLevelDefinitionIndex), overrideRequiredGroups);
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
				getPositionItemsForPortfolio(this._items, portfolio.portfolio).forEach(i => removePositionItem.call(this, i));
			});
		}

		mutatePosition(position, summary) {

		}

		removePosition(position) {
			removePositionItem.call(this, this._items.find((item) => item.position.position === position));
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
		 * @param {String} names
		 * @param {Array.<String> keys
		 * @returns {PositionGroup}
		 */
		getGroup(names, keys) {
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
		 * @param {Array.<String> keys
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

			return getPositionItemsForPortfolio(this._items, portfolio).map(item => item.position);
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

		toString() {
			return '[PositionContainer]';
		}
	}

	function findNode(tree, keys) {
		return keys.reduce((tree, key) => tree.findChild(group => group.key === key), tree);
	}

	function getSummaryArray(ranges) {
		return ranges.map(range => null);
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

	function addGroupBinding(group, dispoable) {
		const id = group.id;

		if (!this._groupBindings.hasOwnProperty(id)) {
			this._groupBindings[id] = new DisposableStack();
		}

		this._groupBindings[id].push(dispoable);
	}

	function createGroups(parentTree, currentTree, items, treeDefinition, levelDefinitions, overrideRequiredGroups) {
		if (levelDefinitions.length === 0) {
			return;
		}

		const parent = currentTree.getValue() || null;

		const levelDefinition = levelDefinitions[0];

		const populatedObjects = array.groupBy(items, levelDefinition.keySelector);
		const populatedGroups = Object.keys(populatedObjects).reduce((list, key) => {
			const items = populatedObjects[key];
			const first = items[0];

			list.push(new PositionGroup(this, parent, levelDefinition, items, levelDefinition.currencySelector(first), key, levelDefinition.descriptionSelector(first), levelDefinition.single && items.length === 1, levelDefinition.aggregateCash));

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

		const initializeGroupObservers = (group, groupTree) => {
			addGroupBinding.call(this, group, group.registerGroupExcludedChangeHandler((excluded, sender) => {
				groupTree.climb((parentGroup) => {
					if (parentGroup) {
						let excludedItems = [];

						currentTree.walk((childGroup) => {
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

						parentTree.walk((childGroup) => {
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
		};

		compositeGroups.forEach((group) => {
			const childTree = currentTree.addChild(group);

			initializeGroupObservers(group, childTree);

			addGroupBinding.call(this, group, group.registerMarketPercentChangeHandler(() => {
				currentTree.walk((childGroup) => childGroup.refreshMarketPercent());
			}));

			createGroups.call(this, parentTree, childTree, group.items, treeDefinition, array.dropLeft(levelDefinitions));
		});
	}

	function getPositionItemsForPortfolio(items, portfolio) {
		return items.reduce((positionItems, item) => {
			if (item.position.portfolio === portfolio) {
				positionItems.push(item.position);
			}

			return positionItems;
		}, [ ]);
	}

	function removePositionItem(positionItem) {
		if (!positionItem) {
			return;
		}

		positionItem.dispose();
	}

	return PositionContainer;
})();
