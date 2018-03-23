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
		constructor(code, description, rangeCalculator, startDateCalculator, descriptionCalculator) {
			super(code, description);

			assert.argumentIsRequired(rangeCalculator, 'rangeCalculator', Function);
			assert.argumentIsRequired(startDateCalculator, 'startDateCalculator', Function);
			assert.argumentIsRequired(descriptionCalculator, 'descriptionCalculator', Function);

			this._rangeCalculator = rangeCalculator;
			this._startDateCalculator = startDateCalculator;
			this._descriptionCalculator = descriptionCalculator;
		}

		/**
		 * Returns a human-readable description of the frame, given
		 * start and end dates.
		 *
		 * @public
		 * @param {Day} startDate
		 * @param {Day} endDate
		 * @return {String}
		 */
		describeRange(startDate, endDate) {
			return this._descriptionCalculator(startDate, endDate);
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

	const yearly = new PositionSummaryFrame('YEARLY', 'year', getYearlyRanges, getYearlyStartDate, getYearlyRangeDescription);
	const quarterly = new PositionSummaryFrame('QUARTER', 'quarter', getQuarterlyRanges, getQuarterlyStartDate, getQuarterlyRangeDescription);
	const monthly = new PositionSummaryFrame('MONTH', 'month', getMonthlyRanges, getMonthlyStartDate, getMonthlyRangeDescription);
	const ytd = new PositionSummaryFrame('YTD', 'year-to-date', getYearToDateRanges, getYearToDateStartDate, getYearToDateRangeDescription);

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

	function getYearlyRangeDescription(startDate, endDate) {
		return endDate.year.toString();
	}

	function getQuarterlyRangeDescription(startDate, endDate) {
		return '';
	}

	function getMonthlyRangeDescription(startDate, endDate) {
		return '';
	}

	function getYearToDateRangeDescription(startDate, endDate) {
		return '';
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
