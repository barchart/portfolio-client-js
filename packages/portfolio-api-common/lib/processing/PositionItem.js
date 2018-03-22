const assert = require('@barchart/common-js/lang/assert'),
	Decimal = require('@barchart/common-js/lang/Decimal'),
	Event = require('@barchart/common-js/messaging/Event'),
	is = require('@barchart/common-js/lang/is');

const InstrumentType = require('./../data/InstrumentType');

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
			this._data.previous = null;
			this._data.basis = null;

			calculateStaticData(this);
			calculatePriceData(this, null);

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

		get data() {
			return this._data;
		}

		setPrice(price) {
			if (this._data.price !== price) {
				calculatePriceData(this, this._data.price = price);

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

	function calculateStaticData(item) {
		const position = item.position;
		const snapshot = item.position.snapshot;

		const data = item._data;

		data.previous = position.previous || null;

		let basis;

		if (snapshot.basis) {
			basis = snapshot.basis.opposite();
		} else {
			basis = Decimal.ZERO;
		}

		data.basis = basis;
	}

	function calculatePriceData(item, price) {
		const position = item.position;
		const snapshot = item.position.snapshot;

		const data = item._data;

		let market;

		if (position.instrument.type === InstrumentType.OTHER) {
			market = snapshot.value;
		} else if (position.instrument.type === InstrumentType.CASH) {
			market = snapshot.open;
		} else {
			if (price) {
				market = snapshot.open.multiply(price);
			} else {
				market = snapshot.value;
			}
		}

		data.market = market;
	}

	return PositionItem;
})();
