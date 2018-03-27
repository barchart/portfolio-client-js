const array = require('@barchart/common-js/lang/array'),
	assert = require('@barchart/common-js/lang/assert'),
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
		constructor(portfolio, position, currentSummary, previousSummaries) {
			this._portfolio = portfolio;
			this._position = position;

			this._currentSummary = currentSummary || null;
			this._previousSummaries = previousSummaries || [ ];

			this._data = { };

			this._data.basis = null;

			this._currentQuote = null;
			this._previousQuote = null;

			this._data.currentPrice = null;
			this._data.previousPrice = null;

			this._data.market = null;
			this._data.marketChange = null;

			this._data.unrealizedToday = null;
			this._data.unrealizedTodayChange = null;

			this._data.unrealized = null;
			this._data.unrealizedChange = null;
			
			this._data.summaryTotalCurrent = null;
			this._data.summaryTotalCurrentChange = null;

			this._data.summaryTotalPrevious = null;

			this._data.realized = null;
			this._data.income = null;
			this._data.basisPrice = null;

			this._excluded = false;

			calculateStaticData(this);
			calculatePriceData(this, null);

			this._quoteChangedEvent = new Event(this);
			this._excludedChangeEvent = new Event(this);
		}

		get portfolio() {
			return this._portfolio;
		}

		get position() {
			return this._position;
		}

		get currentSummary() {
			return this._currentSummary;
		}
		
		get previousSummaries() {
			return this._previousSummaries;
		}

		get data() {
			return this._data;
		}

		get quote() {
			return this._currentQuote;
		}

		get excluded() {
			return this._excluded;
		}

		setQuote(quote) {
			assert.argumentIsRequired(quote, 'quote', Object);

			if (this._previousQuote === null || this._previousQuote.lastPrice !== quote.lastPrice) {
				calculatePriceData(this, quote.lastPrice);

				this._previousQuote = this._currentQuote;
				this._currentQuote = quote;

				this._quoteChangedEvent.fire(this._currentQuote);
			}
		}

		setExcluded(value) {
			assert.argumentIsRequired(value, 'value', Boolean);

			if (this._excluded !== value) {
				this._excludedChangeEvent.fire(this, this._excluded = value);
			}
		}

		registerQuoteChangeHandler(handler) {
			this._quoteChangedEvent.register(handler);
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
		const previousSummaries = item.previousSummaries;

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
		data.unrealized = Decimal.ZERO;

		data.income = snapshot.income;

		data.summaryTotalCurrent = calculateSummaryTotal(item.currentSummary);
		data.summaryTotalPrevious = calculateSummaryTotal(array.last(previousSummaries));

		if (snapshot.open.getIsZero()) {
			data.basisPrice = Decimal.ZERO;
		} else {
			data.basisPrice = basis.divide(snapshot.open);
		}
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

		const summary = item.currentSummary;

		if (summary && price) {
			const period = summary.period;

			let unrealized = summary.end.open.multiply(price).add(summary.end.basis);
			let unrealizedChange;

			if (data.unrealizedToday !== null) {
				unrealizedChange = unrealized.subtract(data.unrealized);
			} else {
				unrealizedChange = Decimal.ZERO;
			}

			let summaryTotalCurrent = period.realized.add(period.income).add(unrealized);
			let summaryTotalCurrentChange;

			if (data.summaryTotalCurrent !== null) {
				summaryTotalCurrentChange = summaryTotalCurrent.subtract(data.summaryTotalCurrent);
			}  else {
				summaryTotalCurrentChange = Decimal.ZERO;
			}

			data.summaryTotalCurrent = summaryTotalCurrent;
			data.summaryTotalCurrentChange = summaryTotalCurrentChange;

			data.unrealized = unrealized;
			data.unrealizedChange = unrealizedChange;
		} else {
			data.summaryTotalCurrentChange = Decimal.ZERO;

			data.unrealized = Decimal.ZERO;
			data.unrealizedChange = Decimal.ZERO;
		}
	}
	
	function calculateSummaryTotal(summary) {
		let returnRef;
		
		if (summary) {
			const period = summary.period;

			returnRef = period.realized.add(period.income).add(period.unrealized);
		} else {
			returnRef = Decimal.ZERO;
		}
		
		return returnRef;
	}

	return PositionItem;
})();
