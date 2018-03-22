const assert = require('@barchart/common-js/lang/assert'),
	Decimal = require('@barchart/common-js/lang/Decimal'),
	Event = require('@barchart/common-js/messaging/Event'),
	is = require('@barchart/common-js/lang/is');

module.exports = (() => {
	'use strict';

	/**
	 * @public
	 */
	class PositionItem {
		constructor(portfolio, position, summaries) {
			this._portfolio = portfolio;
			this._position = position;
			this._summaries = summaries || [ ];

			this._data = { };

			this._data.current = null;
			this._data.previous = position.previous || null;

			const snapshot = this._position.snapshot;

			this._data.basis = snapshot.basis || Decimal.ZERO;

			/*
			let market;

			if (position.previous) {
				market = snapshot.open.multiply(position.previous);
			} else {
				market = snapshot.value;
			}
			*/

			this._priceChangeEvent = new Event(this);
		}

		get portfolio() {
			return this._portfolio;
		}

		get position() {
			return this._position;
		}

		get summaries() {
			return this._summaries;
		}

		setPrice(price) {
			if (this._data.price !== price) {
				this._data.price = price;

				this._priceChangeEvent.fire(this._data);
			}
		}

		registerPriceChangeHandler(handler) {
			assert.argumentIsRequired(handler, 'handler', Function);

			this._priceChangeEvent.register(handler);
		}

		toString() {
			return '[PositionItem]';
		}
	}

	return PositionItem;
})();
