const array = require('@barchart/common-js/lang/array'),
	ComparatorBuilder = require('@barchart/common-js/collections/sorting/ComparatorBuilder'),
	comparators = require('@barchart/common-js/collections/sorting/comparators'),
	Currency = require('@barchart/common-js/lang/Currency'),
	assert = require('@barchart/common-js/lang/assert'),
	is = require('@barchart/common-js/lang/is'),
	Tree = require('@barchart/common-js/collections/Tree');

const InstrumentType = require('./../data/InstrumentType');

const PositionGroup = require('./PositionGroup'),
	PositionItem = require('./PositionItem');

module.exports = (() => {
	'use strict';

	/**
	 * @public
	 */
	class PositionContainer {
		constructor(portfolios, positions, summaries, definitions, defaultCurrency) {
			this._definitions = definitions;
			this._defaultCurrency = defaultCurrency || Currency.CAD;

			this._portfolios = portfolios.reduce((map, portfolio) => {
				map[portfolio.portfolio] = portfolio;

				return map;
			}, { });

			this._summaries = summaries.reduce((map, summary) => {
				const key = summary.position;

				if (!map.hasOwnProperty(key)) {
					map[key] = [ ];
				}

				map[key].push(summary);

				return map;
			}, { });

			this._items = positions.reduce((items, position) => {
				const portfolio = this._portfolios[position.portfolio];

				if (position) {
					const summaries = this._summaries[position.position] || [ ];

					items.push(new PositionItem(portfolio, position, summaries));
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

				const currentDefinition = definitions[0];
				const additionalDefinitions = array.dropLeft(definitions);

				const populatedObjects = array.groupBy(items, currentDefinition.keySelector);
				const populatedGroups = Object.keys(populatedObjects).map(key => populatedObjects[key]).map((items) => {
					const first = items[0];

					return new PositionGroup(items, currentDefinition.currencySelector(first), currentDefinition.descriptionSelector(first), currentDefinition.single && items.length === 1);
				});

				const missingGroups = array.difference(currentDefinition.requiredGroups.map(group => group.description), populatedGroups.map(group => group.description));

				const empty = missingGroups.map((description) => {
					return new PositionGroup([ ], currentDefinition.requiredGroups.find(group => group.description === description).currency, description);
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

					createGroups(child, group.items, additionalDefinitions);
				});
			};

			createGroups(this._tree, this._items, this._definitions);
		}

		get defaultCurrency() {
			return this._defaultCurrency;
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

		setExchangeRage(symbol, price) {

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

	return PositionContainer;
})();
