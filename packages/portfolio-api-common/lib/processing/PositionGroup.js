const assert = require('@barchart/common-js/lang/assert'),
	Currency = require('@barchart/common-js/lang/Currency'),
	Decimal = require('@barchart/common-js/lang/Decimal'),
	formatter = require('@barchart/common-js/lang/formatter'),
	is = require('@barchart/common-js/lang/is');

module.exports = (() => {
	'use strict';

	/**
	 * @public
	 */
	class PositionGroup {
		constructor(parent, items, currency, description, single) {
			this._parent = parent || null;

			this._items = items;
			this._currency = currency;

			this._description = description;

			this._single = is.boolean(single) && single;

			this._dataFormat = { };
			this._dataActual = { };
			
			this._dataFormat.description = this._description;
			
			this._dataActual.currentPrice = null;
			this._dataActual.previousPrice = null;
			this._dataActual.basis = null;
			this._dataActual.realized = null;
			this._dataActual.income = null;
			this._dataActual.market = null;
			this._dataActual.marketPercent = null;
			this._dataActual.unrealizedToday = null;
			this._dataActual.total = null;
			this._dataActual.summaryOneTotal = null;
			this._dataActual.summaryTwoTotal = null;

			this._dataFormat.currentPrice = null;
			this._dataFormat.previousPrice = null;
			this._dataFormat.basis = null;
			this._dataFormat.realized = null;
			this._dataFormat.income = null;
			this._dataFormat.market = null;
			this._dataFormat.marketPercent = null;
			this._dataFormat.unrealizedToday = null;
			this._dataFormat.total = null;
			this._dataFormat.summaryOneTotal = null;
			this._dataFormat.summaryTwoTotal = null;

			this._dataFormat.unrealizedTodayNegative = false;

			this._items.forEach((item) => {
				item.registerPriceChangeHandler((data, sender) => {
					if (this._single) {
						this._dataActual.currentPrice = data.currentPrice;
						this._dataFormat.currentPrice = format(data.currentPrice, sender.position.instrument.currency);
					} else {
						this._dataActual.currentPrice = null;
						this._dataFormat.currentPrice = null;
					}

					calculatePriceData(this, sender);
				});
			});

			calculateStaticData(this);
			calculatePriceData(this);
		}

		get items() {
			return this._items;
		}

		get currency() {
			return this._currency;
		}

		get description() {
			return this._description;
		}

		get data() {
			return this._dataFormat;
		}

		get single() {
			return this._single;
		}

		toString() {
			return '[PositionGroup]';
		}
	}

	function formatNumber(decimal, precision) {
		if (decimal !== null) {
			return formatter.numberToString(decimal.toFloat(), precision, ',', false);
		} else {
			return '—';
		}
	}

	function formatPercent(decimal, precision) {
		if (decimal !== null) {
			return formatNumber(decimal.multiply(100), precision);
		} else {
			return '—';
		}
	}

	function formatCurrency(decimal, currency) {
		return formatNumber(decimal, currency.precision);
	}

	function calculateStaticData(group) {
		const actual = group._dataActual;
		const format = group._dataFormat;

		const currency = group.currency;
		
		const items = group._items;

		let updates = items.reduce((updates, item) => {
			updates.basis = updates.basis.add(item.data.basis);
			updates.realized = updates.realized.add(item.data.realized);
			updates.income = updates.income.add(item.data.income);
			updates.summaryOneTotal = updates.summaryOneTotal.add(item.data.summaryOneTotal);
			updates.summaryTwoTotal = updates.summaryTwoTotal.add(item.data.summaryTwoTotal);

			return updates;
		}, {
			basis: Decimal.ZERO,
			realized: Decimal.ZERO,
			income: Decimal.ZERO,
			summaryOneTotal: Decimal.ZERO,
			summaryTwoTotal: Decimal.ZERO
		});

		actual.basis = updates.basis;
		actual.realized = updates.realized;
		actual.income = updates.income;
		actual.summaryOneTotal = updates.summaryOneTotal;
		actual.summaryTwoTotal = updates.summaryTwoTotal;

		format.basis = formatCurrency(actual.basis, currency);
		format.realized = formatCurrency(actual.basis, currency);
		format.income = formatCurrency(actual.income, currency);
		format.summaryOneTotal = formatCurrency(updates.summaryOneTotal, currency);
		format.summaryTwoTotal = formatCurrency(updates.summaryTwoTotal, currency);
	}

	function calculatePriceData(group, item) {
		const parent = group._parent;

		const actual = group._dataActual;
		const format = group._dataFormat;

		const currency = group.currency;

		let updates;

		if (actual.market !== null && actual.unrealizedToday !== null && actual.total !== null) {
			updates = {
				market: actual.market.add(item.data.marketChange),
				unrealizedToday: actual.unrealizedToday.add(item.data.unrealizedTodayChange)
			};
		} else {
			const items = group._items;

			updates = items.reduce((updates, item) => {
				updates.market = updates.market.add(item.data.market);
				updates.unrealizedToday = updates.unrealizedToday.add(item.data.unrealizedToday);

				return updates;
			}, {
				market: Decimal.ZERO,
				unrealizedToday: Decimal.ZERO
			});
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
		actual.marketPercent = updates.marketPercent;
		actual.unrealizedToday = updates.unrealizedToday;
		actual.total = updates.unrealizedToday.add(actual.realized).add(actual.income);
		
		format.market = formatCurrency(actual.market, currency);
		format.marketPercent = formatPercent(actual.marketPercent, 2);
		format.unrealizedToday = formatCurrency(actual.unrealizedToday, currency);
		format.unrealizedTodayNegative = actual.unrealizedToday.getIsNegative();
		format.total = formatCurrency(actual.total, currency);
	}

	return PositionGroup;
})();
