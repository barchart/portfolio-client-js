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
		 * The portfolio does not exist.
		 *
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get PORTFOLIO_UPDATE_FAILED_NO_PORTFOLIO() {
			return portfolioUpdateFailedNoPortfolio;
		}

		/**
		 * The portfolio does not exist.
		 *
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get PORTFOLIO_DELETE_FAILED_NO_PORTFOLIO() {
			return portfolioDeleteFailedNoPortfolio;
		}

		/**
		 * The portfolio does not exist.
		 *
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get POSITION_CREATE_FAILED_NO_PORTFOLIO() {
			return positionCreateFailedNoPortfolio;
		}

		/**
		 * The portfolio does not exist.
		 *
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get POSITION_UPDATE_FAILED_NO_POSITION() {
			return positionUpdateFailedNoPosition;
		}

		/**
		 * Unable to delete, a related position is locked.
		 *
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get POSITION_DELETE_FAILED_POSITION_LOCKED() {
			return positionDeleteFailedPositionLocked;
		}

		/**
		 * The position does not exist.
		 *
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get TRANSACTION_CREATE_FAILED_NO_POSITION() {
			return transactionCreateFailedNoPosition;
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
		 * The transaction date is invalid.
		 * For example create opening transaction after delist date.
		 *
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get TRANSACTION_CREATE_FAILED_INVALID_DATE() {
			return transactionCreateFailedInvalidDate;
		}

		/**
		 * The target instrument is invalid.
		 * Can be used in Merger and Acquisition.
		 *
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get TRANSACTION_CREATE_FAILED_TARGET_INSTRUMENT_MISSING() {
			return transactionCreateFailedTargetInstrumentMissing;
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
		 * The transaction would cause the position direction to change
		 * from long to short, or vice versa.
		 *
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get TRANSACTION_CREATE_FAILED_INVALID_DIRECTION_SWITCH() {
			return transactionCreateFailedInvalidDirectionSwitch;
		}

		/**
		 * The initial transaction type (first in sequence) would be invalid.
		 *
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get TRANSACTION_CREATE_FAILED_INVALID_INITIAL_TYPE() {
			return transactionCreateFailedInvalidInitialType;
		}

		/**
		 * A transaction quantity cannot have a negative amount.
		 *
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get TRANSACTION_CREATE_FAILED_QUANTITY_NEGATIVE() {
			return transactionCreateFailedQuantityNegative;
		}

		/**
		 * A valuation transaction cannot have a negative rate (or amount).
		 *
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get TRANSACTION_CREATE_FAILED_VALUATION_NEGATIVE() {
			return transactionCreateFailedValuationNegative;
		}

		/**
		 * A "terminal" transaction must be the last transaction is the history.
		 *
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get TRANSACTION_CREATE_FAILED_INVALID_TERMINATION() {
			return transactionCreateFailedInvalidTermination;
		}

		/**
		 * A transaction cannot be created after the termination date of
		 * the instrument.
		 *
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get TRANSACTION_CREATE_FAILED_AFTER_TERMINATION() {
			return transactionCreateFailedAfterTermination;
		}

		/**
		 * The transaction (of this type) cannot be created by a user, instead,
		 * it is created and managed by the system (e.g. dividends).
		 *
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get TRANSACTION_CREATE_FAILED_TYPE_RESERVED() {
			return transactionCreateFailedTypeReserved;
		}

		/**
		 * The transaction failed because a dividend would be reinvested on
		 * a day for which no historical price is available.
		 *
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get TRANSACTION_CREATE_FAILED_REINVEST_PRICE_UNAVAILABLE() {
			return transactionCreateFailedReinvestPriceUnavailable;
		}

		/**
		 * The transaction failed because a dividends cannot be re-invested
		 * for short positions.
		 *
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get TRANSACTION_CREATE_FAILED_REINVEST_INVALID() {
			return transactionCreateFailedReinvestInvalid;
		}

		/**
		 * The transaction failed because a related position is locked.
		 *
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get TRANSACTION_CREATE_FAILED_POSITION_LOCKED() {
			return transactionCreateFailedPositionLocked;
		}

		/**
		 * The transaction failed because corporate action history is corrupt.
		 *
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get TRANSACTION_CREATE_FAILED_INSTRUMENT_CORRUPT() {
			return transactionCreateFailedInstrumentCorrupt;
		}

		/**
		 * The transaction (of this type) cannot be deleted by a user, instead,
		 * it is created and managed by the system (e.g. dividends).
		 *
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get TRANSACTION_DELETE_FAILED_TYPE_RESERVED() {
			return transactionDeleteFailedTypeReserved;
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

		/**
		 * Unable to delete, the position's direction would switch.
		 *
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get TRANSACTION_DELETE_FAILED_DIRECTION_SWITCH_ON_REWRITE() {
			return transactionDeleteFailedDirectionSwitchOnRewrite;
		}

		/**
		 * Unable to delete, a related position is locked.
		 *
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get TRANSACTION_DELETE_FAILED_POSITION_LOCKED() {
			return transactionDeleteFailedPositionLocked;
		}

		/**
		 * The transaction date is invalid.
		 * For example edit opening transaction after delist date.
		 *
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get TRANSACTION_EDIT_FAILED_INVALID_DATE() {
			return transactionEditFailedInvalidDate;
		}

		/**
		 * Unable to edit, the transaction doesn't exist.
		 *
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get TRANSACTION_EDIT_FAILED_NO_TRANSACTION() {
			return transactionEditFailedNoTransaction;
		}

		/**
		 * The transaction (of this type) cannot be edited by a user, instead,
		 * it is managed by the system (e.g. dividends).
		 *
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get TRANSACTION_EDIT_FAILED_TYPE_RESERVED() {
			return transactionEditFailedTypeReserved;
		}

		/**
		 * A transaction's type cannot be changed.
		 *
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get TRANSACTION_EDIT_FAILED_TYPE_CHANGED() {
			return transactionEditFailedTypeChanged;
		}

		/**
		 * Conversion of transaction type is unsupported.
		 *
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get TRANSACTION_SWITCH_FAILED_INVALID_CONVERSION() {
			return transactionSwitchFailedInvalidConversion;
		}

		/**
		 * Conversion of transaction type is not allowed. Dividends (or distributions)
		 * cannot be reinvested when the position is short.
		 *
		 * @public
		 * @static
		 * @returns {FailureType}
		 */
		static get TRANSACTION_SWITCH_FAILED_INVALID_REINVEST() {
			return transactionSwitchFailedInvalidReinvest;
		}

		toString() {
			return '[PortfolioFailureType]';
		}
	}

	const portfolioUpdateFailedNoPortfolio = new FailureType('PORTFOLIO_UPDATE_FAILED_NO_PORTFOLIO', 'Unable to update portfolio. The portfolio does not exist, has it been deleted?', false);
	const portfolioDeleteFailedNoPortfolio = new FailureType('PORTFOLIO_DELETE_FAILED_NO_PORTFOLIO', 'Unable to delete portfolio. The portfolio does not exist, has it already been deleted?', false);

	const positionCreateFailedNoPortfolio = new FailureType('POSITION_CREATE_FAILED_NO_PORTFOLIO', 'Unable to create transaction. The portfolio does not exist, has it been deleted?', false);
	const positionUpdateFailedNoPosition = new FailureType('POSITION_UPDATE_FAILED_NO_POSITION', 'Unable to update preferences for position. The position does not exist, has it been deleted?', false);
	const positionDeleteFailedPositionLocked = new FailureType('POSITION_DELETE_FAILED_POSITION_LOCKED', 'Unable to delete position, your {L|description} history is being recalculated. Please wait a minute or two and retry.');

	const transactionCreateFailedNoPosition = new FailureType('TRANSACTION_CREATE_FAILED_NO_POSITION', 'Unable to create transaction. The referenced position does not exist. Has it been deleted?', false);
	const transactionCreateFailedOutOfSequence = new FailureType('TRANSACTION_CREATE_FAILED_OUT_OF_SEQUENCE', 'Unable to process transaction, because the transaction date is out-of-sequence. In other words, it would occur before an existing transaction. Please confirm your intent to re-write transaction history (which could take some time and alter the historical results for this position).');
	const transactionCreateFailedInvalidDate = new FailureType('TRANSACTION_CREATE_FAILED_INVALID_DATE', 'Unable to process transaction with given date.');
	const transactionCreateFailedTargetInstrumentMissing = new FailureType('TRANSACTION_CREATE_FAILED_TARGET_INSTRUMENT_MISSING', 'Unable to create transaction. The target instrument does not exist.');
	const transactionCreateFailedTypeInvalidForInstrument = new FailureType('TRANSACTION_CREATE_FAILED_TYPE_INVALID_FOR_INSTRUMENT', 'Unable to process transaction, {L|transactionType.description} transactions cannot be used with {L|instrumentType.description} positions.');
	const transactionCreateFailedTypeInvalidForDirection = new FailureType('TRANSACTION_CREATE_FAILED_TYPE_INVALID_FOR_DIRECTION', 'Unable to process transaction, a {L|positionDirection.description} position would be created (i.e. you would have {L|positionDirection.sign} shares/units). {u|instrumentType.description} positions cannot have {L|positionDirection.description} positions.', false);
	const transactionCreateFailedInvalidDirectionSwitch = new FailureType('TRANSACTION_CREATE_FAILED_INVALID_DIRECTION_SWITCH', 'Unable to process transaction, the transaction would switch the position from {L|currentDirection.description} to {L|proposedDirection.description} (i.e. {L|currentDirection.sign} to {L|proposedDirection.sign} shares/units). This is not allowed. Please close the current position (i.e. zero it out) and then enter a second transaction.', false);
	const transactionCreateFailedInvalidInitialType = new FailureType('TRANSACTION_CREATE_FAILED_INVALID_INITIAL_TYPE', 'Unable to process operation because the first transaction would to be a {U|transactionType.description}, which is not allowed -- since {U|transactionType.description} transactions cannot open a position.', false);
	const transactionCreateFailedQuantityNegative = new FailureType('TRANSACTION_CREATE_FAILED_QUANTITY_NEGATIVE', 'Unable to process transaction, quantity cannot be negative.');
	const transactionCreateFailedValuationNegative = new FailureType('TRANSACTION_CREATE_FAILED_VALUATION_NEGATIVE', 'Unable to process operation, valuations cannot be negative.', false);
	const transactionCreateFailedInvalidTermination = new FailureType('TRANSACTION_CREATE_FAILED_INVALID_TERMINATION', 'Unable to process operation, a {U|transactionType.description} must be the final transaction in the position history.', false);
	const transactionCreateFailedAfterTermination = new FailureType('TRANSACTION_CREATE_FAILED_AFTER_TERMINATION', 'Unable to process operation, one or more transactions would exist after {L|termination}, the final day of trading for this instrument', false);

	const transactionCreateFailedTypeReserved = new FailureType('TRANSACTION_CREATE_FAILED_TYPE_RESERVED', 'Unable to create {U|type.description} transaction, this type of transaction is managed by the system.');
	const transactionCreateFailedReinvestPriceUnavailable = new FailureType('TRANSACTION_CREATE_FAILED_REINVEST_PRICE_UNAVAILABLE', 'Unable to create transaction, a dividend was paid on {L|day}; however no historical price is available for this day. To successfully create this transaction, please turn off dividend reinvestment for this position.');
	const transactionCreateFailedReinvestInvalid = new FailureType('TRANSACTION_CREATE_FAILED_REINVEST_INVALID', 'Unable to create transaction, short positions do not allow dividends to be reinvested.');
	const transactionCreateFailedPositionLocked = new FailureType('TRANSACTION_CREATE_FAILED_POSITION_LOCKED', 'Unable to create transaction, your {L|description} history is being recalculated. Please re-enter this transaction in a minute or two.');
	const transactionCreateFailedInstrumentCorrupt = new FailureType('TRANSACTION_CREATE_FAILED_INSTRUMENT_CORRUPT', 'Unable to create transaction, corporate action history for {U|symbol} cannot be located. The issue should be corrected within 24 to 48 hours.');

	const transactionDeleteFailedOutOfSequence = new FailureType('TRANSACTION_DELETE_FAILED_OUT_OF_SEQUENCE', 'Deleting any transaction, except for the most recent, will cause transaction history to be re-written. Please confirm your intent to re-write transaction history (which could take some time and alter the historical results for this position).');
	const transactionDeleteFailedNoTransaction = new FailureType('TRANSACTION_DELETE_FAILED_NO_TRANSACTION', 'Unable to delete transaction. The referenced transaction does not exist.', false);
	const transactionDeleteFailedDirectionSwitchOnRewrite = new FailureType('TRANSACTION_DELETE_FAILED_DIRECTION_SWITCH_ON_REWRITE', 'Deleting this transaction would cause your history to be re-written and the position to switch from long to short (i.e. positive to negative) or vice versa.', false);
	const transactionDeleteFailedPositionLocked = new FailureType('TRANSACTION_DELETE_FAILED_POSITION_LOCKED', 'Unable to delete transaction, your {L|description} history is being recalculated. Please wait a minute or two and retry.');
	const transactionDeleteFailedTypeReserved = new FailureType('TRANSACTION_DELETE_FAILED_TYPE_RESERVED', 'Unable to delete {U|type.description} transaction, this type of transaction is managed by the system.');

	const transactionEditFailedInvalidDate = new FailureType('TRANSACTION_EDIT_FAILED_INVALID_DATE', 'Unable to edit transaction with given date.');
	const transactionEditFailedNoTransaction = new FailureType('TRANSACTION_EDIT_FAILED_NO_TRANSACTION', 'Unable to edit transaction. The referenced transaction does not exist.', false);
	const transactionEditFailedTypeReserved = new FailureType('TRANSACTION_EDIT_FAILED_TYPE_RESERVED', 'Unable to edit {U|type.description} transaction, this type of transaction is managed by the system.');
	const transactionEditFailedTypeChanged = new FailureType('TRANSACTION_EDIT_FAILED_TYPE_CHANGED', 'Changing a transaction type is forbidden. You must delete the existing transaction and then create a new transaction.');

	const transactionSwitchFailedInvalidConversion = new FailureType('TRANSACTION_SWITCH_FAILED_INVALID_CONVERSION', 'Unable to convert transaction from {U|existing.description} to {U|desired.description}. This conversion is not supported.');
	const transactionSwitchFailedInvalidReinvest = new FailureType('TRANSACTION_SWITCH_FAILED_INVALID_REINVEST', 'Unable to convert transaction from {U|existing.description} to {U|desired.description}. Reinvestment is not supported for short positions.');

	return PortfolioFailureType;
})();
