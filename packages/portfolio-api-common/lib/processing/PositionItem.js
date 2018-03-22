const assert = require('@barchart/common-js/lang/assert'),
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
