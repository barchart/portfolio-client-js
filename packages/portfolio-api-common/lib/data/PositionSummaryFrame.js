const array = require('@barchart/common-js/lang/array'),
	assert = require('@barchart/common-js/lang/assert'),
	Day = require('@barchart/common-js/lang/Day'),
	Decimal = require('@barchart/common-js/lang/Decimal'),
	Enum = require('@barchart/common-js/lang/Enum');

module.exports = (() => {
	'use strict';

	/**
	 * An enumeration used to define time frames for position summaries.
	 *
	 * @public
	 * @extends {Enum}
	 * @param {String} code
	 * @param {String} description
	 * @param {Boolean} unique
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
		 * @returns {PositionSummaryRange[]}
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
		 * @param {Transaction[]} transactions
		 * @returns {PositionSummaryRange[]}
		 */
		getRanges(transactions) {
			assert.argumentIsArray(transactions, 'transactions');

			return this._rangeCalculator(getFilteredTransactions(transactions));
		}

		/**
		 * Returns the range which contains a given date and all subsequent ranges.
		 *
		 * @public
		 * @param {Day} date
		 * @returns {PositionSummaryRange[]}
		 */
		getRangesFromDate(date) {
			assert.argumentIsRequired(date, 'date', Day, 'Day');

			const transaction = { date: date, snapshot: { open: Decimal.ONE } };

			return this.getRanges([ transaction ]);
		}

		/**
		 * Returns the range immediately prior to the range containing the
		 * date supplied.
		 *
		 * @public
		 * @param {Day} date
		 * @param {Number} periods
		 * @returns {PositionSummaryRange[]}
		 */
		getPriorRanges(date, periods) {
			assert.argumentIsRequired(date, 'date', Day, 'Day');
			assert.argumentIsRequired(periods, 'periods', Number, 'Number');

			const transactionOne = { date: this.getStartDate((periods - 1), date), snapshot: { open: Decimal.ONE } };
			const transactionTwo = { date: date, snapshot: { open: Decimal.ZERO } };

			return this._rangeCalculator([ transactionOne, transactionTwo ]);
		}

		/**
		 * Returns the start date for a frame, a given number of periods ago.
		 *
		 * @public
		 * @param {Number} periods
		 * @param {Day=} start
		 * @returns {Day}
		 */
		getStartDate(periods, start) {
			assert.argumentIsRequired(periods, 'periods', Number);
			assert.argumentIsOptional(start, 'start', Day, 'Day');

			return this._startDateCalculator(periods, start);
		}

		/**
		 * A summary for a calendar year.
		 *
		 * @public
		 * @static
		 * @returns {PositionSummaryFrame}
		 */
		static get YEARLY() {
			return yearly;
		}

		/**
		 * A summary for a quarter.
		 *
		 * @public
		 * @static
		 * @returns {PositionSummaryFrame}
		 */
		static get QUARTERLY() {
			return quarterly;
		}

		/**
		 * A summary for a calendar month.
		 *
		 * @public
		 * @static
		 * @returns {PositionSummaryFrame}
		 */
		static get MONTHLY() {
			return monthly;
		}

		/**
		 * A summary the current year (to date).
		 *
		 * @public
		 * @static
		 * @returns {PositionSummaryFrame}
		 */
		static get YTD() {
			return ytd;
		}

		/**
		 * Returns the {@link PositionSummaryFrame} instance that matches the code
		 * provided.
		 *
		 * @public
		 * @static
		 * @param {String} code
		 * @returns {PositionSummaryFrame|null}
		 */
		static parse(code) {
			return Enum.fromCode(PositionSummaryFrame, code);
		}

		toString() {
			return `[PositionSummaryFrame (code=${this.code})]`;
		}
	}

	const yearly = new PositionSummaryFrame('YEARLY', 'year', false, getYearlyRanges, getYearlyStartDate, getYearlyRangeDescription);
	const quarterly = new PositionSummaryFrame('QUARTERLY', 'quarter', false, getQuarterlyRanges, getQuarterlyStartDate, getQuarterlyRangeDescription);
	const monthly = new PositionSummaryFrame('MONTHLY', 'month', false, getMonthlyRanges, getMonthlyStartDate, getMonthlyRangeDescription);
	const ytd = new PositionSummaryFrame('YTD', 'year-to-date', true, getYearToDateRanges, getYearToDateStartDate, getYearToDateRangeDescription);

	/**
	 * The start and and date for a {@link PositionSummaryFrame}
	 *
	 * @typedef PositionSummaryRange
	 * @type {Object}
	 * @property {Day} start
	 * @property {Day} end
	 */

	/**
	 * The start and and date for a {@link PositionSummaryFrame} along with the frame type.
	 *
	 * @typedef PositionSummaryDefinition
	 * @type {Object}
	 * @property {Day} start
	 * @property {Day} end
	 * @property {PositionSummaryFrame} frame
	 */

	function getRange(start, end) {
		return { start, end };
	}

	function getYearlyRanges(transactions) {
		const ranges = [ ];

		if (transactions.length !== 0) {
			const first = array.first(transactions);
			const last = array.last(transactions);

			const firstDate = first.date;

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
		const ranges = [ ];

		if (transactions.length !== 0) {
			const today = Day.getToday();

			const first = array.first(transactions);
			const last = array.last(transactions);

			const firstDate = first.date;

			let lastDate;

			if (last.snapshot.open.getIsZero()) {
				lastDate = last.date;
			} else {
				lastDate = today;
			}

			if (today.month === lastDate.month && today.year === lastDate.year) {
				lastDate = lastDate.subtractMonths(1);
			}

			lastDate = lastDate.getEndOfMonth();

			for (let end = firstDate.getEndOfMonth(); !end.getIsAfter(lastDate); end = end.addMonths(1).getEndOfMonth()) {
				ranges.push(getRange(end.subtractMonths(1).getEndOfMonth(), end));
			}
		}

		return ranges;
	}

	function getYearToDateRanges(transactions) {
		const ranges = [ ];

		if (transactions.length !== 0) {
			const last = array.last(transactions);

			const currentYear = Day.getToday().year;

			if (!last.snapshot.open.getIsZero() || last.date.year === currentYear) {
				let end = new Day(currentYear, 12, 31);
				let start = end.subtractYears(1);

				ranges.push(getRange(start, end));
			}
		}

		return ranges;
	}

	function getYearlyStartDate(periods, date) {
		const today = date || Day.getToday();

		return today
			.subtractMonths(today.month - 1)
			.subtractDays(today.day)
			.subtractYears(periods);
	}

	function getQuarterlyStartDate(periods, date) {
		return null;
	}

	function getMonthlyStartDate(periods, date) {
		const today = date || Day.getToday();

		return today
			.subtractMonths(periods)
			.subtractDays(today.day);
	}

	function getYearToDateStartDate(periods, date) {
		return null;
	}

	function getYearlyRangeDescription(start, end) {
		return `Year ended ${end.format()}`;
	}

	function getQuarterlyRangeDescription(start, end) {
		return '';
	}

	function getMonthlyRangeDescription(start, end) {
		return `Month ended ${end.format()}`;
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
