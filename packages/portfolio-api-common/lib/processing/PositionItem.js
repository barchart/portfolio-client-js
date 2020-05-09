const assert = require('@barchart/common-js/lang/assert'),
	Currency = require('@barchart/common-js/lang/Currency'),
	Decimal = require('@barchart/common-js/lang/Decimal'),
	Disposable = require('@barchart/common-js/lang/Disposable'),
	Event = require('@barchart/common-js/messaging/Event'),
	is = require('@barchart/common-js/lang/is');

const InstrumentType = require('./../data/InstrumentType'),
	PositionDirection = require('./../data/PositionDirection');

module.exports = (() => {
	'use strict';

	/**
	 * A container for a single position, which handles quote changes and notifies
	 * observers -- which are typically parent-level {@link PositionGroup}
	 * instances.
	 *
	 * @public
	 * @param {Object} portfolio
	 * @param {Object} position
	 * @param {Object} currentSummary
	 * @param {Object[]} previousSummaries
	 * @param {Boolean} reporting
	 */
	class PositionItem extends Disposable {
		constructor(portfolio, position, currentSummary, previousSummaries, reporting) {
			super();

			this._portfolio = portfolio;
			this._position = position;

			const instrument = position.instrument;

			this._currency = instrument.currency || Currency.CAD;
			this._invalid = instrument.type.usesSymbols && (!is.object(instrument.symbol) || !is.string(instrument.symbol.barchart));

			this._currentSummary = currentSummary || null;
			this._previousSummaries = previousSummaries || [ ];

			this._reporting = reporting;

			this._data = { };

			this._data.basis = null;

			this._currentQuote = null;
			this._previousQuote = null;
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

			this._data.marketPrevious = null;
			this._data.marketPrevious2 = null;

			this._data.quantity = null;
			this._data.quantityPrevious = null;

			this._data.realized = null;
			this._data.income = null;
			this._data.basisPrice = null;

			this._data.periodIncome = null;
			this._data.periodRealized = null;

			this._data.periodUnrealized = null;
			this._data.periodUnrealizedChange = null;

			this._data.periodPrice = null;
			this._data.periodPricePrevious = null;

			this._data.periodGain = null;
			this._data.periodGainChange = null;

			this._data.periodGainPrevious = null;
			this._data.periodGainPrevious2 = null;

			this._data.periodDivisor = null;
			this._data.periodDivisorChange = null;

			this._data.periodDivisorPrevious = null;
			this._data.periodDivisorPrevious2 = null;

			this._data.initiate = null;

			this._data.totalDivisor = null;

			this._data.newsExists = false;
			this._data.fundamental = { };
			this._data.calculating = getIsCalculating(position);
			this._data.locked = getIsLocked(position);

			this._quoteChangedEvent = new Event(this);
			this._newsExistsChangedEvent = new Event(this);
			this._fundamentalDataChangedEvent = new Event(this);
			this._lockChangedEvent = new Event(this);
			this._calculatingChangedEvent = new Event(this);
			this._portfolioChangedEvent = new Event(this);
			this._positionItemDisposeEvent = new Event(this);

			calculateStaticData(this);
			calculatePriceData(this, null);
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
		 * Indicates if the position's symbol is invalid.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get invalid() {
			return this._invalid;
		}

		/**
		 * The current summary of the encapsulated position.
		 *
		 * @public
		 * @returns {Object}
		 */
		get currentSummary() {
			return this._currentSummary;
		}

		/**
		 * Previous summaries for the encapsulated position.
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
		 * @returns {Object}
		 */
		get data() {
			return this._data;
		}

		/**
		 * The most recent quote for the symbol of the encapsulated position.
		 *
		 * @public
		 * @returns {null|Object}
		 */
		get quote() {
			return this._currentQuote;
		}

		/**
		 * The second most recent quote for the symbol of the encapsulated position.
		 *
		 * @public
		 * @returns {null|Object}
		 */
		get previousQuote() {
			return this._previousQuote;
		}

		/**
		 * The current price.
		 *
		 * @return {null|Number}
		 */
		get currentPrice() {
			return this._currentPrice;
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
				if (quote.previousPrice) {
					this._data.previousPrice = quote.previousPrice;
				}

				calculatePriceData(this, quote.lastPrice);

				this._currentPricePrevious = this._currentPrice;
				this._currentPrice = quote.lastPrice;

				this._previousQuote = this._currentQuote;
				this._currentQuote = quote;

				this._quoteChangedEvent.fire(this._currentQuote);
			}
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

			this._fundamentalDataChangedEvent.fire(this._data.fundamental = data);
		}

		/**
		 * Sets a position's lock status.
		 *
		 * @public
		 * @param {Object} position
		 */
		setPositionLock(position) {
			assert.argumentIsRequired(position, 'position');

			if (this.getIsDisposed()) {
				return;
			}

			const value = getIsLocked(position);

			if (this._data.locked !== value) {
				this._lockChangedEvent.fire(this._data.locked = value);
			}
		}

		/**
		 * Sets a position's calculating status.
		 *
		 * @public
		 * @param {Object} position
		 */
		setPositionCalculating(position) {
			assert.argumentIsRequired(position, 'position', Object);

			if (this.getIsDisposed()) {
				return;
			}

			const value = getIsCalculating(position);

			if (this._data.calculating !== value) {
				this._calculatingChangedEvent.fire(this._data.calculating = value);
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
		 * Registers an observer for fundamental data changes.
		 *
		 * @public
		 * @param {Function} handler
		 * @returns {Disposable}
		 */
		registerFundamentalDataChangeHandler(handler) {
			return this._fundamentalDataChangedEvent.register(handler);
		}

		/**
		 * Registers an observer for position lock changes.
		 *
		 * @public
		 * @param {Function} handler
		 * @returns {Disposable}
		 */
		registerLockChangeHandler(handler) {
			return this._lockChangedEvent.register(handler);
		}

		/**
		 * Registers an observer for position calculating changes.
		 *
		 * @public
		 * @param {Function} handler
		 * @return {Disposable}
		 */
		registerCalculatingChangeHandler(handler) {
			return this._calculatingChangedEvent.register(handler);
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
			this._fundamentalDataChangedEvent.clear();
			this._lockChangedEvent.clear();
			this._portfolioChangedEvent.clear();
			this._positionItemDisposeEvent.clear();
		}

		toString() {
			return '[PositionItem]';
		}
	}

	function calculateStaticData(item) {
		const position = item.position;

		const currentSummary = item.currentSummary;

		const previousSummary1 = getPreviousSummary(item.previousSummaries, 1);
		const previousSummary2 = getPreviousSummary(item.previousSummaries, 2);
		const previousSummary3 = getPreviousSummary(item.previousSummaries, 3);

		const snapshot = getSnapshot(position, currentSummary, item._reporting);

		const data = item._data;

		data.initiate = guessInitiateDirection(item.previousSummaries, item.currentSummary);

		data.quantity = snapshot.open;
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

		data.marketPrevious = previousSummary1 === null ? Decimal.ZERO : previousSummary1.end.value;
		data.marketPrevious2 = previousSummary2 === null ? Decimal.ZERO : previousSummary2.end.value;
		data.quantityPrevious = previousSummary1 === null ? Decimal.ZERO : previousSummary1.end.open;

		data.periodGain = calculatePeriodGain(position.instrument.type, data.initiate, currentSummary, previousSummary1);
		data.periodGainPrevious = calculatePeriodGain(position.instrument.type, data.initiate, previousSummary1, previousSummary2);
		data.periodGainPrevious2 = calculatePeriodGain(position.instrument.type, data.initiate, previousSummary2, previousSummary3);

		data.periodIncome = currentSummary !== null ? currentSummary.period.income : Decimal.ZERO;
		data.periodRealized = currentSummary !== null ? currentSummary.period.realized : Decimal.ZERO;
		data.periodUnrealized = calculatePeriodUnrealized(position.instrument.type, data.periodGain, data.periodRealized, data.periodIncome);

		data.periodDivisor = calculatePeriodDivisor(position.instrument.type, data.initiate, currentSummary, previousSummary1);
		data.periodDivisorPrevious = calculatePeriodDivisor(position.instrument.type, data.initiate, previousSummary1, previousSummary2);
		data.periodDivisorPrevious2 = calculatePeriodDivisor(position.instrument.type, data.initiate, previousSummary2, previousSummary3);

		if (snapshot.open.getIsZero()) {
			data.basisPrice = Decimal.ZERO;
		} else {
			data.basisPrice = basis.divide(snapshot.open);
		}

		if (currentSummary && !currentSummary.end.open.getIsZero()) {
			data.periodPrice = currentSummary.end.value.divide(currentSummary.end.open);
		} else {
			data.periodPrice = null;
		}

		if (previousSummary1 && !previousSummary1.end.open.getIsZero()) {
			data.periodPricePrevious = previousSummary1.end.value.divide(previousSummary1.end.open);
		} else {
			data.periodPricePrevious = null;
		}

		data.totalDivisor = calculateTotalDivisor(position.instrument.type, data.initiate, currentSummary, position);
	}

	function calculatePriceData(item, price) {
		const position = item.position;
		const snapshot = getSnapshot(position, item.currentSummary, item._reporting);

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

		const currentSummary = item.currentSummary;
		const previousSummary = getPreviousSummary(item.previousSummaries, 1);

		if (currentSummary && position.instrument.type !== InstrumentType.CASH) {
			let priceToUse;

			if (price) {
				priceToUse = price;
			} else if (data.previousPrice) {
				priceToUse = new Decimal(data.previousPrice);
			} else if (!currentSummary.end.open.getIsZero()) {
				priceToUse = currentSummary.end.value.divide(currentSummary.end.open);
			} else {
				priceToUse = null;
			}

			if (priceToUse !== null) {
				let unrealized = currentSummary.end.open.multiply(priceToUse).add(currentSummary.end.basis);
				let unrealizedChange;

				if (data.unrealized !== null) {
					unrealizedChange = unrealized.subtract(data.unrealized);
				} else {
					unrealizedChange = Decimal.ZERO;
				}

				data.unrealized = unrealized;
				data.unrealizedChange = unrealizedChange;

				let periodGain = calculatePeriodGain(position.instrument.type, data.initiate, currentSummary, previousSummary, priceToUse);
				let periodGainChange;

				if (data.periodGain !== null) {
					periodGainChange = periodGain.subtract(data.periodGain);
				} else {
					periodGainChange = Decimal.ZERO;
				}

				data.periodGain = periodGain;
				data.periodGainChange = periodGainChange;

				let periodUnrealized = calculatePeriodUnrealized(position.instrument.type, data.periodGain, data.periodRealized, data.periodIncome);
				let periodUnrealizedChange;

				if (data.periodUnrealized !== null) {
					periodUnrealizedChange = periodUnrealized.subtract(data.periodUnrealized);
				} else {
					periodUnrealizedChange = Decimal.ZERO;
				}

				data.periodUnrealized = periodUnrealized;
				data.periodUnrealizedChange = periodUnrealizedChange;
			} else {
				data.unrealizedChange = Decimal.ZERO;
				data.periodUnrealizedChange = Decimal.ZERO;
				data.periodGainChange = Decimal.ZERO;
			}
		} else {
			data.unrealizedChange = Decimal.ZERO;
			data.periodUnrealizedChange = Decimal.ZERO;
			data.periodGainChange = Decimal.ZERO;
		}
	}

	function guessInitiateDirection(previousSummaries, currentSummary) {
		const summaries = previousSummaries.concat(currentSummary);

		const direction = summaries.reduce((accumulator, summary) => {
			let returnRef = accumulator;

			if (summary !== null && summary.start.direction !== PositionDirection.EVEN) {
				returnRef = summary.start.direction;
			}

			if (summary !== null && summary.end.direction !== PositionDirection.EVEN) {
				returnRef = summary.end.direction;
			}

			return returnRef;
		}, null);

		return direction || PositionDirection.LONG;
	}

	function calculatePeriodGain(type, direction, currentSummary, previousSummary, overridePrice) {
		let returnRef;

		if (currentSummary && type !== InstrumentType.CASH) {
			let startValue;

			if (previousSummary) {
				startValue = previousSummary.end.value;
			} else {
				startValue = Decimal.ZERO;
			}

			let endValue;

			if (overridePrice) {
				endValue = currentSummary.end.open.multiply(overridePrice);
			} else {
				endValue = currentSummary.end.value;
			}

			const valueChange = endValue.subtract(startValue);
			const tradeChange = currentSummary.period.sells.subtract(currentSummary.period.buys.opposite());
			const incomeChange = currentSummary.period.income;

			returnRef = valueChange.add(tradeChange).add(incomeChange);
		} else {
			returnRef = Decimal.ZERO;
		}

		return returnRef;
	}

	function calculatePeriodDivisor(type, direction, currentSummary, previousSummary) {
		let returnRef;

		if (currentSummary && type !== InstrumentType.CASH) {
			let startValue;

			if (previousSummary) {
				startValue = previousSummary.end.value;
			} else {
				startValue = Decimal.ZERO;
			}

			if (direction === PositionDirection.SHORT) {
				returnRef = startValue.opposite().add(currentSummary.period.sells);
			} else {
				returnRef = startValue.add(currentSummary.period.buys.opposite());
			}
		} else {
			returnRef = Decimal.ZERO;
		}

		return returnRef;
	}

	function calculatePeriodUnrealized(type, periodGain, periodRealized, periodIncome) {
		let returnRef;

		if (type !== InstrumentType.CASH) {
			returnRef = periodRealized.add(periodIncome).subtract(periodGain).opposite();
		} else {
			returnRef = Decimal.ZERO;
		}

		return returnRef;
	}

	function calculateTotalDivisor(type, direction, finalSummary, position) {
		let returnRef;

		// 2019-06-05, BRI. We should be reading from the summary -- in case we are
		// running for a previous period. However, the summary does not have buy and
		// sell totals for the entire history. Could be added.

		if (finalSummary && type !== InstrumentType.CASH) {
			if (direction === PositionDirection.SHORT) {
				returnRef = position.snapshot.sells;
			} else {
				returnRef = position.snapshot.buys.opposite();
			}
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

	function getIsLocked(position) {
		assert.argumentIsRequired(position, 'position');

		return is.object(position.system) && is.boolean(position.system.locked) && position.system.locked;
	}

	function getIsCalculating(position) {
		assert.argumentIsRequired(position, 'position', Object);

		return is.object(position.system) && is.object(position.system.calculating) && is.number(position.system.calculating.processors) && position.system.calculating.processors > 0;
	}

	function getSnapshot(position, currentSummary, reporting) {
		let snapshot;

		if (reporting) {
			snapshot = { };

			snapshot.date = currentSummary.end.date;
			snapshot.open = currentSummary.end.open;
			snapshot.direction = currentSummary.end.direction;
			snapshot.buys = currentSummary.period.buys;
			snapshot.sells = currentSummary.period.sells;
			snapshot.gain = currentSummary.period.realized;
			snapshot.basis = currentSummary.end.basis;
			snapshot.income = currentSummary.period.income;
			snapshot.value = currentSummary.end.value;
		} else {
			snapshot = position.snapshot;
		}

		return snapshot;
	}

	return PositionItem;
})();
