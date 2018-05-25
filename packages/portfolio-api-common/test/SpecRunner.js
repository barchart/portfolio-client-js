(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const uuid = require('uuid');

const assert = require('@barchart/common-js/lang/assert'),
	Enum = require('@barchart/common-js/lang/Enum');

module.exports = (() => {
	'use strict';

	/**
	 * An enumeration used to classify instruments.
	 *
	 * @public
	 * @extends {Enum}
	 * @param {String} description
	 * @param {String} alternateDescription
	 * @param {String} code
	 * @param {Boolean} canReinvest
	 * @param {Boolean} canShort
	 * @param {Boolean} canSwitchDirection
	 * @param {Boolean} usesSymbols
	 * @param {Boolean} hasCorporateActions
	 * @param {Function} generator
	 */
	class InstrumentType extends Enum {
		constructor(code, description, alternateDescription, canReinvest, canShort, canSwitchDirection, usesSymbols, hasCorporateActions, generator) {
			super(code, description);

			assert.argumentIsRequired(alternateDescription, 'alternateDescription', String);
			assert.argumentIsRequired(canReinvest, 'canReinvest', Boolean);
			assert.argumentIsRequired(canShort, 'canShort', Boolean);
			assert.argumentIsRequired(canSwitchDirection, 'canSwitchDirection', Boolean);
			assert.argumentIsRequired(usesSymbols, 'usesSymbols', Boolean);
			assert.argumentIsRequired(hasCorporateActions, 'hasCorporateActions', Boolean);
			assert.argumentIsRequired(generator, 'generator', Function);

			this._alternateDescription = alternateDescription;
			this._canReinvest = canReinvest;
			this._canShort = canShort;
			this._canSwitchDirection = canSwitchDirection;
			this._usesSymbols = usesSymbols;
			this._hasCorporateActions = hasCorporateActions;

			this._generator = generator;
		}

		/**
		 * A human-readable description.
		 *
		 * @public
		 * @returns {String}
		 */
		get alternateDescription() {
			return this._alternateDescription;
		}

		/**
		 * Indicates if the instrument type allows automatic reinvestment.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get canReinvest() {
			return this._canReinvest;
		}

		/**
		 * Indicates if short-selling is possible for this instrument type.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get canShort() {
			return this._canShort;
		}

		/**
		 * Indicates if one transaction is allowed to switch a position size from
		 * positive to negative (or vice versa).
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get canSwitchDirection() {
			return this._canSwitchDirection;
		}

		/**
		 * Indicates if an instrument of this type can be represented by a symbol.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get usesSymbols() {
			return this._usesSymbols;
		}

		/**
		 * Indicates if corporate actions are possible for this type of instrument.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get hasCorporateActions() {
			return this._hasCorporateActions;
		}

		/**
		 * Generates an identifier for the instrument.
		 *
		 * @public
		 * @param {Object} instrument
		 * @returns {String}
		 */
		generateIdentifier(instrument) {
			assert.argumentIsRequired(instrument, 'instrument');

			if (instrument.type !== this) {
				throw new Error('Unable to generate instrument identifier for incompatible type.');
			}

			return this._generator(instrument);
		}

		/**
		 * Cash.
		 *
		 * @public
		 * @static
		 * @returns {InstrumentType}
		 */
		static get CASH() {
			return cash;
		}

		/**
		 * An equity issue.
		 *
		 * @public
		 * @static
		 * @returns {InstrumentType}
		 */
		static get EQUITY() {
			return equity;
		}

		/**
		 * A mutual fund.
		 *
		 * @public
		 * @static
		 * @returns {InstrumentType}
		 */
		static get FUND() {
			return fund;
		}

		/**
		 * An undefined asset (e.g. a house, or a collectible, or a salvaged alien spaceship).
		 *
		 * @public
		 * @static
		 * @returns {InstrumentType}
		 */
		static get OTHER() {
			return other;
		}

		/**
		 * Generates an identifier for the instrument.
		 *
		 * @public
		 * @static
		 * @param {Object} instrument
		 * @returns {String}
		 */
		static generateIdentifier(instrument) {
			return map[instrument.type.code].generateIdentifier(instrument);
		}

		/**
		 *
		 * @public
		 * @static
		 * @param code
		 * @returns {InstrumentType}
		 */
		static fromSymbolType(code) {
			assert.argumentIsRequired(code, 'code', Number);

			if (code === 1 || code === 6 || code === 7 || code === 11) {
				return InstrumentType.EQUITY;
			} else if (code === 5 || code == 15) {
				return InstrumentType.FUND;
			} else {
				throw new Error('Unable to determine InstrumentType for [', code, ']');
			}
		}

		toString() {
			return '[InstrumentType]';
		}
	}

	const cash = new InstrumentType('CASH', 'cash', 'Cash', false, false, true, false, false, (instrument) => `BARCHART-${instrument.type.code}-${instrument.currency.code}`);
	const equity = new InstrumentType('EQUITY', 'equity', 'Equities', true, true, false, true, true, (instrument) => `BARCHART-${instrument.type.code}-${instrument.symbol.barchart}`);
	const fund = new InstrumentType('FUND', 'mutual fund', 'Funds', true, false, false, true, true, (instrument) => `BARCHART-${instrument.type.code}-${instrument.symbol.barchart}`);
	const other = new InstrumentType('OTHER', 'other', 'Other', false, false, false, false, false, (instrument) => `BARCHART-${instrument.type.code}-${uuid.v4()}`);

	const map = { };

	map[cash.code] = cash;
	map[equity.code] = equity;
	map[fund.code] = fund;
	map[other.code] = other;

	return InstrumentType;
})();

},{"@barchart/common-js/lang/Enum":21,"@barchart/common-js/lang/assert":24,"uuid":30}],2:[function(require,module,exports){
const assert = require('@barchart/common-js/lang/assert'),
	Decimal = require('@barchart/common-js/lang/Decimal'),
	Enum = require('@barchart/common-js/lang/Enum');

module.exports = (() => {
	'use strict';

	/**
	 * Describes a position size -- positive values are long, negative values
	 * are short and zero values are even.
	 *
	 * @public
	 * @extends {Enum}
	 * @param {String} code
	 * @param {String} description
	 * @param {sign} sign
	 */
	class PositionDirection extends Enum {
		constructor(code, description, sign) {
			super(code, description);

			assert.argumentIsRequired(sign, 'sign', String);
			
			this._sign = sign;
		}

		/**
		 * A description of the positiveness or negativeness of the size of the
		 * position.
		 *
		 * @public
		 * @returns {String}
		 */
		get sign() {
			return this._sign;
		}

		/**
		 * Indicates if the position size is positive (i.e. is {@link PositionDirection.LONG}).
		 *
		 * @public
		 * @returns {boolean}
		 */
		get positive() {
			return this === long;
		}

		/**
		 * Indicates if the position size is negative (i.e. is {@link PositionDirection.SHORT}).
		 *
		 * @public
		 * @returns {boolean}
		 */
		get negative() {
			return this === short;
		}

		/**
		 * Indicates if the position size is zero (i.e. is {@link PositionDirection.EVEN}).
		 *
		 * @public
		 * @returns {boolean}
		 */
		get closed() {
			return this === even;
		}

		/**
		 * A positive quantity position.
		 * 
		 * @public
		 * @static
		 * @returns {PositionDirection}
		 */
		static get LONG() {
			return long;
		}

		/**
		 * A positive quantity position.
		 *
		 * @public
		 * @static
		 * @returns {PositionDirection}
		 */
		static get SHORT() {
			return short;
		}

		/**
		 * A zero quantity position.
		 *
		 * @public
		 * @static
		 * @returns {PositionDirection}
		 */
		static get EVEN() {
			return even;
		}

		/**
		 * Given an open quantity, returns a {@link PositionDirection} that
		 * describes the quantity.
		 *
		 * @public
		 * @static
		 * @param {Decimal} open
		 * @returns {PositionDirection}
		 */
		static for(open) {
			assert.argumentIsRequired(open, 'open', Decimal, 'Decimal');
			
			if (open.getIsPositive()) {
				return long;
			} else if (open.getIsNegative()) {
				return short;
			} else {
				return even;
			}
		}
	}

	const long = new PositionDirection('LONG', 'Long', 'positive');
	const short = new PositionDirection('SHORT', 'Short', 'negative');
	const even = new PositionDirection('EVEN', 'Even', 'zero');

	return PositionDirection;
})();

},{"@barchart/common-js/lang/Decimal":19,"@barchart/common-js/lang/Enum":21,"@barchart/common-js/lang/assert":24}],3:[function(require,module,exports){
const array = require('@barchart/common-js/lang/array'),
	assert = require('@barchart/common-js/lang/assert'),
	Day = require('@barchart/common-js/lang/Day'),
	Decimal = require('@barchart/common-js/lang/Decimal'),
	Enum = require('@barchart/common-js/lang/Enum'),
	is = require('@barchart/common-js/lang/is');

module.exports = (() => {
	'use strict';

	/**
	 * An enumeration used to define timeframes for position summaries.
	 *
	 * @public
	 * @extends {Enum}
	 * @param {String} code
	 * @param {String} description
	 * @param {Function} rangeCalculator
	 * @param {Function} startDateCalculator
	 * @param {Function} descriptionCalculator
	 */
	class PositionSummaryFrame extends Enum {
		constructor(code, description, unique, rangeCalculator, startDateCalculator, descriptionCalculator) {
			super(code, description);

			assert.argumentIsRequired(unique, 'unique', Boolean);

			assert.argumentIsRequired(rangeCalculator, 'rangeCalculator', Function);
			assert.argumentIsRequired(startDateCalculator, 'startDateCalculator', Function);
			assert.argumentIsRequired(descriptionCalculator, 'descriptionCalculator', Function);

			this._unique = unique;

			this._rangeCalculator = rangeCalculator;
			this._startDateCalculator = startDateCalculator;
			this._descriptionCalculator = descriptionCalculator;
		}

		/**
		 * If true, only one summary, of the given type, can exist for a
		 * position. If false, multiple summaries, of the given type, can
		 * exist for a position.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get unique() {
			return this._unique;
		}

		/**
		 * Returns a human-readable description of the frame, given
		 * start and end dates.
		 *
		 * @public
		 * @returns {PositionSummaryRange} range
		 * @returns {String}
		 */
		describeRange(range) {
			return this._descriptionCalculator(range.start, range.end);
		}

		/**
		 * Returns the most recent ranges for the frame.
		 *
		 * @public
		 * @param {Number} periods
		 * @returns {Array.<PositionSummaryRange>}
		 */
		getRecentRanges(periods) {
			const startDate = this.getStartDate(periods);
			const transaction = { date: startDate, snapshot: { open: Decimal.ONE } };

			return this.getRanges([ transaction ]);
		}

		/**
		 * Returns the ranges for the set of {@link Transaction} objects.
		 *
		 * @public
		 * @param {Array.<Transaction>} transactions
		 * @returns {Array.<PositionSummaryRange>}
		 */
		getRanges(transactions) {
			assert.argumentIsArray(transactions, 'transactions');

			return this._rangeCalculator(getFilteredTransactions(transactions));
		}

		/**
		 * Returns the start date for a frame, a given number of periods ago.
		 *
		 * @public
		 * @param {Number} periods
		 * @returns {Day}
		 */
		getStartDate(periods) {
			assert.argumentIsRequired(periods, 'periods', Number);

			return this._startDateCalculator(periods);
		}

		/**
		 * A summary for a calendar year.
		 *
		 * @public
		 * @returns {PositionSummaryFrame}
		 */
		static get YEARLY() {
			return yearly;
		}

		/**
		 * A summary for a quarter.
		 *
		 * @public
		 * @returns {PositionSummaryFrame}
		 */
		static get QUARTERLY() {
			return quarterly;
		}

		/**
		 * A summary for a calendar month.
		 *
		 * @public
		 * @returns {PositionSummaryFrame}
		 */
		static get MONTHLY() {
			return monthly;
		}

		/**
		 * A summary the current year (to date).
		 *
		 * @public
		 * @returns {PositionSummaryFrame}
		 */
		static get YTD() {
			return ytd;
		}

		toString() {
			return '[PositionSummaryFrame]';
		}
	}

	const yearly = new PositionSummaryFrame('YEARLY', 'year', false, getYearlyRanges, getYearlyStartDate, getYearlyRangeDescription);
	const quarterly = new PositionSummaryFrame('QUARTER', 'quarter', false, getQuarterlyRanges, getQuarterlyStartDate, getQuarterlyRangeDescription);
	const monthly = new PositionSummaryFrame('MONTH', 'month', false, getMonthlyRanges, getMonthlyStartDate, getMonthlyRangeDescription);
	const ytd = new PositionSummaryFrame('YTD', 'year-to-date', true, getYearToDateRanges, getYearToDateStartDate, getYearToDateRangeDescription);

	/**
	 * The start and and date for a {@link PositionSummaryFrame}
	 *
	 * @typedef PositionSummaryRange
	 * @type {Object}
	 * @property {Day} start
	 * @property {Day} end
	 */

	function getRange(start, end) {
		return {
			start: start,
			end: end
		};
	}

	function getYearlyRanges(transactions) {
		const ranges = [ ];

		if (transactions.length !== 0) {
			const first = array.first(transactions);
			const last = array.last(transactions);

			const firstDate = first.date;
			const lastDate = last.date;

			let lastYear;

			if (last.snapshot.open.getIsZero()) {
				lastYear = last.date.year + 1;
			} else {
				lastYear = Day.getToday().year;
			}

			for (let end = new Day(firstDate.year, 12, 31); end.year < lastYear; end = end.addYears(1)) {
				ranges.push(getRange(end.subtractYears(1), end));
			}
		}

		return ranges;
	}

	function getQuarterlyRanges(transactions) {
		return [ ];
	}

	function getMonthlyRanges(transactions) {
		return [ ];
	}

	function getYearToDateRanges(transactions) {
		const ranges = [ ];

		if (transactions.length !== 0) {
			const first = array.first(transactions);
			const last = array.last(transactions);

			const currentYear = Day.getToday().year;

			if (!last.snapshot.open.getIsZero() || last.date.year === currentYear) {
				let end = new Day(Day.getToday().year, 12, 31);
				let start = end.subtractYears(1);

				ranges.push(getRange(start, end));
			}
		}

		return ranges;
	}

	function getYearlyStartDate(periods) {
		const today = Day.getToday();

		return Day.getToday()
			.subtractMonths(today.month - 1)
			.subtractDays(today.day)
			.subtractYears(periods);
	}

	function getQuarterlyStartDate(periods) {
		return null;
	}

	function getMonthlyStartDate(periods) {
		return null;
	}

	function getYearToDateStartDate(periods) {
		return null;
	}

	function getYearlyRangeDescription(start, end) {
		return end.year.toString();
	}

	function getQuarterlyRangeDescription(start, end) {
		return '';
	}

	function getMonthlyRangeDescription(start, end) {
		return '';
	}

	function getYearToDateRangeDescription(start, end) {
		return `${end.year.toString()} YTD`;
	}

	function getFilteredTransactions(transactions) {
		return transactions.reduce((filtered, transaction) => {
			if (!transaction.snapshot.open.getIsZero() || transaction.type.closing) {
				filtered.push(transaction);
			}

			return filtered;
		}, [ ]);
	}

	return PositionSummaryFrame;
})();

},{"@barchart/common-js/lang/Day":18,"@barchart/common-js/lang/Decimal":19,"@barchart/common-js/lang/Enum":21,"@barchart/common-js/lang/array":23,"@barchart/common-js/lang/assert":24,"@barchart/common-js/lang/is":26}],4:[function(require,module,exports){
const assert = require('@barchart/common-js/lang/assert'),
	Enum = require('@barchart/common-js/lang/Enum');

module.exports = (() => {
	'use strict';

	/**
	 * An enumeration item that describes a type of transaction.
	 *
	 * @public
	 * @extends {Enum}
	 * @param {String} code
	 * @param {String} description
	 * @param {String} display
	 * @param {Boolean} purchase
	 * @param {Boolean} sale
	 * @param {Boolean} income
	 * @param {Boolean} opening
	 * @param {Boolean} closing
	 * @param {Boolean} fee
	 * @param {Boolean} corporateAction
	 * @param {Boolean} initial
	 * @param {Boolean} significant
	 */
	class TransactionType extends Enum {
		constructor(code, description, display, purchase, sale, income, opening, closing, fee, corporateAction, initial, significant) {
			super(code, description);

			assert.argumentIsRequired(display, 'display', String);
			assert.argumentIsRequired(purchase, 'purchase', Boolean);
			assert.argumentIsRequired(sale, 'sale', Boolean);
			assert.argumentIsRequired(income, 'income', Boolean);
			assert.argumentIsRequired(opening, 'opening', Boolean);
			assert.argumentIsRequired(closing, 'closing', Boolean);
			assert.argumentIsRequired(fee, 'fee', Boolean);
			assert.argumentIsRequired(corporateAction, 'corporateAction', Boolean);
			assert.argumentIsRequired(initial, 'initial', Boolean);
			assert.argumentIsRequired(significant, 'significant', Boolean);

			this._display = display;
			this._purchase = purchase;
			this._sale = sale;
			this._income = income;
			this._opening = opening;
			this._closing = closing;
			this._fee = fee;
			this._corporateAction = corporateAction;
			this._initial = initial;
			this._significant = significant;
		}

		/**
		 * A human-readable description of the transaction type.
		 *
		 * @public
		 * @returns {String}
		 */
		get display() {
			return this._display;
		}

		/**
		 * Indicates if the transaction was a trade.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get trade() {
			return this._purchase || this._sale;
		}

		/**
		 * Indicates if the transaction was a purchase.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get purchase() {
			return this._purchase;
		}

		/**
		 * Indicates if the transaction was a sale.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get sale() {
			return this._sale;
		}

		/**
		 * Indicates if the transaction was an income payment.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get income() {
			return this._income;
		}

		/**
		 * Indicates if the transaction opens the position (i.e. increases its
		 * magnitude).
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get opening() {
			return this._opening;
		}

		/**
		 * Indicates if the transaction closes the position (i.e. decreases its
		 * magnitude).
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get closing() {
			return this._closing;
		}

		/**
		 * Indicates if the transaction is a chart that neither opens nor
		 * closes the position.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get fee() {
			return this._fee;
		}

		/**
		 * Indicates if the transaction is a corporate action.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get corporateAction() {
			return this._corporateAction;
		}

		/**
		 * Indicates if the transaction can be the first transaction for a position.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get initial() {
			return this._initial;
		}

		/**
		 * Significant transactions cannot be discarded during transaction re-write.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get significant() {
			return this._significant;
		}

		/**
		 * A purchase.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get BUY() {
			return buy;
		}

		/**
		 * A sale.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get SELL() {
			return sell;
		}

		/**
		 * A purchase (in a short position).
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get BUY_SHORT() {
			return buyShort;
		}

		/**
		 * A short sale.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get SELL_SHORT() {
			return sellShort;
		}

		/**
		 * A cash dividend.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get DIVIDEND() {
			return dividend;
		}

		/**
		 * A cash dividend, reinvested.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get DIVIDEND_REINVEST() {
			return dividendReinvest;
		}

		/**
		 * A stock dividend.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get DIVIDEND_STOCK() {
			return dividendStock;
		}

		/**
		 * A mutual fund distribution in cash.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get DISTRIBUTION_CASH() {
			return distributionCash;
		}

		/**
		 * A mutual fund distribution in units.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get DISTRIBUTION_FUND() {
			return distributionFund;
		}

		/**
		 * A mutual fund distribution in cash, reinvested.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get DISTRIBUTION_REINVEST() {
			return distributionReinvest;
		}

		/**
		 * A split.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get SPLIT() {
			return split;
		}

		/**
		 * A fee.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get FEE() {
			return fee;
		}

		/**
		 * A mutual fund fee, which is paid in units.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get FEE_UNITS() {
			return feeUnits;
		}

		/**
		 * A deposit.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get DEPOSIT() {
			return deposit;
		}

		/**
		 * A withdrawal.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get WITHDRAWAL() {
			return withdrawal;
		}

		/**
		 * A system-generated withdrawal, arising from another transaction.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get DEBIT() {
			return debit;
		}

		/**
		 * A system-generated deposit, arising from another transaction.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get CREDIT() {
			return credit;
		}

		/**
		 * A valuation event.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get VALUATION() {
			return valuation;
		}

		/**
		 * Other Income.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get INCOME() {
			return income;
		}

		toString() {
			return '[TransactionType]';
		}
	}

	const buy = new TransactionType('B', 'Buy', 'Buy', true, false, false, true, false, false, false, true, true);
	const sell = new TransactionType('S', 'Sell', 'Sell', false, true, false, false, true, false, false, false, true);
	const buyShort = new TransactionType('BS', 'Buy To Cover', 'Buy To Cover', true, false, false, false, true, false, false, false, true);
	const sellShort = new TransactionType('SS', 'Sell Short', 'Sell Short', false, true, false, true, false, false, false, true, true);
	const dividend = new TransactionType('DV', 'Dividend', 'Dividend', false, false, true, false, false, false, true, false, false);
	const dividendReinvest = new TransactionType('DX', 'Dividend (Reinvested)', 'Dividend Reinvest', false, false, false, true, false, false, true, false, false);
	const dividendStock = new TransactionType('DS', 'Dividend (Stock)', 'Dividend Stock', false, false, false, true, false, false, true, false, false);
	const split = new TransactionType('SP', 'Split', 'Split', false, false, false, true, false, false, true, false, false);
	const fee = new TransactionType('F', 'Fee', 'Fee', false, false, false, false, false, true, false, false, false);
	const feeUnits = new TransactionType('FU', 'Fee Units', 'Fee', false, false, false, false, true, false, false, false, false);

	const distributionCash = new TransactionType('DC', 'Distribution (Cash)', 'Cash Distribution', false, false, true, false, false, false, true, false, false);
	const distributionReinvest = new TransactionType('DY', 'Distribution (Reinvested)', 'Distribution Reinvest', false, false, false, true, false, false, true, false, false);
	const distributionFund = new TransactionType('DF', 'Distribution (Units)', 'Unit Distribution', false, false, false, true, false, false, true, false, false);

	const deposit = new TransactionType('D', 'Deposit', 'Deposit', false, false, false, false, false, false, false, true, true);
	const withdrawal = new TransactionType('W', 'Withdrawal', 'Withdrawal', false, false, false, false, false, false, false, true, true);
	const debit = new TransactionType('DR', 'Debit', 'Debit', false, false, false, false, false, false, false, true, true);
	const credit = new TransactionType('CR', 'Credit', 'Credit', false, false, false, false, false, false, false, true, true);

	const valuation = new TransactionType('V', 'Valuation', 'Valuation', false, false, false, false, false, false, false, false, false);
	const income = new TransactionType('I', 'Income', 'Income', false, false, true, false, false, false, false, false, false);

	return TransactionType;
})();

},{"@barchart/common-js/lang/Enum":21,"@barchart/common-js/lang/assert":24}],5:[function(require,module,exports){
const assert = require('@barchart/common-js/lang/assert'),
	array = require('@barchart/common-js/lang/array');

const InstrumentType = require('./InstrumentType'),
	PositionDirection = require('./PositionDirection'),
	TransactionType = require('./TransactionType');

module.exports = (() => {
	'use strict';

	/**
	 * Static utilities for validating transactions.
	 *
	 * @public
	 */
	class TransactionValidator {
		constructor() {

		}

		/**
		 * Given a set of transaction, ensures that all sequence numbers and dates
		 * are properly ordered.
		 *
		 * @public
		 * @static
		 * @param {Array.<Object>} transactions
		 * @returns {Boolean}
		 */
		static validateOrder(transactions) {
			return TransactionValidator.getInvalidIndex(transactions) < 0;
		}

		/**
		 * Given a set of transaction, returns the index of the first transaction that with an invalid
		 * sequence number or date.
		 *
		 * @public
		 * @static
		 * @param {Array.<Object>} transactions
		 * @returns {Number}
		 */
		static getInvalidIndex(transactions) {
			assert.argumentIsArray(transactions, 'transactions');

			return transactions.findIndex((t, i) => t.sequence !== (i + 1) || (i !== 0 && t.date.getIsBefore(transactions[i - 1].date)));
		}

		/**
		 * Given an instrument type, returns all valid transaction types.
		 *
		 * @static
		 * @public
		 * @param {InstrumentType} instrumentType
		 * @param {Boolean=} userInitiated
		 * @pararm {PositionDirection=} currentDirection
		 * @returns {Array.<TransactionType>}
		 */
		static getTransactionTypesFor(instrumentType, userInitiated, currentDirection) {
			assert.argumentIsRequired(instrumentType, 'instrumentType', InstrumentType, 'InstrumentType');
			assert.argumentIsOptional(userInitiated, 'userInitiated', Boolean);

			let valid = validTransactionTypes[instrumentType.code] || [ ];

			if (userInitiated) {
				valid = valid.filter(data => data.user === userInitiated);
			}

			if (currentDirection) {
				valid = valid.filter(data => data.directions.some(d => d === currentDirection));
			}

			return valid.map(d => d.type);
		}

		/**
		 * Returns transaction types which can be initiated by the user, regardless
		 * of instrument type.
		 *
		 * @public
		 * @static
		 * @returns {Array.<TransactionType>}
		 */
		static getUserInitiatedTransactionTypes() {
			return array.unique(Object.keys(validTransactionTypes).reduce((types, key) => {
				const instrumentTypes = validTransactionTypes[key];

				instrumentTypes.forEach((data) => {
					if (data.user) {
						types.push(data.type);
					}
				});

				return types;
			}, [ ]));
		}

		/**
		 * Determines if a transaction type is applicable to an instrument type.
		 *
		 * @static
		 * @public
		 * @param {InstrumentType} instrumentType
		 * @param {TransactionType} transactionType
		 * @param {Boolean=} userInitiated
		 * @returns {Boolean}
		 */
		static validateTransactionType(instrumentType, transactionType, userInitiated) {
			assert.argumentIsRequired(transactionType, 'transactionType', TransactionType, 'TransactionType');

			const transactionTypes = TransactionValidator.getTransactionTypesFor(instrumentType, userInitiated);

			return transactionTypes.some(t => t === transactionType);
		}

		/**
		 * Determines if a transaction type is valid as the first transaction of
		 * a position.
		 *
		 * @param {TransactionType} transactionType
		 */
		static validateInitialTransactionType(transactionType) {
			return transactionType.initial;
		}
		
		/**
		 * Determines if a position for a given instrument type can exist in
		 * the given direction.
		 *
		 * @static
		 * @public
		 * @param {InstrumentType} instrumentType
		 * @param {PositionDirection} direction
		 * @returns {Boolean}
		 */
		static validateDirection(instrumentType, direction) {
			assert.argumentIsRequired(instrumentType, 'instrumentType', InstrumentType, 'InstrumentType');
			assert.argumentIsRequired(direction, 'direction', PositionDirection, 'PositionDirection');

			return validDirections[instrumentType.code].some(d => d === direction);
		}

		/**
		 * Determines if the position switches direction and if the direction switch
		 * is valid.
		 *
		 * @static
		 * @public
		 * @param {InstrumentType} instrumentType
		 * @param {PositionDirection|null|undefined} currentDirection
		 * @param {PositionDirection} proposedDirection
		 * @returns {Boolean}
		 */
		static validateDirectionSwitch(instrumentType, currentDirection, proposedDirection) {
			return currentDirection === null || instrumentType.canSwitchDirection || (currentDirection.closed || proposedDirection.closed || currentDirection.positive === proposedDirection.positive);
		}

		toString() {
			return '[TransactionValidator]';
		}
	}

	const validTransactionTypes = { };

	function associateTypes(instrumentType, transactionType, userInitiated, directions) {
		const instrumentTypeCode = instrumentType.code;

		if (!validTransactionTypes.hasOwnProperty(instrumentTypeCode)) {
			validTransactionTypes[instrumentTypeCode] = [ ];
		}

		validTransactionTypes[instrumentTypeCode].push({ type: transactionType, user: userInitiated, directions: directions || [ PositionDirection.LONG, PositionDirection.SHORT, PositionDirection.EVEN ]  });
	}

	associateTypes(InstrumentType.EQUITY, TransactionType.BUY, true, [ PositionDirection.LONG, PositionDirection.EVEN ]);
	associateTypes(InstrumentType.EQUITY, TransactionType.SELL, true, [ PositionDirection.LONG ]);
	associateTypes(InstrumentType.EQUITY, TransactionType.SELL_SHORT, true, [ PositionDirection.SHORT, PositionDirection.EVEN ]);
	associateTypes(InstrumentType.EQUITY, TransactionType.BUY_SHORT, true, [ PositionDirection.SHORT ]);
	associateTypes(InstrumentType.EQUITY, TransactionType.FEE, true, [ PositionDirection.LONG, PositionDirection.SHORT ]);
	associateTypes(InstrumentType.EQUITY, TransactionType.DIVIDEND, false);
	associateTypes(InstrumentType.EQUITY, TransactionType.DIVIDEND_REINVEST, false);
	associateTypes(InstrumentType.EQUITY, TransactionType.DIVIDEND_STOCK, false);
	associateTypes(InstrumentType.EQUITY, TransactionType.SPLIT, false);

	associateTypes(InstrumentType.FUND, TransactionType.BUY, true, [ PositionDirection.LONG, PositionDirection.EVEN ]);
	associateTypes(InstrumentType.FUND, TransactionType.SELL, true, [ PositionDirection.LONG ]);
	associateTypes(InstrumentType.FUND, TransactionType.FEE, true, [ PositionDirection.LONG ]);
	associateTypes(InstrumentType.FUND, TransactionType.FEE_UNITS, false);
	associateTypes(InstrumentType.FUND, TransactionType.DISTRIBUTION_CASH, false);
	associateTypes(InstrumentType.FUND, TransactionType.DISTRIBUTION_REINVEST, false);
	associateTypes(InstrumentType.FUND, TransactionType.DISTRIBUTION_FUND, false);

	associateTypes(InstrumentType.OTHER, TransactionType.BUY, true, [ PositionDirection.LONG, PositionDirection.EVEN ]);
	associateTypes(InstrumentType.OTHER, TransactionType.SELL, true, [ PositionDirection.LONG ]);
	associateTypes(InstrumentType.OTHER, TransactionType.INCOME, true, [ PositionDirection.LONG ]);
	associateTypes(InstrumentType.OTHER, TransactionType.FEE, true, [ PositionDirection.LONG ]);
	associateTypes(InstrumentType.OTHER, TransactionType.VALUATION, true, [ PositionDirection.LONG ]);

	associateTypes(InstrumentType.CASH, TransactionType.DEPOSIT, true);
	associateTypes(InstrumentType.CASH, TransactionType.WITHDRAWAL, true);
	associateTypes(InstrumentType.CASH, TransactionType.FEE, true);
	associateTypes(InstrumentType.CASH, TransactionType.DEBIT, false);
	associateTypes(InstrumentType.CASH, TransactionType.CREDIT, false);

	const validDirections = { };

	function associateDirections(instrumentType, positionDirection) {
		const instrumentTypeCode = instrumentType.code;

		if (!validDirections.hasOwnProperty(instrumentTypeCode)) {
			validDirections[instrumentTypeCode] = [ ];
		}

		validDirections[instrumentTypeCode].push(positionDirection);
	}

	associateDirections(InstrumentType.EQUITY, PositionDirection.EVEN);
	associateDirections(InstrumentType.EQUITY, PositionDirection.LONG);
	associateDirections(InstrumentType.EQUITY, PositionDirection.SHORT);

	associateDirections(InstrumentType.FUND, PositionDirection.EVEN);
	associateDirections(InstrumentType.FUND, PositionDirection.LONG);

	associateDirections(InstrumentType.OTHER, PositionDirection.EVEN);
	associateDirections(InstrumentType.OTHER, PositionDirection.LONG);

	associateDirections(InstrumentType.CASH, PositionDirection.EVEN);
	associateDirections(InstrumentType.CASH, PositionDirection.LONG);
	associateDirections(InstrumentType.CASH, PositionDirection.SHORT);

	return TransactionValidator;
})();

},{"./InstrumentType":1,"./PositionDirection":2,"./TransactionType":4,"@barchart/common-js/lang/array":23,"@barchart/common-js/lang/assert":24}],6:[function(require,module,exports){
const array = require('@barchart/common-js/lang/array'),
	assert = require('@barchart/common-js/lang/assert'),
	ComparatorBuilder = require('@barchart/common-js/collections/sorting/ComparatorBuilder'),
	comparators = require('@barchart/common-js/collections/sorting/comparators'),
	Currency = require('@barchart/common-js/lang/Currency'),
	Decimal = require('@barchart/common-js/lang/Decimal'),
	DisposableStack = require('@barchart/common-js/collections/specialized/DisposableStack'),
	Event = require('@barchart/common-js/messaging/Event'),
	is = require('@barchart/common-js/lang/is'),
	Rate = require('@barchart/common-js/lang/Rate'),
	Tree = require('@barchart/common-js/collections/Tree');

const PositionSummaryFrame = require('./../data/PositionSummaryFrame');

const PositionLevelDefinition = require('./definitions/PositionLevelDefinition'),
	PositionLevelType = require('./definitions/PositionLevelType'),
	PositionTreeDefinition = require('./definitions/PositionTreeDefinition');

const PositionGroup = require('./PositionGroup'),
	PositionItem = require('./PositionItem');

module.exports = (() => {
	'use strict';

	const DEFAULT_CURRENCY = Currency.CAD;

	const REQUIRED_CURRENCIES = [
		Currency.CAD,
		Currency.USD
	];

	/**
	 * A container for positions which groups the positions into one or more
	 * trees for aggregation and display purposes. For example, positions could be
	 * grouped first by asset class then by position.
	 *
	 * Furthermore, the container performs aggregation (driven primarily by price
	 * changes) for each level of grouping.
	 *
	 * @public
	 * @param {Array.<PositionTreeDefinition>} definitions
	 * @param {Array.<Object>} portfolios
	 * @param {Array.<Object>} positions
	 * @param {Array.<Object>} summaries
	 */
	class PositionContainer {
		constructor(definitions, portfolios, positions, summaries) {
			assert.argumentIsArray(definitions, 'definitions', PositionTreeDefinition, 'PositionTreeDefinition');
			assert.argumentIsArray(portfolios, 'portfolios');
			assert.argumentIsArray(positions, 'positions');
			assert.argumentIsArray(summaries, 'summaries');

			this._definitions = definitions;

			this._groupBindings = { };

			this._positionSymbolAddedEvent = new Event(this);
			this._positionSymbolRemovedEvent = new Event(this);

			this._portfolios = portfolios.reduce((map, portfolio) => {
				map[portfolio.portfolio] = portfolio;

				return map;
			}, { });

			this._currentSummaryFrame = PositionSummaryFrame.YTD;
			this._currentSummaryRange = array.last(this._currentSummaryFrame.getRecentRanges(0));

			this._summariesCurrent = summaries.reduce((map, summary) => {
				addSummaryCurrent(map, summary, this._currentSummaryFrame, this._currentSummaryRange);

				return map;
			}, { });

			this._previousSummaryFrame = PositionSummaryFrame.YEARLY;
			this._previousSummaryRanges = this._previousSummaryFrame.getRecentRanges(1);

			this._summariesPrevious = summaries.reduce((map, summary) => {
				addSummaryPrevious(map, summary, this._previousSummaryFrame, this._previousSummaryRanges);

				return map;
			}, { });

			this._items = positions.reduce((items, position) => {
				const item = createPositionItem.call(this, position);

				if (item) {
					items.push(item);
				}

				return items;
			}, [ ]);

			this._symbols = this._items.reduce((map, item) => {
				addBarchartSymbol(map, item);

				return map;
			}, { });

			this._symbolsDisplay = this._items.reduce((map, item) => {
				addDisplaySymbol(map, item);

				return map;
			}, { });

			this._currencies = this._items.reduce((map, item) => {
				const currency = extractCurrency(item.position);

				if (currency) {
					const code = currency.code;

					if (!map.hasOwnProperty(code)) {
						map[code] = [ ];
					}

					map[code].push(item);
				}

				return map;
			}, { });

			const forexCurrencyCodes = array.unique(Object.keys(this._currencies).concat(REQUIRED_CURRENCIES.map(c => c.code)));

			this._forexSymbols = forexCurrencyCodes.reduce((symbols, code) => {
				if (code !== DEFAULT_CURRENCY.code) {
					symbols.push(`^${code}${DEFAULT_CURRENCY.code}`);
				}

				return symbols;
			}, [ ]);

			this._forexQuotes = this._forexSymbols.map((symbol) => {
				return Rate.fromPair(Decimal.ONE, symbol);
			});

			this._nodes = { };

			this._trees = this._definitions.reduce((map, treeDefinition) => {
				const tree = new Tree();

				createGroups.call(this, tree, this._items, treeDefinition, treeDefinition.definitions);
				
				map[treeDefinition.name] = tree;

				return map;
			}, { });

			Object.keys(this._portfolios).forEach(key => updateEmptyPortfolioGroups.call(this, this._portfolios[key]));

			recalculatePercentages.call(this);
		}

		/**
		 * Adds a new portfolio to the container, injecting it into aggregation
		 * trees, as necessary.
		 *
		 * @public
		 * @param {Object} portfolio
		 */
		addPortfolio(portfolio) {
			assert.argumentIsRequired(portfolio, 'portfolio', Object);
			assert.argumentIsRequired(portfolio.portfolio, 'portfolio.portfolio', String);
			assert.argumentIsRequired(portfolio.name, 'portfolio.name', String);

			const key = portfolio.portfolio;

			if (!this._portfolios.hasOwnProperty(key)) {
				this._portfolios[key] = portfolio;

				this._definitions.forEach((treeDefinition) => {
					const tree = this._trees[treeDefinition.name];
					const levelDefinitions = treeDefinition.definitions;

					let portfolioRequiredGroup = null;

					let portfolioLevelDefinition = null;
					let portfolioLevelDefinitionIndex = null;

					levelDefinitions.forEach((levelDefinition, i) => {
						if (portfolioRequiredGroup === null) {
							portfolioRequiredGroup = levelDefinition.generateRequiredGroup(portfolio);

							if (portfolioRequiredGroup !== null) {
								portfolioLevelDefinition = levelDefinition;
								portfolioLevelDefinitionIndex = i;
							}
						}
					});

					if (portfolioRequiredGroup !== null) {
						let parentTrees = [ ];

						if (portfolioLevelDefinitionIndex === 0) {
							parentTrees.push(tree);
						} else {
							const parentLevelDefinition = levelDefinitions[ portfolioLevelDefinitionIndex - 1 ];

							tree.walk((group, groupTree) => {
								if (group.definition === parentLevelDefinition) {
									parentTrees.push(groupTree);
								}
							}, false, false);
						}

						const overrideRequiredGroups = [ portfolioRequiredGroup ];

						parentTrees.forEach((t) => {
							createGroups.call(this, t, [ ], treeDefinition, levelDefinitions.slice(portfolioLevelDefinitionIndex), overrideRequiredGroups);
						});
					}
				});

				updateEmptyPortfolioGroups.call(this, portfolio);
			}
		}

		/**
		 * Updates the portfolio data. For example, a portfolio's name might change.
		 *
		 * @public
		 * @param {Object} portfolio
		 */
		updatePortfolio(portfolio) {
			assert.argumentIsRequired(portfolio, 'portfolio', Object);
			assert.argumentIsRequired(portfolio.portfolio, 'portfolio.portfolio', String);

			getPositionItemsForPortfolio(this._items, portfolio.portfolio).forEach(item => item.updatePortfolio(portfolio));

			updateEmptyPortfolioGroups.call(this, portfolio);
		}

		/**
		 * Removes an existing portfolio, and all of it's positions, from the container. This
		 * also triggers removal of the portfolio and it's positions from any applicable
		 * aggregation trees.
		 *
		 * @public
		 * @param {Object} portfolio
		 */
		removePortfolio(portfolio) {
			assert.argumentIsRequired(portfolio, 'portfolio', Object);
			assert.argumentIsRequired(portfolio.portfolio, 'portfolio.portfolio', String);

			getPositionItemsForPortfolio(this._items, portfolio.portfolio).forEach(item => removePositionItem.call(this, item));

			delete this._portfolios[portfolio.portfolio];

			Object.keys(this._trees).forEach((key) => {
				this._trees[key].walk((group, groupNode) => {
					if (group.definition.type === PositionLevelType.PORTFOLIO && group.key === PositionLevelDefinition.getKeyForPortfolioGroup(portfolio)) {
						severGroupNode.call(this, groupNode);
					}
				}, true, false);
			});

			recalculatePercentages.call(this);
		}

		/**
		 * Adds a new position to the container or updates an existing position already
		 * in the container.
		 *
		 * @public
		 * @param {Object} position
		 * @param {Array.<Object>} summaries
		 */
		updatePosition(position, summaries) {
			assert.argumentIsRequired(position, 'position', Object);
			assert.argumentIsRequired(position.position, 'position.position', String);
			assert.argumentIsRequired(position.portfolio, 'position.portfolio', String);
			assert.argumentIsArray(summaries, 'summaries');

			if (!this._portfolios.hasOwnProperty(position.portfolio)) {
				return;
			}

			const existingBarchartSymbols = this.getPositionSymbols(false);

			removePositionItem.call(this, this._items.find((item) => item.position.position === position.position));

			summaries.forEach((summary) => {
				addSummaryCurrent(this._summariesCurrent, summary, this._currentSummaryFrame, this._currentSummaryRange);
				addSummaryPrevious(this._summariesPrevious, summary, this._previousSummaryFrame, this._previousSummaryRanges);
			});

			const item = createPositionItem.call(this, position);

			addBarchartSymbol(this._symbols, item);
			addDisplaySymbol(this._symbolsDisplay, item);

			this._items.push(item);

			const createGroupOrInjectItem = (parentTree, treeDefinition, levelDefinitions) => {
				if (levelDefinitions.length === 0) {
					return;
				}

				const levelDefinition = levelDefinitions[0];
				const levelKey = levelDefinition.keySelector(item);

				let groupTree;

				if (parentTree.getChildren().length > 0) {
					groupTree = parentTree.findChild(childGroup => childGroup.key === levelKey) || null;
				} else {
					groupTree = null;
				}

				if (groupTree !== null) {
					groupTree.getValue().addItem(item);

					createGroupOrInjectItem(groupTree, treeDefinition, array.dropLeft(levelDefinitions));
				} else {
					createGroups.call(this, parentTree, [ item ], treeDefinition, levelDefinitions, [ ]);
				}
			};

			this._definitions.forEach(definition => createGroupOrInjectItem(this._trees[definition.name], definition, definition.definitions));

			const addedBarchartSymbol = extractSymbolForBarchart(item.position);

			if (addedBarchartSymbol !== null && !existingBarchartSymbols.some(existingBarchartSymbol => existingBarchartSymbol === addedBarchartSymbol)) {
				this._positionSymbolAddedEvent.fire(addedBarchartSymbol);
			}

			recalculatePercentages.call(this);
		}

		/**
		 * Removes a single position from the container.
		 *
		 * @public
		 * @param {Object} position
		 */
		removePosition(position) {
			assert.argumentIsRequired(position, 'position', Object);
			assert.argumentIsRequired(position.position, 'position.position', String);

			removePositionItem.call(this, this._items.find((item) => item.position.position === position.position));

			recalculatePercentages.call(this);
		}

		/**
		 * Returns a distinct list of all symbols used by the positions
		 * within the container.
		 *
		 * @public
		 * @param {Boolean} display - If true, all "display" symbols are returned; otherwise Barchart symbols are returned.
		 * @returns {Array.<String>}
		 */
		getPositionSymbols(display) {
			const symbols = this._items.reduce((symbols, item) => {
				const position = item.position;

				let symbol;

				if (display) {
					symbol = extractSymbolForDisplay(position);
				} else {
					symbol = extractSymbolForBarchart(position);
				}

				if (symbol !== null) {
					symbols.push(symbol);
				}

				return symbols;
			}, [ ]);

			return array.unique(symbols);
		}

		/**
		 * Performs a batch update of both position quotes and forex quotes,
		 * triggering updates to position(s) and data aggregation(s).
		 *
		 * @public
		 * @param {Array.<Object>} positionQuotes
		 * @param {Array.<Object>} forexQuotes
		 */
		setQuotes(positionQuotes, forexQuotes) {
			assert.argumentIsArray(positionQuotes, 'positionQuotes');
			assert.argumentIsArray(forexQuotes, 'forexQuotes');

			if (positionQuotes.length !== 0) {
				positionQuotes.forEach((quote) => {
					const symbol = quote.symbol;

					if (symbol) {
						if (this._symbols.hasOwnProperty(symbol)) {
							this._symbols[ symbol ].forEach(item => item.setQuote(quote));
						}
					}
				});
			}

			if (forexQuotes.length !== 0) {
				forexQuotes.forEach((quote) => {
					const symbol = quote.symbol;

					if (symbol) {
						const rate = Rate.fromPair(quote.lastPrice, symbol);
						const index = this._forexQuotes.findIndex(existing => existing.formatPair() === rate.formatPair());

						if (index < 0) {
							this._forexQuotes.push(rate);
						} else {
							this._forexQuotes[index] = rate;
						}

						Object.keys(this._trees).forEach((key) => {
							this._trees[key].walk(group => group.setForexRates(this._forexQuotes), true, false);
						});

						recalculatePercentages.call(this);
					}
				});
			}

			if (positionQuotes.length !== 0 || forexQuotes.length !== 0) {
				recalculatePercentages.call(this);
			}
		}

		/**
		 * Returns all forex symbols that are required to do currency translations.
		 *
		 * @public
		 * @returns {Array.<String>}
		 */
		getForexSymbols() {
			return this._forexSymbols;
		}

		/**
		 * Returns all current forex quotes.
		 *
		 * @public
		 * @returns {Array.<Object>}
		 */
		getForexQuotes() {
			return this._forexQuotes;
		}

		/**
		 * Updates fundamental data for a single symbol.
		 *
		 * @public
		 * @param {String} symbol
		 * @param {Object} data
		 */
		setPositionFundamentalData(symbol, display, data) {
			assert.argumentIsRequired(symbol, 'symbol', String);
			assert.argumentIsRequired(display, 'display', Boolean);
			assert.argumentIsRequired(data, 'data', Object);

			let map;

			if (display) {
				map = this._symbolsDisplay;
			} else {
				map = this._symbols;
			}

			if (map.hasOwnProperty(symbol)) {
				map[symbol].forEach(item => item.setPositionFundamentalData(data));
			}
		}

		/**
		 * Indicates if a news article exists for a symbol.
		 *
		 * @public
		 * @param {String} symbol
		 * @param {Boolean} display
		 * @param {Boolean} exists
		 */
		setNewsArticleExists(symbol, display, exists) {
			assert.argumentIsRequired(symbol, 'symbol', String);
			assert.argumentIsRequired(display, 'display', Boolean);
			assert.argumentIsRequired(exists, 'exists', Boolean);

			let map;

			if (display) {
				map = this._symbolsDisplay;
			} else {
				map = this._symbols;
			}

			if (map.hasOwnProperty(symbol)) {
				map[symbol].forEach(item => item.setNewsArticleExists(exists));
			}
		}

		/**
		 * Returns a single level of grouping from one of the internal trees.
		 *
		 * @public
		 * @param {String} name
		 * @param {Array.<String>} keys
		 * @returns {PositionGroup}
		 */
		getGroup(name, keys) {
			assert.argumentIsRequired(name, 'name', String);
			assert.argumentIsArray(keys, 'keys', Number);

			return findNode(this._trees[name], keys).getValue();
		}

		/**
		 * Returns all child groups from a level of grouping within one of
		 * the internal trees.
		 *
		 * @public
		 * @param {String} name
		 * @param {Array.<String>} keys
		 * @returns {Array.<PositionGroup>}
		 */
		getGroups(name, keys) {
			assert.argumentIsRequired(name, 'name', String);
			assert.argumentIsArray(keys, 'keys', Number);

			return findNode(this._trees[name], keys).getChildren().map(node => node.getValue());
		}

		/**
		 * Returns the immediate parent {@link PositionGroup} of a {@link PositionGroup}.
		 *
		 * @public
		 * @param {PositionGroup} position
		 * @returns {PositionGroup|null}
		 */
		getParentGroup(group) {
			assert.argumentIsRequired(group, 'group', PositionGroup, 'PositionGroup');

			return findParentGroup.call(this, group, candidate => true);
		}

		/**
		 * Returns the a parent {@link PositionGroup} which represents a portfolio.
		 *
		 * @public
		 * @param {PositionGroup} position
		 * @returns {PositionGroup|null}
		 */
		getParentGroupForPortfolio(group) {
			assert.argumentIsRequired(group, 'group', PositionGroup, 'PositionGroup');

			return findParentGroup.call(this, group, candidate => candidate.definition.type === PositionLevelType.PORTFOLIO);
		}

		/**
		 * Returns all portfolios in the container.
		 *
		 * @public
		 * @returns {Array.<Object>}
		 */
		getPortfolios() {
			return Object.keys(this._portfolios).map(id => this._portfolios[id]);
		}

		/**
		 * Returns all positions for the given portfolio.
		 *
		 * @public
		 * @param {String} portfolio
		 * @returns {Array.<Object>}
		 */
		getPositions(portfolio) {
			assert.argumentIsRequired(portfolio, 'portfolio', String);

			return getPositionItemsForPortfolio(this._items, portfolio)
				.map((item) => {
					return item.position;
				});
		}

		/**
		 * Returns a single position for a portfolio.
		 *
		 * @public
		 * @param {String} portfolio
		 * @param {String} position
		 * @returns {Object|null}
		 */
		getPosition(portfolio, position) {
			assert.argumentIsRequired(position, 'position', String);

			return this.getPositions(portfolio).find(p => p.position === position) || null;
		}

		/**
		 * Registers an observer for symbol addition (this occurs when a new position is added
		 * for a symbol that does not already exist in the container). This event only fires
		 * after the constructor completes (and initial positions have been added).
		 *
		 * @public
		 * @param {Function} handler
		 * @returns {Disposable}
		 */
		registerPositionSymbolAddedHandler(handler) {
			return this._positionSymbolAddedEvent.register(handler);
		}

		/**
		 * Registers an observer for symbol removal (this occurs when the last position for a
		 * symbol is removed from the container).
		 *
		 * @public
		 * @param {Function} handler
		 * @returns {Disposable}
		 */
		registerPositionSymbolRemovedHandler(handler) {
			return this._positionSymbolRemovedEvent.register(handler);
		}

		toString() {
			return '[PositionContainer]';
		}
	}

	function findNode(tree, keys) {
		return keys.reduce((tree, key) => tree.findChild(group => group.key === key), tree);
	}

	function findParentGroup(group, predicate) {
		const groupNode = this._nodes[group.id];

		let returnRef = null;

		if (groupNode) {
			const resultNode = groupNode.findParent((candidateGroup, candidateNode) => !candidateNode.getIsRoot() && predicate(candidateGroup));

			if (resultNode) {
				returnRef = resultNode.getValue();
			}
		}

		return returnRef;
	}

	function extractSymbolForBarchart(position) {
		if (position.instrument && position.instrument.symbol && position.instrument.symbol.barchart) {
			return position.instrument.symbol.barchart;
		} else {
			return null;
		}
	}

	function extractSymbolForDisplay(position) {
		if (position.instrument && position.instrument.symbol && position.instrument.symbol.display) {
			return position.instrument.symbol.display;
		} else {
			return null;
		}
	}

	function extractCurrency(position) {
		if (position.instrument && position.instrument.currency) {
			return position.instrument.currency;
		} else {
			return null;
		}
	}

	function addGroupBinding(group, dispoable) {
		const id = group.id;

		if (!this._groupBindings.hasOwnProperty(id)) {
			this._groupBindings[id] = new DisposableStack();
		}

		this._groupBindings[id].push(dispoable);
	}

	function initializeGroupObservers(groupTree, treeDefinition) {
		const group = groupTree.getValue();

		addGroupBinding.call(this, group, group.registerGroupExcludedChangeHandler(() => {
			groupTree.climb((parentGroup, parentTree) => {
				if (parentGroup) {
					let excludedItems = [];

					parentTree.walk((childGroup) => {
						if (childGroup.excluded) {
							excludedItems = excludedItems.concat(childGroup.items);
						}
					}, false, false);

					parentGroup.setExcludedItems(array.unique(excludedItems));
				}
			}, false);

			if (treeDefinition.exclusionDependencies.length > 0) {
				const dependantTrees = treeDefinition.exclusionDependencies.reduce((trees, name) => {
					if (this._trees.hasOwnProperty(name)) {
						trees.push(this._trees[name]);
					}

					return trees;
				}, [ ]);

				if (dependantTrees.length > 0) {
					let excludedItems = [ ];

					groupTree.getRoot().walk((childGroup) => {
						if (childGroup.excluded) {
							excludedItems = excludedItems.concat(childGroup.items);
						}
					}, false, false);

					dependantTrees.forEach((dependantTrees) => {
						dependantTrees.walk((childGroup) => {
							childGroup.setExcludedItems(excludedItems);
						}, false, false);
					});
				}
			}
		}));
	}

	function createGroups(parentTree, items, treeDefinition, levelDefinitions, overrideRequiredGroups) {
		if (levelDefinitions.length === 0) {
			return;
		}

		const rates = this._forexQuotes;

		const levelDefinition = levelDefinitions[0];

		const populatedObjects = array.groupBy(items, levelDefinition.keySelector);
		const populatedGroups = Object.keys(populatedObjects).reduce((list, key) => {
			const items = populatedObjects[key];
			const first = items[0];

			list.push(new PositionGroup(levelDefinition, items, rates, levelDefinition.currencySelector(first), key, levelDefinition.descriptionSelector(first), levelDefinition.aggregateCash));

			return list;
		}, [ ]);

		const requiredGroupsToUse = overrideRequiredGroups || levelDefinition.requiredGroups;

		const missingGroups = array.difference(requiredGroupsToUse.map(group => group.key), populatedGroups.map(group => group.key))
			.map((key) => {
				return requiredGroupsToUse.find(g => g.key === key);
			});

		const empty = missingGroups.map((group) => {
			return new PositionGroup(levelDefinition, [ ], rates, group.currency, group.key, group.description);
		});

		const compositeGroups = populatedGroups.concat(empty);

		let builder;

		if (requiredGroupsToUse.length !== 0) {
			const ordering = requiredGroupsToUse.reduce((map, group, index) => {
				map[group.description] = index;

				return map;
			}, { });

			const getIndex = (description) => {
				if (ordering.hasOwnProperty(description)) {
					return ordering[description];
				} else {
					return Number.MAX_VALUE;
				}
			};

			builder = ComparatorBuilder.startWith((a, b) => {
				return comparators.compareNumbers(getIndex(a.description), getIndex(b.description));
			}).thenBy((a, b) => {
				return comparators.compareStrings(a.description, b.description);
			});
		} else {
			builder = ComparatorBuilder.startWith((a, b) => {
				return comparators.compareStrings(a.description, b.description);
			});
		}

		compositeGroups.sort(builder.toComparator());

		compositeGroups.forEach((group) => {
			const childTree = parentTree.addChild(group);

			this._nodes[group.id] = childTree;

			group.setParentGroup(this.getParentGroup(group));
			group.setPortfolioGroup(this.getParentGroupForPortfolio(group));

			initializeGroupObservers.call(this, childTree, treeDefinition);

			createGroups.call(this, childTree, group.items, treeDefinition, array.dropLeft(levelDefinitions));
		});
	}


	function updateEmptyPortfolioGroups(portfolio) {
		Object.keys(this._trees).forEach((key) => {
			this._trees[key].walk((group) => {
				if (group.definition.type === PositionLevelType.PORTFOLIO && group.key === PositionLevelDefinition.getKeyForPortfolioGroup(portfolio) && group.getIsEmpty()) {
					group.updatePortfolio(portfolio);
				}
			}, true, false);
		});
	}

	function getPositionItemsForPortfolio(items, portfolio) {
		return items.reduce((positionItems, item) => {
			if (item.position.portfolio === portfolio) {
				positionItems.push(item);
			}

			return positionItems;
		}, [ ]);
	}

	function getSummaryArray(ranges) {
		return ranges.map(range => null);
	}

	function addSummaryCurrent(map, summary, currentSummaryFrame, currentSummaryRange) {
		if (summary.frame === currentSummaryFrame && currentSummaryRange.start.getIsEqual(summary.start.date) && currentSummaryRange.end.getIsEqual(summary.end.date)) {
			const key = summary.position;

			map[key] = summary;
		}
	}

	function addSummaryPrevious(map, summary, previousSummaryFrame, previousSummaryRanges) {
		if (summary.frame === previousSummaryFrame) {
			const key = summary.position;

			if (!map.hasOwnProperty(key)) {
				map[key] = getSummaryArray(previousSummaryRanges);
			}

			const index = previousSummaryRanges.findIndex(r => r.start.getIsEqual(summary.start.date) && r.end.getIsEqual(summary.end.date));

			if (!(index < 0)) {
				map[key][index] = summary;
			}
		}
	}

	function addBarchartSymbol(map, item) {
		const barchartSymbol = extractSymbolForBarchart(item.position);

		if (barchartSymbol) {
			if (!map.hasOwnProperty(barchartSymbol)) {
				map[barchartSymbol] = [ ];
			}

			map[barchartSymbol].push(item);
		}
	}

	function addDisplaySymbol(map, item) {
		const displaySymbol = extractSymbolForDisplay(item.position);

		if (displaySymbol) {
			if (!map.hasOwnProperty(displaySymbol)) {
				map[displaySymbol] = [ ];
			}

			map[displaySymbol].push(item);
		}
	}

	function createPositionItem(position) {
		const portfolio = this._portfolios[position.portfolio];

		let returnRef;

		if (portfolio) {
			const currentSummary = this._summariesCurrent[ position.position ] || null;
			const previousSummaries = this._summariesPrevious[ position.position ] || getSummaryArray(this._previousSummaryRanges);

			returnRef = new PositionItem(portfolio, position, currentSummary, previousSummaries);
		} else {
			returnRef = null;
		}

		return returnRef;
	}

	function removePositionItem(positionItem) {
		if (!positionItem) {
			return;
		}

		delete this._summariesCurrent[positionItem.position.position];
		delete this._summariesPrevious[positionItem.position.position];

		array.remove(this._items, i => i === positionItem);

		const barchartSymbol = extractSymbolForBarchart(positionItem.position);

		if (this._symbols.hasOwnProperty(barchartSymbol)) {
			array.remove(this._symbols[barchartSymbol], i => i === positionItem);
		}

		const displaySymbol = extractSymbolForDisplay(positionItem.position);

		if (this._symbolsDisplay.hasOwnProperty(displaySymbol)) {
			array.remove(this._symbolsDisplay[displaySymbol], i => i === positionItem);
		}

		const currency = extractCurrency(positionItem.position);

		if (currency && this._currencies.hasOwnProperty(currency.code)) {
			array.remove(this._currencies[currency.code], i => i === positionItem);
		}

		Object.keys(this._trees).forEach((key) => {
			this._trees[key].walk((group, groupNode) => {
				if (group.definition.type === PositionLevelType.POSITION && group.key === positionItem.position.position) {
					severGroupNode.call(this, groupNode);
				}
			}, true, false);
		});

		positionItem.dispose();
	}

	function severGroupNode(groupNodeToSever) {
		groupNodeToSever.sever();
		groupNodeToSever.walk(group => delete this._nodes[group.id], false, true);
	}

	function recalculatePercentages() {
		Object.keys(this._trees).forEach((key) => {
			this._trees[key].walk(group => group.refreshMarketPercent(), false, false);
		});
	}

	return PositionContainer;
})();

},{"./../data/PositionSummaryFrame":3,"./PositionGroup":7,"./PositionItem":8,"./definitions/PositionLevelDefinition":9,"./definitions/PositionLevelType":10,"./definitions/PositionTreeDefinition":11,"@barchart/common-js/collections/Tree":13,"@barchart/common-js/collections/sorting/ComparatorBuilder":14,"@barchart/common-js/collections/sorting/comparators":15,"@barchart/common-js/collections/specialized/DisposableStack":16,"@barchart/common-js/lang/Currency":17,"@barchart/common-js/lang/Decimal":19,"@barchart/common-js/lang/Rate":22,"@barchart/common-js/lang/array":23,"@barchart/common-js/lang/assert":24,"@barchart/common-js/lang/is":26,"@barchart/common-js/messaging/Event":28}],7:[function(require,module,exports){
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
	 * @param {LevelDefinition} definition
	 * @param {Array.<PositionItem>} items
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
			this._dataFormat.newsExists = false;
			this._dataFormat.quantity = null;
			this._dataFormat.basisPrice = null;

			this._dataActual.key = this._key;
			this._dataActual.description = this._description;
			this._dataActual.newsExists = false;
			this._dataActual.quantity = null;
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
			this._dataActual.realized = null;
			this._dataActual.income = null;
			this._dataActual.market = null;
			this._dataActual.marketPercent = null;
			this._dataActual.marketPercentPortfolio = null;
			this._dataActual.unrealized = null;
			this._dataActual.unrealizedToday = null;
			this._dataActual.total = null;
			this._dataActual.summaryTotalCurrent = null;
			this._dataActual.summaryTotalPrevious = null;
			this._dataActual.summaryTotalPrevious2 = null;
			this._dataActual.cashTotal = null;

			this._dataFormat.currentPrice = null;
			this._dataFormat.basis = null;
			this._dataFormat.realized = null;
			this._dataFormat.income = null;
			this._dataFormat.market = null;
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
			this._dataFormat.cashTotal = null;
			this._dataFormat.portfolioType = null;

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
		 * The {@link LevelDefinition} which was used to generate this group.
		 *
		 * @public
		 * @returns {LevelDefinition}
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
		 * @param {Array.<Object>} items
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
		 * @param {Array.<Rate>} rate
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

			const descriptionSelector = this._definition.descriptionSelector;

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

		if (this._single) {
			newsBinding = item.registerNewsExistsChangeHandler((exists) => {
				this._dataActual.newsExists = exists;
				this._dataFormat.newsExists = exists;
			});
		}

		this._disposeStack.push(item.registerPortfolioChangeHandler((portfolio) => {
			const descriptionSelector = this._definition.descriptionSelector;

			this._description = descriptionSelector(this._items[0]);

			this._dataActual.description = this._description;
			this._dataFormat.description = this._description;
		}));

		this._disposeStack.push(quoteBinding);
		this._disposeStack.push(newsBinding);
		this._disposeStack.push(fundamentalBinding);

		this._disposeStack.push(item.registerPositionItemDisposeHandler(() => {
			quoteBinding.dispose();
			newsBinding.dispose();
			fundamentalBinding.dispose();

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
			updates.summaryTotalPrevious2 = updates.summaryTotalPrevious2.add(translate(item, item.data.summaryTotalPrevious2));

			if (item.position.instrument.type === InstrumentType.CASH) {
				updates.cashTotal = updates.cashTotal.add(translate(item, item.data.market));
			}

			return updates;
		}, {
			basis: Decimal.ZERO,
			realized: Decimal.ZERO,
			unrealized: Decimal.ZERO,
			income: Decimal.ZERO,
			summaryTotalCurrent: Decimal.ZERO,
			summaryTotalPrevious: Decimal.ZERO,
			summaryTotalPrevious2: Decimal.ZERO,
			cashTotal: Decimal.ZERO
		});

		actual.basis = updates.basis;
		actual.realized = updates.realized;
		actual.unrealized = updates.unrealized;
		actual.income = updates.income;
		actual.summaryTotalCurrent = updates.summaryTotalCurrent;
		actual.summaryTotalPrevious = updates.summaryTotalPrevious;
		actual.summaryTotalPrevious2 = updates.summaryTotalPrevious2;
		actual.cashTotal = updates.cashTotal;

		format.basis = formatCurrency(actual.basis, currency);
		format.realized = formatCurrency(actual.realized, currency);
		format.unrealized = formatCurrency(actual.unrealized, currency);
		format.income = formatCurrency(actual.income, currency);
		format.summaryTotalCurrent = formatCurrency(updates.summaryTotalCurrent, currency);
		format.summaryTotalPrevious = formatCurrency(updates.summaryTotalPrevious, currency);
		format.summaryTotalPreviousNegative = updates.summaryTotalPrevious.getIsNegative();
		format.summaryTotalPrevious2 = formatCurrency(updates.summaryTotalPrevious2, currency);
		format.summaryTotalPrevious2Negative = updates.summaryTotalPrevious2.getIsNegative();
		format.cashTotal = formatCurrency(updates.cashTotal, currency);

		calculateUnrealizedPercent(group);

		if (group.single && group._items.length === 1) {
			const item = group._items[0];

			actual.quantity = item.position.snapshot.open;
			actual.basisPrice = item.data.basisPrice;

			format.quantity = formatDecimal(actual.quantity, 2);
			format.basisPrice = formatCurrency(actual.basisPrice, currency);

			format.invalid = definition.type === PositionLevelType.POSITION && item.invalid;
		}

		const groupItems = group._items;

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

			if (item.currency !== currency) {
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
				updates.marketAbsolute = updates.marketAbsolute.add(translate(item, item.data.marketAbsolute));
				updates.unrealized = updates.unrealized.add(translate(item, item.data.unrealized));
				updates.unrealizedToday = updates.unrealizedToday.add(translate(item, item.data.unrealizedToday));
				updates.summaryTotalCurrent = updates.summaryTotalCurrent.add(translate(item, item.data.summaryTotalCurrent));

				return updates;
			}, {
				market: Decimal.ZERO,
				marketAbsolute: Decimal.ZERO,
				marketDirection: unchanged,
				unrealized: Decimal.ZERO,
				unrealizedToday: Decimal.ZERO,
				summaryTotalCurrent: Decimal.ZERO
			});
		} else {
			updates = {
				market: actual.market.add(translate(item, item.data.marketChange)),
				marketAbsolute: actual.marketAbsolute.add(translate(item, item.data.marketAbsoluteChange)),
				marketDirection: { up: item.data.marketChange.getIsPositive(), down: item.data.marketChange.getIsNegative() },
				unrealized: actual.unrealized.add(translate(item, item.data.unrealizedChange)),
				unrealizedToday: actual.unrealizedToday.add(translate(item, item.data.unrealizedTodayChange)),
				summaryTotalCurrent: actual.summaryTotalCurrent.add(translate(item, item.data.summaryTotalCurrentChange))
			};
		}

		actual.market = updates.market;
		actual.marketAbsolute = updates.marketAbsolute;
		actual.unrealized = updates.unrealized;
		actual.unrealizedToday = updates.unrealizedToday;
		actual.summaryTotalCurrent = updates.summaryTotalCurrent;
		actual.total = updates.unrealized.add(actual.realized).add(actual.income);
		
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

		calculateUnrealizedPercent(group);
	}

	function calculateMarketPercent(group, rates, parentGroup, portfolioGroup) {
		const actual = group._dataActual;
		const format = group._dataFormat;
		const excluded = group._excluded;

		const calculatePercent = (parent) => {
			let marketPercent;

			if (parent && !excluded) {
				const parentData = parent._dataActual;

				if (parentData.marketAbsolute !== null && !parentData.marketAbsolute.getIsZero()) {
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

},{"./../data/InstrumentType":1,"./definitions/PositionLevelDefinition":9,"./definitions/PositionLevelType":10,"@barchart/common-js/collections/specialized/DisposableStack":16,"@barchart/common-js/lang/Currency":17,"@barchart/common-js/lang/Decimal":19,"@barchart/common-js/lang/Disposable":20,"@barchart/common-js/lang/Rate":22,"@barchart/common-js/lang/array":23,"@barchart/common-js/lang/assert":24,"@barchart/common-js/lang/formatter":25,"@barchart/common-js/lang/is":26,"@barchart/common-js/messaging/Event":28}],8:[function(require,module,exports){
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
		 * Indicates if the position's symbol is invalid.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get invalid() {
			return this._invalid;
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
				if (quote.previousPrice) {
					this._data.previousPrice = quote.previousPrice;
				}

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

		if (summary && position.instrument.type !== InstrumentType.CASH) {
			let priceToUse;

			if (price) {
				priceToUse = price;
			} else if (data.previousPrice) {
				priceToUse = new Decimal(data.previousPrice);
			} else if (!summary.end.open.getIsZero()) {
				priceToUse = summary.end.value.divide(summary.end.open);
			} else {
				priceToUse = null;
			}

			if (priceToUse !== null) {
				const period = summary.period;

				let unrealized = summary.end.open.multiply(priceToUse).add(summary.end.basis);
				let unrealizedChange;

				if (data.unrealized !== null) {
					unrealizedChange = unrealized.subtract(data.unrealized);
				} else {
					unrealizedChange = Decimal.ZERO;
				}

				let summaryTotalCurrent = period.realized.add(period.income).add(unrealized);
				let summaryTotalCurrentChange;

				if (data.summaryTotalCurrent !== null) {
					summaryTotalCurrentChange = summaryTotalCurrent.subtract(data.summaryTotalCurrent);
				} else {
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

},{"./../data/InstrumentType":1,"@barchart/common-js/lang/Currency":17,"@barchart/common-js/lang/Decimal":19,"@barchart/common-js/lang/Disposable":20,"@barchart/common-js/lang/assert":24,"@barchart/common-js/lang/is":26,"@barchart/common-js/messaging/Event":28}],9:[function(require,module,exports){
const assert = require('@barchart/common-js/lang/assert'),
	Currency = require('@barchart/common-js/lang/Currency'),
	is = require('@barchart/common-js/lang/is');

const InstrumentType = require('./../../data/InstrumentType');

const PositionLevelType = require('./PositionLevelType');

module.exports = (() => {
	'use strict';

	/**
	 * Defines a grouping level within a tree of positions. A level could represent a
	 * group of multiple positions (e.g. all equities or all positions for a portfolio).
	 * Alternately, a level could also represent a single position.
	 *
	 * @public
	 * @param {String} name
	 * @param {PositionLevelDefinition~keySelector} keySelector
	 * @param {PositionLevelDefinition~descriptionSelector} descriptionSelector
	 * @param {PositionLevelDefinition~currencySelector} currencySelector
	 * @param {Array.<PositionLevelDefinition~RequiredGroup>=} requiredGroups
	 * @param {Boolean=} aggregateCash
	 * @param {Function=} requiredGroupGenerator
	 */
	class PositionLevelDefinition {
		constructor(name, type, keySelector, descriptionSelector, currencySelector, requiredGroups, aggregateCash, requiredGroupGenerator) {
			assert.argumentIsRequired(name, 'name', String);
			assert.argumentIsRequired(type, 'type', PositionLevelType, 'PositionLevelType');
			assert.argumentIsRequired(keySelector, 'keySelector', Function);
			assert.argumentIsRequired(descriptionSelector, 'descriptionSelector', Function);
			assert.argumentIsRequired(currencySelector, 'currencySelector', Function);

			if (requiredGroups) {
				assert.argumentIsArray(requiredGroups, 'requiredGroups', String);
			}

			assert.argumentIsOptional(aggregateCash, 'aggregateCash', Boolean);
			assert.argumentIsOptional(requiredGroupGenerator, 'requiredGroupGenerator', Function);

			this._name = name;
			this._type = type;

			this._keySelector = keySelector;
			this._descriptionSelector = descriptionSelector;
			this._currencySelector = currencySelector;

			this._requiredGroups = requiredGroups || [ ];

			this._single = type === PositionLevelType.POSITION;
			this._aggregateCash = is.boolean(aggregateCash) && aggregateCash;

			this._requiredGroupGenerator = requiredGroupGenerator || (input => null);
		}

		/**
		 * The name of the grouping level.
		 *
		 * @public
		 * @returns {String}
		 */
		get name() {
			return this._name;
		}

		/**
		 * A general description of the type of items grouped together.
		 *
		 * @public
		 * @returns {PositionLevelType}
		 */
		get type() {
			return this._type;
		}

		/**
		 * A function, when given a {@link PositionItem} returns a string that is used
		 * to group {@link PositionItem} instances into different groups.
		 *
		 * @public
		 * @returns {PositionLevelDefinition~keySelector}
		 */
		get keySelector() {
			return this._keySelector;
		}

		/**
		 * A function, when given a {@link PositionItem} returns a string used to describe the
		 * group.
		 *
		 * @public
		 * @returns {PositionLevelDefinition~descriptionSelector}
		 */
		get descriptionSelector() {
			return this._descriptionSelector;
		}

		/**
		 * A function, when given a {@link PositionItem} returns the {@link Currency} used to
		 * display values for the group.
		 *
		 * @public
		 * @returns {PositionLevelDefinition~currencySelector}
		 */
		get currencySelector() {
			return this._currencySelector;
		}

		/**
		 * Indicates the required groups (i.e. descriptions). The allows for the creation of empty
		 * groups.
		 *
		 * @public
		 * @returns {Array<String>}
		 */
		get requiredGroups() {
			return this._requiredGroups;
		}

		/**
		 * Indicates if the grouping level is meant to only contain a single item.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get single() {
			return this._single;
		}

		/**
		 * Indicates if the grouping level should aggregate cash positions.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get aggregateCash() {
			return this._aggregateCash;
		}

		/**
		 * Given an input, potentially creates a new {@link PositionLevelDefinition~RequiredGroup}.
		 *
		 * @public
		 * @param {*} input
		 * @returns {PositionLevelDefinition~RequiredGroup|null}
		 */
		generateRequiredGroup(input) {
			const requiredGroup = this._requiredGroupGenerator(input);

			if (requiredGroup !== null) {
				this._requiredGroups.push(requiredGroup);
			}

			return requiredGroup;
		}

		/**
		 * Builds a {@link PositionLevelDefinition~RequiredGroup} for a portfolio.
		 *
		 * @public
		 * @static
		 * @param {Object} portfolio
		 * @returns {PositionLevelDefinition~RequiredGroup}
		 */
		static buildRequiredGroupForPortfolio(portfolio) {
			return {
				key: PositionLevelDefinition.getKeyForPortfolioGroup(portfolio),
				description: PositionLevelDefinition.getDescriptionForPortfolioGroup(portfolio),
				currency: Currency.CAD
			};
		}

		static getKeyForPortfolioGroup(portfolio) {
			assert.argumentIsRequired(portfolio, 'portfolio', Object);

			return portfolio.portfolio;
		}

		static getDescriptionForPortfolioGroup(portfolio) {
			assert.argumentIsRequired(portfolio, 'portfolio', Object);

			return portfolio.name;
		}

		static getRequiredGroupGeneratorForPortfolio() {
			return (portfolio) => {
				let requiredGroup;

				if (is.object(portfolio) && is.string(portfolio.portfolio) && is.string(portfolio.name)) {
					requiredGroup = PositionLevelDefinition.buildRequiredGroupForPortfolio(portfolio);
				} else {
					requiredGroup = null;
				}

				return requiredGroup;
			};
		}

		/**
		 * Builds a {@link PositionLevelDefinition~RequiredGroup} for an asset class.
		 *
		 * @public
		 * @static
		 * @param {InstrumentType} type
		 * @param {Currency} currency
		 * @returns {PositionLevelDefinition~RequiredGroup}
		 */
		static buildRequiredGroupForAssetClass(type, currency) {
			return {
				key: PositionLevelDefinition.getKeyForAssetClassGroup(type, currency),
				description: PositionLevelDefinition.getDescriptionForAssetClassGroup(type, currency),
				currency: currency
			};
		}

		static getKeyForAssetClassGroup(type, currency) {
			assert.argumentIsRequired(type, 'type', InstrumentType, 'InstrumentType');
			assert.argumentIsRequired(currency, 'currency', Currency, 'Currency');

			return `${type.code}|${currency.code}`;
		}

		static getDescriptionForAssetClassGroup(type, currency) {
			assert.argumentIsRequired(type, 'type', InstrumentType, 'InstrumentType');
			assert.argumentIsRequired(currency, 'currency', Currency, 'Currency');

			return `${type.alternateDescription}${currency.code === 'CAD' ? '' : ` (${currency.alternateDescription})`}`;
		}

		toString() {
			return '[PositionLevelDefinition]';
		}
	}

	/**
	 * A callback used to determine the eligibility for membership of a {@link PositionItem}
	 * within a group.
	 *
	 * @public
	 * @callback PositionLevelDefinition~keySelector
	 * @param {PositionItem} item
	 * @returns {String}
	 */

	/**
	 * A callback used to determine the human-readable name of a group. This function should
	 * return the same value for any {@link PositionItem} in the group.
	 *
	 * @public
	 * @callback PositionLevelDefinition~descriptionSelector
	 * @param {PositionItem} item
	 * @returns {String}
	 */

	/**
	 * A callback used to determine the display {@link Currency} for the group. This function should
	 * return the same value for any {@link PositionItem} in the group.
	 *
	 * @public
	 * @callback PositionLevelDefinition~currencySelector
	 * @param {PositionItem} item
	 * @returns {Currency}
	 */

	/**
	 * The data required to construct a group.
	 *
	 * @public
	 * @typedef PositionLevelDefinition~RequiredGroup
	 * @type {Object}
	 * @property {String} key
	 * @property {String} description
	 * @property {Currency} currency
	 */

	return PositionLevelDefinition;
})();

},{"./../../data/InstrumentType":1,"./PositionLevelType":10,"@barchart/common-js/lang/Currency":17,"@barchart/common-js/lang/assert":24,"@barchart/common-js/lang/is":26}],10:[function(require,module,exports){
const Enum = require('@barchart/common-js/lang/Enum');

module.exports = (() => {
	'use strict';

	class PositionLevelType extends Enum {
		constructor(code) {
			super(code, code);
		}

		static get PORTFOLIO() {
			return portfolio;
		}

		static get POSITION() {
			return position;
		}

		static get OTHER() {
			return other;
		}
	}

	const portfolio = new PositionLevelType('PORTFOLIO');
	const position = new PositionLevelType('POSITION');
	const other = new PositionLevelType('OTHER');

	return PositionLevelType;
})();

},{"@barchart/common-js/lang/Enum":21}],11:[function(require,module,exports){
const assert = require('@barchart/common-js/lang/assert');

const PositionLevelDefinition = require('./PositionLevelDefinition');

module.exports = (() => {
	'use strict';

	/**
	 * Defines the structure for a tree of positions.
	 *
	 * @public
	 * @param {String} name
	 * @param {Array.<PositionLevelDefinition>} definitions
	 */
	class PositionTreeDefinitions {
		constructor(name, definitions, exclusionDependencies) {
			assert.argumentIsRequired(name, 'name', String);
			assert.argumentIsArray(definitions, 'definitions', PositionLevelDefinition, 'PositionLevelDefinition');

			if (exclusionDependencies) {
				assert.argumentIsArray(exclusionDependencies, 'exclusionDependencies', String);
			}

			this._name = name;
			this._definitions = definitions;
			this._exclusionDependencies = exclusionDependencies || [ ];
		}

		/**
		 * The name of the tree.
		 *
		 * @public
		 * @returns {String}
		 */
		get name() {
			return this._name;
		}

		/**
		 * An ordered list of {@link PositionLevelDefinitions} that describes the
		 * levels of the tree. The first item represents the top-most level of the
		 * tree (i.e. the children of the root node) and the last item represents the
		 * bottom-most level of the tree (i.e. leaf nodes).
		 *
		 * @public
		 * @returns {Array.<PositionLevelDefinitions>}
		 */
		get definitions() {
			return this._definitions;
		}

		/**
		 * Returns the names of other trees which should be impacted when a
		 * group (from the current tree) is excluded.
		 *
		 * @public
		 * @returns {Array.<String>}
		 */
		get exclusionDependencies() {
			return this._exclusionDependencies;
		}

		toString() {
			return '[PositionTreeDefinitions]';
		}
	}

	return PositionTreeDefinitions;
})();

},{"./PositionLevelDefinition":9,"@barchart/common-js/lang/assert":24}],12:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assert = require('./../lang/assert');

module.exports = function () {
	'use strict';

	/**
  * A stack collection (supports LIFO operations).
  *
  * @public
  */

	var Stack = function () {
		function Stack() {
			_classCallCheck(this, Stack);

			this._array = [];
		}

		/**
   * Adds an item to the stack.
   *
   * @public
   * @param {object} item
   * @returns {object} - The item added to the stack.
   */


		_createClass(Stack, [{
			key: 'push',
			value: function push(item) {
				this._array.unshift(item);

				return item;
			}

			/**
    * Removes and returns an item from the stack. Throws if the stack is empty.
    *
    * @public
    * @returns {object} - The removed from the stack.
    */

		}, {
			key: 'pop',
			value: function pop() {
				if (this.empty()) {
					throw new Error('Stack is empty');
				}

				return this._array.shift();
			}

			/**
    * Returns the next item in the stack (without removing it). Throws if the stack is empty.
    *
    * @public
    * @returns {object} - The item added to the queue.
    */

		}, {
			key: 'peek',
			value: function peek() {
				if (this.empty()) {
					throw new Error('Stack is empty');
				}

				return this._array[0];
			}

			/**
    * Returns true if the queue is empty; otherwise false.
    *
    * @public
    * @returns {boolean}
    */

		}, {
			key: 'empty',
			value: function empty() {
				return this._array.length === 0;
			}

			/**
    * Runs an action on each item in the stack.
    *
    * @public
    * @param {Function} action - The action to run.
    */

		}, {
			key: 'scan',
			value: function scan(action) {
				assert.argumentIsRequired(action, 'action', Function);

				this._array.forEach(function (x) {
					return action(x);
				});
			}

			/**
    * Outputs an array of the stacks's items; without affecting the
    * queue's internal state;
    *
    * @public
    * @returns {Array}
    */

		}, {
			key: 'toArray',
			value: function toArray() {
				return this._array.slice(0);
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[Stack]';
			}
		}]);

		return Stack;
	}();

	return Stack;
}();

},{"./../lang/assert":24}],13:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var is = require('./../lang/is');

module.exports = function () {
	'use strict';

	/**
  * A tree data structure. Each instance represents a node, holding
  * an item, a reference to the parent node, and a reference to
  * children nodes. Children are stored in insertion order.
  *
  * @public
  * @param {*} value - The value of the node.
  * @param {Tree} parent - The parent node. If not supplied, this will be the root node.
  */

	var Tree = function () {
		function Tree(value, parent) {
			_classCallCheck(this, Tree);

			this._value = value;

			this._parent = parent || null;
			this._children = [];
		}

		/**
   * Gets the root node.
   *
   * @public
   * @returns {Tree}
   */


		_createClass(Tree, [{
			key: 'getRoot',
			value: function getRoot() {
				if (this.getIsRoot()) {
					return this;
				} else {
					return this._parent.getRoot();
				}
			}

			/**
    * Returns the parent node. If this is the root node, a null value is returned.
    *
    * @public
    * @returns {Tree|null}
    */

		}, {
			key: 'getParent',
			value: function getParent() {
				return this._parent;
			}

			/**
    * Returns the collection of children nodes.
    *
    * @public
    * @returns {Array<Tree>}
    */

		}, {
			key: 'getChildren',
			value: function getChildren() {
				return this._children;
			}

			/**
    * Returns the value associated with the current node.
    *
    * @public
    * @returns {*}
    */

		}, {
			key: 'getValue',
			value: function getValue() {
				return this._value;
			}

			/**
    * Returns true if this node has no children; otherwise false.
    *
    * @public
    * @returns {boolean}
    */

		}, {
			key: 'getIsLeaf',
			value: function getIsLeaf() {
				return this._children.length === 0;
			}

			/**
    * Returns true if this node has no parent; otherwise false.
    *
    * @public
    * @returns {boolean}
    */

		}, {
			key: 'getIsRoot',
			value: function getIsRoot() {
				return this._parent === null;
			}

			/**
    * Adds a child node to the current node and returns a reference
    * to the child node.
    *
    * @public
    * @param {*} value - The value of the child.
    * @returns {Tree}
    */

		}, {
			key: 'addChild',
			value: function addChild(value) {
				var returnRef = new Tree(value, this);

				this._children.push(returnRef);

				return returnRef;
			}

			/**
    * Removes a child node.
    *
    * @public
    * @param {Tree} node - The child to remove.
    */

		}, {
			key: 'removeChild',
			value: function removeChild(node) {
				for (var i = this._children.length - 1; !(i < 0); i--) {
					var child = this._children[i];

					if (child === node) {
						this._children.splice(i, 1);

						child._parent = null;
						child._children = [];

						break;
					}
				}
			}

			/**
    * Removes the current node from the parent tree. Use on a root node
    * has no effect.
    *
    * @public
    */

		}, {
			key: 'sever',
			value: function sever() {
				if (this.getIsRoot()) {
					return;
				}

				this.getParent().removeChild(this);
			}

			/**
    * Searches the children nodes for the first child node that matches the
    * predicate.
    *
    * @public
    * @param {Tree~nodePredicate} predicate - A predicate that tests each child node. The predicate takes two arguments -- the node's value, and the node itself.
    * @returns {Tree|null}
    */

		}, {
			key: 'findChild',
			value: function findChild(predicate) {
				var returnRef = null;

				for (var i = 0; i < this._children.length; i++) {
					var child = this._children[i];

					if (predicate(child.getValue(), child)) {
						returnRef = child;

						break;
					}
				}

				return returnRef;
			}

			/**
    * Searches the tree recursively, starting with the current node.
    *
    * @public
    * @param {Tree~nodePredicate} predicate - A predicate that tests each child node. The predicate takes two arguments -- the node's value, and the node itself.
    * @param {boolean=} childrenFirst - True, if the tree should be searched depth first.
    * @param {boolean=} includeCurrentNode - True, if the current node should be checked against the predicate.
    * @returns {Tree|null}
    */

		}, {
			key: 'search',
			value: function search(predicate, childrenFirst, includeCurrentNode) {
				var returnRef = null;

				if (returnRef === null && childrenFirst && includeCurrentNode && predicate(this.getValue(), this)) {
					returnRef = this;
				}

				for (var i = 0; i < this._children.length; i++) {
					var child = this._children[i];

					returnRef = child.search(predicate, childrenFirst, true);

					if (returnRef !== null) {
						break;
					}
				}

				if (returnRef === null && !childrenFirst && includeCurrentNode && predicate(this.getValue(), this)) {
					returnRef = this;
				}

				return returnRef;
			}

			/**
    * Walks the children of the current node, running an action on each node.
    *
    * @public
    * @param {Tree~nodeAction} walkAction - A action to apply to each node. The action takes two arguments -- the node's value, and the node itself.
    * @param {boolean=} childrenFirst - True if the tree should be walked depth first.
    * @param {boolean=} includeCurrentNode - True if the current node should be applied to the action.
    */

		}, {
			key: 'walk',
			value: function walk(walkAction, childrenFirst, includeCurrentNode) {
				var predicate = function predicate(value, node) {
					walkAction(value, node);

					return false;
				};

				this.search(predicate, childrenFirst, includeCurrentNode);
			}

			/**
    * Climbs the parents of the current node -- current node up to the root node, running an action on each node.
    *
    * @public
    * @param {Tree~nodeAction} climbAction - A action to apply to each node. The action takes two arguments -- the node's value, and the node itself.
    * @param {boolean=} includeCurrentNode - True if the current node should be applied to the action.
    */

		}, {
			key: 'climb',
			value: function climb(climbAction, includeCurrentNode) {
				if (includeCurrentNode) {
					climbAction(this.getValue(), this);
				}

				if (this._parent !== null) {
					this._parent.climb(climbAction, true);
				}
			}

			/**
    * Climbs the tree, evaluating each parent until a predicate is matched. Once matched,
    * the {@link Tree} node is returned. Otherwise, if the predicate cannot be matched,
    * a null value is returned.
    *
    * @public
    * @param {Tree~nodePredicate} predicate - A predicate that tests each child node. The predicate takes two arguments -- the node's value, and the node itself.
    * @param {boolean=} includeCurrentNode - If true, the predicate will be applied to the current node.
    * @returns {Tree|null}
    */

		}, {
			key: 'findParent',
			value: function findParent(predicate, includeCurrentNode) {
				var returnRef = void 0;

				if (is.boolean(includeCurrentNode) && includeCurrentNode && predicate(this.getValue(), this)) {
					returnRef = this;
				} else if (this._parent !== null) {
					returnRef = this._parent.findParent(predicate, true);
				} else {
					returnRef = null;
				}

				return returnRef;
			}

			/**
    * Creates a representation of the tree using JavaScript objects and arrays.
    *
    * @public
    * @param {Function=} valueConverter - An optional function for converting the value of each node.
    * @param {Boolean=} valueConverter - If true, empty children arrays will be excluded from output.
    * @returns {Object}
    */

		}, {
			key: 'toJSObj',
			value: function toJSObj(valueConverter, omitEmptyChildren) {
				var valueConverterToUse = void 0;

				if (is.fn(valueConverter)) {
					valueConverterToUse = valueConverter;
				} else {
					valueConverterToUse = function valueConverterToUse(x) {
						return x;
					};
				}

				var converted = {
					value: valueConverterToUse(this._value)
				};

				if (!(is.boolean(omitEmptyChildren) && omitEmptyChildren && this._children.length === 0)) {
					converted.children = this._children.map(function (child) {
						return child.toJSObj(valueConverter, omitEmptyChildren);
					});
				}

				return converted;
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[Tree]';
			}
		}]);

		return Tree;
	}();

	/**
  * A predicate that is used to check a node (i.e. {@link Tree}).
  *
  * @callback Tree~nodePredicate
  * @param {*} item - The candidate node's item
  * @param {Tree} node - The candidate node.
  * @returns {Boolean}
  */

	/**
  * An action that is run on a node (i.e. {@link Tree}).
  *
  * @callback Tree~nodeAction
  * @param {*} item - The candidate node's item
  * @param {Tree} node - The candidate node.
  */

	return Tree;
}();

},{"./../lang/is":26}],14:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assert = require('./../../lang/assert'),
    comparators = require('./comparators');

module.exports = function () {
	'use strict';

	/**
  * A builder for compound comparator functions (e.g. sort by last name,
  * then by first name, then by social security number) that uses a fluent
  * interface.
  *
  * @public
  * @param {Function} comparator - The initial comparator.
  * @param {Boolean=} invert - Indicates if the comparator should sort in descending order.
  */

	var ComparatorBuilder = function () {
		function ComparatorBuilder(comparator, invert, previous) {
			_classCallCheck(this, ComparatorBuilder);

			assert.argumentIsRequired(comparator, 'comparator', Function);
			assert.argumentIsOptional(invert, 'invert', Boolean);

			this._comparator = comparator;
			this._invert = invert || false;
			this._previous = previous || null;
		}

		/**
   * Adds a new comparator to the list of comparators to use.
   *
   * @public
   * @param {Function} comparator - The next comparator function.
   * @param {Boolean=} invert - Indicates if the comparator should sort in descending order.
   * @returns {ComparatorBuilder}
   */


		_createClass(ComparatorBuilder, [{
			key: 'thenBy',
			value: function thenBy(comparator, invert) {
				assert.argumentIsRequired(comparator, 'comparator', Function);
				assert.argumentIsOptional(invert, 'invert', Boolean);

				return new ComparatorBuilder(comparator, invert, this);
			}

			/**
    * Flips the order of the comparator (e.g. ascending to descending).
    *
    * @public
    * @returns {ComparatorBuilder}
    */

		}, {
			key: 'invert',
			value: function invert() {
				var previous = void 0;

				if (this._previous) {
					previous = this._previous.invert();
				} else {
					previous = null;
				}

				return new ComparatorBuilder(this._comparator, !this._invert, previous);
			}

			/**
    * Returns the comparator function.
    *
    * @public
    * @returns {Function}
    */

		}, {
			key: 'toComparator',
			value: function toComparator() {
				var _this = this;

				var previousComparator = void 0;

				if (this._previous) {
					previousComparator = this._previous.toComparator();
				} else {
					previousComparator = comparators.empty;
				}

				return function (a, b) {
					var result = previousComparator(a, b);

					if (result === 0) {
						var sortA = void 0;
						var sortB = void 0;

						if (_this._invert) {
							sortA = b;
							sortB = a;
						} else {
							sortA = a;
							sortB = b;
						}

						result = _this._comparator(sortA, sortB);
					}

					return result;
				};
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[ComparatorBuilder]';
			}

			/**
    * Creates a {@link ComparatorBuilder}, given an initial comparator function.
    *
    * @public
    * @param {Function} comparator - The initial comparator.
    * @param {Boolean=} invert - Indicates if the comparator should sort in descending order.
    * @returns {ComparatorBuilder}
    */

		}], [{
			key: 'startWith',
			value: function startWith(comparator, invert) {
				return new ComparatorBuilder(comparator, invert);
			}
		}]);

		return ComparatorBuilder;
	}();

	return ComparatorBuilder;
}();

},{"./../../lang/assert":24,"./comparators":15}],15:[function(require,module,exports){
'use strict';

var assert = require('./../../lang/assert');

module.exports = function () {
	'use strict';

	/**
  * Functions that can be used as comparators.
  *
  * @public
  * @module collections/sorting/comparators
  */

	return {
		/**
   * Compares two dates (in ascending order).
   *
   * @static
   * @param {Date} a
   * @param {Date} b
   * @returns {Number}
   */
		compareDates: function compareDates(a, b) {
			assert.argumentIsRequired(a, 'a', Date);
			assert.argumentIsRequired(b, 'b', Date);

			return a - b;
		},

		/**
   * Compares two numbers (in ascending order).
   *
   * @static
   * @param {Number} a
   * @param {Number} b
   * @returns {Number}
   */
		compareNumbers: function compareNumbers(a, b) {
			assert.argumentIsRequired(a, 'a', Number);
			assert.argumentIsRequired(b, 'b', Number);

			return a - b;
		},

		/**
   * Compares two strings (in ascending order), using {@link String#localeCompare}.
   *
   * @static
   * @param {Number} a
   * @param {Number} b
   * @returns {Number}
   */
		compareStrings: function compareStrings(a, b) {
			assert.argumentIsRequired(a, 'a', String);
			assert.argumentIsRequired(b, 'b', String);

			return a.localeCompare(b);
		},

		/**
   * Compares two objects, always returning zero.
   *
   * @static
   * @param {*} a
   * @param {*} b
   * @returns {Number}
   */
		empty: function empty(a, b) {
			return 0;
		}
	};
}();

},{"./../../lang/assert":24}],16:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Stack = require('./../Stack');

