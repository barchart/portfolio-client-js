const array = require('@barchart/common-js/lang/array'),
	assert = require('@barchart/common-js/lang/assert'),
	Currency = require('@barchart/common-js/lang/Currency'),
	Decimal = require('@barchart/common-js/lang/Decimal'),
	Disposable = require('@barchart/common-js/lang/Disposable'),
	DisposableStack = require('@barchart/common-js/collections/specialized/DisposableStack'),
	Event = require('@barchart/common-js/messaging/Event'),
	formatter = require('@barchart/common-js/lang/formatter'),
	is = require('@barchart/common-js/lang/is'),
	Rate = require('@barchart/common-js/lang/Rate');

const InstrumentType = require('./../data/InstrumentType');

const PositionLevelDefinition = require('./definitions/PositionLevelDefinition'),
	PositionLevelType = require('./definitions/PositionLevelType');

module.exports = (() => {
	'use strict';

	let counter = 0;

	/**
	 * A grouping of {@link PositionItem} instances. The group aggregates from across
	 * all the positions and performs currency translation, as necessary.
	 *
	 * @public
	 * @param {PositionContainer} container
	 * @param {PositionLevelDefinition} definition
	 * @param {PositionItem[]} items
	 * @param {Currency} currency
	 * @param {String} key
	 * @param {String} description
	 * @param {Boolean=} aggregateCash
	 */
	class PositionGroup {
		constructor(definition, items, rates, currency, key, description, aggregateCash) {
			this._id = counter++;

			this._definition = definition;

			this._items = items;
			this._rates = rates;

			this._parentGroup = null;
			this._portfolioGroup = null;

			this._currency = currency || Currency.CAD;
			this._bypassCurrencyTranslation = false;

			this._key = key;
			this._description = description;

			this._single = this._definition.single;
			this._aggregateCash = is.boolean(aggregateCash) && aggregateCash;

			this._excluded = false;
			this._showClosedPositions = false;

			this._groupExcludedChangeEvent = new Event(this);
			this._showClosedPositionsChangeEvent = new Event(this);

			this._disposeStack = new DisposableStack();

			this._excludedItems = [ ];
			this._excludedItemMap = { };
			this._consideredItems = this._items.slice(0);

			this._dataFormat = { };
			this._dataActual = { };

			this._dataFormat.key = this._key;
			this._dataFormat.description = this._description;
			this._dataFormat.hide = false;
			this._dataFormat.invalid = false;
			this._dataFormat.locked = false;
			this._dataFormat.calculating = false;
			this._dataFormat.newsExists = false;
			this._dataFormat.quantity = null;
			this._dataFormat.quantityPrevious = null;
			this._dataFormat.basisPrice = null;

			this._dataActual.key = this._key;
			this._dataActual.description = this._description;
			this._dataActual.newsExists = false;
			this._dataActual.quantity = null;
			this._dataActual.quantityPrevious = null;
			this._dataActual.basisPrice = null;

			if (this._single && items.length === 1) {
				const item = items[0];

				this._dataFormat.portfolio = item.portfolio.portfolio;
				this._dataFormat.position = item.position.position;
				this._dataFormat.instrument = item.position.instrument;
				this._dataFormat.fundamental = item.fundamental || { };
			} else {
				this._dataFormat.portfolio = null;
				this._dataFormat.position = null;
				this._dataFormat.instrument = null;
				this._dataFormat.fundamental = { };
			}

			this._dataActual.quoteLast = null;
			this._dataActual.quoteOpen = null;
			this._dataActual.quoteHigh = null;
			this._dataActual.quoteLow = null;
			this._dataActual.quoteChange = null;
			this._dataActual.quoteChangePercent = null;
			this._dataActual.quoteTime = null;
			this._dataActual.quoteVolume = null;

			this._dataFormat.quoteLast = null;
			this._dataFormat.quoteOpen = null;
			this._dataFormat.quoteHigh = null;
			this._dataFormat.quoteLow = null;
			this._dataFormat.quoteChange = null;
			this._dataFormat.quoteChangePercent = null;
			this._dataFormat.quoteTime = null;
			this._dataFormat.quoteVolume = null;
			this._dataFormat.quoteChangeDirection = unchanged;
			this._dataFormat.quoteChangeNegative = false;

			this._dataActual.currentPrice = null;
			this._dataActual.basis = null;
			this._dataActual.basis2 = null;
			this._dataActual.realized = null;
			this._dataActual.income = null;
			this._dataActual.market = null;
			this._dataActual.market2 = null;
			this._dataActual.marketPercent = null;
			this._dataActual.marketPercentPortfolio = null;
			this._dataActual.unrealized = null;
			this._dataActual.unrealizedToday = null;
			this._dataActual.total = null;
			this._dataActual.summaryTotalCurrent = null;
			this._dataActual.summaryTotalPrevious = null;
			this._dataActual.summaryTotalPrevious2 = null;
			this._dataActual.marketPrevious = null;
			this._dataActual.marketPrevious2 = null;
			this._dataActual.marketChange = null;
			this._dataActual.marketChangePercent = null;
			this._dataActual.cashTotal = null;
			this._dataActual.totalDivisor = null;
			this._dataActual.periodDivisorCurrent = null;
			this._dataActual.periodDivisorPrevious = null;
			this._dataActual.periodDivisorPrevious2 = null;

			this._dataFormat.currentPrice = null;
			this._dataFormat.basis = null;
			this._dataFormat.basis2 = null;
			this._dataFormat.realized = null;
			this._dataFormat.realizedPercent = null;
			this._dataFormat.income = null;
			this._dataFormat.market = null;
			this._dataFormat.market2 = null;
			this._dataFormat.marketPercent = null;
			this._dataFormat.marketPercentPortfolio = null;
			this._dataFormat.marketDirection = null;
			this._dataFormat.unrealized = null;
			this._dataFormat.unrealizedPercent = null;
			this._dataFormat.unrealizedNegative = false;
			this._dataFormat.unrealizedToday = null;
			this._dataFormat.unrealizedTodayNegative = false;
			this._dataFormat.total = null;
			this._dataFormat.totalNegative = false;
			this._dataFormat.summaryTotalCurrent = null;
			this._dataFormat.summaryTotalCurrentNegative = false;
			this._dataFormat.summaryTotalPrevious = null;
			this._dataFormat.summaryTotalPreviousNegative = false;
			this._dataFormat.summaryTotalPrevious2 = null;
			this._dataFormat.summaryTotalPrevious2Negative = false;
			this._dataFormat.marketPrevious = null;
			this._dataFormat.marketPrevious2 = null;
			this._dataFormat.marketChange = null;
			this._dataFormat.marketChangePercent = null;
			this._dataFormat.cashTotal = null;
			this._dataFormat.portfolioType = null;

			this._dataActual.periodPrice = null;
			this._dataActual.periodPricePrevious = null;

			this._dataFormat.periodPrice = null;
			this._dataFormat.periodPricePrevious = null;

			this._dataActual.periodIncome = null;
			this._dataActual.periodRealized = null;
			this._dataActual.periodUnrealized = null;

			this._dataFormat.periodIncome = null;
			this._dataFormat.periodRealized = null;
			this._dataFormat.periodUnrealized = null;

			this._dataActual.totalPercent = null;
			this._dataActual.periodPercent = null;
			this._dataActual.periodPercentPrevious = null;
			this._dataActual.periodPercentPrevious2 = null;

			this._dataFormat.totalPercent = null;
			this._dataFormat.periodPercent = null;
			this._dataFormat.periodPercentPrevious = null;
			this._dataFormat.periodPercentPrevious2 = null;

			this._items.forEach((item) => {
				bindItem.call(this, item);
			});

			this.refresh();
		}

		/**
		 * A unique (and otherwise meaningless) identifier for the group.
		 *
		 * @public
		 * @returns {Number}
		 */
		get id() {
			return this._id;
		}

		/**
		 * The {@link PositionLevelDefinition} which was used to generate this group.
		 *
		 * @public
		 * @returns {PositionLevelDefinition}
		 */
		get definition() {
			return this._definition;
		}

		/**
		 * The key of the group.
		 *
		 * @public
		 * @returns {String}
		 */
		get key() {
			return this._key;
		}

		/**
		 * The description of the group.
		 *
		 * @public
		 * @returns {String}
		 */
		get description() {
			return this._description;
		}

		/**
		 * The {@link Currency} which all aggregated data is presented in.
		 *
		 * @public
		 * @returns {Currency}
		 */
		get currency() {
			return this._currency;
		}

		/**
		 * The {@link PositionItem} instances which for which aggregated data is compiled.
		 *
		 * @public
		 * @returns {Currency}
		 */
		get items() {
			return this._items;
		}

		/**
		 * The string-based, human-readable aggregated data for the group.
		 *
		 * @public
		 * @returns {Object}
		 */
		get data() {
			return this._dataFormat;
		}

		/**
		 * The raw aggregated data for the group (typically {@link Decimal} instances).
		 *
		 * @public
		 * @returns {Object}
		 */
		get actual() {
			return this._dataActual;
		}

		/**
		 * Indicates if the group will only contain one {@link PositionItem} -- that is,
		 * indicates if the group represents a single position.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get single() {
			return this._single;
		}

		/**
		 * Indicates if the group should be excluded from higher-level aggregations.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get excluded() {
			return this._excluded;
		}

		/**
		 * Changes the group currency.
		 *
		 * @public
		 * @param {Currency} currency
		 */
		changeCurrency(currency) {
			assert.argumentIsRequired(currency, 'currency', Currency, 'Currency');

			if (this._currency !== currency) {
				this._currency = currency;

				this.refresh();
			}
		}

		/**
		 * Sets the immediate parent group (allowing for calculation of relative
		 * percentages).
		 *
		 * @public
		 * @param {PortfolioGroup} group
		 */
		setParentGroup(group) {
			assert.argumentIsOptional(group, 'group', PositionGroup, 'PositionGroup');

			if (this._parentGroup !== null) {
				throw new Error('The parent group has already been set.');
			}

			this._parentGroup = group;
		}

		/**
		 * Sets the nearest parent group for a portfolio (allowing for calculation
		 * of relative percentages).
		 *
		 * @public
		 * @param {PortfolioGroup} group
		 */
		setPortfolioGroup(group) {
			assert.argumentIsOptional(group, 'group', PositionGroup, 'PositionGroup');

			if (this._portfolioGroup !== null) {
				throw new Error('The portfolio group has already been set.');
			}

			this._portfolioGroup = group;
		}

		/**
		 * Adds a new {@link PositionItem} to the group.
		 *
		 * @public
		 * @param {PositionItem} item
		 */
		addItem(item) {
			this._items.push(item);
			this._consideredItems.push(item);

			bindItem.call(this, item);

			this.refresh();

			if (this._excluded) {
				this.setExcluded(false);
				this.setExcluded(true);
			}
		}

		/**
		 * Sets the list of items which are excluded from group aggregation calculations.
		 *
		 * @public
		 * @param {Object[]} items
		 */
		setExcludedItems(items) {
			this._excludedItems = items;
			this._consideredItems = array.difference(this._items, this._excludedItems);

			this._excludedItemMap = this._excludedItems.reduce((map, item) => {
				const key = item.position.position;

				map[key] = item;

				return map;
			}, { });

			this.refresh();
		}

		/**
		 * Causes aggregated data to be recalculated using a new exchange rate.
		 *
		 * @public
		 * @param {Rate[]} rates
		 */
		setForexRates(rates) {
			this._rates = rates;

			if (!this._bypassCurrencyTranslation) {
				this.refresh();
			}
		}

		/**
		 * Set a flag to indicate if parent groups should exclude this group's
		 * items from their calculations.
		 *
		 * @public
		 * @param {Boolean} value
		 */
		setExcluded(value) {
			assert.argumentIsRequired(value, 'value', Boolean);

			if (this._excluded !== value) {
				this._groupExcludedChangeEvent.fire(this._excluded = value);
			}
		}

		setShowClosedPositions(value) {
			assert.argumentIsRequired(value, 'value', Boolean);

			if (this._showClosedPositions !== value) {
				this._showClosedPositionsChangeEvent.fire(this._showClosedPositions = value);
			}
		}

		/**
		 * Updates the portfolio data. For example, a portfolio's name might change. This
		 * function only affects {@link PositionLevelType.PORTFOLIO} groups.
		 *
		 * @public
		 * @param {Object} portfolio
		 */
		updatePortfolio(portfolio) {
			if (this._definition.type !== PositionLevelType.PORTFOLIO || this._key !== PositionLevelDefinition.getKeyForPortfolioGroup(portfolio) || !this.getIsEmpty()) {
				return;
			}

			this._description = PositionLevelDefinition.getDescriptionForPortfolioGroup(portfolio);

			this._dataActual.description = this._description;
			this._dataFormat.description = this._description;

			let portfolioType;

			if (portfolio.miscellany && portfolio.miscellany.data.type && portfolio.miscellany.data.type.value) {
				portfolioType = portfolio.miscellany.data.type.value;
			} else {
				portfolioType = null;
			}

			this._dataFormat.portfolioType = portfolioType;

			this.changeCurrency(this._definition.currencySelector({ portfolio }));
		}

		/**
		 * Causes all aggregated data to be recalculated.
		 *
		 * @public
		 */
		refresh() {
			calculateStaticData(this, this._rates, this._definition);
			calculatePriceData(this, this._rates, null, true);
		}

		/**
		 * Causes the percent of the position, with respect to the parent container's
		 * total, to be recalculated.
		 *
		 * @public
		 */
		refreshMarketPercent() {
			calculateMarketPercent(this, this._rates, this._parentGroup, this._portfolioGroup);
		}

		/**
		 * Indicates if the group contains any items.
		 *
		 * @public
		 * @returns {boolean}
		 */
		getIsEmpty() {
			return this._items.length === 0;
		}

		/**
		 * Adds an observer for changes to the exclusion of the group
		 * from higher level aggregations.
		 *
		 * @public
		 * @param {Function} handler
		 * @returns {Disposable}
		 */
		registerGroupExcludedChangeHandler(handler) {
			return this._groupExcludedChangeEvent.register(handler);
		}

		toString() {
			return '[PositionGroup]';
		}
	}

	function bindItem(item) {
		const quoteBinding = item.registerQuoteChangeHandler((quote, sender) => {
			if (this._single) {
				const precision = sender.position.instrument.currency.precision;

				this._dataActual.currentPrice = quote.lastPrice;
				this._dataFormat.currentPrice = formatNumber(this._dataActual.currentPrice, precision);

				this._dataActual.quoteLast = quote.previousPrice;
				this._dataActual.quoteOpen = quote.openPrice;
				this._dataActual.quoteHigh = quote.highPrice;
				this._dataActual.quoteLow = quote.lowPrice;
				this._dataActual.quoteChange = quote.priceChange;
				this._dataActual.quoteChangePercent = quote.percentChange;
				this._dataActual.quoteTime = quote.timeDisplay;
				this._dataActual.quoteVolume = quote.volume;

				this._dataFormat.quoteLast = formatNumber(this._dataActual.quoteLast , precision);
				this._dataFormat.quoteOpen = formatNumber(this._dataActual.quoteOpen, precision);
				this._dataFormat.quoteHigh = formatNumber(this._dataActual.quoteHigh, precision);
				this._dataFormat.quoteLow = formatNumber(this._dataActual.quoteLow, precision);
				this._dataFormat.quoteChange = formatNumber(this._dataActual.quoteChange, precision);
				this._dataFormat.quoteChangePercent = formatPercent(new Decimal(this._dataActual.quoteChangePercent || 0), 2);
				this._dataFormat.quoteTime = this._dataActual.quoteTime;
				this._dataFormat.quoteVolume = formatNumber(this._dataActual.quoteVolume, 0);

				const quoteChangePositive = quote.lastPriceDirection === 'up';
				const quoteChangeNegative = quote.lastPriceDirection === 'down';

				setTimeout(() => this._dataFormat.quoteChangeDirection = { up: quoteChangePositive, down: quoteChangeNegative }, 0);

				this._dataFormat.quoteChangeNegative = is.number(this._dataActual.quoteChange) && this._dataActual.quoteChange < 0;
			} else {
				this._dataActual.currentPrice = null;
				this._dataFormat.currentPrice = null;
			}

			calculatePriceData(this, this._rates, sender, false);
		});

		let fundamentalBinding = item.registerFundamentalDataChangeHandler((data) => {
			if (this._single) {
				this._dataFormat.fundamental = data;
			} else {
				const fundamentalFields = [ 'percentChange1m', 'percentChange1y', 'percentChange3m', 'percentChangeYtd' ];

				const fundamentalData = this.items.reduce((sums, item, i) => {
					if (item.data && item.data.fundamental && item.data.fundamental.raw) {
						const fundamental = item.data.fundamental.raw;

						fundamentalFields.forEach((fieldName) => {
							const summary = sums[fieldName];
							const value = fundamental[fieldName];

							if (is.number(value)) {
								summary.total = sums[fieldName].total + value;
								summary.count = sums[fieldName].count + 1;
							}

							if ((i + 1) == this.items.length) {
								let averageFormat;

								if (summary.count > 0) {
									averageFormat = formatPercent(new Decimal(summary.total / summary.count), 2, true);
								} else {
									averageFormat = '--';
								}

								summary.averageFormat = averageFormat;
							}
						});
					}

					return sums;
				}, fundamentalFields.reduce((sums, fieldName) => {
					sums[fieldName] = { total: 0, count: 0, averageFormat: '--' };

					return sums;
				}, { }));

				this._dataFormat.fundamental = fundamentalFields.reduce((sums, fieldName) => {
					sums[fieldName] = fundamentalData[fieldName].averageFormat;

					return sums;
				}, { });
			}
		});

		let newsBinding = Disposable.getEmpty();
		let lockedBinding = Disposable.getEmpty();
		let calculatingBinding = Disposable.getEmpty();

		if (this._single) {
			newsBinding = item.registerNewsExistsChangeHandler((exists) => {
				this._dataActual.newsExists = exists;
				this._dataFormat.newsExists = exists;
			});

			lockedBinding = item.registerLockChangeHandler((locked) => {
				this._dataFormat.locked = locked;
			});

			calculatingBinding = item.registerCalculatingChangeHandler((calculating) => {
				this._dataFormat.calculating = calculating;
			});
		}

		this._disposeStack.push(item.registerPortfolioChangeHandler((portfolio) => {
			const descriptionSelector = this._definition.descriptionSelector;

			this._description = descriptionSelector(this._items[0]);

			this._dataActual.description = this._description;
			this._dataFormat.description = this._description;

			if (this._definition.type !== PositionLevelType.PORTFOLIO || this._key !== PositionLevelDefinition.getKeyForPortfolioGroup(portfolio)) {
				return;
			}

			const currencySelector = this._definition.currencySelector;

			this.changeCurrency(currencySelector({ portfolio }));
		}));

		this._disposeStack.push(fundamentalBinding);
		this._disposeStack.push(quoteBinding);
		this._disposeStack.push(lockedBinding);
		this._disposeStack.push(calculatingBinding);
		this._disposeStack.push(newsBinding);

		this._disposeStack.push(item.registerPositionItemDisposeHandler(() => {
			fundamentalBinding.dispose();
			quoteBinding.dispose();
			newsBinding.dispose();
			lockedBinding.dispose();
			calculatingBinding.dispose();

			array.remove(this._items, i => i === item);
			array.remove(this._excludedItems, i => i === item);
			array.remove(this._consideredItems, i => i === item);

			delete this._excludedItemMap[item.position.position];

			this.refresh();
		}));
	}

	function formatNumber(number, precision) {
		if (is.number(number)) {
			return formatter.numberToString(number, precision, ',', false);
		} else {
			return '—';
		}
	}

	function formatDecimal(decimal, precision) {
		if (decimal !== null) {
			return formatNumber(decimal.toFloat(), precision);
		} else {
			return '—';
		}
	}

	function formatPercent(decimal, precision, plus) {
		if (decimal !== null) {
			let prefix;

			if (is.boolean(plus) && plus && !Decimal.getIsNegative(decimal)) {
				prefix = '+';
			} else {
				prefix = '';
			}

			return `${prefix}${formatDecimal(decimal.multiply(100), precision)}%`;
		} else {
			return '—';
		}
	}

	function formatCurrency(decimal, currency) {
		return formatDecimal(decimal, currency.precision);
	}

	function calculateStaticData(group, rates, definition) {
		const actual = group._dataActual;
		const format = group._dataFormat;

		const currency = group.currency;

		const items = group._consideredItems;

		group._bypassCurrencyTranslation = items.every(item => item.currency === currency);

		const translate = (item, value) => {
			let translated;

			if (item.currency !== currency && !value.getIsZero()) {
				translated = Rate.convert(value, item.currency, currency, ...rates);
			} else {
				translated = value;
			}

			return translated;
		};

		let updates = items.reduce((updates, item) => {
			updates.basis = updates.basis.add(translate(item, item.data.basis));

			if (item.position.instrument.type === InstrumentType.FUTURE) {
				if (group.single) {
					updates.basis2 = null;
				}
			} else {
				updates.basis2 = updates.basis2.add(translate(item, item.data.basis));
			}

			updates.realized = updates.realized.add(translate(item, item.data.realized));
			updates.unrealized = updates.unrealized.add(translate(item, item.data.unrealized));
			updates.income = updates.income.add(translate(item, item.data.income));
			updates.summaryTotalCurrent = updates.summaryTotalCurrent.add(translate(item, item.data.periodGain));
			updates.summaryTotalPrevious = updates.summaryTotalPrevious.add(translate(item, item.data.periodGainPrevious));
			updates.summaryTotalPrevious2 = updates.summaryTotalPrevious2.add(translate(item, item.data.periodGainPrevious2));
			updates.marketPrevious = updates.marketPrevious.add(translate(item, item.data.marketPrevious));
			updates.marketPrevious2 = updates.marketPrevious2.add(translate(item, item.data.marketPrevious2));

			updates.periodIncome = updates.periodIncome.add(translate(item, item.data.periodIncome));
			updates.periodRealized = updates.periodRealized.add(translate(item, item.data.periodRealized));
			updates.periodUnrealized = updates.periodUnrealized.add(translate(item, item.data.periodUnrealized));

			if (item.position.instrument.type === InstrumentType.CASH) {
				updates.cashTotal = updates.cashTotal.add(translate(item, item.data.market));
			}

			updates.totalDivisor = updates.periodDivisorCurrent.add(translate(item, item.data.totalDivisor));
			updates.periodDivisorCurrent = updates.periodDivisorCurrent.add(translate(item, item.data.periodDivisor));
			updates.periodDivisorPrevious = updates.periodDivisorPrevious.add(translate(item, item.data.periodDivisorPrevious));
			updates.periodDivisorPrevious2 = updates.periodDivisorPrevious2.add(translate(item, item.data.periodDivisorPrevious2));

			return updates;
		}, {
			basis: Decimal.ZERO,
			basis2: Decimal.ZERO,
			realized: Decimal.ZERO,
			unrealized: Decimal.ZERO,
			income: Decimal.ZERO,
			summaryTotalCurrent: Decimal.ZERO,
			summaryTotalPrevious: Decimal.ZERO,
			summaryTotalPrevious2: Decimal.ZERO,
			marketPrevious: Decimal.ZERO,
			marketPrevious2: Decimal.ZERO,
			periodIncome: Decimal.ZERO,
			periodRealized: Decimal.ZERO,
			periodUnrealized: Decimal.ZERO,
			cashTotal: Decimal.ZERO,
			totalDivisor: Decimal.ZERO,
			periodDivisorCurrent: Decimal.ZERO,
			periodDivisorPrevious: Decimal.ZERO,
			periodDivisorPrevious2: Decimal.ZERO
		});

		actual.basis = updates.basis;
		actual.basis2 = updates.basis2;
		actual.realized = updates.realized;
		actual.unrealized = updates.unrealized;
		actual.income = updates.income;
		actual.summaryTotalCurrent = updates.summaryTotalCurrent;
		actual.summaryTotalPrevious = updates.summaryTotalPrevious;
		actual.summaryTotalPrevious2 = updates.summaryTotalPrevious2;
		actual.marketPrevious = updates.marketPrevious;
		actual.marketPrevious2 = updates.marketPrevious2;
		actual.periodIncome = updates.periodIncome;
		actual.periodRealized = updates.periodRealized;
		actual.periodUnrealized = updates.periodUnrealized;
		actual.cashTotal = updates.cashTotal;
		actual.totalDivisor = updates.totalDivisor;
		actual.periodDivisorCurrent = updates.periodDivisorCurrent;
		actual.periodDivisorPrevious = updates.periodDivisorPrevious;
		actual.periodDivisorPrevious2 = updates.periodDivisorPrevious2;

		format.basis = formatCurrency(actual.basis, currency);
		format.basis2 = formatCurrency(actual.basis2, currency);
		format.realized = formatCurrency(actual.realized, currency);
		format.unrealized = formatCurrency(actual.unrealized, currency);
		format.income = formatCurrency(actual.income, currency);
		format.summaryTotalCurrent = formatCurrency(updates.summaryTotalCurrent, currency);
		format.summaryTotalCurrentNegative = updates.summaryTotalCurrent.getIsNegative();
		format.summaryTotalPrevious = formatCurrency(updates.summaryTotalPrevious, currency);
		format.summaryTotalPreviousNegative = updates.summaryTotalPrevious.getIsNegative();
		format.summaryTotalPrevious2 = formatCurrency(updates.summaryTotalPrevious2, currency);
		format.summaryTotalPrevious2Negative = updates.summaryTotalPrevious2.getIsNegative();
		format.marketPrevious = formatCurrency(updates.marketPrevious, currency);
		format.marketPrevious2 = formatCurrency(updates.marketPrevious2, currency);
		format.periodIncome = formatCurrency(updates.periodIncome, currency);
		format.periodRealized = formatCurrency(updates.periodRealized, currency);
		format.periodUnrealized = formatCurrency(updates.periodUnrealized, currency);
		format.cashTotal = formatCurrency(updates.cashTotal, currency);

		calculateRealizedPercent(group);
		calculateUnrealizedPercent(group);

		actual.periodPercent = calculateGainPercent(actual.summaryTotalCurrent, actual.periodDivisorCurrent);
		actual.periodPercentPrevious = calculateGainPercent(actual.summaryTotalPrevious, actual.periodDivisorPrevious);
		actual.periodPercentPrevious2 = calculateGainPercent(actual.summaryTotalPrevious2, actual.periodDivisorPrevious2);

		format.periodPercent = formatPercent(actual.periodPercent, 2);
		format.periodPercentPrevious = formatPercent(actual.periodPercentPrevious, 2);
		format.periodPercentPrevious2 = formatPercent(actual.periodPercentPrevious2, 2);

		const groupItems = group._items;

		if (group.single && groupItems.length === 1) {
			const item = group._items[0];

			actual.quantity = item.data.quantity;
			actual.quantityPrevious = item.data.quantityPrevious;

			format.quantity = formatDecimal(actual.quantity, 2);
			format.quantityPrevious = formatDecimal(actual.quantityPrevious, 2);

			actual.basisPrice = item.data.basisPrice;

			format.basisPrice = formatCurrency(actual.basisPrice, currency);

			actual.periodPrice = item.data.periodPrice;
			actual.periodPricePrevious = item.data.periodPricePrevious;

			format.periodPrice = formatCurrency(actual.periodPrice, currency);
			format.periodPricePrevious = formatCurrency(actual.periodPricePrevious, currency);

			format.invalid = definition.type === PositionLevelType.POSITION && item.invalid;
			format.locked = definition.type === PositionLevelType.POSITION && item.data.locked;
			format.calculating = definition.type === PositionLevelType.POSITION && item.data.calculating;
		}

		let portfolioType = null;

		if (groupItems.length > 0) {
			const portfolio = groupItems[0].portfolio;

			if (groupItems.every(i => i.portfolio.portfolio === portfolio.portfolio)) {
				if (portfolio.miscellany && portfolio.miscellany.data.type && portfolio.miscellany.data.type.value) {
					portfolioType = portfolio.miscellany.data.type.value;
				}
			}
		}

		format.portfolioType = portfolioType;
	}

	function calculatePriceData(group, rates, item, forceRefresh) {
		const currency = group.currency;

		const actual = group._dataActual;
		const format = group._dataFormat;

		const refresh = (is.boolean(forceRefresh) && forceRefresh) || (actual.market === null || actual.unrealizedToday === null || actual.total === null);

		if (!refresh && group._excludedItemMap.hasOwnProperty(item.position.position)) {
			return;
		}

		const translate = (item, value) => {
			let translated;

			if (item.currency !== currency && !value.getIsZero()) {
				translated = Rate.convert(value, item.currency, currency, ...rates);
			} else {
				translated = value;
			}

			return translated;
		};

		let updates;

		if (refresh) {
			const items = group._consideredItems;

			updates = items.reduce((updates, item) => {
				updates.market = updates.market.add(translate(item, item.data.market));

				if (item.position.instrument.type === InstrumentType.FUTURE) {
					updates.market2 = updates.market2.add(translate(item, item.data.unrealized));
				} else {
					updates.market2 = updates.market2.add(translate(item, item.data.market));
				}

				updates.marketAbsolute = updates.marketAbsolute.add(translate(item, item.data.marketAbsolute));
				updates.unrealized = updates.unrealized.add(translate(item, item.data.unrealized));
				updates.unrealizedToday = updates.unrealizedToday.add(translate(item, item.data.unrealizedToday));
				updates.summaryTotalCurrent = updates.summaryTotalCurrent.add(translate(item, item.data.periodGain));
				updates.periodUnrealized = updates.periodUnrealized.add(translate(item, item.data.periodUnrealized));

				return updates;
			}, {
				market: Decimal.ZERO,
				market2: Decimal.ZERO,
				marketAbsolute: Decimal.ZERO,
				marketDirection: unchanged,
				unrealized: Decimal.ZERO,
				unrealizedToday: Decimal.ZERO,
				summaryTotalCurrent: Decimal.ZERO,
				periodUnrealized: Decimal.ZERO
			});
		} else {
			updates = { };

			updates.market = actual.market.add(translate(item, item.data.marketChange));

			if (item.position.instrument.type === InstrumentType.FUTURE) {
				updates.market2 = actual.market2.add(translate(item, item.data.unrealizedChange));
			} else {
				updates.market2 = actual.market2.add(translate(item, item.data.marketChange));
			}

			updates.marketAbsolute = actual.marketAbsolute.add(translate(item, item.data.marketAbsoluteChange));
			updates.marketDirection = { up: item.data.marketChange.getIsPositive(), down: item.data.marketChange.getIsNegative() };
			updates.unrealized = actual.unrealized.add(translate(item, item.data.unrealizedChange));
			updates.unrealizedToday = actual.unrealizedToday.add(translate(item, item.data.unrealizedTodayChange));
			updates.summaryTotalCurrent = actual.summaryTotalCurrent.add(translate(item, item.data.periodGainChange));
			updates.periodUnrealized = actual.periodUnrealized.add(translate(item, item.data.periodUnrealizedChange));
		}

		actual.market = updates.market;
		actual.market2 = updates.market2;
		actual.marketAbsolute = updates.marketAbsolute;
		actual.unrealized = updates.unrealized;
		actual.unrealizedToday = updates.unrealizedToday;
		actual.summaryTotalCurrent = updates.summaryTotalCurrent;
		actual.periodUnrealized = updates.periodUnrealized;

		actual.total = updates.unrealized.add(actual.realized).add(actual.income);
		actual.totalPercent = calculateGainPercent(actual.total, actual.totalDivisor);

		let marketChange = updates.market.subtract(actual.marketPrevious);
		let marketChangePercent;

		if (actual.marketPrevious.getIsApproximate(Decimal.ZERO, 4)) {
			if (marketChange.getIsPositive()) {
				marketChangePercent = Decimal.ONE;
			} else if (marketChange.getIsNegative()) {
				marketChangePercent = Decimal.NEGATIVE_ONE;
			} else {
				marketChangePercent = Decimal.ZERO;
			}
		} else {
			marketChangePercent = marketChange.divide(actual.marketPrevious);
		}

		actual.marketChange = marketChange;
		actual.marketChangePercent = marketChangePercent;

		format.market = formatCurrency(actual.market, currency);
		format.market2 = formatCurrency(actual.market2, currency);

		if (updates.marketDirection.up || updates.marketDirection.down) {
			format.marketDirection = unchanged;
			setTimeout(() => format.marketDirection = updates.marketDirection, 0);
		}

		format.unrealized = formatCurrency(actual.unrealized, currency);
		format.unrealizedNegative = actual.unrealized.getIsNegative();

		format.unrealizedToday = formatCurrency(actual.unrealizedToday, currency);
		format.unrealizedTodayNegative = actual.unrealizedToday.getIsNegative();

		format.summaryTotalCurrent = formatCurrency(actual.summaryTotalCurrent, currency);
		format.summaryTotalCurrentNegative = actual.summaryTotalCurrent.getIsNegative();

		format.periodUnrealized = formatCurrency(actual.periodUnrealized, currency);

		format.total = formatCurrency(actual.total, currency);
		format.totalNegative = actual.total.getIsNegative();
		format.totalPercent = formatPercent(actual.totalPercent, 2);

		format.marketChange = formatCurrency(actual.marketChange, currency);
		format.marketChangePercent = formatPercent(actual.marketChangePercent, 2);

		calculateRealizedPercent(group);
		calculateUnrealizedPercent(group);

		actual.periodPercent = calculateGainPercent(actual.summaryTotalCurrent, actual.periodDivisorCurrent);
		format.periodPercent = formatPercent(actual.periodPercent, 2);
	}

	function calculateMarketPercent(group, rates, parentGroup, portfolioGroup) {
		const actual = group._dataActual;
		const format = group._dataFormat;
		const excluded = group._excluded;

		const calculatePercent = (parent) => {
			let marketPercent;

			if (parent && !excluded) {
				const parentData = parent._dataActual;

				if (parentData.marketAbsolute !== null && !parentData.marketAbsolute.getIsApproximate(Decimal.ZERO, 4)) {
					let numerator;

					if (group.currency !== parent.currency) {
						numerator = Rate.convert(actual.marketAbsolute, group.currency, parent.currency, ...rates);
					} else {
						numerator = actual.marketAbsolute;
					}

					marketPercent = numerator.divide(parentData.marketAbsolute);
				} else {
					marketPercent = null;
				}
			} else {
				marketPercent = null;
			}

			return marketPercent;
		};

		actual.marketPercent = calculatePercent(parentGroup);
		format.marketPercent = formatPercent(actual.marketPercent, 2);

		if (parentGroup === portfolioGroup) {
			actual.marketPercentPortfolio = actual.marketPercent;
			format.marketPercentPortfolio = format.marketPercent;
		} else {
			actual.marketPercentPortfolio = calculatePercent(portfolioGroup);
			format.marketPercentPortfolio = formatPercent(actual.marketPercentPortfolio, 2);
		}
	}

	function calculateRealizedPercent(group) {
		const actual = group._dataActual;
		const format = group._dataFormat;

		const openBasis = actual.basis;
		const totalBasis = actual.totalDivisor;

		const numerator = actual.realized;
		const denominator = totalBasis.subtract(openBasis);

		if (denominator.getIsApproximate(Decimal.ZERO, 4)) {
			actual.realizedPercent = Decimal.ZERO;
		} else {
			actual.realizedPercent = numerator.divide(denominator);
		}

		format.realizedPercent = formatPercent(actual.realizedPercent, 2);
	}

	function calculateUnrealizedPercent(group) {
		const actual = group._dataActual;
		const format = group._dataFormat;

		const numerator = actual.unrealized;
		const denominator = actual.basis.absolute();

		if (denominator.getIsApproximate(Decimal.ZERO, 4)) {
			actual.unrealizedPercent = Decimal.ZERO;
		} else {
			actual.unrealizedPercent = numerator.divide(denominator);
		}

		format.unrealizedPercent = formatPercent(actual.unrealizedPercent, 2);
	}

	function calculateGainPercent(gain, basis) {
		return basis.getIsApproximate(Decimal.ZERO, 4) ? Decimal.ZERO : gain.divide(basis);
	}

	const unchanged = { up: false, down: false };

	return PositionGroup;
})();
