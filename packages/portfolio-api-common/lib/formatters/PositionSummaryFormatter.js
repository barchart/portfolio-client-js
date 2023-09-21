const array = require('@barchart/common-js/lang/array'),
	assert = require('@barchart/common-js/lang/assert'),
	Decimal = require('@barchart/common-js/lang/Decimal'),
	formatter = require('@barchart/common-js/lang/formatter');

module.exports = (() => {
	/**
	 * Static utilities for formatting position summary records (into groups based on
	 * instrument type)
	 *
	 * @public
	 */
	class PositionSummaryFormatter {
		/**
		 * The formatter
		 *
		 * @public
		 * @static
		 * @param {Array} summaries
		 * @returns {Object}
		 */
		static format(summaries) {
			assert.argumentIsRequired(summaries, 'summaries', Object);

			const summaryGroups = array.groupBy(summaries, summary => summary.instrument.type.code);

			const total = {
				start: Decimal.ZERO,
				change: Decimal.ZERO,
				end: Decimal.ZERO
			};

			const formattedSummaryGroups = Object.keys(summaryGroups).map((group) => {
				const positions = summaryGroups[group];

				let start = Decimal.ZERO;
				let end = Decimal.ZERO;

				positions.map((position) => {
					start = start.add(position.start.value);
					end = end.add(position.end.value);
				});

				const change = end.subtract(start);

				total.start = total.start.add(start);
				total.change = total.change.add(change);
				total.end = total.end.add(end);

				return summaryGroups[group] = {
					name: group,
					start: formatNumber(start.toFloat()),
					end: formatNumber(end.toFloat()),
					change: formatNumber(change.toFloat())
				};
			});

			Object.keys(total).map(key => total[key] = formatNumber(total[key].toFloat()));

			return {
				groups: formattedSummaryGroups,
				total
			};
		}
	}

	const formatNumber = (float) => {
		return formatter.numberToString(float, 2, ',');
	};

	return PositionSummaryFormatter;
})();