var assert = require('./../../lang/assert'),
    Disposable = require('./../../lang/Disposable'),
    is = require('./../../lang/is');

module.exports = function () {
	'use strict';

	/**
  * A stack of {@link Disposable} instances which itself inherits {@Disposable}.
  * When {@link DisposableStack#dispose} is called, then each item in the collection
  * is disposed in order.
  *
  * @public
  * @extends {Disposable}
  */

	var DisposableStack = function (_Disposable) {
		_inherits(DisposableStack, _Disposable);

		function DisposableStack() {
			_classCallCheck(this, DisposableStack);

			var _this = _possibleConstructorReturn(this, (DisposableStack.__proto__ || Object.getPrototypeOf(DisposableStack)).call(this));

			_this._stack = new Stack();
			return _this;
		}

		/**
   * Adds a new {@link Disposable} instance to the stack.
   *
   * @public
   * @param {Disposable} disposable - The item to add.
   */


		_createClass(DisposableStack, [{
			key: 'push',
			value: function push(disposable) {
				assert.argumentIsRequired(disposable, 'disposable', Disposable, 'Disposable');

				if (this.getIsDisposed()) {
					throw new Error('Unable to push item onto DisposableStack because it has been disposed.');
				}

				this._stack.push(disposable);
			}
		}, {
			key: '_onDispose',
			value: function _onDispose() {
				while (!this._stack.empty()) {
					this._stack.pop().dispose();
				}
			}
		}], [{
			key: 'fromArray',
			value: function fromArray(bindings) {
				assert.argumentIsArray(bindings, 'bindings', Disposable, 'Disposable');

				var returnRef = new DisposableStack();

				for (var i = 0; i < bindings.length; i++) {
					returnRef.push(bindings[i]);
				}

				return returnRef;
			}
		}, {
			key: 'pushPromise',
			value: function pushPromise(stack, promise) {
				assert.argumentIsRequired(stack, 'stack', DisposableStack, 'DisposableStack');
				assert.argumentIsRequired(promise, 'promise');

				return promise.then(function (b) {
					var bindings = void 0;

					if (is.array(b)) {
						bindings = b;
					} else {
						bindings = [b];
					}

					bindings.forEach(function (binding) {
						return stack.push(binding);
					});
				});
			}
		}]);

		return DisposableStack;
	}(Disposable);

	return DisposableStack;
}();

},{"./../../lang/Disposable":20,"./../../lang/assert":24,"./../../lang/is":26,"./../Stack":12}],17:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('./assert'),
    Enum = require('./Enum'),
    is = require('./is');

