const assert = require('@barchart/common-js/lang/assert'),
	Currency = require('@barchart/common-js/lang/Currency'),
	Decimal = require('@barchart/common-js/lang/Decimal'),
	Disposable = require('@barchart/common-js/lang/Disposable'),
	Event = require('@barchart/common-js/messaging/Event'),
	is = require('@barchart/common-js/lang/is');

const InstrumentType = require('./../data/InstrumentType');

module.exports = (() => {
	'use strict';

	/**
	 * A container for a single position, which handles quote changes and
	 * notifies observers -- which are typically parent-level {@link PositionGroup}
	 * instances.
	 *
	 * @public
	 * @param {Object} portfolio
	 * @param {Object} position
	 * @param {Object} currentSummary
	 * @param {Array.<Object>} previousSummaries
	 */
	class PositionItem extends Disposable {
		constructor(portfolio, position, currentSummary, previousSummaries) {
			super();

			this._portfolio = portfolio;
			this._position = position;

			const instrument = position.instrument;

			this._currency = instrument.currency || Currency.CAD;
			this._invalid = instrument.type.usesSymbols && (!is.object(instrument.symbol) || !is.string(instrument.symbol.barchart));

			this._currentSummary = currentSummary || null;
			this._previousSummaries = previousSummaries || [ ];

			this._data = { };

			this._data.basis = null;

			this._currentQuote = null;
			this._currentPrice = null;

			this._data.currentPrice = null;
			this._data.currentPricePrevious = null;

			this._data.market = null;
			this._data.marketChange = null;

			this._data.marketAbsolute = null;
			this._data.marketAbsoluteChange = null;

			this._data.unrealizedToday = null;
			this._data.unrealizedTodayChange = null;

			this._data.unrealized = null;
			this._data.unrealizedChange = null;

			this._data.summaryTotalCurrent = null;
			this._data.summaryTotalCurrentChange = null;

			this._data.summaryTotalPrevious = null;
			this._data.summaryTotalPrevious2 = null;

			this._data.realized = null;
			this._data.income = null;
			this._data.basisPrice = null;

			this._data.newsExists = false;
			this._data.fundamental = { };

			calculateStaticData(this);
			calculatePriceData(this, null);

			this._quoteChangedEvent = new Event(this);
			this._newsExistsChangedEvent = new Event(this);
			this._fundamentalDataChangeEvent = new Event(this);
			this._portfolioChangedEvent = new Event(this);
			this._positionItemDisposeEvent = new Event(this);
		}

		/**
		 * The portfolio of the encapsulated position.
		 *
		 * @public
		 * @returns {Object}
		 */
		get portfolio() {
			return this._portfolio;
		}

		/**
		 * The encapsulated position.
		 *
		 * @public
		 * @returns {Object}
		 */
		get position() {
			return this._position;
		}

		/**
		 * The {@link Currency} of the encapsulated position.
		 *
		 * @public
		 * @returns {Object}
		 */
		get currency() {
			return this._currency;
		}

		/**
		 * The year-to-date position summary of the encapsulated position.
		 *
		 * @public
		 * @returns {Object}
		 */
		get currentSummary() {
			return this._currentSummary;
		}

		/**
		 * Previous year's summaries for the encapsulated position.
		 *
		 * @public
		 * @returns {Object}
		 */
		get previousSummaries() {
			return this._previousSummaries;
		}

		/**
		 * Various data regarding the encapsulated position.
		 *
		 * @public
		 * @returns {*}
		 */
		get data() {
			return this._data;
		}

		/**
		 * The current quote for the symbol of the encapsulated position.
		 *
		 * @public
		 * @returns {null|{Object}}
		 */
		get quote() {
			return this._currentQuote;
		}

		updatePortfolio(portfolio) {
			assert.argumentIsRequired(portfolio, 'portfolio', Object);
			assert.argumentIsRequired(portfolio.portfolio, 'portfolio.portfolio', String);

			if (portfolio.portfolio !== this._portfolio.portfolio) {
				throw new Error('Unable to move position into new portfolio.');
			}

			if (this._portfolio !== portfolio) {
				this._portfolioChangedEvent.fire(this._portfolio = portfolio);
			}
		}

		/**
		 * Sets the current quote -- causing position-level data (e.g. market value) to
		 * be recalculated.
		 *
		 * @public
		 * @param {Object} quote
		 */
		setQuote(quote) {
			assert.argumentIsRequired(quote, 'quote', Object);

			if (this.getIsDisposed()) {
				return;
			}

			if (this._currentPricePrevious !== quote.lastPrice) {
				calculatePriceData(this, quote.lastPrice);

				this._currentPricePrevious = this._currentPrice;
				this._currentPrice = quote.lastPrice;

				this._currentQuote = quote;

				this._quoteChangedEvent.fire(this._currentQuote);
			}
		}

		/**
		 * Sets fundamental data for the position.
		 *
		 * @public
		 * @param {Object} data
		 */
		setPositionFundamentalData(data) {
			assert.argumentIsRequired(data, 'data', Object);

			if (this.getIsDisposed()) {
				return;
			}

			this._fundamentalDataChangeEvent.fire(this._data.fundamental = data);
		}

		/**
		 * Sets a flag which indicates if news article(s) exist for the encapsulated position's
		 * symbol.
		 *
		 * @public
		 * @param {Boolean} value
		 */
		setNewsArticleExists(value) {
			assert.argumentIsRequired(value, 'value', Boolean);

			if (this.getIsDisposed()) {
				return;
			}

			if (this._data.newsExists !== value) {
				this._newsExistsChangedEvent.fire(this._data.newsExists = value);
			}
		}

		/**
		 * Registers an observer for quote changes, which is fired after internal recalculations
		 * of position data are complete.
		 *
		 * @public
		 * @param {Function} handler
		 * @returns {Disposable}
		 */
		registerQuoteChangeHandler(handler) {
			return this._quoteChangedEvent.register(handler);
		}

		/**
		 * Registers an observer for fundamental data changes.
		 *
		 * @public
		 * @param {Function} handler
		 * @returns {Disposable}
		 */
		registerFundamentalDataChangeHandler(handler) {
			return this._fundamentalDataChangeEvent.register(handler);
		}

		/**
		 * Registers an observer changes to the status of news existence.
		 *
		 * @public
		 * @param {Function} handler
		 * @returns {Disposable}
		 */
		registerNewsExistsChangeHandler(handler) {
			return this._newsExistsChangedEvent.register(handler);
		}

		/**
		 * Registers an observer changes to portfolio metadata.
		 *
		 * @public
		 * @param {Function} handler
		 * @returns {Disposable}
		 */
		registerPortfolioChangeHandler(handler) {
			return this._portfolioChangedEvent.register(handler);
		}

		/**
		 * Registers an observer for object disposal.
		 *
		 * @public
		 * @param {Function} handler
		 * @returns {Disposable}
		 */
		registerPositionItemDisposeHandler(handler) {
			return this._positionItemDisposeEvent.register(handler);
		}

		_onDispose() {
			this._positionItemDisposeEvent.fire(this);

			this._quoteChangedEvent.clear();
			this._newsExistsChangedEvent.clear();
			this._fundamentalDataChangeEvent.clear();
			this._portfolioChangedEvent.clear();
			this._positionItemDisposeEvent.clear();
		}

		toString() {
			return '[PositionItem]';
		}
	}

	function calculateStaticData(item) {
		const portfolio = item.portfolio;
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
		data.summaryTotalPrevious = calculateSummaryTotal(getPreviousSummary(previousSummaries, 1));
		data.summaryTotalPrevious2 = calculateSummaryTotal(getPreviousSummary(previousSummaries, 2));

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

		let marketAbsolute = market.absolute();
		let marketAbsoluteChange;

		if (data.marketAbsolute === null) {
			marketAbsoluteChange = marketAbsolute;
		} else {
			marketAbsoluteChange = marketAbsolute.subtract(data.marketAbsolute);
		}

		data.marketAbsolute = marketAbsolute;
		data.marketAbsoluteChange = marketAbsoluteChange;

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

	function getPreviousSummary(previousSummaries, count) {
		const index = previousSummaries.length - count;

		let summary;

		if (!(index < 0)) {
			summary = previousSummaries[index];
		} else {
			summary = null;
		}

		return summary;
	}

	return PositionItem;
})();
