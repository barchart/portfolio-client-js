const assert = require('@barchart/common-js/lang/assert'),
	Currency = require('@barchart/common-js/lang/Currency'),
	Decimal = require('@barchart/common-js/lang/Decimal'),
	Event = require('@barchart/common-js/messaging/Event'),
	formatter = require('@barchart/common-js/lang/formatter'),
	is = require('@barchart/common-js/lang/is'),
	Rate = require('@barchart/common-js/lang/Rate');

module.exports = (() => {
	'use strict';

	/**
	 * A grouping of {@link PositionItem} instances. The group aggregates from across
	 * all the positions and performs currency translation, as necessary.
	 *
	 * @public
	 * @param {PositionContainer} container
	 * @param {PositionGroup|null} parent
	 * @param {Array.<PositionItem>} items
	 * @param {Currency} currency
	 * @param {String} key
	 * @param {String} description
	 * @param {Boolean=} single
	 */
	class PositionGroup {
		constructor(container, parent, items, currency, key, description, single) {
			this._container = container;
			this._parent = parent || null;

			this._items = items;
			this._currency = currency || Currency.CAD;
			this._bypassCurrencyTranslation = false;

			this._key = key;
			this._description = description;

			this._single = is.boolean(single) && single;

			this._excluded = false;
			this._suspended = false;
			this._showClosedPositions = false;

			this._marketPercentChangeEvent = new Event(this);
			this._excludedChangeEvent = new Event(this);
			this._showClosedPositionsChangeEvent = new Event(this);

			this._dataFormat = { };
			this._dataActual = { };

			this._dataFormat.key = this._key;
			this._dataFormat.description = this._description;
			this._dataFormat.newsExists = false;
			this._dataFormat.quantity = null;
			this._dataFormat.basisPrice = null;

			this._dataActual.key = this._key;
			this._dataActual.description = this._description;
			this._dataActual.newsExists = false;
			this._dataActual.quantity = null;
			this._dataActual.basisPrice = null;

			if (this._single) {
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

			this._dataFormat.quoteLast = null;
			this._dataFormat.quoteOpen = null;
			this._dataFormat.quoteHigh = null;
			this._dataFormat.quoteLow = null;
			this._dataFormat.quoteChange = null;
			this._dataFormat.quoteChangePercent = null;
			this._dataFormat.quoteTime = null;
			this._dataFormat.quoteVolume = null;

			this._dataActual.currentPrice = null;
			this._dataActual.previousPrice = null;
			this._dataActual.basis = null;
			this._dataActual.realized = null;
			this._dataActual.income = null;
			this._dataActual.market = null;
			this._dataActual.marketPercent = null;
			this._dataActual.unrealized = null;
			this._dataActual.unrealizedToday = null;
			this._dataActual.total = null;
			this._dataActual.summaryTotalCurrent = null;
			this._dataActual.summaryTotalPrevious = null;

			this._dataFormat.currentPrice = null;
			this._dataFormat.previousPrice = null;
			this._dataFormat.basis = null;
			this._dataFormat.realized = null;
			this._dataFormat.income = null;
			this._dataFormat.market = null;
			this._dataFormat.marketPercent = null;
			this._dataFormat.marketDirection = null;
			this._dataFormat.unrealized = null;
			this._dataFormat.unrealizedPercent = null;
			this._dataFormat.unrealizedNegative = false;
			this._dataFormat.unrealizedToday = null;
			this._dataFormat.unrealizedTodayNegative = false;
			this._dataFormat.total = null;
			this._dataFormat.totalNegative = false;
			this._dataFormat.summaryTotalCurrent = null;
			this._dataActual.summaryTotalCurrentNegative = false;
			this._dataFormat.summaryTotalPrevious = null;
			this._dataFormat.summaryTotalPreviousNegative = false;

			this._items.forEach((item) => {
				item.registerQuoteChangeHandler((quote, sender) => {
					if (this._single) {
						const precision = sender.position.instrument.currency.precision;

						this._dataActual.currentPrice = quote.lastPrice;
						this._dataFormat.currentPrice = formatNumber(this._dataActual.currentPrice, precision);

						this._dataFormat.quoteLast = formatNumber(quote.previousPrice, precision);
						this._dataFormat.quoteOpen = formatNumber(quote.openPrice, precision);
						this._dataFormat.quoteHigh = formatNumber(quote.highPrice, precision);
						this._dataFormat.quoteLow = formatNumber(quote.lowPrice, precision);
						this._dataFormat.quoteChange = formatNumber(quote.priceChange, precision);
						this._dataFormat.quoteChangePercent = formatPercent(new Decimal(quote.percentChange || 0), 2);
						this._dataFormat.quoteTime = quote.timeDisplay;
						this._dataFormat.quoteVolume = formatNumber(quote.volume, 0);
					} else {
						this._dataActual.currentPrice = null;
						this._dataFormat.currentPrice = null;
					}

					calculatePriceData(this, this._container.getForexQuotes(), sender, false);
				});

				if (this._single) {
					item.registerNewsExistsChangeHandler((exists, sender) => {
						this._dataActual.newsExists = exists;
						this._dataFormat.newsExists = exists;
					});

					item._fundamentalDataChangeEvent((data, sender) => {
						this._dataFormat.fundamental = data;
					});
				}
			});

			this.refresh();
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

		get suspended() {
			return this._suspended;
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
		 * Causes aggregated data to be recalculated using a new exchange rate.
		 *
		 * @public
		 * @param {Rate} rate
		 */
		setForexRate(rate) {
			if (!this._bypassCurrencyTranslation) {
				this.refresh();
			}
		}

		setExcluded(value) {
			assert.argumentIsRequired(value, 'value', Boolean);

			if (this._excluded !== value) {
				this._excludedChangeEvent(this._excluded = value);
			}
		}

		setShowClosedPositions(value) {
			assert.argumentIsRequired(value, 'value', Boolean);

			if (this._showClosedPositions !== value) {
				this._showClosedPositionsChangeEvent(this._showClosedPositions = value);
			}
		}

		setSuspended(value) {
			assert.argumentIsRequired(value, 'value', Boolean);

			if (this._suspended !== value) {
				if (this._suspended = value) {
					this.refresh();
				}
			}
		}

		/**
		 * Causes all aggregated data to be recalculated.
		 *
		 * @public
		 */
		refresh() {
			const rates = this._container.getForexQuotes();

			calculateStaticData(this, rates);
			calculatePriceData(this, rates, null, true);
		}

		/**
		 * Causes the percent of the position, with respect to the parent container's
		 * total, to be recalculated.
		 *
		 * @public
		 */
		refreshMarketPercent() {
			calculateMarketPercent(this, this._container.getForexQuotes(), true);
		}

		registerMarketPercentChangeHandler(handler) {
			this._marketPercentChangeEvent.register(handler);
		}

		toString() {
			return '[PositionGroup]';
		}
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

	function formatPercent(decimal, precision) {
		if (decimal !== null) {
			return formatDecimal(decimal.multiply(100), precision) + '%';
		} else {
			return '—';
		}
	}

	function formatCurrency(decimal, currency) {
		return formatDecimal(decimal, currency.precision);
	}

	function calculateStaticData(group, rates) {
		if (group.suspended) {
			return;
		}

		const actual = group._dataActual;
		const format = group._dataFormat;

		const currency = group.currency;
		
		const items = group._items;

		group._bypassCurrencyTranslation = items.every(item => item.currency === currency);

		const translate = (item, value) => {
			let translated;

			if (item.currency !== currency) {
				translated = Rate.convert(value, item.currency, currency, ...rates);
			} else {
				translated = value;
			}

			return translated;
		};

		let updates = items.reduce((updates, item) => {
			updates.basis = updates.basis.add(translate(item, item.data.basis));
			updates.realized = updates.realized.add(translate(item, item.data.realized));
			updates.unrealized = updates.unrealized.add(translate(item, item.data.unrealized));
			updates.income = updates.income.add(translate(item, item.data.income));
			updates.summaryTotalCurrent = updates.summaryTotalCurrent.add(translate(item, item.data.summaryTotalCurrent));
			updates.summaryTotalPrevious = updates.summaryTotalPrevious.add(translate(item, item.data.summaryTotalPrevious));

			return updates;
		}, {
			basis: Decimal.ZERO,
			realized: Decimal.ZERO,
			unrealized: Decimal.ZERO,
			income: Decimal.ZERO,
			summaryTotalCurrent: Decimal.ZERO,
			summaryTotalPrevious: Decimal.ZERO
		});

		actual.basis = updates.basis;
		actual.realized = updates.realized;
		actual.unrealized = updates.unrealized;
		actual.income = updates.income;
		actual.summaryTotalCurrent = updates.summaryTotalCurrent;
		actual.summaryTotalPrevious = updates.summaryTotalPrevious;

		format.basis = formatCurrency(actual.basis, currency);
		format.realized = formatCurrency(actual.basis, currency);
		format.unrealized = formatCurrency(actual.unrealized, currency);
		format.income = formatCurrency(actual.income, currency);
		format.summaryTotalCurrent = formatCurrency(updates.summaryTotalCurrent, currency);
		format.summaryTotalPrevious = formatCurrency(updates.summaryTotalPrevious, currency);
		format.summaryTotalPreviousNegative = updates.summaryTotalPrevious.getIsNegative();

		calculateUnrealizedPercent(group);

		if (group.single) {
			const item = group._items[0];

			actual.quantity = item.position.snapshot.open;
			actual.basisPrice = item.data.basisPrice;

			format.quantity = formatDecimal(actual.quantity, 2);
			format.basisPrice = formatCurrency(actual.basisPrice, currency);
		}
	}

	function calculatePriceData(group, rates, item, forceRefresh) {
		if (group.suspended) {
			return;
		}

		const parent = group._parent;

		const actual = group._dataActual;
		const format = group._dataFormat;

		const currency = group.currency;

		const translate = (item, value) => {
			let translated;

			if (item.currency !== currency) {
				translated = Rate.convert(value, item.currency, currency, ...rates);
			} else {
				translated = value;
			}

			return translated;
		};

		const refresh = (is.boolean(forceRefresh) && forceRefresh) || (actual.market === null || actual.unrealizedToday === null || actual.total === null);

		let updates;

		if (refresh) {
			const items = group._items;

			updates = items.reduce((updates, item) => {
				updates.market = updates.market.add(translate(item, item.data.market));
				updates.unrealized = updates.unrealized.add(translate(item, item.data.unrealized));
				updates.unrealizedToday = updates.unrealizedToday.add(translate(item, item.data.unrealizedToday));
				updates.summaryTotalCurrent = updates.summaryTotalCurrent.add(translate(item, item.data.summaryTotalCurrent));

				return updates;
			}, {
				market: Decimal.ZERO,
				marketDirection: unchanged,
				unrealized: Decimal.ZERO,
				unrealizedToday: Decimal.ZERO,
				summaryTotalCurrent: Decimal.ZERO

			});
		} else {
			updates = {
				market: actual.market.add(translate(item, item.data.marketChange)),
				marketDirection: { up: item.data.marketChange.getIsPositive(), down: item.data.marketChange.getIsNegative() },
				unrealized: actual.unrealized.add(translate(item, item.data.unrealizedChange)),
				unrealizedToday: actual.unrealizedToday.add(translate(item, item.data.unrealizedTodayChange)),
				summaryTotalCurrent: actual.summaryTotalCurrent.add(translate(item, item.data.summaryTotalCurrentChange))
			};
		}
		
		if (parent !== null) {
			const parentData = parent._dataActual;

			if (parentData.market !== null && !parentData.market.getIsZero()) {
				updates.marketPercent = updates.market.divide(parentData.market);
			} else {
				updates.marketPercent = null;
			}
		} else {
			updates.marketPercent = null;
		}

		actual.market = updates.market;
		actual.unrealized = updates.unrealized;
		actual.unrealizedToday = updates.unrealizedToday;
		actual.summaryTotalCurrent = updates.summaryTotalCurrent;
		actual.total = updates.unrealizedToday.add(actual.realized).add(actual.income);
		
		format.market = formatCurrency(actual.market, currency);
		
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

		format.total = formatCurrency(actual.total, currency);
		format.totalNegative = actual.total.getIsNegative();
		
		calculateMarketPercent(group, rates, false);
		calculateUnrealizedPercent(group);
	}

	function calculateMarketPercent(group, rates, silent) {
		if (group.suspended) {
			return;
		}

		const parent = group._parent;

		const actual = group._dataActual;
		const format = group._dataFormat;
		
		let marketPercent;
		
		if (parent !== null) {
			const parentData = parent._dataActual;

			if (parentData.market !== null && !parentData.market.getIsZero()) {
				let numerator;

				if (group.currency !== parent.currency) {
					numerator = Rate.convert(actual.market, group.currency, parent.currency, ...rates);
				} else {
					numerator = actual.market;
				}

				marketPercent = numerator.divide(parentData.market);
			} else {
				marketPercent = null;
			}
		} else {
			marketPercent = null;
		}

		actual.marketPercent = marketPercent;
		
		format.marketPercent = formatPercent(actual.marketPercent, 2);
		
		if (!silent) {
			group._marketPercentChangeEvent.fire(group);
		}
	}

	function calculateUnrealizedPercent(group) {
		const actual = group._dataActual;
		const format = group._dataFormat;

		if (actual.basis.getIsZero()) {
			actual.unrealizedPercent = null;
			format.unrealizedPercent = '—';
		} else {
			actual.unrealizedPercent = actual.unrealized.divide(actual.basis);
			format.unrealizedPercent = formatPercent(actual.unrealizedPercent, 2);
		}
	}

	const unchanged = { up: false, down: false };

	return PositionGroup;
})();