module.exports = function () {
	'use strict';

	/**
  * An enumeration for currency types.
  *
  * @public
  * @param {String} code - Currency code (e.g. "USD")
  * @param {String} description - The description (e.g. "US Dollar")
  * @param {Number} precision - The number of decimal places possible for by a real world transaction.
  * @extends {Enum}
  */

	var Currency = function (_Enum) {
		_inherits(Currency, _Enum);

		function Currency(code, description, precision, alternateDescription) {
			_classCallCheck(this, Currency);

			var _this = _possibleConstructorReturn(this, (Currency.__proto__ || Object.getPrototypeOf(Currency)).call(this, code, description));

			assert.argumentIsRequired(precision, 'precision', Number);
			assert.argumentIsValid(precision, 'precision', is.integer, 'is an integer');

			assert.argumentIsOptional(alternateDescription, 'alternateDescription', String);

			_this._precision = precision;

			_this._alternateDescription = alternateDescription || description;
			return _this;
		}

		/**
   * The maximum number of decimal places supported by a real world transaction.
   *
   * @public
   * @returns {Number}
   */


		_createClass(Currency, [{
			key: 'toString',
			value: function toString() {
				return '[Currency (code=' + this.code + ')]';
			}
		}, {
			key: 'precision',
			get: function get() {
				return this._precision;
			}

			/**
    * An alternate human-readable description.
    *
    * @public
    * @returns {String}
    */

		}, {
			key: 'alternateDescription',
			get: function get() {
				return this._alternateDescription;
			}

			/**
    * Given a code, returns the enumeration item.
    *
    * @public
    * @param {String} code
    * @returns {Currency|null}
    */

		}], [{
			key: 'parse',
			value: function parse(code) {
				return Enum.fromCode(Currency, code);
			}

			/**
    * The Canadian Dollar.
    *
    * @public
    * @returns {Currency}
    */

		}, {
			key: 'CAD',
			get: function get() {
				return cad;
			}

			/**
    * The Euro.
    *
    * @public
    * @returns {Currency}
    */

		}, {
			key: 'EUR',
			get: function get() {
				return eur;
			}

			/**
    * The US Dollar.
    *
    * @public
    * @returns {Currency}
    */

		}, {
			key: 'USD',
			get: function get() {
				return usd;
			}
		}]);

		return Currency;
	}(Enum);

	var cad = new Currency('CAD', 'Canadian Dollar', 2, 'CAD$');
	var eur = new Currency('EUR', 'Euro', 2, 'EUR');
	var usd = new Currency('USD', 'US Dollar', 2, 'US$');

	return Currency;
}();

},{"./Enum":21,"./assert":24,"./is":26}],18:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assert = require('./assert'),
    ComparatorBuilder = require('./../collections/sorting/ComparatorBuilder'),
    comparators = require('./../collections/sorting/comparators'),
    is = require('./is');

