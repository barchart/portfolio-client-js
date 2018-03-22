const assert = require('@barchart/common-js/lang/assert'),
	Currency = require('@barchart/common-js/lang/Currency'),
	Decimal = require('@barchart/common-js/lang/Decimal'),
	formatter = require('@barchart/common-js/lang/formatter'),
	is = require('@barchart/common-js/lang/is');

module.exports = (() => {
	'use strict';

	/**
	 * @public
	 */
	class PositionGroup {
		constructor(items, currency, description, single) {
			this._items = items;
			this._currency = currency;

			this._description = description;

			this._single = is.boolean(single) && single;

			this._dataFormat = { };
			this._dataRaw = { };
			
			this._dataFormat.description = this._description;

			this._dataRaw.current = null;
			this._dataRaw.previous = null;

			this._dataFormat.current = null;
			this._dataFormat.previous = null;

			this._dataRaw.basis = null;
			this._dataRaw.market = null;

			this._dataFormat.basis = null;
			this._dataFormat.market = null;

			this._items.forEach((item) => {
				item.registerPriceChangeHandler((data, sender) => {
					if (this._single) {
						this._dataRaw.current = data.current;
						this._dataFormat.current = format(data.current, sender.position.instrument.currency);
					} else {
						this._dataRaw.current = null;
						this._dataFormat.current = null;
					}

					calculateVariablePriceData(this, item);
				});
			});

			calculateStaticData(this);
		}

		get items() {
			return this._items;
		}

		get currency() {
			return this._currency;
		}

		get description() {
			return this._description;
		}

		get data() {
			return this._dataFormat;
		}

		get single() {
			return this._single;
		}

		toString() {
			return '[PositionGroup]';
		}
	}

	function format(decimal, currency) {
		return formatter.numberToString(decimal.toFloat(), currency.precision, ',', false);
	}

	function calculateStaticData(group) {
		const items = group._items;

		const raw = group._dataRaw;
		const formatted = group._dataFormat;

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

		raw.basis = updates.basis;
		formatted.basis = format(updates.basis, Currency.USD);
	}

	function calculateVariablePriceData(group, item) {

	}

	return PositionGroup;
})();
