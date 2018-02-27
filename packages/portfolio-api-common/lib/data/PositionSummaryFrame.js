const assert = require('@barchart/common-js/lang/assert'),
	Enum = require('@barchart/common-js/lang/Enum');

module.exports = (() => {
	'use strict';

	/**
	 * An enumeration used to define timeframes for position summaries.
	 *
	 * @public
	 * @extends {Enum}
	 * @param {String} description
	 * @param {String} code
	 * @param {Boolean} canReinvest
	 */
	class PositionSummaryFrame extends Enum {
		constructor(code, description) {
			super(code, description);
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

	const yearly = new PositionSummaryFrame('YEARL', 'year');
	const quarterly = new PositionSummaryFrame('QUARTER', 'quarter');
	const monthly = new PositionSummaryFrame('MONTH', 'month');
	const ytd = new PositionSummaryFrame('YTD', 'year-to-date');

	return PositionSummaryFrame;
})();