module.exports = function () {
	'use strict';

	/**
  * A data structure that represents a day (year, month, and day)
  * without consideration for time or timezone.
  *
  * @public
  * @param {Number} year
  * @param {Number} month
  * @param {Number} day
  */

	var Day = function () {
		function Day(year, month, day) {
			_classCallCheck(this, Day);

			if (!Day.validate(year, month, day)) {
				throw new Error('Unable to instantiate Day, input is invalid [' + year + '], [' + month + '], [' + day + ']');
			}

			this._year = year;
			this._month = month;
			this._day = day;
		}

		/**
   * Calculates a new {@link Day} in the future (or past).
   *
   * @public
   * @param {Number} days - The number of days to add (negative numbers can be used for subtraction).
   * @param {Boolean=} inverse - If true, the sign of the "days" value will be flipped.
   * @returns {Day}
   */


		_createClass(Day, [{
			key: 'addDays',
			value: function addDays(days, inverse) {
				assert.argumentIsRequired(days, 'days', Number);
				assert.argumentIsOptional(inverse, inverse, Boolean);
				assert.argumentIsValid(days, 'days', is.large, 'is an integer');

				var totalDaysToShift = void 0;

				if (is.boolean(inverse) && inverse) {
					totalDaysToShift = days * -1;
				} else {
					totalDaysToShift = days;
				}

				var positive = is.positive(totalDaysToShift);

				var shiftedDay = this._day;
				var shiftedMonth = this._month;
				var shiftedYear = this._year;

				while (totalDaysToShift !== 0) {
					var monthDaysAvailable = void 0;
					var monthDaysToShift = void 0;

					if (positive) {
						monthDaysAvailable = Day.getDaysInMonth(shiftedYear, shiftedMonth) - shiftedDay;
						monthDaysToShift = Math.min(totalDaysToShift, monthDaysAvailable);
					} else {
						monthDaysAvailable = 1 - shiftedDay;
						monthDaysToShift = Math.max(totalDaysToShift, monthDaysAvailable);
					}

					totalDaysToShift = totalDaysToShift - monthDaysToShift;

					if (totalDaysToShift === 0) {
						shiftedDay = shiftedDay + monthDaysToShift;
					} else if (positive) {
						shiftedMonth++;

						if (shiftedMonth > 12) {
							shiftedYear++;
							shiftedMonth = 1;
						}

						shiftedDay = 0;
					} else {
						shiftedMonth--;

						if (shiftedMonth < 1) {
							shiftedYear--;
							shiftedMonth = 12;
						}

						shiftedDay = Day.getDaysInMonth(shiftedYear, shiftedMonth) + 1;
					}
				}

				return new Day(shiftedYear, shiftedMonth, shiftedDay);
			}

			/**
    * Calculates a new {@link Day} in the past (or future).
    *
    * @public
    * @param {Number} days - The number of days to subtract (negative numbers can be used for addition).
    * @returns {Day}
    */

		}, {
			key: 'subtractDays',
			value: function subtractDays(days) {
				return this.addDays(days, true);
			}

			/**
    * Calculates a new {@link Day} in the future (or past). If the new date is at the end of
    * the month and the new month has fewer days than the current month, days will be subtracted
    * as necessary (e.g. adding one month to March 31 will return April 30).
    *
    * @public
    * @param {Number} months - The number of months to add (negative numbers can be used for subtraction).
    * @param {Boolean=} inverse - If true, the sign of the "days" value will be flipped.
    * @returns {Day}
    */

		}, {
			key: 'addMonths',
			value: function addMonths(months, inverse) {
				assert.argumentIsRequired(months, 'months', Number);
				assert.argumentIsOptional(inverse, inverse, Boolean);
				assert.argumentIsValid(months, 'months', is.large, 'is an integer');

				var totalMonthsToShift = void 0;

				if (is.boolean(inverse) && inverse) {
					totalMonthsToShift = months * -1;
				} else {
					totalMonthsToShift = months;
				}

				var monthsToShift = totalMonthsToShift % 12;
				var yearsToShift = (totalMonthsToShift - monthsToShift) / 12;

				var shiftedYear = this.year + yearsToShift;
				var shiftedMonth = this.month + monthsToShift;
				var shiftedDay = this.day;

				if (shiftedMonth > 12) {
					shiftedYear = shiftedYear + 1;
					shiftedMonth = shiftedMonth - 12;
				}

				if (shiftedMonth < 1) {
					shiftedYear = shiftedYear - 1;
					shiftedMonth = shiftedMonth + 12;
				}

				while (!Day.validate(shiftedYear, shiftedMonth, shiftedDay)) {
					shiftedDay = shiftedDay - 1;
				}

				return new Day(shiftedYear, shiftedMonth, shiftedDay);
			}

			/**
    * Calculates a new {@link Day} in the past (or future).
    *
    * @public
    * @param {Number} months - The number of months to subtract (negative numbers can be used for addition).
    * @returns {Day}
    */

		}, {
			key: 'subtractMonths',
			value: function subtractMonths(months) {
				return this.addMonths(months, true);
			}

			/**
    * Calculates a new {@link Day} in the future (or past). If the new date is at the end of
    * the month and the new month has fewer days than the current month, days will be subtracted
    * as necessary (e.g. adding one year to February 29 will return February 28).
    *
    * @public
    * @param {Number} years - The number of years to add (negative numbers can be used for subtraction).
    * @param {Boolean=} inverse - If true, the sign of the "days" value will be flipped.
    * @returns {Day}
    */

		}, {
			key: 'addYears',
			value: function addYears(years, inverse) {
				assert.argumentIsRequired(years, 'years', Number);
				assert.argumentIsOptional(inverse, inverse, Boolean);
				assert.argumentIsValid(years, 'years', is.large, 'is an integer');

				var yearsToShift = void 0;

				if (is.boolean(inverse) && inverse) {
					yearsToShift = years * -1;
				} else {
					yearsToShift = years;
				}

				var shiftedYear = this.year + yearsToShift;
				var shiftedMonth = this.month;
				var shiftedDay = this.day;

				while (!Day.validate(shiftedYear, shiftedMonth, shiftedDay)) {
					shiftedDay = shiftedDay - 1;
				}

				return new Day(shiftedYear, shiftedMonth, shiftedDay);
			}

			/**
    * Calculates a new {@link Day} in the past (or future).
    *
    * @public
    * @param {Number} years - The number of years to subtract (negative numbers can be used for addition).
    * @returns {Day}
    */

		}, {
			key: 'subtractYears',
			value: function subtractYears(years) {
				return this.addYears(years, true);
			}

			/**
    * Indicates if another {@link Day} occurs before the current instance.
    *
    * @public
    * @param {Day} other
    * @returns {boolean}
    */

		}, {
			key: 'getIsBefore',
			value: function getIsBefore(other) {
				return Day.compareDays(this, other) < 0;
			}

			/**
    * Indicates if another {@link Day} occurs after the current instance.
    *
    * @public
    * @param {Day} other
    * @returns {boolean}
    */

		}, {
			key: 'getIsAfter',
			value: function getIsAfter(other) {
				return Day.compareDays(this, other) > 0;
			}

			/**
    * Indicates the current day falls between two other days, inclusive
    * of the range boundaries.
    *
    * @public
    * @param {Day=} first
    * @param {Day=} last
    * @param {boolean=} exclusive
    * @returns {boolean}
    */

		}, {
			key: 'getIsContained',
			value: function getIsContained(first, last) {
				assert.argumentIsOptional(first, 'first', Day, 'Day');
				assert.argumentIsOptional(last, 'last', Day, 'Day');

				var notAfter = void 0;
				var notBefore = void 0;

				if (first && last && first.getIsAfter(last)) {
					notBefore = false;
					notAfter = false;
				} else {
					notAfter = !(last instanceof Day) || !this.getIsAfter(last);
					notBefore = !(first instanceof Day) || !this.getIsBefore(first);
				}

				return notAfter && notBefore;
			}

			/**
    * Indicates if another {@link Day} occurs after the current instance.
    *
    * @public
    * @param {Day} other
    * @returns {boolean}
    */

		}, {
			key: 'getIsEqual',
			value: function getIsEqual(other) {
				return Day.compareDays(this, other) === 0;
			}

			/**
    * The year.
    *
    * @public
    * @returns {Number}
    */

		}, {
			key: 'format',


			/**
    * Outputs the date as the formatted string: {year}-{month}-{day}.
    *
    * @public
    * @returns {String}
    */
			value: function format() {
				return this._year + '-' + leftPad(this._month) + '-' + leftPad(this._day);
			}

			/**
    * Returns the JSON representation.
    *
    * @public
    * @returns {String}
    */

		}, {
			key: 'toJSON',
			value: function toJSON() {
				return this.format();
			}

			/**
    * Converts a string (which matches the output of {@link Day#format} into
    * a {@link Day} instance.
    *
    * @public
    * @static
    * @param {String} value
    * @returns {Day}
    */

		}, {
			key: 'toString',
			value: function toString() {
				return '[Day]';
			}
		}, {
			key: 'year',
			get: function get() {
				return this._year;
			}

			/**
    * The month of the year (January is one, December is twelve).
    *
    * @public
    * @returns {Number}
    */

		}, {
			key: 'month',
			get: function get() {
				return this._month;
			}

			/**
    * The day of the month.
    *
    * @public
    * @returns {Number}
    */

		}, {
			key: 'day',
			get: function get() {
				return this._day;
			}
		}], [{
			key: 'parse',
			value: function parse(value) {
				assert.argumentIsRequired(value, 'value', String);

				var match = value.match(dayRegex);

				if (match === null) {
					throw new Error('Unable to parse value as Day [ ' + value + ' ]');
				}

				return new Day(parseInt(match[1]), parseInt(match[2]), parseInt(match[3]));
			}

			/**
    * Creates a {@link Day} from the year, month, and day properties (in local time)
    * of the {@link Date} argument.
    *
    * @public
    * @static
    * @param {Date} date
    * @returns {Day}
    */

		}, {
			key: 'fromDate',
			value: function fromDate(date) {
				assert.argumentIsRequired(date, 'date', Date);

				return new Day(date.getFullYear(), date.getMonth() + 1, date.getDate());
			}

			/**
    * Creates a {@link Day} from the year, month, and day properties (in UTC)
    * of the {@link Date} argument.
    *
    * @public
    * @static
    * @param {Date} date
    * @returns {Day}
    */

		}, {
			key: 'fromDateUtc',
			value: function fromDateUtc(date) {
				assert.argumentIsRequired(date, 'date', Date);

				return new Day(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
			}

			/**
    * Returns a {@link Day} instance using today's local date.
    *
    * @static
    * @public
    * @return {Day}
    */

		}, {
			key: 'getToday',
			value: function getToday() {
				return Day.fromDate(new Date());
			}

			/**
    * Returns true if the year, month, and day combination is valid; otherwise false.
    *
    * @public
    * @static
    * @param {Number} year
    * @param {Number} month
    * @param {Number} day
    * @returns {Boolean}
    */

		}, {
			key: 'validate',
			value: function validate(year, month, day) {
				return is.integer(year) && is.integer(month) && is.integer(day) && !(month < 1) && !(month > 12) && !(day < 1) && !(day > Day.getDaysInMonth(year, month));
			}

			/**
    * Returns the number of days in a given month.
    *
    * @public
    * @static
    * @param {number} year - The year number (e.g. 2017)
    * @param {number} month - The month number (e.g. 2 is February)
    */

		}, {
			key: 'getDaysInMonth',
			value: function getDaysInMonth(year, month) {
				switch (month) {
					case 1:
					case 3:
					case 5:
					case 7:
					case 8:
					case 10:
					case 12:
						{
							return 31;
						}
					case 4:
					case 6:
					case 9:
					case 11:
						{
							return 30;
						}
					case 2:
						{
							if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
								return 29;
							} else {
								return 28;
							}
						}
				}
			}

			/**
    * A comparator function for {@link Day} instances.
    *
    * @public
    * @static
    * @param {Day} a
    * @param {Day} b
    * @returns {Number}
    */

		}, {
			key: 'compareDays',
			value: function compareDays(a, b) {
				assert.argumentIsRequired(a, 'a', Day, 'Day');
				assert.argumentIsRequired(b, 'b', Day, 'Day');

				return comparator(a, b);
			}
		}]);

		return Day;
	}();

	var dayRegex = /^([0-9]{4}).?([0-9]{2}).?([0-9]{2})$/;

	function leftPad(value) {
		return value < 10 ? '0' + value : '' + value;
	}

	var comparator = ComparatorBuilder.startWith(function (a, b) {
		return comparators.compareNumbers(a.year, b.year);
	}).thenBy(function (a, b) {
		return comparators.compareNumbers(a.month, b.month);
	}).thenBy(function (a, b) {
		return comparators.compareNumbers(a.day, b.day);
	}).toComparator();

	return Day;
}();

},{"./../collections/sorting/ComparatorBuilder":14,"./../collections/sorting/comparators":15,"./assert":24,"./is":26}],19:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assert = require('./assert'),
    Enum = require('./Enum'),
    is = require('./is');

