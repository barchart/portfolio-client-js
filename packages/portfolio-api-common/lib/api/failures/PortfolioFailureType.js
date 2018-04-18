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
		static get POSITION_CREATE_FAILED_NO_PORTFOLIO() {
			return positionCreateFailedNoPortfolio;
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
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get TRANSACTION_CREATE_FAILED_TYPE_INVALID_FOR_INSTRUMENT() {
			return transactionCreateFailedTypeInvalidForInstrument;
		}

		/**
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get TRANSACTION_CREATE_FAILED_TYPE_INVALID_FOR_DIRECTION() {
			return transactionCreateFailedTypeInvalidForDirection;
		}

		/**
		 * The transaction would cause the position to change (from long to
		 * short, or vice versa).
		 *
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get TRANSACTION_CREATE_FAILED_INVALID_DIRECTION_SWITCH() {
			return transactionCreateFailedInvalidDirectionSwitch;
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

	const positionCreateFailedNoPortfolio = new FailureType('POSITION_CREATE_FAILED_NO_PORTFOLIO', 'Unable to create transaction. The referenced portfolio does not exist. Has it been deleted?');

	const transactionCreateFailedOutOfSequence = new FailureType('TRANSACTION_CREATE_FAILED_OUT_OF_SEQUENCE', 'Unable to create transaction, because the transaction date is out-of-sequence. In other words, it would occur before an existing transaction. Please confirm your intent to re-write transaction history (which could take some time and alter the historical results for this position).');
	const transactionCreateFailedTypeInvalidForInstrument = new FailureType('TRANSACTION_CREATE_FAILED_TYPE_INVALID_FOR_INSTRUMENT', '{L|transactionType.description} are not allowed for {L|instrumentType.description}');
	const transactionCreateFailedTypeInvalidForDirection = new FailureType('TRANSACTION_CREATE_FAILED_TYPE_INVALID_FOR_DIRECTION', 'A {L|type.description} are not allowed. At the time of the transaction, your position is {L|direction} (i.e. {L|sign}).');
	const transactionCreateFailedInvalidDirectionSwitch = new FailureType('TRANSACTION_CREATE_FAILED_INVALID_DIRECTION_SWITCH', 'Unable to create transaction, because the position direction would be switched (from long to short or vice versa). Please close the position (to a zero balance), then enter a second transaction.');

	const transactionDeleteFailedOutOfSequence = new FailureType('TRANSACTION_DELETE_FAILED_OUT_OF_SEQUENCE', 'Deleting any transaction, except for the most recent, will cause transaction history to be re-written. Please confirm your intent to re-write transaction history (which could take some time and alter the historical results for this position).');
	const transactionDeleteUnsupported = new FailureType('TRANSACTION_DELETE_UNSUPPORTED', 'Unable to delete transaction. This operation is not currently supported (but will be implemented soon).');

	return PortfolioFailureType;
})();