const array = require('@barchart/common-js/lang/array'),
	assert = require('@barchart/common-js/lang/assert'),
	is = require('@barchart/common-js/lang/is'),
	Tree = require('@barchart/common-js/lang/Tree');

const PositionGroup = require('./PositionGroup'),
	PositionGroupDefinition = require('./PositionGroupDefinition'),
	PositionItem = require('./PositionItem');

module.exports = (() => {
	'use strict';

	/**
	 * @public
	 */
	class PositionContainer {
		constructor(portfolios, positions, summaries, definitions) {
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
				let position = item.position;
				let symbol = null;

				if (position.instrument && position.instrument.symbol && position.instrument.barchart) {
					symbol = position.instrument.barchart;

					if (!map.hasOwnProperty(symbol)) {
						map[symbol] = [ ];
					}

					map[symbol].push(item);
				}

				return map;
			}, { });

			this._definitions = definitions || [ new PositionGroupDefinition('Totals', i => true, i => 'Totals', [ 'Totals' ]) ];

			this._tree = new Tree();

			const createGroups = (tree, items, definitions) => {
				if (definitions.length === 0) {
					return;
				}

				const definition = definitions[0];

				const populated = array.groupBy(definition.keySelector).map((items) => {
					const first = group[0];

					return new PositionGroup(definition.descriptionSelector(first), items);
				});

				const missing = array.difference(definition.requiredGroups, populated.map(group => group.description));

				const empty = missing.map((description) => {
					return new PositionGroup(description, [ ]);
				});

				const composite = populated.concat(empty);

				composite.forEach((group) => {
					const child = this._tree.addChild(group);

					createGroups(child, group.items, definitions.splice(1, definitions.length - 1));
				});
			};

			createGroups(this._tree, this._items, this._definitions);
		}

		setPrice(symbol, price) {
			if (this._symbols.hasOwnProperty(symbol)) {
				this._symbols.forEach(item.setPrice(price));
			}
		}

		toString() {
			return '[PositionContainer]';
		}
	}

	return PositionContainer;
})();
