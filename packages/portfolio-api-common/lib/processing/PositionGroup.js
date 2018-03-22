const assert = require('@barchart/common-js/lang/assert'),
	Decimal = require('@barchart/common-js/lang/Decimal'),
	is = require('@barchart/common-js/lang/is');

module.exports = (() => {
	'use strict';

	/**
	 * @public
	 */
	class PositionGroup {
		constructor(items, description, single) {
			this._description = description;
			this._items = items;

			this._single = is.boolean(single) && single;

			this._data = { };

			this._data.description = this._description;

			this._data.current = null;
			this._data.previous = null;

			this._data.basis = null;
			this._data.market = null;

			this._items.forEach((item) => {
				item.registerPriceChangeHandler((data, sender) => {
					if (this._single) {
						data.current = data.current;
					} else {
						data.current = null;
					}

					calculateVariablePriceData(this, item, price);
				});
			});

			calculateStaticData(this);
		}

		get description() {
			return this._description;
		}

		get data() {
			return this._data;
		}

		get items() {
			return this._items;
		}

		get single() {
			return this._single;
		}

		toString() {
			return '[PositionGroup]';
		}
	}

	function calculateStaticData(group) {
		const items = group._items;
		const data = group._data;

		let updates;

		if (group.single) {
			const item = items[0];

			updates.basis = item.basis;
		} else {
			updates = items.reduce(function(updates, item) {
				const position = item.position;
				const snapshot = item.position.snapshot;

				updates.value = updates.basis.add(snapshot.basis);

				return updates;
			}, {
				basis: Decimal.ZERO
			});
		}

		data.basis = updates.basis;
	}

	function calculateVariablePriceData(group, item, price) {

	}

	return PositionGroup;
})();
