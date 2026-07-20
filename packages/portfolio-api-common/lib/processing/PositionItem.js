const assert = require('@barchart/common-js/lang/assert'),
	Currency = require('@barchart/common-js/lang/Currency'),
	Day = require('@barchart/common-js/lang/Day'),
	Decimal = require('@barchart/common-js/lang/Decimal'),
	Disposable = require('@barchart/common-js/lang/Disposable'),
	Event = require('@barchart/common-js/messaging/Event'),
	is = require('@barchart/common-js/lang/is');

const InstrumentType = require('./../data/InstrumentType'),
	PositionDirection = require('./../data/PositionDirection'),
	OptionsValuationType = require('./../data/OptionsValuationType');

const AveragePriceCalculator = require('./../calculators/AveragePriceCalculator'),
	ValuationCalculator = require('./../calculators/ValuationCalculator');

module.exports = (() => {
	'use strict';

	const DAYS_PER_YEAR = 365;

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
	 * @param {Day|null} reportDate
	 * @param {Object=} periodSummaries
	 */
	class PositionItem extends Disposable {
		constructor(portfolio, position, currentSummary, previousSummaries, reporting, reportDate, periodSummaries) {
			super();

			this._portfolio = portfolio;
			this._position = position;

			this._priceSelctor = getPriceSelector(this._portfolio, this._position);

			const instrument = position.instrument;

			this._currency = instrument.currency || Currency.CAD;
			this._invalid = instrument.type.usesSymbols && (!is.object(instrument.symbol) || !is.string(instrument.symbol.barchart));

			this._exchangeStatus = null;

			this._currentSummary = currentSummary || null;
			this._previousSummaries = previousSummaries || [ ];
			this._periodSummaries = periodSummaries || { };

			this._reporting = reporting;
			this._reportDate = reportDate || null;

			this._today = calculateToday(this._reportDate, this._exchangeStatus);

			this._currentQuote = null;
			this._previousQuote = null;
			this._currentPrice = null;

			this._data = { };

			this._data.basis = null;

			this._data.market = null;
			this._data.marketChange = null;

			this._data.marketAbsolute = null;
			this._data.marketAbsoluteChange = null;

			this._data.todayQuote = null;
			this._data.todayExchange = null;

			this._data.todayPrice = null;
			this._data.todayPricePrevious = null;

			this._data.realizedToday = null;
			this._data.realizedTodayChange = null;
			this._data.gainToday = null;
			this._data.gainTodayChange = null;
			this._data.todayDivisor = null;
			this._data.todayDivisorChange = null;
			this._data.todaysGainLossPercent = null;

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
			this._data.unrealizedPrice = null;

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

			this._data.weekToDateGain = null;
			this._data.weekToDateGainChange = null;
			this._data.weekToDateDivisor = null;
			this._data.weekToDatePercent = null;
			this._data.weekToDateSummaryExists = false;

			this._data.monthToDateGain = null;
			this._data.monthToDateGainChange = null;
			this._data.monthToDateDivisor = null;
			this._data.monthToDatePercent = null;
			this._data.monthToDateSummaryExists = false;

			this._data.initiate = null;

			this._data.totalDivisor = null;
			this._data.totalPercent = null;

			this._data.daysHeld = null;
			this._data.weeksHeld = null;
			this._data.annualizedReturnPercent = null;

			this._data.newsExists = false;
			this._data.fundamental = { };
			this._data.calculating = getIsCalculating(position);
			this._data.locked = getIsLocked(position);
			this._data.expired = getIsExpired(position, this._today);

			this._quoteChangedEvent = new Event(this);
			this._newsExistsChangedEvent = new Event(this);
			this._fundamentalDataChangedEvent = new Event(this);
			this._lockChangedEvent = new Event(this);
			this._calculatingChangedEvent = new Event(this);
			this._portfolioChangedEvent = new Event(this);
			this._positionItemDisposeEvent = new Event(this);

			calculateStaticData(this);
			calculatePriceData(this, null, null, this._today);
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
		 * @public
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

			this._priceSelctor = getPriceSelector(this._portfolio, this._position);

			if (this._currentQuote) {
				this.setQuote(this._currentQuote, true);
			}
		}

		/**
		 * Sets the current quote -- causing position-level data (e.g. market value) to
		 * be recalculated.
		 *
		 * @public
		 * @param {Quote} quote
		 * @param {Boolean=} force
		 */
		setQuote(quote, force) {
			assert.argumentIsRequired(quote, 'quote', Object);
			assert.argumentIsOptional(force, 'force', Boolean);

			if (this.disposed) {
				return;
			}

			const priceToUse = this._priceSelctor(quote);

			if (!(this._currentPrice !== priceToUse || force)) {
				return;
			}

			if (quote.previousPrice) {
				this._data.previousPrice = quote.previousPrice;
			}

			calculatePriceData(this, priceToUse, calculateQuoteDay(quote), this._today);

			this._currentPrice = priceToUse;

			this._previousQuote = this._currentQuote;
			this._currentQuote = quote;

			this._quoteChangedEvent.fire(this._currentQuote);
		}

		/**
		 * Sets the current exchange status -- causing position-level data (e.g. today's gain) to
		 * be recalculated.
		 *
		 * @public
		 * @param {ExchangeStatus} exchange
		 */
		setExchangeStatus(exchange) {
			assert.argumentIsRequired(exchange, 'exchange', Object);
			assert.argumentIsRequired(exchange.code, 'exchange.code', String);
			assert.argumentIsRequired(exchange.currentDay, 'exchange.currentDay', Day, 'Day');
			assert.argumentIsRequired(exchange.currentOpened, 'exchange.currentOpened', Boolean);

			if (this._exchangeStatus === null || !(exchange.currentDay.getIsEqual(this._exchangeStatus.currentDay) && exchange.currentOpened === this._exchangeStatus.currentOpened)) {
				this._exchangeStatus = exchange;

				this._today = calculateToday(this._reportDate, this._exchangeStatus);

				calculateHoldingPeriodData(this);

				if (this._currentQuote) {
					this.setQuote(this._currentQuote, true);
				} else {
					this._data.annualizedReturnPercent = calculateAnnualizedReturnPercent(this._position.instrument.type, this._data.totalPercent, this._data.totalDivisor, this._data.daysHeld);
				}
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

			if (this.disposed) {
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

			if (this.disposed) {
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

			if (this.disposed) {
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

			if (this.disposed) {
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
		 * Registers an observer for changes to portfolio metadata.
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
			this._calculatingChangedEvent.clear();
			this._portfolioChangedEvent.clear();
			this._positionItemDisposeEvent.clear();
		}

		toString() {
			return '[PositionItem]';
		}
	}

	/**
	 * @private
	 * @param {PositionItem} item
	 */
	function calculateStaticData(item) {
		const position = item.position;

		const currentSummary = item.currentSummary;

		const previousSummary1 = getPreviousSummary(item.previousSummaries, 1);
		const previousSummary2 = getPreviousSummary(item.previousSummaries, 2);
		const previousSummary3 = getPreviousSummary(item.previousSummaries, 3);

		const weekToDateSummary = item._periodSummaries.weekToDate || null;
		const monthToDateSummary = item._periodSummaries.monthToDate || null;

		const snapshot = getSnapshot(position, currentSummary, item._reporting);

		const data = item._data;

		data.initiate = guessInitialDirection(position, item.previousSummaries, item.currentSummary);

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

		data.periodGain = calculatePeriodGain(position.instrument, data.initiate, currentSummary, previousSummary1);
		data.periodGainPrevious = calculatePeriodGain(position.instrument, data.initiate, previousSummary1, previousSummary2);
		data.periodGainPrevious2 = calculatePeriodGain(position.instrument, data.initiate, previousSummary2, previousSummary3);

		data.periodIncome = currentSummary !== null ? currentSummary.period.income : Decimal.ZERO;
		data.periodRealized = currentSummary !== null ? currentSummary.period.realized : Decimal.ZERO;
		data.periodUnrealized = calculatePeriodUnrealized(position.instrument.type, data.periodGain, data.periodRealized, data.periodIncome);

		data.periodDivisor = calculatePeriodDivisor(position.instrument.type, data.initiate, currentSummary, previousSummary1);
		data.periodDivisorPrevious = calculatePeriodDivisor(position.instrument.type, data.initiate, previousSummary1, previousSummary2);
		data.periodDivisorPrevious2 = calculatePeriodDivisor(position.instrument.type, data.initiate, previousSummary2, previousSummary3);

		data.weekToDateGain = calculatePeriodGain(position.instrument, data.initiate, weekToDateSummary, null, null, true);
		data.weekToDateDivisor = calculatePeriodDivisor(position.instrument.type, data.initiate, weekToDateSummary, null, true);
		data.weekToDateSummaryExists = weekToDateSummary !== null;
		data.weekToDatePercent = data.weekToDateSummaryExists ? calculateGainPercent(data.weekToDateGain, data.weekToDateDivisor) : null;

		data.monthToDateGain = calculatePeriodGain(position.instrument, data.initiate, monthToDateSummary, null, null, true);
		data.monthToDateDivisor = calculatePeriodDivisor(position.instrument.type, data.initiate, monthToDateSummary, null, true);
		data.monthToDateSummaryExists = monthToDateSummary !== null;
		data.monthToDatePercent = data.monthToDateSummaryExists ? calculateGainPercent(data.monthToDateGain, data.monthToDateDivisor) : null;

		data.basisPrice = AveragePriceCalculator.calculate(position.instrument, data.basis, snapshot.open) || Decimal.ZERO;
		data.basisPrice = data.basisPrice.opposite();

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

		data.totalDivisor = calculateTotalDivisor(position.instrument.type, data.initiate, position);

		calculateHoldingPeriodData(item, snapshot);
	}

	function calculateHoldingPeriodData(item, snapshot) {
		const data = item._data;

		const openingDate = is.object(item.position.opening) ? item.position.opening.date : null;
		const closingDate = is.object(item.position.closing) ? item.position.closing.date : null;

		const currentSnapshot = snapshot || getSnapshot(item.position, item.currentSummary, item._reporting);

		data.daysHeld = null;
		data.weeksHeld = null;

		if (openingDate instanceof Day && !openingDate.getIsAfter(item._today)) {
			let heldUntil;

			if (currentSnapshot.open.getIsZero()) {
				heldUntil = closingDate instanceof Day && !closingDate.getIsBefore(openingDate) && !closingDate.getIsAfter(item._today) ? closingDate : null;
			} else {
				heldUntil = item._today;
			}

			if (heldUntil !== null) {
				data.daysHeld = Day.countDaysBetween(openingDate, heldUntil);
				data.weeksHeld = Math.floor(data.daysHeld / 7);
			}
		}
	}

	/**
	 * @private
	 * @param {PositionItem} item
	 * @param {Decimal|number|null} price
	 * @param {Day|null} day
	 * @param {Day} today
	 */
	function calculatePriceData(item, price, day, today) {
		const position = item.position;
		const snapshot = getSnapshot(position, item.currentSummary, item._reporting);

		const data = item._data;

		// 2023/11/28, BRI. Futures contracts do not have their value set to zero
		// after expiration. At expiration, the contract would have been closed
		// (but the price would not have been zero). On the other hand, option
		// contracts can expire worthless, and we attempt to represent that here.

		const worthless = data.expired && (position.instrument.type === InstrumentType.EQUITY_OPTION || position.instrument.type === InstrumentType.FUTURE_OPTION);

		let market;

		if (position.instrument.type === InstrumentType.OTHER) {
			market = snapshot.value;
		} else if (position.instrument.type === InstrumentType.CASH) {
			market = snapshot.open;
		} else {
			let priceToUse;

			if (worthless) {
				priceToUse = Decimal.ZERO;
			} else {
				priceToUse = price;
			}

			market = ValuationCalculator.calculate(position.instrument, priceToUse, snapshot.open) || snapshot.value;
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

		data.todayQuote = day || null;
		data.todayExchange = today || null;

		let unrealizedToday;
		let unrealizedTodayChange;
		let todayDivisor;

		// 2025/07/20, BRI. The unrealized gain should only be calculated if the position
		// has quoted today. That means the position item is date-aware at this point. In
		// words, the phrase "today" is literal. It does not mean the gain on the last known
		// price change (e.g. friday, last week, sometime in the past when the instrument
		// was delisted, etc).

		const priceIsToday = day && today.getIsEqual(day);

		if (priceIsToday && data.previousPrice && price) {
			const unrealizedTodayBase = ValuationCalculator.calculate(position.instrument, data.previousPrice, snapshot.open);

			unrealizedToday = market.subtract(unrealizedTodayBase);
			todayDivisor = unrealizedTodayBase.absolute();
		} else {
			unrealizedToday = Decimal.ZERO;
			todayDivisor = Decimal.ZERO;
		}

		if (data.unrealizedToday !== null) {
			unrealizedTodayChange = unrealizedToday.subtract(data.unrealizedToday);
		} else {
			unrealizedTodayChange = unrealizedToday;
		}

		data.unrealizedToday = unrealizedToday;
		data.unrealizedTodayChange = unrealizedTodayChange;

		if (data.todayDivisor !== null) {
			data.todayDivisorChange = todayDivisor.subtract(data.todayDivisor);
		} else {
			data.todayDivisorChange = todayDivisor;
		}

		data.todayDivisor = todayDivisor;

		if (priceIsToday && price) {
			data.todayPrice = price;

			if (data.previousPrice) {
				data.todayPricePrevious = data.previousPrice;
			}
		} else {
			data.todayPrice = null;
			data.todayPricePrevious = null;
		}

		let realizedToday;
		let realizedTodayChange;

		if (position.latest && position.latest.gain && position.latest.date && today && position.latest.date.getIsEqual(today)) {
			realizedToday = position.latest.gain;
		} else {
			realizedToday = Decimal.ZERO;
		}

		if (data.realizedToday) {
			realizedTodayChange = realizedToday.subtract(data.realizedToday);
		} else {
			realizedTodayChange = realizedToday;
		}

		data.realizedToday = realizedToday;
		data.realizedTodayChange = realizedTodayChange;

		const gainToday = unrealizedToday.add(realizedToday);

		if (data.gainToday !== null) {
			data.gainTodayChange = gainToday.subtract(data.gainToday);
		} else {
			data.gainTodayChange = gainToday;
		}

		data.gainToday = gainToday;
		data.todaysGainLossPercent = calculateGainPercent(data.gainToday, data.todayDivisor);

		const currentSummary = item.currentSummary;
		const previousSummary = getPreviousSummary(item.previousSummaries, 1);

		const weekToDateSummary = item._periodSummaries.weekToDate || null;
		const monthToDateSummary = item._periodSummaries.monthToDate || null;

		let currentPriceToUse = null;

		if (currentSummary && position.instrument.type !== InstrumentType.CASH) {
			let priceToUse;

			if (worthless) {
				priceToUse = Decimal.ZERO;
			} else if (price) {
				priceToUse = price;
			} else if (data.previousPrice) {
				priceToUse = new Decimal(data.previousPrice);
			} else if (!currentSummary.end.open.getIsZero()) {
				priceToUse = AveragePriceCalculator.calculate(position.instrument, currentSummary.end.value, currentSummary.end.open) || Decimal.ZERO;
				priceToUse = priceToUse.opposite();
			} else {
				priceToUse = null;
			}

			if (priceToUse !== null) {
				currentPriceToUse = priceToUse;

				const unrealized = ValuationCalculator.calculate(position.instrument, priceToUse, currentSummary.end.open).add(currentSummary.end.basis);

				let unrealizedChange;

				if (data.unrealized !== null) {
					unrealizedChange = unrealized.subtract(data.unrealized);
				} else {
					unrealizedChange = Decimal.ZERO;
				}

				data.unrealized = unrealized;
				data.unrealizedChange = unrealizedChange;

				let periodGain = calculatePeriodGain(position.instrument, data.initiate, currentSummary, previousSummary, priceToUse);
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

				if (snapshot.open.getIsZero()) {
					data.unrealizedPrice = null;
				} else {
					data.unrealizedPrice = data.basisPrice.opposite().add(priceToUse);
				}
			} else {
				data.unrealizedChange = Decimal.ZERO;
				data.periodUnrealizedChange = Decimal.ZERO;
				data.periodGainChange = Decimal.ZERO;
				data.weekToDateGainChange = Decimal.ZERO;
				data.monthToDateGainChange = Decimal.ZERO;
			}
		} else {
			data.unrealizedChange = Decimal.ZERO;
			data.periodUnrealizedChange = Decimal.ZERO;
			data.periodGainChange = Decimal.ZERO;
			data.weekToDateGainChange = Decimal.ZERO;
			data.monthToDateGainChange = Decimal.ZERO;
		}

		if (position.instrument.type !== InstrumentType.CASH) {
			if (currentPriceToUse === null) {
				if (worthless) {
					currentPriceToUse = Decimal.ZERO;
				} else if (price) {
					currentPriceToUse = price;
				} else if (data.previousPrice) {
					currentPriceToUse = new Decimal(data.previousPrice);
				}
			}

			if (currentPriceToUse !== null) {
				const weekToDateData = calculateCurrentPeriodData(position.instrument, data.initiate, weekToDateSummary, currentPriceToUse, data.weekToDateGain, data.weekToDateDivisor);

				const monthToDateData = calculateCurrentPeriodData(position.instrument, data.initiate, monthToDateSummary, currentPriceToUse, data.monthToDateGain, data.monthToDateDivisor);

				data.weekToDateGain = weekToDateData.gain;
				data.weekToDateGainChange = weekToDateData.gainChange;
				data.weekToDatePercent = weekToDateData.percent;

				data.monthToDateGain = monthToDateData.gain;
				data.monthToDateGainChange = monthToDateData.gainChange;
				data.monthToDatePercent = monthToDateData.percent;
			}
		}

		data.totalPercent = calculateGainPercent(data.unrealized.add(data.realized).add(data.income), data.totalDivisor);
		data.annualizedReturnPercent = calculateAnnualizedReturnPercent(position.instrument.type, data.totalPercent, data.totalDivisor, data.daysHeld);
	}

	function calculateCurrentPeriodData(instrument, direction, summary, price, previousGain, divisor) {
		const gain = calculatePeriodGain(instrument, direction, summary, null, price, true);

		return {
			gain: gain,
			gainChange: gain.subtract(previousGain),
			percent: summary === null ? null : calculateGainPercent(gain, divisor)
		};
	}

	function guessInitialDirection(position, previousSummaries, currentSummary) {
		if (position.snapshot.initial) {
			return position.snapshot.initial;
		}

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

	function calculatePeriodGain(instrument, direction, currentSummary, previousSummary, overridePrice, useCurrentStart) {
		let returnRef;

		const type = instrument.type;

		if (currentSummary && type !== InstrumentType.CASH) {
			let startValue;

			if (previousSummary) {
				startValue = previousSummary.end.value;
			} else if (useCurrentStart) {
				startValue = currentSummary.start.value;
			} else {
				startValue = Decimal.ZERO;
			}

			let endValue;

			if (overridePrice) {
				endValue = ValuationCalculator.calculate(instrument, overridePrice, currentSummary.end.open);
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

	function calculatePeriodDivisor(type, direction, currentSummary, previousSummary, useCurrentStart) {
		let returnRef;

		if (currentSummary && type !== InstrumentType.CASH) {
			let startValue;

			if (previousSummary) {
				startValue = previousSummary.end.value;
			} else if (useCurrentStart) {
				startValue = currentSummary.start.value;
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

	function calculateTotalDivisor(type, direction, position) {
		if (type === InstrumentType.CASH) {
			return Decimal.ZERO;
		}

		let divisor;

		if (direction === PositionDirection.SHORT) {
			divisor = position.snapshot.sells;
		} else if (direction === PositionDirection.LONG) {
			divisor = position.snapshot.buys.opposite();
		} else {
			divisor = Decimal.ZERO;
		}

		return divisor;
	}

	function calculateGainPercent(gain, divisor) {
		return divisor.getIsApproximate(Decimal.ZERO, 4) ? Decimal.ZERO : gain.divide(divisor);
	}

	function calculateAnnualizedReturnPercent(type, totalPercent, totalDivisor, daysHeld) {
		if (type === InstrumentType.CASH || totalDivisor.getIsApproximate(Decimal.ZERO, 4) || daysHeld === null || daysHeld < DAYS_PER_YEAR || totalPercent.toFloat() < -1) {
			return null;
		}

		const annualizedReturn = Math.pow(1 + totalPercent.toFloat(), DAYS_PER_YEAR / daysHeld) - 1;

		return Number.isFinite(annualizedReturn) ? new Decimal(annualizedReturn) : null;
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
		assert.argumentIsRequired(position, 'position');

		return is.object(position.system) && is.object(position.system.calculate) && is.number(position.system.calculate.processors) &&	position.system.calculate.processors > 0;
	}

	function getIsExpired(position, day) {
		assert.argumentIsRequired(position, 'position');

		const type = position.instrument.type;

		let expiration;

		if (type === InstrumentType.FUTURE) {
			expiration = position.instrument.future.expiration;
		} else if (type === InstrumentType.FUTURE_OPTION || type === InstrumentType.EQUITY_OPTION) {
			expiration = position.instrument.option.expiration;
		} else {
			expiration = null;
		}

		return expiration !== null && expiration.getIsBefore(day);
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

	function calculateToday(reportDate, exchangeStatus) {
		if (reportDate instanceof Day) {
			return reportDate;
		}

		if (exchangeStatus && exchangeStatus.currentDay instanceof Day) {
			return exchangeStatus.currentDay;
		}

		return Day.getToday();
	}

	function calculateQuoteDay(quote) {
		if (quote && quote.lastDay instanceof Day) {
			return quote.lastDay;
		}

		return null;
	}

	function selectPriceFromLastPrice(quote) {
		return quote.lastPrice;
	}

	function selectPriceFromMidpoint(quote) {
		let price = null;

		if (is.number(quote.askPrice) && is.number(quote.bidPrice)) {
			price = (quote.askPrice + quote.bidPrice) / 2;
		}

		if (price === null || price === 0) {
			price = quote.lastPrice;
		}

		return price;
	}

	function getPriceSelector(portfolio, position) {
		let type = null;

		if (portfolio.miscellany && portfolio.miscellany.data && portfolio.miscellany.data.optionsValuation) {
			type = OptionsValuationType.parse(portfolio.miscellany.data.optionsValuation);
		}

		if (type === null) {
			type = OptionsValuationType.LAST_TRADE;
		}

		if (position.instrument.type.option && type === OptionsValuationType.MIDPOINT) {
			return selectPriceFromMidpoint;
		}

		return selectPriceFromLastPrice;
	}

	return PositionItem;
})();