var Big = require('big.js');

module.exports = function () {
	'use strict';

	/**
  * An immutable object that allows for arbitrary-precision calculations.
  *
  * @public
  * @param {Decimal|Number|String} value - The value.
  */

	var Decimal = function () {
		function Decimal(value) {
			_classCallCheck(this, Decimal);

			this._big = getBig(value);
		}

		/**
   * Returns a new {@link Decimal} instance that is the sum of the
   * current instance's value and the value supplied.
   *
   * @public
   * @param {Decimal|Number|String} other - The value to add.
   * @returns {Decimal}
   */


		_createClass(Decimal, [{
			key: 'add',
			value: function add(other) {
				return new Decimal(this._big.plus(getBig(other)));
			}

			/**
    * Returns a new {@link Decimal} instance with a value that results
    * from the subtraction of the value supplied from the current instance's
    * value.
    *
    * @public
    * @param {Decimal|Number|String} other - The value to subtract.
    * @returns {Decimal}
    */

		}, {
			key: 'subtract',
			value: function subtract(other) {
				return new Decimal(this._big.minus(getBig(other)));
			}

			/**
    * Returns a new {@link Decimal} instance that is the product of the
    * current instance's value and the value supplied.
    *
    * @public
    * @param {Decimal|Number|String} other - The value to add.
    * @returns {Decimal}
    */

		}, {
			key: 'multiply',
			value: function multiply(other) {
				return new Decimal(this._big.times(getBig(other)));
			}

			/**
    * Returns a new {@link Decimal} instance with a value that results
    * from the division of the current instance's value by the value
    * supplied.
    *
    * @public
    * @param {Decimal|Number|String} other - The value to subtract.
    * @returns {Decimal}
    */

		}, {
			key: 'divide',
			value: function divide(other) {
				return new Decimal(this._big.div(getBig(other)));
			}

			/**
    * Returns a new {@link Decimal} with a value resulting from a rounding
    * operation on the current value.
    *
    * @public
    * @param {Number} places - The number of decimal places to retain.
    * @param {RoundingMode=} mode - The strategy to use for rounding.
    * @returns {Decimal}
    */

		}, {
			key: 'round',
			value: function round(places, mode) {
				assert.argumentIsRequired(places, 'places', Number);
				assert.argumentIsOptional(mode, 'mode', RoundingMode, 'RoundingMode');

				var modeToUse = mode || RoundingMode.NORMAL;

				return new Decimal(this._big.round(places, modeToUse.value));
			}

			/**
    * Returns a new {@link Decimal} instance having the absolute value of
    * the current instance's value.
    *
    * @public
    * @returns {Decimal}
    */

		}, {
			key: 'absolute',
			value: function absolute() {
				return new Decimal(this._big.abs());
			}

			/**
    * Returns a new {@link Decimal} instance the opposite sign as the
    * current instance's value.
    *
    * @public
    * @returns {Decimal}
    */

		}, {
			key: 'opposite',
			value: function opposite() {
				return this.multiply(-1);
			}

			/**
    * Returns a Boolean value, indicating if the current instance's value is
    * equal to zero (or approximately equal to zero).
    *
    * @public
    * @param {Boolean=} approximate
    * @returns {Boolean}
    */

		}, {
			key: 'getIsZero',
			value: function getIsZero(approximate) {
				assert.argumentIsOptional(approximate, 'approximate', Boolean);

				return this._big.eq(zero) || is.boolean(approximate) && approximate && this.round(20, RoundingMode.NORMAL).getIsZero();
			}

			/**
    * Returns true if the current instance is positive; otherwise false.
    *
    * @public
    * @returns {Boolean}
    */

		}, {
			key: 'getIsPositive',
			value: function getIsPositive() {
				return this._big.gt(zero);
			}

			/**
    * Returns true if the current instance is negative; otherwise false.
    *
    * @public
    * @returns {Boolean}
    */

		}, {
			key: 'getIsNegative',
			value: function getIsNegative() {
				return this._big.lt(zero);
			}

			/**
    * Returns true if the current instance is greater than the value.
    *
    * @public
    * @param {Decimal|Number|String} other - The value to compare.
    * @returns {Boolean}
    */

		}, {
			key: 'getIsGreaterThan',
			value: function getIsGreaterThan(other) {
				return this._big.gt(getBig(other));
			}

			/**
    * Returns true if the current instance is greater than or equal to the value.
    *
    * @public
    * @param {Decimal|Number|String} other - The value to compare.
    * @returns {Boolean}
    */

		}, {
			key: 'getIsGreaterThanOrEqual',
			value: function getIsGreaterThanOrEqual(other) {
				return this._big.gte(getBig(other));
			}

			/**
    * Returns true if the current instance is less than the value.
    *
    * @public
    * @param {Decimal|Number|String} other - The value to compare.
    * @returns {Boolean}
    */

		}, {
			key: 'getIsLessThan',
			value: function getIsLessThan(other) {
				return this._big.lt(getBig(other));
			}

			/**
    * Returns true if the current instance is less than or equal to the value.
    *
    * @public
    * @param {Decimal|Number|String} other - The value to compare.
    * @returns {Boolean}
    */

		}, {
			key: 'getIsLessThanOrEqual',
			value: function getIsLessThanOrEqual(other) {
				return this._big.lte(getBig(other));
			}

			/**
    * Returns true if the current instance is equal to the value.
    *
    * @public
    * @param {Decimal|Number|String} other - The value to compare.
    * @returns {Boolean}
    */

		}, {
			key: 'getIsEqual',
			value: function getIsEqual(other) {
				return this._big.eq(getBig(other));
			}

			/**
    * Emits a floating point value that approximates the value of the current
    * instance.
    *
    * @public
    * @param {Number=} places
    * @returns {Number}
    */

		}, {
			key: 'toFloat',
			value: function toFloat(places) {
				assert.argumentIsOptional(places, 'places', Number);

				// Accepting places might be a mistake here; perhaps
				// the consumer should be forced to use the round
				// function.

				return parseFloat(this._big.toFixed(places || 16));
			}

			/**
    * Returns a string-based representation of the instance's value.
    *
    * @public
    * @returns {String}
    */

		}, {
			key: 'toFixed',
			value: function toFixed() {
				return this._big.toFixed();
			}

			/**
    * Returns the JSON representation.
    *
    * @public
    * @returns {String}
    */

		}, {
			key: 'toJSON',
			value: function toJSON() {
				return this.toFixed();
			}

			/**
    * Parses the value emitted by {@link Decimal#toJSON}.
    *
    * @public
    * @param {String} value
    * @returns {Decimal}
    */

		}, {
			key: 'toString',
			value: function toString() {
				return '[Decimal]';
			}
		}], [{
			key: 'parse',
			value: function parse(value) {
				return new Decimal(value);
			}

			/**
    * Returns an instance with the value of zero.
    *
    * @public
    * @returns {Decimal}
    */

		}, {
			key: 'getIsZero',


			/**
    * Runs {@link Decimal#getIsZero} and returns the result.
    *
    * @public
    * @param {Decimal} instance
    * @return {Boolean}
    */
			value: function getIsZero(instance) {
				assert.argumentIsRequired(instance, 'instance', Decimal, 'Decimal');

				return instance.getIsZero();
			}

			/**
    * Runs {@link Decimal#getIsZero} and returns the inverse.
    *
    * @public
    * @param {Decimal} instance
    * @return {Boolean}
    */

		}, {
			key: 'getIsNotZero',
			value: function getIsNotZero(instance) {
				assert.argumentIsRequired(instance, 'instance', Decimal, 'Decimal');

				return !instance.getIsZero();
			}

			/**
    * Runs {@link Decimal#getIsPositive} and returns the result.
    *
    * @public
    * @param {Decimal} instance
    * @return {Boolean}
    */

		}, {
			key: 'getIsPositive',
			value: function getIsPositive(instance) {
				assert.argumentIsRequired(instance, 'instance', Decimal, 'Decimal');

				return instance.getIsPositive();
			}

			/**
    * Checks an instance to see if its negative or zero.
    *
    * @public
    * @param {Decimal} instance
    * @return {Boolean}
    */

		}, {
			key: 'getIsNotPositive',
			value: function getIsNotPositive(instance) {
				assert.argumentIsRequired(instance, 'instance', Decimal, 'Decimal');

				return instance.getIsNegative() || instance.getIsZero();
			}

			/**
    * Runs {@link Decimal#getIsNegative} and returns the result.
    *
    * @public
    * @param {Decimal} instance
    * @return {Boolean}
    */

		}, {
			key: 'getIsNegative',
			value: function getIsNegative(instance) {
				assert.argumentIsRequired(instance, 'instance', Decimal, 'Decimal');

				return instance.getIsNegative();
			}

			/**
    * Checks an instance to see if its positive or zero.
    *
    * @public
    * @param {Decimal} instance
    * @return {Boolean}
    */

		}, {
			key: 'getIsNotNegative',
			value: function getIsNotNegative(instance) {
				assert.argumentIsRequired(instance, 'instance', Decimal, 'Decimal');

				return instance.getIsPositive() || instance.getIsZero();
			}

			/**
    * A comparator function for {@link Decimal} instances.
    *
    * @public
    * @param {Decimal} a
    * @param {Decimal} b
    * @returns {Number}
    */

		}, {
			key: 'compareDecimals',
			value: function compareDecimals(a, b) {
				assert.argumentIsRequired(a, 'a', Decimal, 'Decimal');
				assert.argumentIsRequired(b, 'b', Decimal, 'Decimal');

				if (a._big.gt(b._big)) {
					return 1;
				} else if (a._big.lt(b._big)) {
					return -1;
				} else {
					return 0;
				}
			}
		}, {
			key: 'ZERO',
			get: function get() {
				return decimalZero;
			}

			/**
    * Returns an instance with the value of one.
    *
    * @public
    * @returns {Decimal}
    */

		}, {
			key: 'ONE',
			get: function get() {
				return decimalOne;
			}

			/**
    * Returns an instance with the value of one.
    *
    * @public
    * @returns {Decimal}
    */

		}, {
			key: 'NEGATIVE_ONE',
			get: function get() {
				return decimalNegativeOne;
			}

			/**
    * Return the {@link RoundingMode} enumeration.
    *
    * @public
    * @returns {RoundingMode}
    */

		}, {
			key: 'ROUNDING_MODE',
			get: function get() {
				return RoundingMode;
			}
		}]);

		return Decimal;
	}();

	var zero = new Big(0);
	var positiveOne = new Big(1);
	var negativeOne = new Big(-1);

	var decimalZero = new Decimal(zero);
	var decimalOne = new Decimal(positiveOne);
	var decimalNegativeOne = new Decimal(negativeOne);

	function getBig(value) {
		if (value instanceof Big) {
			return value;
		} else if (value instanceof Decimal) {
			return value._big;
		} else {
			return new Big(value);
		}
	}

	/**
  * An enumeration of strategies for rouding a {@link Decimal} instance.
  *
  * @public
  * @inner
  * @extends {Enum}
  */

	var RoundingMode = function (_Enum) {
		_inherits(RoundingMode, _Enum);

		function RoundingMode(value, description) {
			_classCallCheck(this, RoundingMode);

			var _this = _possibleConstructorReturn(this, (RoundingMode.__proto__ || Object.getPrototypeOf(RoundingMode)).call(this, value.toString(), description));

			_this._value = value;
			return _this;
		}

		/**
   * The code used by the Big.js library.
   *
   * @ignore
   * @returns {Number}
   */


		_createClass(RoundingMode, [{
			key: 'toString',
			value: function toString() {
				return '[RoundingMode]';
			}
		}, {
			key: 'value',
			get: function get() {
				return this._value;
			}

			/**
    * Rounds away from zero.
    *
    * @public
    * @returns {RoundingMode}
    */

		}], [{
			key: 'UP',
			get: function get() {
				return up;
			}

			/**
    * Rounds towards zero.
    *
    * @public
    * @returns {RoundingMode}
    */

		}, {
			key: 'DOWN',
			get: function get() {
				return down;
			}

			/**
    * Rounds towards nearest neighbor. If equidistant, rounds away from zero.
    *
    * @public
    * @returns {RoundingMode}
    */

		}, {
			key: 'NORMAL',
			get: function get() {
				return normal;
			}
		}]);

		return RoundingMode;
	}(Enum);

	var up = new RoundingMode(3, 'up');
	var down = new RoundingMode(0, 'down');
	var normal = new RoundingMode(1, 'normal');

	return Decimal;
}();

},{"./Enum":21,"./assert":24,"./is":26,"big.js":29}],20:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assert = require('./assert');

module.exports = function () {
	'use strict';

	/**
  * An object that has an end-of-life process.
  *
  * @public
  * @interface
  */

	var Disposable = function () {
		function Disposable() {
			_classCallCheck(this, Disposable);

			this._disposed = false;
		}

		/**
   * Invokes end-of-life logic. Once this function has been
   * invoked, further interaction with the object is not
   * recommended.
   *
   * @public
   */


		_createClass(Disposable, [{
			key: 'dispose',
			value: function dispose() {
				if (this._disposed) {
					return;
				}

				this._disposed = true;

				this._onDispose();
			}

			/**
    * @protected
    * @abstract
    * @ignore
    */

		}, {
			key: '_onDispose',
			value: function _onDispose() {
				return;
			}

			/**
    * Returns true if the {@link Disposable#dispose} function has been invoked.
    *
    * @public
    * @returns {boolean}
    */

		}, {
			key: 'getIsDisposed',
			value: function getIsDisposed() {
				return this._disposed || false;
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[Disposable]';
			}

			/**
    * Creates and returns a {@link Disposable} object with end-of-life logic
    * delegated to a function.
    *
    * @public
    * @param disposeAction {Function}
    * @returns {Disposable}
    */

		}], [{
			key: 'fromAction',
			value: function fromAction(disposeAction) {
				assert.argumentIsRequired(disposeAction, 'disposeAction', Function);

				return new DisposableAction(disposeAction);
			}

			/**
    * Creates and returns a {@link Disposable} object whose end-of-life
    * logic does nothing.
    *
    * @public
    * @returns {Disposable}
    */

		}, {
			key: 'getEmpty',
			value: function getEmpty() {
				return Disposable.fromAction(function () {
					return;
				});
			}
		}]);

		return Disposable;
	}();

	var DisposableAction = function (_Disposable) {
		_inherits(DisposableAction, _Disposable);

		function DisposableAction(disposeAction) {
			_classCallCheck(this, DisposableAction);

			var _this = _possibleConstructorReturn(this, (DisposableAction.__proto__ || Object.getPrototypeOf(DisposableAction)).call(this, disposeAction));

			_this._disposeAction = disposeAction;
			return _this;
		}

		_createClass(DisposableAction, [{
			key: '_onDispose',
			value: function _onDispose() {
				this._disposeAction();
				this._disposeAction = null;
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[DisposableAction]';
			}
		}]);

		return DisposableAction;
	}(Disposable);

	return Disposable;
}();

},{"./assert":24}],21:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assert = require('./assert');

