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

			this._data.basis = null;

			this._data.currentPrice = null;
			this._data.previousPrice = null;

			this._data.market = null;
			this._data.marketChange = null;

			this._data.unrealizedToday = null;
			this._data.unrealizedTodayChange = null;

			this._data.realized = null;
			this._data.income = null;

			this._excluded = false;

			calculateStaticData(this);
			calculatePriceData(this, null);

			this._priceChangeEvent = new Event(this);
			this._excludedChangeEvent = new Event(this);
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

		get excluded() {
			return this._excluded;
		}

		setPrice(price) {
			assert.argumentIsRequired(price, 'price', Number);

			if (this._data.price !== price) {
				calculatePriceData(this, this._data.currentPrice = price);

				this._priceChangeEvent.fire(this._data);
			}
		}

		setExcluded(value) {
			assert.argumentIsRequired(value, 'value', Boolean);

			if (this._excluded !== value) {
				this._excludedChangeEvent.fire(this, this._excluded = value);
			}
		}

		registerPriceChangeHandler(handler) {
			this._priceChangeEvent.register(handler);
		}

		registerExcludedChangeHandler(handler) {
			this._excludedChangeEvent.register(handler);
		}


		toString() {
			return '[PositionItem]';
		}
	}

	function calculateStaticData(item) {
		const position = item.position;
		const snapshot = item.position.snapshot;
		const summaries = item.summaries;

		const data = item._data;

		data.previousPrice = position.previous || null;

		let basis;

		if (snapshot.basis) {
			basis = snapshot.basis.opposite();
		} else {
			basis = Decimal.ZERO;
		}

		data.basis = basis;

		data.realized = snapshot.gain;
		data.income = snapshot.income;

		const getSummaryTotal = (index) => {
			let summaryTotal;

			if (summaries.length > index && summaries[index] !== null) {
				const period = summaries[index].period;

				summaryTotal = period.realized.add(period.unrealized).add(period.income);
			} else {
				summaryTotal = Decimal.ZERO;
			}

			return summaryTotal;
		};

		data.summaryOneTotal = getSummaryTotal(0);
		data.summaryTwoTotal = getSummaryTotal(1);
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

		let marketChange;

		if (data.market === null) {
			marketChange = market;
		} else {
			marketChange = market.subtract(data.market);
		}

		data.market = market;
		data.marketChange = marketChange;
		
		let unrealizedToday;
		let unrealizedTodayChange;

		if (data.previousPrice && price) {
			unrealizedToday = market.subtract(snapshot.open.multiply(data.previousPrice));

			if (data.unrealizedToday !== null) {
				unrealizedTodayChange = unrealizedToday.subtract(data.unrealizedToday);
			} else {
				unrealizedTodayChange = unrealizedToday;
			}
		} else {
			unrealizedToday = Decimal.ZERO;
			unrealizedTodayChange = Decimal.ZERO;
		}

		data.unrealizedToday = unrealizedToday;
		data.unrealizedTodayChange = unrealizedTodayChange;
	}

	return PositionItem;
})();
