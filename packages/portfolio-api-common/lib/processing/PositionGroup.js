const assert = require('@barchart/common-js/lang/assert'),
	Currency = require('@barchart/common-js/lang/Currency'),
	Decimal = require('@barchart/common-js/lang/Decimal'),
	Event = require('@barchart/common-js/messaging/Event'),
	formatter = require('@barchart/common-js/lang/formatter'),
	is = require('@barchart/common-js/lang/is');

module.exports = (() => {
	'use strict';

	/**
	 * @public
	 */
	class PositionGroup {
		constructor(container, parent, items, currency, key, description, single) {
			this._container = container;
			this._parent = parent || null;

			this._items = items;
			this._currency = currency || Currency.CAD;

			this._key = key;
			this._description = description;

			this._single = is.boolean(single) && single;

			this._excluded = false;
			this._suspended = false;

			this._marketPercentChangeEvent = new Event(this);

			this._dataFormat = { };
			this._dataActual = { };

			this._dataFormat.key = this._key;
			this._dataFormat.description = this._description;

			this._dataFormat.quantity = null;

			if (this._single) {
				const item = items[0];

				this._dataFormat.portfolio = item.portfolio.portfolio;
				this._dataFormat.position = item.position.position;
				this._dataFormat.instrument = item.position.instrument;
			} else {
				this._dataFormat.portfolio = null;
				this._dataFormat.position = null;
				this._dataFormat.instrument = null;
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

						this._dataActual.currentPrice = sender.data.currentPrice;
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

					calculatePriceData(this, sender, false);
				});
			});

			this.refresh();
		}

		get key() {
			return this._key;
		}

		get description() {
			return this._description;
		}

		get currency() {
			return this._currency;
		}

		get items() {
			return this._items;
		}

		get data() {
			return this._dataFormat;
		}

		get actual() {
			return this._dataActual;
		}

		get single() {
			return this._single;
		}

		get suspended() {
			return this._suspended;
		}

		get excluded() {
			return this._excluded;
		}

		setExcluded(value) {
			assert.argumentIsRequired(value, 'value', Boolean);

			if (this._excluded !== value) {
				this._container.startTransaction(() => {
					this._items.forEach((item) => {
						item.setExcluded(value);
					});
				});
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

		refresh() {
			calculateStaticData(this);
			calculatePriceData(this, null, true);
		}

		refreshMarketPercent() {
			calculateMarketPercent(this, true);
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

	function calculateStaticData(group) {
		if (group.suspended) {
			return;
		}

		const actual = group._dataActual;
		const format = group._dataFormat;

		const currency = group.currency;
		
		const items = group._items;

		let updates = items.reduce((updates, item) => {
			updates.basis = updates.basis.add(item.data.basis);
			updates.realized = updates.realized.add(item.data.realized);
			updates.unrealized = updates.unrealized.add(item.data.unrealized);
			updates.income = updates.income.add(item.data.income);
			updates.summaryTotalCurrent = updates.summaryTotalCurrent.add(item.data.summaryTotalCurrent);
			updates.summaryTotalPrevious = updates.summaryTotalPrevious.add(item.data.summaryTotalPrevious);

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

			format.quantity = formatDecimal(item.position.snapshot.open, 2);
			format.basisPrice = formatCurrency(item.data.basisPrice, currency);
		}
	}

	function calculatePriceData(group, item, forceRefresh) {
		if (group.suspended) {
			return;
		}

		const parent = group._parent;

		const actual = group._dataActual;
		const format = group._dataFormat;

		const currency = group.currency;

		const refresh = (is.boolean(forceRefresh) && forceRefresh) || (actual.market === null || actual.unrealizedToday === null || actual.total === null);

		let updates;

		if (refresh) {
			const items = group._items;

			updates = items.reduce((updates, item) => {
				updates.market = updates.market.add(item.data.market);
				updates.unrealized = updates.unrealized.add(item.data.unrealized);
				updates.unrealizedToday = updates.unrealizedToday.add(item.data.unrealizedToday);
				updates.summaryTotalCurrent = updates.summaryTotalCurrent.add(item.data.summaryTotalCurrent);

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
				market: actual.market.add(item.data.marketChange),
				marketDirection: { up: item.data.marketChange.getIsPositive(), down: item.data.marketChange.getIsNegative() },
				unrealized: actual.unrealized.add(item.data.unrealizedChange),
				unrealizedToday: actual.unrealizedToday.add(item.data.unrealizedTodayChange),
				summaryTotalCurrent: actual.summaryTotalCurrent.add(item.data.summaryTotalCurrentChange)
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
		
		calculateMarketPercent(group, false);
		calculateUnrealizedPercent(group);
	}

	function calculateMarketPercent(group, silent) {
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
				marketPercent = actual.market.divide(parentData.market);
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