module.exports = function () {
	'use strict';

	var types = new Map();

	/**
  * An enumeration. Must be inherited. Do not instantiate directly.
  * Also, this class uses the ES6 Map, therefore a polyfill must
  * be supplied.
  *
  * @public
  * @interface
  * @param {String} code - The unique code of the enumeration item.
  * @param {String} description - A description of the enumeration item.
  */

	var Enum = function () {
		function Enum(code, description) {
			_classCallCheck(this, Enum);

			assert.argumentIsRequired(code, 'code', String);
			assert.argumentIsRequired(description, 'description', String);

			this._code = code;
			this._description = description;

			var c = this.constructor;

			if (!types.has(c)) {
				types.set(c, []);
			}

			var existing = Enum.fromCode(c, code);

			if (existing === null) {
				types.get(c).push(this);
			}
		}

		/**
   * The unique code.
   *
   * @returns {String}
   */


		_createClass(Enum, [{
			key: 'equals',


			/**
    * Returns true if the provided {@link Enum} argument is equal
    * to the instance.
    *
    * @param {Enum} other
    * @returns {boolean}
    */
			value: function equals(other) {
				return other === this || other instanceof Enum && other.constructor === this.constructor && other.code === this.code;
			}

			/**
    * Returns the JSON representation.
    *
    * @public
    * @returns {String}
    */

		}, {
			key: 'toJSON',
			value: function toJSON() {
				return this.code;
			}

			/**
    * Looks up a enumeration item; given the enumeration type and the enumeration
    * item's value. If no matching item can be found, a null value is returned.
    *
    * @param {Function} type - The enumeration type.
    * @param {String} code - The enumeration item's code.
    * @returns {*|null}
    */

		}, {
			key: 'toString',
			value: function toString() {
				return '[Enum]';
			}
		}, {
			key: 'code',
			get: function get() {
				return this._code;
			}

			/**
    * The description.
    *
    * @returns {String}
    */

		}, {
			key: 'description',
			get: function get() {
				return this._description;
			}
		}], [{
			key: 'fromCode',
			value: function fromCode(type, code) {
				return Enum.getItems(type).find(function (x) {
					return x.code === code;
				}) || null;
			}

			/**
    * Returns all of the enumeration's items (given an enumeration type).
    *
    * @param {Function} type - The enumeration to list.
    * @returns {Array}
    */

		}, {
			key: 'getItems',
			value: function getItems(type) {
				return types.get(type) || [];
			}
		}]);

		return Enum;
	}();

	return Enum;
}();

},{"./assert":24}],22:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assert = require('./assert'),
    memoize = require('./memoize');

var Currency = require('./Currency'),
    Decimal = require('./Decimal');

module.exports = function () {
	'use strict';

	/**
  * A component that represents an exchange rate, composed of a {@link Decimal}
  * value and two currencies -- a quote (i.e. the numerator) currency and a
  * base (i.e. denominator) currency.
  *
  * @public
  * @param {Number|String|Decimal} value - The rate
  * @param {Currency} numerator - The quote currency
  * @param {Currency} denominator - The base currency
  */

	var Rate = function () {
		function Rate(value, numerator, denominator) {
			_classCallCheck(this, Rate);

			assert.argumentIsRequired(numerator, 'numerator', Currency, 'Currency');
			assert.argumentIsRequired(denominator, 'denominator', Currency, 'Currency');

			if (numerator === denominator) {
				throw new Error('A rate cannot use two identical currencies.');
			}

			var decimal = getDecimal(value);

			if (!decimal.getIsPositive()) {
				throw new Error('Rate value must be positive.');
			}

			this._decimal = decimal;
			this._numerator = numerator;
			this._denominator = denominator;
		}

		/**
   * The rate.
   *
   * @public
   * @returns {Decimal}
   */


		_createClass(Rate, [{
			key: 'invert',


			/**
    * Returns the equivalent rate with the numerator and denominator (i.e. the qoute and base)
    * currencies.
    *
    * @public
    * @returns {Rate}
    */
			value: function invert() {
				return new Rate(Decimal.ONE.divide(this._decimal), this._denominator, this._numerator);
			}

			/**
    * Formats the currency pair as a string (e.g. "EURUSD" or "^EURUSD").
    *
    * @public
    * @param {Boolean=} useCarat - If true, a carat is used as a prefix to the resulting string.
    * @returns {string}
    */

		}, {
			key: 'formatPair',
			value: function formatPair(useCarat) {
				assert.argumentIsOptional(useCarat, 'useCarat', Boolean);

				return '' + (useCarat ? '^' : '') + this._numerator + this._denominator;
			}

			/**
    * Creates a {@link Rate} instance, when given a value
    *
    * @public
    * @param {Number|String|Decimal} value - The rate.
    * @param {String} symbol - A string that can be parsed as a currency pair.
    * @returns {Rate}
    */

		}, {
			key: 'toString',
			value: function toString() {
				return '[Rate]';
			}
		}, {
			key: 'decimal',
			get: function get() {
				return this._decimal;
			}

			/**
    * The numerator (i.e. quote) currency. In other words,
    * this is EUR of the EURUSD pair.
    *
    * @public
    * @returns {Currency}
    */

		}, {
			key: 'numerator',
			get: function get() {
				return this._numerator;
			}

			/**
    * The quote (i.e. numerator) currency. In other words,
    * this is EUR of the EURUSD pair.
    *
    * @public
    * @returns {Currency}
    */

		}, {
			key: 'quote',
			get: function get() {
				return this._numerator;
			}

			/**
    * The denominator (i.e. base) currency. In other words,
    * this is USD of the EURUSD pair.
    *
    * @public
    * @returns {Currency}
    */

		}, {
			key: 'denominator',
			get: function get() {
				return this._denominator;
			}

			/**
    * The base (i.e. denominator) currency. In other words,
    * this is USD of the EURUSD pair.
    *
    * @public
    * @returns {Currency}
    */

		}, {
			key: 'base',
			get: function get() {
				return this._denominator;
			}
		}], [{
			key: 'fromPair',
			value: function fromPair(value, symbol) {
				assert.argumentIsRequired(symbol, 'symbol', String);

				var pair = parsePair(symbol);

				return new Rate(value, Currency.parse(pair.numerator), Currency.parse(pair.denominator));
			}

			/**
    * Given a {@link Decimal} value in a known currency, output
    * a {@link Decimal} converted to an alternate currency.
    *
    * @public
    * @param {Decimal} amount - The amount to convert.
    * @param {Currency} currency - The currency of the amount.
    * @param {Currency} desiredCurrency - The currency to convert to.
    * @param {...Rate} rates - A list of exchange rates to be used for the conversion.
    * @returns {Decimal}
    */

		}, {
			key: 'convert',
			value: function convert(amount, currency, desiredCurrency) {
				assert.argumentIsRequired(amount, 'amount', Decimal, 'Decimal');
				assert.argumentIsRequired(currency, 'currency', Currency, 'Currency');
				assert.argumentIsRequired(desiredCurrency, 'desiredCurrency', Currency, 'Currency');
				//assert.argumentIsArray(rates, 'rates', Rate, 'Rate');

				var converted = void 0;

				if (currency === desiredCurrency) {
					converted = amount;
				} else {
					var numerator = desiredCurrency;
					var denominator = currency;

					for (var _len = arguments.length, rates = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
						rates[_key - 3] = arguments[_key];
					}

					var rate = rates.find(function (r) {
						return r.numerator === numerator && r.denominator === denominator || r.numerator === denominator && r.denominator === numerator;
					});

					if (rate) {
						if (rate.numerator === denominator) {
							rate = rate.invert();
						}
					}

					if (!rate) {
						throw new Error('Unable to perform conversion, given the rates provided.');
					}

					converted = amount.multiply(rate.decimal);
				}

				return converted;
			}
		}]);

		return Rate;
	}();

	var pairExpression = /^\^?([A-Z]{3})([A-Z]{3})$/;

	function getDecimal(value) {
		if (value instanceof Decimal) {
			return value;
		} else {
			return new Decimal(value);
		}
	}

	var parsePair = memoize.simple(function (symbol) {
		var match = symbol.match(pairExpression);

		if (match === null) {
			throw new Error('The "pair" argument cannot be parsed.');
		}

		return {
			numerator: match[2],
			denominator: match[1]
		};
	});

	return Rate;
}();

},{"./Currency":17,"./Decimal":19,"./assert":24,"./memoize":27}],23:[function(require,module,exports){
'use strict';

var assert = require('./assert'),
    is = require('./is');

module.exports = function () {
	'use strict';

	/**
  * Utilities for working with arrays.
  *
  * @public
  * @module lang/array
  */

	return {
		/**
   * Returns the unique items from an array, where the unique
   * key is determined via a strict equality check.
   *
   * @static
   * @param {Array} a
   * @returns {Array}
   */
		unique: function unique(a) {
			assert.argumentIsArray(a, 'a');

			return this.uniqueBy(a, function (item) {
				return item;
			});
		},


		/**
   * Returns the unique items from an array, where the unique
   * key is determined by a delegate.
   *
   * @static
   * @param {Array} a
   * @param {Function} keySelector - A function that returns a unique key for an item.
   * @returns {Array}
   */
		uniqueBy: function uniqueBy(a, keySelector) {
			assert.argumentIsArray(a, 'a');

			return a.filter(function (item, index, array) {
				var key = keySelector(item);

				return array.findIndex(function (candidate) {
					return key === keySelector(candidate);
				}) === index;
			});
		},


		/**
   * Splits array into groups and returns an object (where the properties have
   * arrays). Unlike the indexBy function, there can be many items which share
   * the same key.
   *
   * @static
   * @param {Array} a
   * @param {Function} keySelector - A function that returns a unique key for an item.
   * @returns {Object}
   */
		groupBy: function groupBy(a, keySelector) {
			assert.argumentIsArray(a, 'a');
			assert.argumentIsRequired(keySelector, 'keySelector', Function);

			return a.reduce(function (groups, item) {
				var key = keySelector(item);

				if (!groups.hasOwnProperty(key)) {
					groups[key] = [];
				}

				groups[key].push(item);

				return groups;
			}, {});
		},


		/**
   * Splits array into groups and returns an array of arrays where the items of each
   * nested array share a common key.
   *
   * @static
   * @param {Array} a
   * @param {Function} keySelector - A function that returns a unique key for an item.
   * @returns {Array}
   */
		batchBy: function batchBy(a, keySelector) {
			assert.argumentIsArray(a, 'a');
			assert.argumentIsRequired(keySelector, 'keySelector', Function);

			var currentKey = null;
			var currentBatch = null;

			return a.reduce(function (batches, item) {
				var key = keySelector(item);

				if (currentBatch === null || currentKey !== key) {
					currentKey = key;

					currentBatch = [];
					batches.push(currentBatch);
				}

				currentBatch.push(item);

				return batches;
			}, []);
		},


		/**
   * Splits array into groups and returns an object (where the properties are items from the
   * original array). Unlike the groupBy, only one item can have a given key value.
   *
   * @static
   * @param {Array} a
   * @param {Function} keySelector - A function that returns a unique key for an item.
   * @returns {Object}
   */
		indexBy: function indexBy(a, keySelector) {
			assert.argumentIsArray(a, 'a');
			assert.argumentIsRequired(keySelector, 'keySelector', Function);

			return a.reduce(function (map, item) {
				var key = keySelector(item);

				if (map.hasOwnProperty(key)) {
					throw new Error('Unable to index array. A duplicate key exists.');
				}

				map[key] = item;

				return map;
			}, {});
		},


		/**
   * Returns a new array containing all but the first item.
   *
   * @static
   * @param {Array} a
   * @returns {Array}
   */
		dropLeft: function dropLeft(a) {
			assert.argumentIsArray(a, 'a');

			var returnRef = Array.from(a);

			if (returnRef.length !== 0) {
				returnRef.shift();
			}

			return returnRef;
		},


		/**
   * Returns a new array containing all but the last item.
   *
   * @static
   * @param {Array} a
   * @returns {Array}
   */
		dropRight: function dropRight(a) {
			assert.argumentIsArray(a, 'a');

			var returnRef = Array.from(a);

			if (returnRef.length !== 0) {
				returnRef.pop();
			}

			return returnRef;
		},


		/**
   * Returns the first item from an array, or an undefined value, if the
   * array is empty.
   *
   * @static
   * @param {Array} a
   * @returns {*|undefined}
   */
		first: function first(a) {
			assert.argumentIsArray(a, 'a');

			var returnRef = void 0;

			if (a.length !== 0) {
				returnRef = a[0];
			} else {
				returnRef = undefined;
			}

			return returnRef;
		},


		/**
   * Returns the last item from an array, or an undefined value, if the
   * array is empty.
   *
   * @static
   * @param {Array} a
   * @returns {*|undefined}
   */
		last: function last(a) {
			assert.argumentIsArray(a, 'a');

			var returnRef = void 0;

			if (a.length !== 0) {
				returnRef = a[a.length - 1];
			} else {
				returnRef = undefined;
			}

			return returnRef;
		},


		/**
   * Returns a copy of an array, replacing any item that is itself an array
   * with the item's items.
   *
   * @static
   * @param {Array} a
   * @param {Boolean=} recursive - If true, all nested arrays will be flattened.
   * @returns {Array}
   */
		flatten: function flatten(a, recursive) {
			assert.argumentIsArray(a, 'a');
			assert.argumentIsOptional(recursive, 'recursive', Boolean);

			var empty = [];

			var flat = empty.concat.apply(empty, a);

			if (recursive && flat.some(function (x) {
				return is.array(x);
			})) {
				flat = this.flatten(flat, true);
			}

			return flat;
		},


		/**
   * Breaks an array into smaller arrays, returning an array of arrays.
   *
   * @static
   * @param {Array} a
   * @param {Number} size - The maximum number of items per partition.
   * @param {Array<Array>}
   */
		partition: function partition(a, size) {
			assert.argumentIsArray(a, 'a');
			assert.argumentIsOptional(size, 'size', Number);

			var copy = a.slice(0);
			var partitions = [];

			while (copy.length !== 0) {
				partitions.push(copy.splice(0, size));
			}

			return partitions;
		},


		/**
   * Set difference operation (using strict equality).
   *
   * @static
   * @param {Array} a
   * @param {Array} b
   * @returns {Array}
   */
		difference: function difference(a, b) {
			return this.differenceBy(a, b, function (item) {
				return item;
			});
		},


		/**
   * Set difference operation, where the uniqueness is determined by a delegate.
   *
   * @static
   * @param {Array} a
   * @param {Array} b
   * @param {Function} keySelector - A function that returns a unique key for an item.
   * @returns {Array}
   */
		differenceBy: function differenceBy(a, b, keySelector) {
			assert.argumentIsArray(a, 'a');
			assert.argumentIsArray(b, 'b');
			assert.argumentIsRequired(keySelector, 'keySelector', Function);

			var returnRef = [];

			a.forEach(function (candidate) {
				var exclude = b.some(function (comparison) {
					return keySelector(candidate) === keySelector(comparison);
				});

				if (!exclude) {
					returnRef.push(candidate);
				}
			});

			return returnRef;
		},


		/**
   * Set symmetric difference operation (using strict equality). In
   * other words, this is the union of the differences between the
   * sets.
   *
   * @static
   * @param {Array} a
   * @param {Array} b
   * @returns {Array}
   */
		differenceSymmetric: function differenceSymmetric(a, b) {
			return this.differenceSymmetricBy(a, b, function (item) {
				return item;
			});
		},


		/**
   * Set symmetric difference operation, where the uniqueness is determined by a delegate.
   *
   * @static
   * @param {Array} a
   * @param {Array} b
   * @param {Function} keySelector - A function that returns a unique key for an item.
   * @returns {Array}
   */
		differenceSymmetricBy: function differenceSymmetricBy(a, b, keySelector) {
			return this.unionBy(this.differenceBy(a, b, keySelector), this.differenceBy(b, a, keySelector), keySelector);
		},


		/**
   * Set union operation (using strict equality).
   *
   * @static
   * @param {Array} a
   * @param {Array} b
   * @returns {Array}
   */
		union: function union(a, b) {
			return this.unionBy(a, b, function (item) {
				return item;
			});
		},


		/**
   * Set union operation, where the uniqueness is determined by a delegate.
   *
   * @static
   * @param {Array} a
   * @param {Array} b
   * @param {Function} keySelector - A function that returns a unique key for an item.
   * @returns {Array}
   */
		unionBy: function unionBy(a, b, keySelector) {
			assert.argumentIsArray(a, 'a');
			assert.argumentIsArray(b, 'b');
			assert.argumentIsRequired(keySelector, 'keySelector', Function);

			var returnRef = a.slice();

			b.forEach(function (candidate) {
				var exclude = returnRef.some(function (comparison) {
					return keySelector(candidate) === keySelector(comparison);
				});

				if (!exclude) {
					returnRef.push(candidate);
				}
			});

			return returnRef;
		},


		/**
   * Set intersection operation (using strict equality).
   *
   * @static
   * @param {Array} a
   * @param {Array} b
   * @returns {Array}
   */
		intersection: function intersection(a, b) {
			return this.intersectionBy(a, b, function (item) {
				return item;
			});
		},


		/**
   * Set intersection operation, where the uniqueness is determined by a delegate.
   *
   * @static
   * @param {Array} a
   * @param {Array} b
   * @param {Function} keySelector - A function that returns a unique key for an item.
   * @returns {Array}
   */
		intersectionBy: function intersectionBy(a, b, keySelector) {
			assert.argumentIsArray(a, 'a');
			assert.argumentIsArray(b, 'b');

			var returnRef = [];

			a.forEach(function (candidate) {
				var include = b.some(function (comparison) {
					return keySelector(candidate) === comparison;
				});

				if (include) {
					returnRef.push(candidate);
				}
			});

			return returnRef;
		},


		/**
   * Removes the first item from an array which matches a predicate.
   *
   * @static
   * @public
   * @param {Array} a
   * @param {Function} predicate
   * @returns {Boolean}
   */
		remove: function remove(a, predicate) {
			assert.argumentIsArray(a, 'a');
			assert.argumentIsRequired(predicate, 'predicate', Function);

			var index = a.findIndex(predicate);
			var found = !(index < 0);

			if (found) {
				a.splice(index, 1);
			}

			return found;
		}
	};
}();

},{"./assert":24,"./is":26}],24:[function(require,module,exports){
'use strict';

var is = require('./is');

module.exports = function () {
	'use strict';

	function checkArgumentType(variable, variableName, type, typeDescription, index) {
		if (type === String) {
			if (!is.string(variable)) {
				throwInvalidTypeError(variableName, 'string', index);
			}
		} else if (type === Number) {
			if (!is.number(variable)) {
				throwInvalidTypeError(variableName, 'number', index);
			}
		} else if (type === Function) {
			if (!is.fn(variable)) {
				throwInvalidTypeError(variableName, 'function', index);
			}
		} else if (type === Boolean) {
			if (!is.boolean(variable)) {
				throwInvalidTypeError(variableName, 'boolean', index);
			}
		} else if (type === Date) {
			if (!is.date(variable)) {
				throwInvalidTypeError(variableName, 'date', index);
			}
		} else if (type === Array) {
			if (!is.array(variable)) {
				throwInvalidTypeError(variableName, 'array', index);
			}
		} else if (!(variable instanceof (type || Object))) {
			throwInvalidTypeError(variableName, typeDescription, index);
		}
	}

	function throwInvalidTypeError(variableName, typeDescription, index) {
		var message = void 0;

		if (typeof index === 'number') {
			message = 'The argument [ ' + (variableName || 'unspecified') + ' ], at index [ ' + index.toString() + ' ] must be a [ ' + (typeDescription || 'unknown') + ' ]';
		} else {
			message = 'The argument [ ' + (variableName || 'unspecified') + ' ] must be a [ ' + (typeDescription || 'Object') + ' ]';
		}

		throw new Error(message);
	}

	function throwCustomValidationError(variableName, predicateDescription) {
		throw new Error('The argument [ ' + (variableName || 'unspecified') + ' ] failed a validation check [ ' + (predicateDescription || 'No description available') + ' ]');
	}

	/**
  * Utilities checking arguments.
  *
  * @public
  * @module lang/assert
  */
	return {
		/**
   * Throws an error if an argument doesn't conform to the desired specification (as
   * determined by a type check).
   *
   * @static
   * @param {*} variable - The value to check.
   * @param {String} variableName - The name of the value (used for formatting an error message).
   * @param {*} type - The expected type of the argument.
   * @param {String=} typeDescription - The description of the expected type (used for formatting an error message).
   */
		argumentIsRequired: function argumentIsRequired(variable, variableName, type, typeDescription) {
			checkArgumentType(variable, variableName, type, typeDescription);
		},


		/**
   * A relaxed version of the "argumentIsRequired" function that will not throw if
   * the value is undefined or null.
   *
   * @static
   * @param {*} variable - The value to check.
   * @param {String} variableName - The name of the value (used for formatting an error message).
   * @param {*} type - The expected type of the argument.
   * @param {String=} typeDescription - The description of the expected type (used for formatting an error message).
   */
		argumentIsOptional: function argumentIsOptional(variable, variableName, type, typeDescription, predicate, predicateDescription) {
			if (variable === null || variable === undefined) {
				return;
			}

			checkArgumentType(variable, variableName, type, typeDescription);

			if (is.fn(predicate) && !predicate(variable)) {
				throwCustomValidationError(variableName, predicateDescription);
			}
		},
		argumentIsArray: function argumentIsArray(variable, variableName, itemConstraint, itemConstraintDescription) {
			this.argumentIsRequired(variable, variableName, Array);

			if (itemConstraint) {
				var itemValidator = void 0;

				if (typeof itemConstraint === 'function' && itemConstraint !== Function) {
					itemValidator = function itemValidator(value, index) {
						return value instanceof itemConstraint || itemConstraint(value, variableName + '[' + index + ']');
					};
				} else {
					itemValidator = function itemValidator(value, index) {
						return checkArgumentType(value, variableName, itemConstraint, itemConstraintDescription, index);
					};
				}

				variable.forEach(function (v, i) {
					itemValidator(v, i);
				});
			}
		},


		/**
   * Throws an error if an argument doesn't conform to the desired specification
   * (as determined by a predicate).
   *
   * @static
   * @param {*} variable - The value to check.
   * @param {String} variableName - The name of the value (used for formatting an error message).
   * @param {Function=} predicate - A function used to validate the item (beyond type checking).
   * @param {String=} predicateDescription - A description of the assertion made by the predicate (e.g. "is an integer") that is used for formatting an error message.
   */
		argumentIsValid: function argumentIsValid(variable, variableName, predicate, predicateDescription) {
			if (!predicate(variable)) {
				throwCustomValidationError(variableName, predicateDescription);
			}
		},
		areEqual: function areEqual(a, b, descriptionA, descriptionB) {
			if (a !== b) {
				throw new Error('The objects must be equal [' + (descriptionA || a.toString()) + '] and [' + (descriptionB || b.toString()) + ']');
			}
		},
		areNotEqual: function areNotEqual(a, b, descriptionA, descriptionB) {
			if (a === b) {
				throw new Error('The objects cannot be equal [' + (descriptionA || a.toString()) + '] and [' + (descriptionB || b.toString()) + ']');
			}
		}
	};
}();

},{"./is":26}],25:[function(require,module,exports){
'use strict';

module.exports = function () {
	'use strict';

	return {
		/**
   * Formats a number into a string for display purposes.
   */
		numberToString: function numberToString(value, digits, thousandsSeparator, useParenthesis) {
			if (value === '' || value === undefined || value === null || isNaN(value)) {
				return '';
			}

			var applyParenthesis = value < 0 && useParenthesis === true;

			if (applyParenthesis) {
				value = 0 - value;
			}

			var returnRef = value.toFixed(digits);

			if (thousandsSeparator && !(value > -1000 && value < 1000)) {
				var length = returnRef.length;
				var negative = value < 0;

				var found = digits === 0;
				var counter = 0;

				var buffer = [];

				for (var i = length - 1; !(i < 0); i--) {
					if (counter === 3 && !(negative && i === 0)) {
						buffer.unshift(thousandsSeparator);

						counter = 0;
					}

					var character = returnRef.charAt(i);

					buffer.unshift(character);

					if (found) {
						counter = counter + 1;
					} else if (character === '.') {
						found = true;
					}
				}

				if (applyParenthesis) {
					buffer.unshift('(');
					buffer.push(')');
				}

				returnRef = buffer.join('');
			} else if (applyParenthesis) {
				returnRef = '(' + returnRef + ')';
			}

			return returnRef;
		}
	};
}();

},{}],26:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function () {
	'use strict';

	/**
  * Utilities for interrogating variables (e.g. checking data types).
  *
  * @public
  * @module lang/is
  */

	return {
		/**
   * Returns true, if the argument is a number. NaN will return false.
   *
   * @static
   * @public
   * @param {*} candidate {*}
   * @returns {boolean}
   */
		number: function number(candidate) {
			return typeof candidate === 'number' && !isNaN(candidate);
		},


		/**
   * Returns true, if the argument is NaN.
   *
   * @static
   * @public
   * @param {*} candidate
   * @returns {boolean}
   */
		nan: function nan(candidate) {
			return typeof candidate === 'number' && isNaN(candidate);
		},


		/**
   * Returns true, if the argument is a valid 32-bit integer.
   *
   * @static
   * @public
   * @param {*} candidate
   * @returns {boolean}
   */
		integer: function integer(candidate) {
			return typeof candidate === 'number' && !isNaN(candidate) && (candidate | 0) === candidate;
		},


		/**
   * Returns true, if the argument is a valid integer (which can exceed 32 bits); however,
   * the check can fail above the value of Number.MAX_SAFE_INTEGER.
   *
   * @static
   * @public
   * @param {*) candidate
   * @returns {boolean}
   */
		large: function large(candidate) {
			return typeof candidate === 'number' && !isNaN(candidate) && isFinite(candidate) && Math.floor(candidate) === candidate;
		},


		/**
   * Returns true, if the argument is a number that is positive.
   *
   * @static
   * @public
   * @param {*} candidate
   * @returns {boolean}
   */
		positive: function positive(candidate) {
			return this.number(candidate) && candidate > 0;
		},


		/**
   * Returns true, if the argument is a number that is negative.
   *
   * @static
   * @public
   * @param {*} candidate
   * @returns {*|boolean}
   */
		negative: function negative(candidate) {
			return this.number(candidate) && candidate < 0;
		},


		/**
   * Returns true, if the argument is a string.
   *
   * @static
   * @public
   * @param {*} candidate
   * @returns {boolean}
   */
		string: function string(candidate) {
			return typeof candidate === 'string';
		},


		/**
   * Returns true, if the argument is a JavaScript Date instance.
   *
   * @static
   * @public
   * @param {*} candidate
   * @returns {boolean}
   */
		date: function date(candidate) {
			return candidate instanceof Date;
		},


		/**
   * Returns true, if the argument is a function.
   *
   * @static
   * @public
   * @param {*} candidate
   * @returns {boolean}
   */
		fn: function fn(candidate) {
			return typeof candidate === 'function';
		},


		/**
   * Returns true, if the argument is an array.
   *
   * @static
   * @public
   * @param {*} candidate
   * @returns {boolean}
   */
		array: function array(candidate) {
			return Array.isArray(candidate);
		},


		/**
   * Returns true, if the argument is a Boolean value.
   *
   * @static
   * @public
   * @param {*} candidate
   * @returns {boolean}
   */
		boolean: function boolean(candidate) {
			return typeof candidate === 'boolean';
		},


		/**
   * Returns true, if the argument is an object.
   *
   * @static
   * @public
   * @param {*} candidate
   * @returns {boolean}
   */
		object: function object(candidate) {
			return (typeof candidate === 'undefined' ? 'undefined' : _typeof(candidate)) === 'object' && candidate !== null;
		},


		/**
   * Returns true, if the argument is a null value.
   *
   * @static
   * @public
   * @param {*} candidate
   * @returns {boolean}
   */
		null: function _null(candidate) {
			return candidate === null;
		},


		/**
   * Returns true, if the argument is an undefined value.
   *
   * @static
   * @public
   * @param {*} candidate
   * @returns {boolean}
   */
		undefined: function (_undefined) {
			function undefined(_x) {
				return _undefined.apply(this, arguments);
			}

			undefined.toString = function () {
				return _undefined.toString();
			};

			return undefined;
		}(function (candidate) {
			return candidate === undefined;
		}),


		/**
   * Given two classes, determines if the "child" class extends
   * the "parent" class (without instantiation).
   *
   * @param {Function} parent
   * @param {Function} child
   * @returns {Boolean}
   */
		extension: function extension(parent, child) {
			return this.fn(parent) && this.fn(child) && child.prototype instanceof parent;
		}
	};
}();

},{}],27:[function(require,module,exports){
'use strict';

var assert = require('./assert'),
    is = require('./is');

module.exports = function () {
	'use strict';

	/**
  * Utilities for caching results of function invocations (a.k.a. memoization).
  *
  * @public
  * @module lang/memoize
  */

	return {
		/**
   * Memoizes a function that accepts a single argument only. Furthermore,
   * the parameter's toString function must return a unique value.
   *
   * @static
   * @public
   * @param {Function} fn - The function to memoize. This function should accept one parameters whose "toString" function outputs a unique value.
   */
		simple: function simple(fn) {
			var cache = {};

			return function (x) {
				if (cache.hasOwnProperty(x)) {
					return cache[x];
				} else {
					return cache[x] = fn(x);
				}
			};
		},


		/**
   * Wraps a function. The resulting function will call the wrapped function
   * once and cache the result. If a specific duration is supplied, the
   * cache will be dropped after the duration expires and the wrapped
   * function will be invoked again.
   *
   * @public
   * @param {Function} fn
   * @param {Number} duration
   * @returns {Function}
   */
		cache: function cache(fn, duration) {
			assert.argumentIsRequired(fn, 'fn', Function);
			assert.argumentIsOptional(duration, 'duration', Number);

			var durationToUse = duration || 0;

			var executionTime = null;
			var cacheResult = null;

			return function () {
				var currentTime = new Date().getTime();

				if (executionTime === null || durationToUse > 0 && currentTime > executionTime + durationToUse) {
					executionTime = currentTime;

					cacheResult = fn();
				}

				return cacheResult;
			};
		}
	};
}();

},{"./assert":24,"./is":26}],28:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('./../lang/assert'),
    Disposable = require('./../lang/Disposable');

