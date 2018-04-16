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
		 * The portfolio referenced does not exist.
		 *
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get TRANSACTION_CREATE_FAILED_NO_PORTFOLIO() {
			return transactionCreateFailedNoPortfolio;
		}

		/**
		 * The transaction would occur before an existing transaction.
		 *
		 * @public
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
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get TRANSACTION_CREATE_FAILED_DIRECTION_SWITCH() {
			return transactionCreateFailedDirectionSwitch;
		}

		static get TRANSACTION_CREATE_REWRITE_UNSUPPORTED() {
			return transactionCreateRewriteUnsupported;
		}

		/**
		 * Deleting any transaction except for the most recent requires
		 * re-writing transaction history.
		 *
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get TRANSACTION_DELETE_FAILED_OUT_OF_SEQUENCE() {
			return transactionDeleteFailedOutOfSequence;
		}

		static get TRANSACTION_DELETE_UNSUPPORTED() {
			return transactionDeleteUnsupported;
		}

		toString() {
			return '[PortfolioFailureType]';
		}
	}

	const transactionCreateFailedNoPortfolio = new FailureType('TRANSACTION_CREATE_FAILED_OUT_OF_SEQUENCE', 'Unable to create transaction, because the referenced portfolio does not exist. Has it been deleted?');
	const transactionCreateFailedOutOfSequence = new FailureType('TRANSACTION_CREATE_FAILED_OUT_OF_SEQUENCE', 'Unable to create transaction, because the transaction date is out-of-sequence. In other words, it would occur before an existing transaction. Please confirm your intent to re-write transaction history (which could take some time and alter the historical results for this position).');
	const transactionCreateFailedDirectionSwitch = new FailureType('TRANSACTION_CREATE_FAILED_DIRECTION_SWITCH', 'Unable to create transaction, because the position direction would be switched (from long to short or vice versa). Please close the position (to a zero balance) first, then enter a second transaction.');
	const transactionCreateRewriteUnsupported = new FailureType('TRANSACTION_CREATE_REWRITE_UNSUPPORTED', 'Unable to re-write transaction history. This operation is not currently supported (but will be implemented soon).');

	const transactionDeleteFailedOutOfSequence = new FailureType('TRANSACTION_DELETE_FAILED_OUT_OF_SEQUENCE', 'Deleting any transaction, except for the most recent, will cause transaction history to be re-written. Please confirm your intent to re-write transaction history (which could take some time and alter the historical results for this position).');
	const transactionDeleteUnsupported = new FailureType('TRANSACTION_DELETE_UNSUPPORTED', 'Unable to delete transaction. This operation is not currently supported (but will be implemented soon).');

	return PortfolioFailureType;
})();