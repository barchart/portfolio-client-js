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

		/**
		 * Unable to delete, the transaction cannot be found.
		 *
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get TRANSACTION_DELETE_FAILED_NO_TRANSACTION() {
			return transactionDeleteFailedNoTransaction;
		}

		toString() {
			return '[PortfolioFailureType]';
		}
	}

	const positionCreateFailedNoPortfolio = new FailureType('POSITION_CREATE_FAILED_NO_PORTFOLIO', 'Unable to create transaction. The referenced portfolio does not exist. Has it been deleted?');

	const transactionCreateFailedOutOfSequence = new FailureType('TRANSACTION_CREATE_FAILED_OUT_OF_SEQUENCE', 'Unable to process transaction, because the transaction date is out-of-sequence. In other words, it would occur before an existing transaction. Please confirm your intent to re-write transaction history (which could take some time and alter the historical results for this position).');
	const transactionCreateFailedTypeInvalidForInstrument = new FailureType('TRANSACTION_CREATE_FAILED_TYPE_INVALID_FOR_INSTRUMENT', 'Unable to process transaction, {L|transactionType.description} transactions cannot be used with {L|instrumentType.description} positions.');
	const transactionCreateFailedTypeInvalidForDirection = new FailureType('TRANSACTION_CREATE_FAILED_TYPE_INVALID_FOR_DIRECTION', 'Unable to process transaction, a {L|positionDirection.description} position would be created (i.e. you would have {L|positionDirection.sign} shares/units). {u|instrumentType.description} positions cannot have {L|positionDirection.description} positions.');
	const transactionCreateFailedInvalidDirectionSwitch = new FailureType('TRANSACTION_CREATE_FAILED_INVALID_DIRECTION_SWITCH', 'Unable to process transaction, the transaction would switch the position from {L|currentDirection.description} to {L|proposedDirection.description} (i.e. {L|currentDirection.sign} to {L|proposedDirection.sign} shares/units). This is not allowed. Please close the current position (i.e. zero it out) and then enter a second transaction.');

	const transactionDeleteFailedOutOfSequence = new FailureType('TRANSACTION_DELETE_FAILED_OUT_OF_SEQUENCE', 'Deleting any transaction, except for the most recent, will cause transaction history to be re-written. Please confirm your intent to re-write transaction history (which could take some time and alter the historical results for this position).');
	const transactionDeleteFailedNoTransaction = new FailureType('TRANSACTION_DELETE_FAILED_NO_TRANSACTION', 'Unable to delete transaction. The referenced transaction does not exist.');

	return PortfolioFailureType;
})();