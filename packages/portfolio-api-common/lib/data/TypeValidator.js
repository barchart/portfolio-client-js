const assert = require('@barchart/common-js/lang/assert');

const InstrumentType = require('./InstrumentType'),
	TransactionType = require('./TransactionType');

module.exports = (() => {
	'use strict';

	/**
	 * Static utilities for validating transactions.
	 *
	 * @public
	 */
	class TypeValidator {
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
		 * Checks to see is an transaction type is applicable to an instrument type.
		 *
		 * @static
		 * @public
		 * @param {InstrumentType} instrumentType
		 * @param {TransactionType} transactionType
		 * @param {Boolean=} userInitiated
		 * @return {Boolean}
		 */
		static validateTransactionTypeFor(instrumentType, transactionType, userInitiated) {
			const transactionTypes = TypeValidator.getTransactionTypesFor(instrumentType, userInitiated);

			return transactionType.some(t => t === transactionType);
		}

		toString() {
			return '[TypeValidator]';
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

	return TypeValidator;
})();
