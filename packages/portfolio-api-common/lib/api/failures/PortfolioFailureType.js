const FailureType = require('@barchart/common-js/api/failures/FailureType');

module.exports = (() => {
	'use strict';

	/**
	 * A static container for portfolio-specific {@link FailureType} items.
	 *
	 * @public
	 */
	class PortfolioFailureType {
		constructor() {
		}

		/**
		 * The transaction would occur before an existing transaction.
		 *
		 * @static
		 * @returns {FailureType}
		 */
		static get TRANSACTION_CREATE_FAILED_OUT_OF_SEQUENCE() {
			return transactionCreateFailedOutOfSequence;
		}

		/**
		 * The transaction would cause the position to change (from long to
		 * short, or vice versa).
		 *
		 * @static
		 * @returns {FailureType}
		 */
		static get TRANSACTION_CREATE_FAILED_DIRECTION_SWITCH() {
			return transactionCreateFailedDirectionSwitch;
		}

		toString() {
			return '[PortfolioFailureType]';
		}
	}

	const transactionCreateFailedOutOfSequence = new FailureType('TRANSACTION_CREATE_FAILED_OUT_OF_SEQUENCE', 'Unable to create transaction, because the transaction date is out-of-sequence. In other words, it would occur before an existing transaction. Please confirm your intent to re-write transaction history (which could take some time and alter the historical results for this position).');
	const transactionCreateFailedDirectionSwitch = new FailureType('TRANSACTION_CREATE_FAILED_DIRECTION_SWITCH', 'Unable to create transaction, because the position direction would be switched (from long to short or vice versa). Please close the position (to a zero balance) first, then enter a second transaction.');

	return PortfolioFailureType;
})();