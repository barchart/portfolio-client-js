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

			this._price = null;
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
			if (this._price !== price) {
				this._priceChangeEvent.fire(this._price = price);
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
