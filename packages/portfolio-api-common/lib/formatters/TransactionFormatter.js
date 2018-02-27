const assert = require('@barchart/common-js/lang/assert');

const ValuationType = require('./../data/ValuationType');

module.exports = (() => {
	'use strict';

	/**
	 * Static utilities for formatting {@link Transaction} objects for 
	 * display to humans.
	 *
	 * @public
	 * @extends {Enum}
	 */
	class TransactionFormatter {
		constructor(schema) {

		}

		/**
		 * Formats transactions for display to humans.
		 *
		 * @public
		 * @static
		 * @param {Array.<Transaction>} transactions
		 */
		static format(transactions) {
			return [ ];
		}

		toString() {
			return '[TransactionFormatter]';
		}
	}

	return TransactionFormatter;
})();