module.exports = function () {
	'use strict';

	/**
  * An implementation of the observer pattern.
  *
  * @param {*} sender - The object which owns the event.
  * @extends {Disposable}
  */

	var Event = function (_Disposable) {
		_inherits(Event, _Disposable);

		function Event(sender) {
			_classCallCheck(this, Event);

			var _this = _possibleConstructorReturn(this, (Event.__proto__ || Object.getPrototypeOf(Event)).call(this));

			_this._sender = sender || null;

			_this._observers = [];
			return _this;
		}

		/**
   * Registers an event handler which will receive a notification when
   * {@link Event#fire} is called.
   *
   * @public
   * @param {Function} handler - The function which will be called each time the event fires. The first argument will be the event data. The second argument will be the event owner (i.e. sender).
   * @returns {Disposable}
   */


		_createClass(Event, [{
			key: 'register',
			value: function register(handler) {
				var _this2 = this;

				assert.argumentIsRequired(handler, 'handler', Function);

				addRegistration.call(this, handler);

				return Disposable.fromAction(function () {
					if (_this2.getIsDisposed()) {
						return;
					}

					removeRegistration.call(_this2, handler);
				});
			}

			/**
    * Removes registration for an event handler. That is, the handler will
    * no longer be called if the event fires.
    *
    * @public
    * @param {Function} handler
    */

		}, {
			key: 'unregister',
			value: function unregister(handler) {
				assert.argumentIsRequired(handler, 'handler', Function);

				removeRegistration.call(this, handler);
			}

			/**
    * Removes all handlers from the event.
    *
    * @public
    */

		}, {
			key: 'clear',
			value: function clear() {
				this._observers = [];
			}

			/**
    * Triggers the event, calling all previously registered handlers.
    *
    * @public
    * @param {*) data - The data to pass each handler.
    */

		}, {
			key: 'fire',
			value: function fire(data) {
				var observers = this._observers;

				for (var i = 0; i < observers.length; i++) {
					var observer = observers[i];

					observer(data, this._sender);
				}
			}

			/**
    * Returns true, if no handlers are currently registered.
    *
    * @returns {boolean}
    */

		}, {
			key: 'getIsEmpty',
			value: function getIsEmpty() {
				return this._observers.length === 0;
			}
		}, {
			key: '_onDispose',
			value: function _onDispose() {
				this._observers = null;
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[Event]';
			}
		}]);

		return Event;
	}(Disposable);

	function addRegistration(handler) {
		var copiedObservers = this._observers.slice();

		copiedObservers.push(handler);

		this._observers = copiedObservers;
	}

	function removeRegistration(handler) {
		var indicesToRemove = [];

		for (var i = 0; i < this._observers.length; i++) {
			var candidate = this._observers[i];

			if (candidate === handler) {
				indicesToRemove.push(i);
			}
		}

		if (indicesToRemove.length > 0) {
			var copiedObservers = this._observers.slice();

			for (var j = indicesToRemove.length - 1; !(j < 0); j--) {
				copiedObservers.splice(indicesToRemove[j], 1);
			}

			this._observers = copiedObservers;
		}
	}

	return Event;
}();

},{"./../lang/Disposable":20,"./../lang/assert":24}],29:[function(require,module,exports){
/*
 *  big.js v5.0.3
 *  A small, fast, easy-to-use library for arbitrary-precision decimal arithmetic.
 *  Copyright (c) 2017 Michael Mclaughlin <M8ch88l@gmail.com>
 *  https://github.com/MikeMcl/big.js/LICENCE
 */
;(function (GLOBAL) {
  'use strict';
  var Big,


/************************************** EDITABLE DEFAULTS *****************************************/


    // The default values below must be integers within the stated ranges.

    /*
     * The maximum number of decimal places (DP) of the results of operations involving division:
     * div and sqrt, and pow with negative exponents.
     */
    DP = 20,          // 0 to MAX_DP

    /*
     * The rounding mode (RM) used when rounding to the above decimal places.
     *
     *  0  Towards zero (i.e. truncate, no rounding).       (ROUND_DOWN)
     *  1  To nearest neighbour. If equidistant, round up.  (ROUND_HALF_UP)
     *  2  To nearest neighbour. If equidistant, to even.   (ROUND_HALF_EVEN)
     *  3  Away from zero.                                  (ROUND_UP)
     */
    RM = 1,             // 0, 1, 2 or 3

    // The maximum value of DP and Big.DP.
    MAX_DP = 1E6,       // 0 to 1000000

    // The maximum magnitude of the exponent argument to the pow method.
    MAX_POWER = 1E6,    // 1 to 1000000

    /*
     * The negative exponent (NE) at and beneath which toString returns exponential notation.
     * (JavaScript numbers: -7)
     * -1000000 is the minimum recommended exponent value of a Big.
     */
    NE = -7,            // 0 to -1000000

    /*
     * The positive exponent (PE) at and above which toString returns exponential notation.
     * (JavaScript numbers: 21)
     * 1000000 is the maximum recommended exponent value of a Big.
     * (This limit is not enforced or checked.)
     */
    PE = 21,            // 0 to 1000000


/**************************************************************************************************/


    // Error messages.
    NAME = '[big.js] ',
    INVALID = NAME + 'Invalid ',
    INVALID_DP = INVALID + 'decimal places',
    INVALID_RM = INVALID + 'rounding mode',
    DIV_BY_ZERO = NAME + 'Division by zero',

    // The shared prototype object.
    P = {},
    UNDEFINED = void 0,
    NUMERIC = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;


  /*
   * Create and return a Big constructor.
   *
   */
  function _Big_() {

    /*
     * The Big constructor and exported function.
     * Create and return a new instance of a Big number object.
     *
     * n {number|string|Big} A numeric value.
     */
    function Big(n) {
      var x = this;

      // Enable constructor usage without new.
      if (!(x instanceof Big)) return n === UNDEFINED ? _Big_() : new Big(n);

      // Duplicate.
      if (n instanceof Big) {
        x.s = n.s;
        x.e = n.e;
        x.c = n.c.slice();
      } else {
        parse(x, n);
      }

      /*
       * Retain a reference to this Big constructor, and shadow Big.prototype.constructor which
       * points to Object.
       */
      x.constructor = Big;
    }

    Big.prototype = P;
    Big.DP = DP;
    Big.RM = RM;
    Big.NE = NE;
    Big.PE = PE;
    Big.version = '5.0.2';

    return Big;
  }


  /*
   * Parse the number or string value passed to a Big constructor.
   *
   * x {Big} A Big number instance.
   * n {number|string} A numeric value.
   */
  function parse(x, n) {
    var e, i, nl;

    // Minus zero?
    if (n === 0 && 1 / n < 0) n = '-0';
    else if (!NUMERIC.test(n += '')) throw Error(INVALID + 'number');

    // Determine sign.
    x.s = n.charAt(0) == '-' ? (n = n.slice(1), -1) : 1;

    // Decimal point?
    if ((e = n.indexOf('.')) > -1) n = n.replace('.', '');

    // Exponential form?
    if ((i = n.search(/e/i)) > 0) {

      // Determine exponent.
      if (e < 0) e = i;
      e += +n.slice(i + 1);
      n = n.substring(0, i);
    } else if (e < 0) {

      // Integer.
      e = n.length;
    }

    nl = n.length;

    // Determine leading zeros.
    for (i = 0; i < nl && n.charAt(i) == '0';) ++i;

    if (i == nl) {

      // Zero.
      x.c = [x.e = 0];
    } else {

      // Determine trailing zeros.
      for (; nl > 0 && n.charAt(--nl) == '0';);
      x.e = e - i - 1;
      x.c = [];

      // Convert string to array of digits without leading/trailing zeros.
      for (e = 0; i <= nl;) x.c[e++] = +n.charAt(i++);
    }

    return x;
  }


  /*
   * Round Big x to a maximum of dp decimal places using rounding mode rm.
   * Called by stringify, P.div, P.round and P.sqrt.
   *
   * x {Big} The Big to round.
   * dp {number} Integer, 0 to MAX_DP inclusive.
   * rm {number} 0, 1, 2 or 3 (DOWN, HALF_UP, HALF_EVEN, UP)
   * [more] {boolean} Whether the result of division was truncated.
   */
  function round(x, dp, rm, more) {
    var xc = x.c,
      i = x.e + dp + 1;

    if (i < xc.length) {
      if (rm === 1) {

        // xc[i] is the digit after the digit that may be rounded up.
        more = xc[i] >= 5;
      } else if (rm === 2) {
        more = xc[i] > 5 || xc[i] == 5 &&
          (more || i < 0 || xc[i + 1] !== UNDEFINED || xc[i - 1] & 1);
      } else if (rm === 3) {
        more = more || xc[i] !== UNDEFINED || i < 0;
      } else {
        more = false;
        if (rm !== 0) throw Error(INVALID_RM);
      }

      if (i < 1) {
        xc.length = 1;

        if (more) {

          // 1, 0.1, 0.01, 0.001, 0.0001 etc.
          x.e = -dp;
          xc[0] = 1;
        } else {

          // Zero.
          xc[0] = x.e = 0;
        }
      } else {

        // Remove any digits after the required decimal places.
        xc.length = i--;

        // Round up?
        if (more) {

          // Rounding up may mean the previous digit has to be rounded up.
          for (; ++xc[i] > 9;) {
            xc[i] = 0;
            if (!i--) {
              ++x.e;
              xc.unshift(1);
            }
          }
        }

        // Remove trailing zeros.
        for (i = xc.length; !xc[--i];) xc.pop();
      }
    } else if (rm < 0 || rm > 3 || rm !== ~~rm) {
      throw Error(INVALID_RM);
    }

    return x;
  }


  /*
   * Return a string representing the value of Big x in normal or exponential notation.
   * Handles P.toExponential, P.toFixed, P.toJSON, P.toPrecision, P.toString and P.valueOf.
   *
   * x {Big}
   * id? {number} Caller id.
   *         1 toExponential
   *         2 toFixed
   *         3 toPrecision
   *         4 valueOf
   * n? {number|undefined} Caller's argument.
   * k? {number|undefined}
   */
  function stringify(x, id, n, k) {
    var e, s,
      Big = x.constructor,
      z = !x.c[0];

    if (n !== UNDEFINED) {
      if (n !== ~~n || n < (id == 3) || n > MAX_DP) {
        throw Error(id == 3 ? INVALID + 'precision' : INVALID_DP);
      }

      x = new Big(x);

      // The index of the digit that may be rounded up.
      n = k - x.e;

      // Round?
      if (x.c.length > ++k) round(x, n, Big.RM);

      // toFixed: recalculate k as x.e may have changed if value rounded up.
      if (id == 2) k = x.e + n + 1;

      // Append zeros?
      for (; x.c.length < k;) x.c.push(0);
    }

    e = x.e;
    s = x.c.join('');
    n = s.length;

    // Exponential notation?
    if (id != 2 && (id == 1 || id == 3 && k <= e || e <= Big.NE || e >= Big.PE)) {
      s = s.charAt(0) + (n > 1 ? '.' + s.slice(1) : '') + (e < 0 ? 'e' : 'e+') + e;

    // Normal notation.
    } else if (e < 0) {
      for (; ++e;) s = '0' + s;
      s = '0.' + s;
    } else if (e > 0) {
      if (++e > n) for (e -= n; e--;) s += '0';
      else if (e < n) s = s.slice(0, e) + '.' + s.slice(e);
    } else if (n > 1) {
      s = s.charAt(0) + '.' + s.slice(1);
    }

    return x.s < 0 && (!z || id == 4) ? '-' + s : s;
  }


  // Prototype/instance methods


  /*
   * Return a new Big whose value is the absolute value of this Big.
   */
  P.abs = function () {
    var x = new this.constructor(this);
    x.s = 1;
    return x;
  };


  /*
   * Return 1 if the value of this Big is greater than the value of Big y,
   *       -1 if the value of this Big is less than the value of Big y, or
   *        0 if they have the same value.
  */
  P.cmp = function (y) {
    var isneg,
      x = this,
      xc = x.c,
      yc = (y = new x.constructor(y)).c,
      i = x.s,
      j = y.s,
      k = x.e,
      l = y.e;

    // Either zero?
    if (!xc[0] || !yc[0]) return !xc[0] ? !yc[0] ? 0 : -j : i;

    // Signs differ?
    if (i != j) return i;

    isneg = i < 0;

    // Compare exponents.
    if (k != l) return k > l ^ isneg ? 1 : -1;

    j = (k = xc.length) < (l = yc.length) ? k : l;

    // Compare digit by digit.
    for (i = -1; ++i < j;) {
      if (xc[i] != yc[i]) return xc[i] > yc[i] ^ isneg ? 1 : -1;
    }

    // Compare lengths.
    return k == l ? 0 : k > l ^ isneg ? 1 : -1;
  };


  /*
   * Return a new Big whose value is the value of this Big divided by the value of Big y, rounded,
   * if necessary, to a maximum of Big.DP decimal places using rounding mode Big.RM.
   */
  P.div = function (y) {
    var x = this,
      Big = x.constructor,
      a = x.c,                  // dividend
      b = (y = new Big(y)).c,   // divisor
      k = x.s == y.s ? 1 : -1,
      dp = Big.DP;

    if (dp !== ~~dp || dp < 0 || dp > MAX_DP) throw Error(INVALID_DP);

    // Divisor is zero?
    if (!b[0]) throw Error(DIV_BY_ZERO);

    // Dividend is 0? Return +-0.
    if (!a[0]) return new Big(k * 0);

    var bl, bt, n, cmp, ri,
      bz = b.slice(),
      ai = bl = b.length,
      al = a.length,
      r = a.slice(0, bl),   // remainder
      rl = r.length,
      q = y,                // quotient
      qc = q.c = [],
      qi = 0,
      d = dp + (q.e = x.e - y.e) + 1;    // number of digits of the result

    q.s = k;
    k = d < 0 ? 0 : d;

    // Create version of divisor with leading zero.
    bz.unshift(0);

    // Add zeros to make remainder as long as divisor.
    for (; rl++ < bl;) r.push(0);

    do {

      // n is how many times the divisor goes into current remainder.
      for (n = 0; n < 10; n++) {

        // Compare divisor and remainder.
        if (bl != (rl = r.length)) {
          cmp = bl > rl ? 1 : -1;
        } else {
          for (ri = -1, cmp = 0; ++ri < bl;) {
            if (b[ri] != r[ri]) {
              cmp = b[ri] > r[ri] ? 1 : -1;
              break;
            }
          }
        }

        // If divisor < remainder, subtract divisor from remainder.
        if (cmp < 0) {

          // Remainder can't be more than 1 digit longer than divisor.
          // Equalise lengths using divisor with extra leading zero?
          for (bt = rl == bl ? b : bz; rl;) {
            if (r[--rl] < bt[rl]) {
              ri = rl;
              for (; ri && !r[--ri];) r[ri] = 9;
              --r[ri];
              r[rl] += 10;
            }
            r[rl] -= bt[rl];
          }

          for (; !r[0];) r.shift();
        } else {
          break;
        }
      }

      // Add the digit n to the result array.
      qc[qi++] = cmp ? n : ++n;

      // Update the remainder.
      if (r[0] && cmp) r[rl] = a[ai] || 0;
      else r = [a[ai]];

    } while ((ai++ < al || r[0] !== UNDEFINED) && k--);

    // Leading zero? Do not remove if result is simply zero (qi == 1).
    if (!qc[0] && qi != 1) {

      // There can't be more than one zero.
      qc.shift();
      q.e--;
    }

    // Round?
    if (qi > d) round(q, dp, Big.RM, r[0] !== UNDEFINED);

    return q;
  };


  /*
   * Return true if the value of this Big is equal to the value of Big y, otherwise return false.
   */
  P.eq = function (y) {
    return !this.cmp(y);
  };


  /*
   * Return true if the value of this Big is greater than the value of Big y, otherwise return
   * false.
   */
  P.gt = function (y) {
    return this.cmp(y) > 0;
  };


  /*
   * Return true if the value of this Big is greater than or equal to the value of Big y, otherwise
   * return false.
   */
  P.gte = function (y) {
    return this.cmp(y) > -1;
  };


  /*
   * Return true if the value of this Big is less than the value of Big y, otherwise return false.
   */
  P.lt = function (y) {
    return this.cmp(y) < 0;
  };


  /*
   * Return true if the value of this Big is less than or equal to the value of Big y, otherwise
   * return false.
   */
  P.lte = function (y) {
    return this.cmp(y) < 1;
  };


  /*
   * Return a new Big whose value is the value of this Big minus the value of Big y.
   */
  P.minus = P.sub = function (y) {
    var i, j, t, xlty,
      x = this,
      Big = x.constructor,
      a = x.s,
      b = (y = new Big(y)).s;

    // Signs differ?
    if (a != b) {
      y.s = -b;
      return x.plus(y);
    }

    var xc = x.c.slice(),
      xe = x.e,
      yc = y.c,
      ye = y.e;

    // Either zero?
    if (!xc[0] || !yc[0]) {

      // y is non-zero? x is non-zero? Or both are zero.
      return yc[0] ? (y.s = -b, y) : new Big(xc[0] ? x : 0);
    }

    // Determine which is the bigger number. Prepend zeros to equalise exponents.
    if (a = xe - ye) {

      if (xlty = a < 0) {
        a = -a;
        t = xc;
      } else {
        ye = xe;
        t = yc;
      }

      t.reverse();
      for (b = a; b--;) t.push(0);
      t.reverse();
    } else {

      // Exponents equal. Check digit by digit.
      j = ((xlty = xc.length < yc.length) ? xc : yc).length;

      for (a = b = 0; b < j; b++) {
        if (xc[b] != yc[b]) {
          xlty = xc[b] < yc[b];
          break;
        }
      }
    }

    // x < y? Point xc to the array of the bigger number.
    if (xlty) {
      t = xc;
      xc = yc;
      yc = t;
      y.s = -y.s;
    }

    /*
     * Append zeros to xc if shorter. No need to add zeros to yc if shorter as subtraction only
     * needs to start at yc.length.
     */
    if ((b = (j = yc.length) - (i = xc.length)) > 0) for (; b--;) xc[i++] = 0;

    // Subtract yc from xc.
    for (b = i; j > a;) {
      if (xc[--j] < yc[j]) {
        for (i = j; i && !xc[--i];) xc[i] = 9;
        --xc[i];
        xc[j] += 10;
      }

      xc[j] -= yc[j];
    }

    // Remove trailing zeros.
    for (; xc[--b] === 0;) xc.pop();

    // Remove leading zeros and adjust exponent accordingly.
    for (; xc[0] === 0;) {
      xc.shift();
      --ye;
    }

    if (!xc[0]) {

      // n - n = +0
      y.s = 1;

      // Result must be zero.
      xc = [ye = 0];
    }

    y.c = xc;
    y.e = ye;

    return y;
  };


  /*
   * Return a new Big whose value is the value of this Big modulo the value of Big y.
   */
  P.mod = function (y) {
    var ygtx,
      x = this,
      Big = x.constructor,
      a = x.s,
      b = (y = new Big(y)).s;

    if (!y.c[0]) throw Error(DIV_BY_ZERO);

    x.s = y.s = 1;
    ygtx = y.cmp(x) == 1;
    x.s = a;
    y.s = b;

    if (ygtx) return new Big(x);

    a = Big.DP;
    b = Big.RM;
    Big.DP = Big.RM = 0;
    x = x.div(y);
    Big.DP = a;
    Big.RM = b;

    return this.minus(x.times(y));
  };


  /*
   * Return a new Big whose value is the value of this Big plus the value of Big y.
   */
  P.plus = P.add = function (y) {
    var t,
      x = this,
      Big = x.constructor,
      a = x.s,
      b = (y = new Big(y)).s;

    // Signs differ?
    if (a != b) {
      y.s = -b;
      return x.minus(y);
    }

    var xe = x.e,
      xc = x.c,
      ye = y.e,
      yc = y.c;

    // Either zero? y is non-zero? x is non-zero? Or both are zero.
    if (!xc[0] || !yc[0]) return yc[0] ? y : new Big(xc[0] ? x : a * 0);

    xc = xc.slice();

    // Prepend zeros to equalise exponents.
    // Note: Faster to use reverse then do unshifts.
    if (a = xe - ye) {
      if (a > 0) {
        ye = xe;
        t = yc;
      } else {
        a = -a;
        t = xc;
      }

      t.reverse();
      for (; a--;) t.push(0);
      t.reverse();
    }

    // Point xc to the longer array.
    if (xc.length - yc.length < 0) {
      t = yc;
      yc = xc;
      xc = t;
    }

    a = yc.length;

    // Only start adding at yc.length - 1 as the further digits of xc can be left as they are.
    for (b = 0; a; xc[a] %= 10) b = (xc[--a] = xc[a] + yc[a] + b) / 10 | 0;

    // No need to check for zero, as +x + +y != 0 && -x + -y != 0

    if (b) {
      xc.unshift(b);
      ++ye;
    }

    // Remove trailing zeros.
    for (a = xc.length; xc[--a] === 0;) xc.pop();

    y.c = xc;
    y.e = ye;

    return y;
  };


  /*
   * Return a Big whose value is the value of this Big raised to the power n.
   * If n is negative, round to a maximum of Big.DP decimal places using rounding
   * mode Big.RM.
   *
   * n {number} Integer, -MAX_POWER to MAX_POWER inclusive.
   */
  P.pow = function (n) {
    var x = this,
      one = new x.constructor(1),
      y = one,
      isneg = n < 0;

    if (n !== ~~n || n < -MAX_POWER || n > MAX_POWER) throw Error(INVALID + 'exponent');
    if (isneg) n = -n;

    for (;;) {
      if (n & 1) y = y.times(x);
      n >>= 1;
      if (!n) break;
      x = x.times(x);
    }

    return isneg ? one.div(y) : y;
  };


  /*
   * Return a new Big whose value is the value of this Big rounded to a maximum of dp decimal
   * places using rounding mode rm.
   * If dp is not specified, round to 0 decimal places.
   * If rm is not specified, use Big.RM.
   *
   * dp? {number} Integer, 0 to MAX_DP inclusive.
   * rm? 0, 1, 2 or 3 (ROUND_DOWN, ROUND_HALF_UP, ROUND_HALF_EVEN, ROUND_UP)
   */
  P.round = function (dp, rm) {
    var Big = this.constructor;
    if (dp === UNDEFINED) dp = 0;
    else if (dp !== ~~dp || dp < 0 || dp > MAX_DP) throw Error(INVALID_DP);
    return round(new Big(this), dp, rm === UNDEFINED ? Big.RM : rm);
  };


  /*
   * Return a new Big whose value is the square root of the value of this Big, rounded, if
   * necessary, to a maximum of Big.DP decimal places using rounding mode Big.RM.
   */
  P.sqrt = function () {
    var r, c, t,
      x = this,
      Big = x.constructor,
      s = x.s,
      e = x.e,
      half = new Big(0.5);

    // Zero?
    if (!x.c[0]) return new Big(x);

    // Negative?
    if (s < 0) throw Error(NAME + 'No square root');

    // Estimate.
    s = Math.sqrt(x.toString());

    // Math.sqrt underflow/overflow?
    // Re-estimate: pass x to Math.sqrt as integer, then adjust the result exponent.
    if (s === 0 || s === 1 / 0) {
      c = x.c.join('');
      if (!(c.length + e & 1)) c += '0';
      r = new Big(Math.sqrt(c).toString());
      r.e = ((e + 1) / 2 | 0) - (e < 0 || e & 1);
    } else {
      r = new Big(s.toString());
    }

    e = r.e + (Big.DP += 4);

    // Newton-Raphson iteration.
    do {
      t = r;
      r = half.times(t.plus(x.div(t)));
    } while (t.c.slice(0, e).join('') !== r.c.slice(0, e).join(''));

    return round(r, Big.DP -= 4, Big.RM);
  };


  /*
   * Return a new Big whose value is the value of this Big times the value of Big y.
   */
  P.times = P.mul = function (y) {
    var c,
      x = this,
      Big = x.constructor,
      xc = x.c,
      yc = (y = new Big(y)).c,
      a = xc.length,
      b = yc.length,
      i = x.e,
      j = y.e;

    // Determine sign of result.
    y.s = x.s == y.s ? 1 : -1;

    // Return signed 0 if either 0.
    if (!xc[0] || !yc[0]) return new Big(y.s * 0);

    // Initialise exponent of result as x.e + y.e.
    y.e = i + j;

    // If array xc has fewer digits than yc, swap xc and yc, and lengths.
    if (a < b) {
      c = xc;
      xc = yc;
      yc = c;
      j = a;
      a = b;
      b = j;
    }

    // Initialise coefficient array of result with zeros.
    for (c = new Array(j = a + b); j--;) c[j] = 0;

    // Multiply.

    // i is initially xc.length.
    for (i = b; i--;) {
      b = 0;

      // a is yc.length.
      for (j = a + i; j > i;) {

        // Current sum of products at this digit position, plus carry.
        b = c[j] + yc[i] * xc[j - i - 1] + b;
        c[j--] = b % 10;

        // carry
        b = b / 10 | 0;
      }

      c[j] = (c[j] + b) % 10;
    }

    // Increment result exponent if there is a final carry, otherwise remove leading zero.
    if (b) ++y.e;
    else c.shift();

    // Remove trailing zeros.
    for (i = c.length; !c[--i];) c.pop();
    y.c = c;

    return y;
  };


  /*
   * Return a string representing the value of this Big in exponential notation to dp fixed decimal
   * places and rounded using Big.RM.
   *
   * dp? {number} Integer, 0 to MAX_DP inclusive.
   */
  P.toExponential = function (dp) {
    return stringify(this, 1, dp, dp);
  };


  /*
   * Return a string representing the value of this Big in normal notation to dp fixed decimal
   * places and rounded using Big.RM.
   *
   * dp? {number} Integer, 0 to MAX_DP inclusive.
   *
   * (-0).toFixed(0) is '0', but (-0.1).toFixed(0) is '-0'.
   * (-0).toFixed(1) is '0.0', but (-0.01).toFixed(1) is '-0.0'.
   */
  P.toFixed = function (dp) {
    return stringify(this, 2, dp, this.e + dp);
  };


  /*
   * Return a string representing the value of this Big rounded to sd significant digits using
   * Big.RM. Use exponential notation if sd is less than the number of digits necessary to represent
   * the integer part of the value in normal notation.
   *
   * sd {number} Integer, 1 to MAX_DP inclusive.
   */
  P.toPrecision = function (sd) {
    return stringify(this, 3, sd, sd - 1);
  };


  /*
   * Return a string representing the value of this Big.
   * Return exponential notation if this Big has a positive exponent equal to or greater than
   * Big.PE, or a negative exponent equal to or less than Big.NE.
   * Omit the sign for negative zero.
   */
  P.toString = function () {
    return stringify(this);
  };


  /*
   * Return a string representing the value of this Big.
   * Return exponential notation if this Big has a positive exponent equal to or greater than
   * Big.PE, or a negative exponent equal to or less than Big.NE.
   * Include the sign for negative zero.
   */
  P.valueOf = P.toJSON = function () {
    return stringify(this, 4);
  };


  // Export


  Big = _Big_();

  Big['default'] = Big.Big = Big;

  //AMD.
  if (typeof define === 'function' && define.amd) {
    define(function () { return Big; });

  // Node and other CommonJS-like environments that support module.exports.
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = Big;

  //Browser.
  } else {
    GLOBAL.Big = Big;
  }
})(this);

},{}],30:[function(require,module,exports){
var v1 = require('./v1');
var v4 = require('./v4');

var uuid = v4;
uuid.v1 = v1;
uuid.v4 = v4;

module.exports = uuid;

},{"./v1":33,"./v4":34}],31:[function(require,module,exports){
/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  return bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

module.exports = bytesToUuid;

},{}],32:[function(require,module,exports){
(function (global){
// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection
var rng;

var crypto = global.crypto || global.msCrypto; // for IE 11
if (crypto && crypto.getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef
  rng = function whatwgRNG() {
    crypto.getRandomValues(rnds8);
    return rnds8;
  };
}

if (!rng) {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);
  rng = function() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}

module.exports = rng;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],33:[function(require,module,exports){
var rng = require('./lib/rng');
var bytesToUuid = require('./lib/bytesToUuid');

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

// random #'s we need to init node and clockseq
var _seedBytes = rng();

// Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
var _nodeId = [
  _seedBytes[0] | 0x01,
  _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
];

// Per 4.2.2, randomize (14 bit) clockseq
var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

// Previous uuid creation time
var _lastMSecs = 0, _lastNSecs = 0;

// See https://github.com/broofa/node-uuid for API details
function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};

  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  var node = options.node || _nodeId;
  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : bytesToUuid(b);
}

module.exports = v1;

},{"./lib/bytesToUuid":31,"./lib/rng":32}],34:[function(require,module,exports){
var rng = require('./lib/rng');
var bytesToUuid = require('./lib/bytesToUuid');

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options == 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;

},{"./lib/bytesToUuid":31,"./lib/rng":32}],35:[function(require,module,exports){
const Day = require('@barchart/common-js/lang/Day'),
	Decimal = require('@barchart/common-js/lang/Decimal');

const PositionSummaryFrame = require('./../../../lib/data/PositionSummaryFrame'),
	TransactionType = require('./../../../lib/data/TransactionType');

describe('After the PositionSummaryFrame enumeration is initialized', () => {
	'use strict';

	describe('and yearly position summary ranges are processed for a transaction set that does not close', () => {
		let ranges;

		beforeEach(() => {
			const transactions = [
				{
					date: new Day(2015, 10, 20),
					snapshot: {
						open: new Decimal(1)
					},
					type: TransactionType.BUY
				},
				{
					date: new Day(2016, 11, 21),
					snapshot: {
						open: new Decimal(1)
					},
					type: TransactionType.BUY
				}
			];

			ranges = PositionSummaryFrame.YEARLY.getRanges(transactions);
		});

		it('should have three ranges (assuming the current year is 2018)', () => {
			expect(ranges.length).toEqual(3);
		});

		it('the first range should be from 12-31-2014 to 12-31-2015', () => {
			expect(ranges[0].start.format()).toEqual('2014-12-31');
			expect(ranges[0].end.format()).toEqual('2015-12-31');
		});

		it('the second range should be from 12-31-2015 to 12-31-2016', () => {
			expect(ranges[1].start.format()).toEqual('2015-12-31');
			expect(ranges[1].end.format()).toEqual('2016-12-31');
		});

		it('the third range should be from 12-31-2016 to 12-31-2017', () => {
			expect(ranges[2].start.format()).toEqual('2016-12-31');
			expect(ranges[2].end.format()).toEqual('2017-12-31');
		});
	});

	describe('and yearly position summary ranges are processed for a transaction set closes the same year', () => {
		let ranges;

		beforeEach(() => {
			const transactions = [
				{
					date: new Day(2015, 10, 20),
					snapshot: {
						open: new Decimal(1)
					},
					type: TransactionType.BUY
				},
				{
					date: new Day(2015, 11, 21),
					snapshot: {
						open: new Decimal(0)
					},
					type: TransactionType.SELL
				}
			];

			ranges = PositionSummaryFrame.YEARLY.getRanges(transactions);
		});

		it('should have one range', () => {
			expect(ranges.length).toEqual(1);
		});

		it('the first range should be from 12-31-2014 to 12-31-2015', () => {
			expect(ranges[0].start.format()).toEqual('2014-12-31');
			expect(ranges[0].end.format()).toEqual('2015-12-31');
		});
	});

	describe('and yearly position summary ranges are processed for a transaction set closes the next year', () => {
		let ranges;

		beforeEach(() => {
			const transactions = [
				{
					date: new Day(2015, 10, 20),
					snapshot: {
						open: new Decimal(1)
					},
					type: TransactionType.BUY
				},
				{
					date: new Day(2016, 11, 21),
					snapshot: {
						open: new Decimal(0)
					},
					type: TransactionType.SELL
				}
			];

			ranges = PositionSummaryFrame.YEARLY.getRanges(transactions);
		});

		it('should have two ranges', () => {
			expect(ranges.length).toEqual(2);
		});

		it('the first range should be from 12-31-2014 to 12-31-2015', () => {
			expect(ranges[0].start.format()).toEqual('2014-12-31');
			expect(ranges[0].end.format()).toEqual('2015-12-31');
		});

		it('the second range should be from 12-31-2015 to 12-31-2016', () => {
			expect(ranges[1].start.format()).toEqual('2015-12-31');
			expect(ranges[1].end.format()).toEqual('2016-12-31');
		});
	});

	describe('and yearly position summary ranges are processed for a transaction set closes in the current next year -- assuming its 2018', () => {
		let ranges;

		beforeEach(() => {
			const transactions = [
				{
					date: new Day(2015, 10, 20),
					snapshot: {
						open: new Decimal(1)
					},
					type: TransactionType.BUY
				},
				{
					date: new Day(2017, 11, 21),
					snapshot: {
						open: new Decimal(0)
					},
					type: TransactionType.SELL
				}
			];

			ranges = PositionSummaryFrame.YEARLY.getRanges(transactions);
		});

		it('should have two ranges', () => {
			expect(ranges.length).toEqual(3);
		});

		it('the first range should be from 12-31-2014 to 12-31-2015', () => {
			expect(ranges[0].start.format()).toEqual('2014-12-31');
			expect(ranges[0].end.format()).toEqual('2015-12-31');
		});

		it('the second range should be from 12-31-2015 to 12-31-2016', () => {
			expect(ranges[1].start.format()).toEqual('2015-12-31');
			expect(ranges[1].end.format()).toEqual('2016-12-31');
		});

		it('the third range should be from 12-31-2015 to 12-31-2016', () => {
			expect(ranges[2].start.format()).toEqual('2016-12-31');
			expect(ranges[2].end.format()).toEqual('2017-12-31');
		});
	});

	describe('and yearly position summary ranges are processed for a transaction set closed in 2016, but has after-the-fact superfluous valuations in 2017 and 2018', () => {
		let ranges;

		beforeEach(() => {
			const transactions = [
				{
					date: new Day(2015, 10, 20),
					snapshot: {
						open: new Decimal(1)
					},
					type: TransactionType.BUY
				},
				{
					date: new Day(2016, 11, 21),
					snapshot: {
						open: new Decimal(0)
					},
					type: TransactionType.SELL
				},
				{
					date: new Day(2017, 11, 21),
					snapshot: {
						open: new Decimal(0)
					},
					type: TransactionType.VALUATION
				},
				{
					date: new Day(2017, 11, 21),
					snapshot: {
						open: new Decimal(0)
					},
					type: TransactionType.VALUATION
				}
			];

			ranges = PositionSummaryFrame.YEARLY.getRanges(transactions);
		});

		it('should have two ranges', () => {
			expect(ranges.length).toEqual(2);
		});

		it('the first range should be from 12-31-2014 to 12-31-2015', () => {
			expect(ranges[0].start.format()).toEqual('2014-12-31');
			expect(ranges[0].end.format()).toEqual('2015-12-31');
		});

		it('the second range should be from 12-31-2015 to 12-31-2016', () => {
			expect(ranges[1].start.format()).toEqual('2015-12-31');
			expect(ranges[1].end.format()).toEqual('2016-12-31');
		});
	});

	describe('and a year-to-date position summary ranges are processed for a transaction set that closed last year', () => {
		let ranges;

		beforeEach(() => {
			const transactions = [
				{
					date: new Day(2017, 1, 1),
					snapshot: {
						open: new Decimal(1)
					},
					type: TransactionType.BUY
				},
				{
					date: new Day(2017, 1, 2),
					snapshot: {
						open: new Decimal(0)
					},
					type: TransactionType.SELL
				}
			];

			ranges = PositionSummaryFrame.YTD.getRanges(transactions);
		});

		it('should have no ranges', () => {
			expect(ranges.length).toEqual(0);
		});
	});

	describe('and a year-to-date position summary ranges are processed for a transaction set that opened this year and has not yet closed', () => {
		let ranges;

		beforeEach(() => {
			const transactions = [
				{
					date: new Day(2018, 1, 1),
					snapshot: {
						open: new Decimal(100)
					},
					type: TransactionType.BUY
				}
			];

			ranges = PositionSummaryFrame.YTD.getRanges(transactions);
		});

		it('should have one range', () => {
			expect(ranges.length).toEqual(1);
		});

		it('the first range should be from 12-31-2017 to 12-31-2015', () => {
			expect(ranges[0].start.format()).toEqual('2017-12-31');
			expect(ranges[0].end.format()).toEqual('2018-12-31');
		});
	});

	describe('and a year-to-date position summary ranges are processed for a transaction set that opened and closed this year', () => {
		let ranges;

		beforeEach(() => {
			const transactions = [
				{
					date: new Day(2018, 1, 1),
					snapshot: {
						open: new Decimal(1)
					},
					type: TransactionType.BUY
				},
				{
					date: new Day(2018, 1, 2),
					snapshot: {
						open: new Decimal(0)
					},
					type: TransactionType.SELL
				}
			];

			ranges = PositionSummaryFrame.YTD.getRanges(transactions);
		});

		it('should have one range', () => {
			expect(ranges.length).toEqual(1);
		});

		it('the first range should be from 12-31-2017 to 12-31-2015', () => {
			expect(ranges[0].start.format()).toEqual('2017-12-31');
			expect(ranges[0].end.format()).toEqual('2018-12-31');
		});
	});

	describe('and getting the start date for yearly frames', () => {
		describe('for one year ago', function() {
			let start;

			beforeEach(() => {
				start = PositionSummaryFrame.YEARLY.getStartDate(1);
			});

			it('should be in December', () => {
				expect(start.month).toEqual(12);
			});

			it('should be on the 31st', () => {
				expect(start.day).toEqual(31);
			});

			it('should be two years ago', () => {
				expect(start.year).toEqual(Day.getToday().year - 2);
			});
		});

		describe('for two years ago', function() {
			let start;

			beforeEach(() => {
				start = PositionSummaryFrame.YEARLY.getStartDate(2);
			});

			it('should be in December', () => {
				expect(start.month).toEqual(12);
			});

			it('should be on the 31st', () => {
				expect(start.day).toEqual(31);
			});

			it('should be two years ago', () => {
				expect(start.year).toEqual(Day.getToday().year - 3);
			});
		});
	});
});

},{"./../../../lib/data/PositionSummaryFrame":3,"./../../../lib/data/TransactionType":4,"@barchart/common-js/lang/Day":18,"@barchart/common-js/lang/Decimal":19}],36:[function(require,module,exports){
const Day = require('@barchart/common-js/lang/Day');

const TransactionValidator = require('./../../../lib/data/TransactionValidator');

describe('When validating transaction order', () => {
	'use strict';

	const build = (sequence, day) => {
		return { sequence: sequence, date: Day.parse(day) };
	};

	it('An array of zero transactions should be valid', () => {
		expect(TransactionValidator.validateOrder([])).toEqual(true);
	});

	it('An array of transactions with ordered sequences, on the same day should be valid', () => {
		expect(TransactionValidator.validateOrder([ build(1, '2018-04-30'), build(2, '2018-04-30'), build(3, '2018-04-30') ])).toEqual(true);
	});

	it('An array of transactions with ordered sequences, on the sequential days should be valid', () => {
		expect(TransactionValidator.validateOrder([ build(1, '2018-04-30'), build(2, '2018-05-01'), build(3, '2018-05-02') ])).toEqual(true);
	});

	it('An array of transactions with ordered sequences (starting after one), on the same day should not be valid', () => {
		expect(TransactionValidator.validateOrder([ build(3, '2018-04-30'), build(4, '2018-04-30'), build(5, '2018-04-30') ])).toEqual(false);
	});

	it('An array of transactions with duplicate sequences, on the same day should not be valid', () => {
		expect(TransactionValidator.validateOrder([ build(1, '2018-04-30'), build(1, '2018-04-30') ])).toEqual(false);
	});

	it('An array of transactions with with a gap in sequences, on the same day should not be valid', () => {
		expect(TransactionValidator.validateOrder([ build(1, '2018-04-30'), build(3, '2018-04-30') ])).toEqual(false);
	});

	it('An array of transactions with with a reversed sequences, on the same subsequent days should not be valid', () => {
		expect(TransactionValidator.validateOrder([ build(2, '2018-04-30'), build(1, '2018-05-01') ])).toEqual(false);
	});

	it('An array of transactions with ordered sequences, on the reversed days should not be valid', () => {
		expect(TransactionValidator.validateOrder([ build(1, '2018-05-02'), build(2, '2018-05-01'), build(3, '2018-04-30') ])).toEqual(false);
	});
});

describe('When requesting all the user-initiated transaction types', () => {
	'use strict';

	let userInitiated;

	beforeEach(() => {
		userInitiated = TransactionValidator.getUserInitiatedTransactionTypes();
	});

	it('Only nine types should be returned', () => {
		expect(userInitiated.length).toEqual(9);
	});
});

describe('When validating direction', () => {
	'use strict';


});

},{"./../../../lib/data/TransactionValidator":5,"@barchart/common-js/lang/Day":18}],37:[function(require,module,exports){
const Currency = require('@barchart/common-js/lang/Currency'),
	Decimal = require('@barchart/common-js/lang/Decimal');

const InstrumentType = require('./../../../lib/data/InstrumentType');

const PositionContainer = require('./../../../lib/processing/PositionContainer'),
	PositionLevelDefinition = require('./../../../lib/processing/definitions/PositionLevelDefinition'),
	PositionLevelType = require('./../../../lib/processing/definitions/PositionLevelType'),
	PositionTreeDefinition = require('./../../../lib/processing/definitions/PositionTreeDefinition');

describe('When a position container data is gathered', () => {
	'use strict';

	let positionCounter = 0;

	function getPosition(portfolio, symbol, currency) {
		return {
			portfolio: portfolio,
			position: (positionCounter++).toString(),
			instrument: {
				symbol: {
					barchart: symbol
				},
				currency: currency || Currency.USD,
				type: InstrumentType.EQUITY
			},
			snapshot: {
				basis: new Decimal(123),
				value: new Decimal(456),
				open: new Decimal(1),
				income: new Decimal(0),
				gain: new Decimal(0)
			}
		};
	}

	describe('for two portfolios, each with the same position, and the second portfolio with an addition position', () => {
		let portfolios;
		let positions;
		let summaries;

		beforeEach(() => {
			portfolios = [
				{
					portfolio: 'My First Portfolio',
					name: 'a'
				}, {
					portfolio: 'My Second Portfolio',
					name: 'b'
				}
			];

			positions = [
				getPosition('My First Portfolio', 'AAPL'),
				getPosition('My Second Portfolio', 'AAPL'),
				getPosition('My Second Portfolio', 'TSLA')
			];

			summaries = [ ];
		});

		describe('and a container is created grouping by total, portfolio, and instrument', () => {
			let name;
			let definitions;
			let container;

			beforeEach(() => {
				definitions = [
					new PositionTreeDefinition(name = 'the only tree', [
						new PositionLevelDefinition('Total', PositionLevelType.OTHER, x => 'totals', x => 'Total', x => Currency.CAD),
						new PositionLevelDefinition('Portfolio', PositionLevelType.PORTFOLIO, x => x.portfolio.portfolio, x => x.portfolio.name, x => Currency.CAD),
						new PositionLevelDefinition('Position', PositionLevelType.POSITION, x => x.position.position, x => x.position.instrument.symbol.barchart, x =>  x.position.instrument.currency)
					])
				];

				try {
					container = new PositionContainer(definitions, portfolios, positions, summaries);
				} catch (e) {
					console.log(e);
				}
			});

			it('the "Total" group should have two children groups', () => {
				expect(container.getGroups(name, [ 'totals' ]).length).toEqual(2);
			});

			it('the "Total" group should have three items', () => {
				expect(container.getGroup(name, [ 'totals' ]).items.length).toEqual(3);
			});

			it('The "a" portfolio group should have one child group', () => {
				expect(container.getGroups(name, [ 'totals', 'My First Portfolio' ]).length).toEqual(1);
			});

			it('the "a" portfolio group should have one item', () => {
				expect(container.getGroup(name, [ 'totals', 'My First Portfolio' ]).items.length).toEqual(1);
			});

			it('The "b" portfolio group should have two child groups', () => {
				expect(container.getGroups(name, [ 'totals', 'My Second Portfolio' ]).length).toEqual(2);
			});

			it('the "b" portfolio group should have two items', () => {
				expect(container.getGroup(name, [ 'totals', 'My Second Portfolio' ]).items.length).toEqual(2);
			});
		});
	});
});

},{"./../../../lib/data/InstrumentType":1,"./../../../lib/processing/PositionContainer":6,"./../../../lib/processing/definitions/PositionLevelDefinition":9,"./../../../lib/processing/definitions/PositionLevelType":10,"./../../../lib/processing/definitions/PositionTreeDefinition":11,"@barchart/common-js/lang/Currency":17,"@barchart/common-js/lang/Decimal":19}]},{},[35,36,37]);
