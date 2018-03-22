const assert = require('@barchart/common-js/lang/assert'),
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

			this._data.previous = null;
			this._data.current = null;

			this._items.forEach((item) => {
				item.registerPriceChangeHandler((price, sender) => {
					if (this._single) {
						data.current = price;
					} else {
						data.current = null;
					}
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

		toString() {
			return '[PositionGroup]';
		}
	}

	function calculateStaticData(group) {
		const items = group._items;
		const data = group._data;

		const updates = items.reduce(function(updates, item) {

		}, { });


	}

	return PositionGroup;
})();
