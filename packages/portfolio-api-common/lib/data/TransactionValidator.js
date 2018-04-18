const assert = require('@barchart/common-js/lang/assert');

const InstrumentType = require('./InstrumentType'),
	PositionDirection = require('./PositionDirection'),
	TransactionType = require('./TransactionType');

module.exports = (() => {
	'use strict';

	/**
	 * Static utilities for validating transactions.
	 *
	 * @public
	 */
	class TransactionValidator {
		constructor() {

		}

		/**
		 * Given an instrument type, returns all valid transaction types.
		 *
		 * @static
		 * @public
		 * @param {InstrumentType} instrumentType
		 * @param {Boolean=} userInitiated
		 * @return {Array.<TransactionType>}
		 */
		static getTransactionTypesFor(instrumentType, userInitiated) {
			assert.argumentIsRequired(instrumentType, 'instrumentType', InstrumentType, 'InstrumentType');
			assert.argumentIsOptional(userInitiated, 'userInitiated', Boolean);

			let valid = validTransactionTypes[instrumentType.code] || [ ];

			if (userInitiated) {
				valid = valid.filter(d => d.user === userInitiated);
			}

			return valid.map(d => d.type);
		}

		/**
		 * Checks to see if an transaction type is applicable to an instrument type.
		 *
		 * @static
		 * @public
		 * @param {InstrumentType} instrumentType
		 * @param {TransactionType} transactionType
		 * @param {Boolean=} userInitiated
		 * @return {Boolean}
		 */
		static validateTransactionType(instrumentType, transactionType, userInitiated) {
			assert.argumentIsRequired(transactionType, 'transactionType', TransactionType, 'TransactionType');

			const transactionTypes = TransactionValidator.getTransactionTypesFor(instrumentType, userInitiated);

			return transactionType.some(t => t === transactionType);
		}

		/**
		 * Checks to see if a position for a given instrument type can exist in
		 * the given direction.
		 *
		 * @static
		 * @public
		 * @param {InstrumentType} instrumentType
		 * @param {PositionDirection} direction
		 * @return {Boolean}
		 */
		static validateDirection(transactionType, direction) {
			assert.argumentIsRequired(transactionType, 'transactionType', TransactionType, 'TransactionType');
			assert.argumentIsRequired(direction, 'direction', PositionDirection, 'PositionDirection');

			return validDirections[transactionType.code].some(d => d === direction);
		}

		/**
		 * Checks to see if the position switches direction and if the direction switch
		 * is valid.
		 *
		 * @static
		 * @public
		 * @param {InstrumentType} instrumentType
		 * @param {PositionDirection|null|undefined} currentDirection
		 * @param {PositionDirection} proposedDirection
		 * @return {Boolean}
		 */
		static validateDirectionSwitch(instrumentType, currentDirection, proposedDirection) {
			return currentDirection === null || instrumentType.canSwitchDirection || (!currentDirection.closed && !proposedDirection.closed && currentDirection.positive !== proposedDirection.positive);
		}

		toString() {
			return '[TransactionValidator]';
		}
	}

	const validTransactionTypes = { };

	function associateTypes(instrumentType, transactionType, userInitiated) {
		const instrumentTypeCode = instrumentType.code;

		if (!validTransactionTypes.hasOwnProperty(instrumentTypeCode)) {
			validTransactionTypes[instrumentTypeCode] = [ ];
		}

		validTransactionTypes[instrumentTypeCode].push({ type: transactionType, user: userInitiated });
	}

	associateTypes(InstrumentType.EQUITY, TransactionType.BUY, true);
	associateTypes(InstrumentType.EQUITY, TransactionType.SELL, true);
	associateTypes(InstrumentType.EQUITY, TransactionType.SELL_SHORT, true);
	associateTypes(InstrumentType.EQUITY, TransactionType.BUY_SHORT, true);
	associateTypes(InstrumentType.EQUITY, TransactionType.FEE, true);
	associateTypes(InstrumentType.EQUITY, TransactionType.DIVIDEND, false);
	associateTypes(InstrumentType.EQUITY, TransactionType.DIVIDEND_REINVEST, false);
	associateTypes(InstrumentType.EQUITY, TransactionType.DIVIDEND_STOCK, false);
	associateTypes(InstrumentType.EQUITY, TransactionType.SPLIT, false);

	associateTypes(InstrumentType.FUND, TransactionType.BUY, true);
	associateTypes(InstrumentType.FUND, TransactionType.SELL, true);
	associateTypes(InstrumentType.FUND, TransactionType.FEE, true);
	associateTypes(InstrumentType.FUND, TransactionType.FEE_UNITS, false);
	associateTypes(InstrumentType.FUND, TransactionType.DISTRIBUTION_CASH, false);
	associateTypes(InstrumentType.FUND, TransactionType.DISTRIBUTION_FUND, false);

	associateTypes(InstrumentType.OTHER, TransactionType.BUY, true);
	associateTypes(InstrumentType.OTHER, TransactionType.SELL, true);
	associateTypes(InstrumentType.OTHER, TransactionType.INCOME, true);
	associateTypes(InstrumentType.OTHER, TransactionType.FEE, true);
	associateTypes(InstrumentType.OTHER, TransactionType.VALUATION, true);

	associateTypes(InstrumentType.CASH, TransactionType.DEPOSIT, true);
	associateTypes(InstrumentType.CASH, TransactionType.WITHDRAWAL, true);
	associateTypes(InstrumentType.CASH, TransactionType.FEE, true);
	associateTypes(InstrumentType.CASH, TransactionType.DEBIT, false);
	associateTypes(InstrumentType.CASH, TransactionType.CREDIT, false);

	const validDirections = { };

	function associateDirections(instrumentType, positionDirection) {
		const instrumentTypeCode = instrumentType.code;

		if (!validDirections.hasOwnProperty(instrumentTypeCode)) {
			validDirections[instrumentTypeCode] = [ ];
		}

		validDirections[instrumentTypeCode].push(positionDirection);
	}

	associateTypes(InstrumentType.EQUITY, PositionDirection.EVEN);
	associateTypes(InstrumentType.EQUITY, PositionDirection.LONG);
	associateTypes(InstrumentType.EQUITY, PositionDirection.SHORT);

	associateTypes(InstrumentType.FUND, PositionDirection.EVEN);
	associateTypes(InstrumentType.FUND, PositionDirection.LONG);

	associateTypes(InstrumentType.OTHER, PositionDirection.EVEN);
	associateTypes(InstrumentType.OTHER, PositionDirection.LONG);

	associateTypes(InstrumentType.CASH, PositionDirection.EVEN);
	associateTypes(InstrumentType.CASH, PositionDirection.LONG);
	associateTypes(InstrumentType.CASH, PositionDirection.SHORT);

	return TransactionValidator;
})();
