const assert = require('@barchart/common-js/lang/assert'),
	is = require('@barchart/common-js/lang/is');

module.exports = (() => {
	'use strict';

	/**
	 * @public
	 */
	class PositionGroup {
		constructor(description, items) {
			this._description = description;
			this._items = items;

			this._items.forEach((item) => {
				item.registerPriceChangeHandler((price, sender) => {

				});
			});

			this._excluded = false;
		}

		get description() {
			return this._description;
		}

		get items() {
			return this._items;
		}

		get excluded() {
			return this._excluded;
		}

		setExcluded(value) {
			if (this._excluded !== value) {
				this._excluded = value;
			}
		}

		toString() {
			return '[PositionGroup]';
		}
	}

	return PositionGroup;
})();
