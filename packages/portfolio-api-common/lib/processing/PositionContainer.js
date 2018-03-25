const array = require('@barchart/common-js/lang/array'),
	ComparatorBuilder = require('@barchart/common-js/collections/sorting/ComparatorBuilder'),
	comparators = require('@barchart/common-js/collections/sorting/comparators'),
	Currency = require('@barchart/common-js/lang/Currency'),
	assert = require('@barchart/common-js/lang/assert'),
	is = require('@barchart/common-js/lang/is'),
	Tree = require('@barchart/common-js/collections/Tree');

const PositionSummaryFrame = require('./../data/PositionSummaryFrame');

const PositionGroup = require('./PositionGroup'),
	PositionItem = require('./PositionItem');

module.exports = (() => {
	'use strict';

	/**
	 * @public
	 */
	class PositionContainer {
		constructor(portfolios, positions, summaries, definitions, defaultCurrency, summaryFrame) {
			this._definitions = definitions;
			this._defaultCurrency = defaultCurrency || Currency.CAD;
			
			const previousSummaryFrame = summaryFrame || PositionSummaryFrame.YEARLY;
			const previousSummaryRanges = previousSummaryFrame.getRecentRanges(0);

			const currentSummaryFrame = PositionSummaryFrame.YTD;
			const currentSummaryRange = array.last(currentSummaryFrame.getRecentRanges(0));

			this._summaryDescriptionCurrent = previousSummaryFrame.describeRange(array.last(previousSummaryRanges));
			this._summaryDescriptionPrevious = currentSummaryFrame.describeRange(currentSummaryRange);

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
				const position = item.position;

				if (position.instrument && position.instrument.symbol && position.instrument.symbol.barchart) {
					const symbol = position.instrument.symbol.barchart;

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

					if (!map.hasOwnProperty(currency)) {
						map[currency] = [ ];
					}

					map[currency].push(item);
				}

				return map;
			}, { });

			this._tree = new Tree();

			const createGroups = (tree, items, definitions) => {
				if (definitions.length === 0) {
					return;
				}

				const parent = tree.getValue() || null;

				const currentDefinition = definitions[0];
				const additionalDefinitions = array.dropLeft(definitions);

				const populatedObjects = array.groupBy(items, currentDefinition.keySelector);
				const populatedGroups = Object.keys(populatedObjects).map(key => populatedObjects[key]).map((items) => {
					const first = items[0];

					return new PositionGroup(this, parent, items, currentDefinition.currencySelector(first), currentDefinition.descriptionSelector(first), currentDefinition.single && items.length === 1);
				});

				const missingGroups = array.difference(currentDefinition.requiredGroups.map(group => group.description), populatedGroups.map(group => group.description));

				const empty = missingGroups.map((description) => {
					return new PositionGroup(this, parent, [ ], currentDefinition.requiredGroups.find(group => group.description === description).currency, description);
				});

				const compositeGroups = populatedGroups.concat(empty);

				let builder;

				if (currentDefinition.requiredGroups.length !== 0) {
					const ordering = currentDefinition.requiredGroups.reduce((map, group, index) => {
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
					const child = tree.addChild(group);

					group.registerMarketPercentChangeHandler(() => {
						this._tree.walk((childGroup) => childGroup.refreshMarketPercent());
					});

					createGroups(child, group.items, additionalDefinitions);
				});
			};

			createGroups(this._tree, this._items, this._definitions);
		}

		get defaultCurrency() {
			return this._defaultCurrency;
		}
		
		getCurrentSummaryDescription() {
			return this._summaryDescriptionCurrent;
		}
		
		getPreviousSummaryDescription() {
			return this._summaryDescriptionPrevious;
		}

		startTransaction(executor) {
			assert.argumentIsRequired(executor, 'executor', Function);

			this._tree.walk(group => group.setSuspended(true), false, false);

			executor(this);

			this._tree.walk(group => group.setSuspended(false), false, false);
		}
		
		getSymbols() {
			return Object.keys(this._symbols);
		}

		setPrice(symbol, price) {
			if (this._symbols.hasOwnProperty(symbol)) {
				this._symbols[symbol].forEach(item => item.setPrice(price));
			}
		}

		getCurrencySymbols() {
			const codes = Object.keys(this._currencies);

			return codes.reduce((symbols, code) => {
				if (code !== this._defaultCurrency) {
					symbols.push(`^${this._defaultCurrency}${code}`);
				}

				return symbols;
			}, [ ]);
		}

		setExchangeRate(symbol, price) {

		}

		getGroup(keys) {
			const node = keys.reduce((tree, key) => {
				tree = tree.findChild(group => group.description === key);

				return tree;
			}, this._tree);

			return node.getValue();
		}

		getGroups(keys) {
			const node = keys.reduce((tree, key) => {
				tree = tree.findChild(group => group.description === key);

				return tree;
			}, this._tree);

			return node.getChildren().map((node) => node.getValue());
		}

		toString() {
			return '[PositionContainer]';
		}
	}

	function getSummaryArray(ranges) {
		return ranges.map(range => null);
	}

	return PositionContainer;
})();
