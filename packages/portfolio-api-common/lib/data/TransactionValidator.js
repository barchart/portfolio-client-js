const assert = require('@barchart/common-js/lang/assert'),
	array = require('@barchart/common-js/lang/array'),
	is = require('@barchart/common-js/lang/is');

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
		 * Given an array of transactions, ensures that all sequence numbers and dates
		 * are properly ordered.
		 *
		 * @public
		 * @static
		 * @param {Array.<Object>} transactions
		 * @returns {Boolean}
		 */
		static validateOrder(transactions) {
			return TransactionValidator.getInvalidIndex(transactions) < 0;
		}

		/**
		 * Given an array of transactions, when transaction references are present, ensures
		 * that no transactions within the set reference the same transaction.
		 *
		 * @public
		 * @static
		 * @param {Array.<Object>} transactions
		 * @returns {Boolean}
		 */
		static validateReferences(transactions) {
			assert.argumentIsArray(transactions, 'transactions');

			const references = { };

			return transactions.every((t) => {
				let valid = true;

				if (is.object(t.reference) && is.string(t.reference.root) && is.number(t.reference.sequence)) {
					const root = t.reference.root;
					const sequence = t.reference.sequence;

					if (!references.hasOwnProperty(root)) {
						references[root] = [ ];
					}

					const sequences = references[root];

					if (sequences.some(s => s === sequence)) {
						valid = false;
					} else {
						sequences.push(sequence);
					}
				}

				return valid;
			});
		}

		/**
		 * Given an array of transactions, returns the index of the first transaction that with an invalid
		 * sequence number or date.
		 *
		 * @public
		 * @static
		 * @param {Array.<Object>} transactions
		 * @returns {Number}
		 */
		static getInvalidIndex(transactions) {
			assert.argumentIsArray(transactions, 'transactions');

			return transactions.findIndex((t, i) => t.sequence !== (i + 1) || (i !== 0 && t.date.getIsBefore(transactions[i - 1].date)));
		}

		/**
		 * Given an instrument type, returns all valid transaction types.
		 *
		 * @static
		 * @public
		 * @param {InstrumentType} instrumentType
		 * @param {Boolean=} userInitiated
		 * @pararm {PositionDirection=} currentDirection
		 * @returns {Array.<TransactionType>}
		 */
		static getTransactionTypesFor(instrumentType, userInitiated, currentDirection) {
			assert.argumentIsRequired(instrumentType, 'instrumentType', InstrumentType, 'InstrumentType');
			assert.argumentIsOptional(userInitiated, 'userInitiated', Boolean);

			let valid = validTransactionTypes[instrumentType.code] || [ ];

			if (userInitiated) {
				valid = valid.filter(data => data.user === userInitiated);
			}

			if (currentDirection) {
				valid = valid.filter(data => data.directions.some(d => d === currentDirection));
			}

			return valid.map(d => d.type);
		}

		/**
		 * Returns transaction types which can be initiated by the user, regardless
		 * of instrument type.
		 *
		 * @public
		 * @static
		 * @returns {Array.<TransactionType>}
		 */
		static getUserInitiatedTransactionTypes() {
			return array.unique(Object.keys(validTransactionTypes).reduce((types, key) => {
				const instrumentTypes = validTransactionTypes[key];

				instrumentTypes.forEach((data) => {
					if (data.user) {
						types.push(data.type);
					}
				});

				return types;
			}, [ ]));
		}

		/**
		 * Determines if a transaction type is applicable to an instrument type.
		 *
		 * @static
		 * @public
		 * @param {InstrumentType} instrumentType
		 * @param {TransactionType} transactionType
		 * @param {Boolean=} userInitiated
		 * @returns {Boolean}
		 */
		static validateTransactionType(instrumentType, transactionType, userInitiated) {
			assert.argumentIsRequired(transactionType, 'transactionType', TransactionType, 'TransactionType');

			const transactionTypes = TransactionValidator.getTransactionTypesFor(instrumentType, userInitiated);

			return transactionTypes.some(t => t === transactionType);
		}

		/**
		 * Determines if a transaction type is valid as the first transaction of
		 * a position.
		 *
		 * @param {TransactionType} transactionType
		 */
		static validateInitialTransactionType(transactionType) {
			return transactionType.initial;
		}
		
		/**
		 * Determines if a position for a given instrument type can exist in
		 * the given direction.
		 *
		 * @static
		 * @public
		 * @param {InstrumentType} instrumentType
		 * @param {PositionDirection} direction
		 * @returns {Boolean}
		 */
		static validateDirection(instrumentType, direction) {
			assert.argumentIsRequired(instrumentType, 'instrumentType', InstrumentType, 'InstrumentType');
			assert.argumentIsRequired(direction, 'direction', PositionDirection, 'PositionDirection');

			return validDirections[instrumentType.code].some(d => d === direction);
		}

		/**
		 * Determines if the position switches direction and if the direction switch
		 * is valid.
		 *
		 * @static
		 * @public
		 * @param {InstrumentType} instrumentType
		 * @param {PositionDirection|null|undefined} currentDirection
		 * @param {PositionDirection} proposedDirection
		 * @returns {Boolean}
		 */
		static validateDirectionSwitch(instrumentType, currentDirection, proposedDirection) {
			return currentDirection === null || instrumentType.canSwitchDirection || (currentDirection.closed || proposedDirection.closed || currentDirection.positive === proposedDirection.positive);
		}

		toString() {
			return '[TransactionValidator]';
		}
	}

	const validTransactionTypes = { };

	function associateTypes(instrumentType, transactionType, userInitiated, directions) {
		const instrumentTypeCode = instrumentType.code;

		if (!validTransactionTypes.hasOwnProperty(instrumentTypeCode)) {
			validTransactionTypes[instrumentTypeCode] = [ ];
		}

		validTransactionTypes[instrumentTypeCode].push({ type: transactionType, user: userInitiated, directions: directions || [ PositionDirection.LONG, PositionDirection.SHORT, PositionDirection.EVEN ]  });
	}

	associateTypes(InstrumentType.EQUITY, TransactionType.BUY, true, [ PositionDirection.LONG, PositionDirection.EVEN ]);
	associateTypes(InstrumentType.EQUITY, TransactionType.SELL, true, [ PositionDirection.LONG ]);
	associateTypes(InstrumentType.EQUITY, TransactionType.SELL_SHORT, true, [ PositionDirection.SHORT, PositionDirection.EVEN ]);
	associateTypes(InstrumentType.EQUITY, TransactionType.BUY_SHORT, true, [ PositionDirection.SHORT ]);
	associateTypes(InstrumentType.EQUITY, TransactionType.FEE, true, [ PositionDirection.LONG, PositionDirection.SHORT ]);
	associateTypes(InstrumentType.EQUITY, TransactionType.DIVIDEND, false);
	associateTypes(InstrumentType.EQUITY, TransactionType.DIVIDEND_REINVEST, false);
	associateTypes(InstrumentType.EQUITY, TransactionType.DIVIDEND_STOCK, false);
	associateTypes(InstrumentType.EQUITY, TransactionType.SPLIT, false);

	associateTypes(InstrumentType.FUND, TransactionType.BUY, true, [ PositionDirection.LONG, PositionDirection.EVEN ]);
	associateTypes(InstrumentType.FUND, TransactionType.SELL, true, [ PositionDirection.LONG ]);
	associateTypes(InstrumentType.FUND, TransactionType.FEE, true, [ PositionDirection.LONG ]);
	associateTypes(InstrumentType.FUND, TransactionType.FEE_UNITS, false);
	associateTypes(InstrumentType.FUND, TransactionType.DISTRIBUTION_CASH, false);
	associateTypes(InstrumentType.FUND, TransactionType.DISTRIBUTION_REINVEST, false);
	associateTypes(InstrumentType.FUND, TransactionType.DISTRIBUTION_FUND, false);

	associateTypes(InstrumentType.OTHER, TransactionType.BUY, true, [ PositionDirection.LONG, PositionDirection.EVEN ]);
	associateTypes(InstrumentType.OTHER, TransactionType.SELL, true, [ PositionDirection.LONG ]);
	associateTypes(InstrumentType.OTHER, TransactionType.INCOME, true, [ PositionDirection.LONG ]);
	associateTypes(InstrumentType.OTHER, TransactionType.FEE, true, [ PositionDirection.LONG ]);
	associateTypes(InstrumentType.OTHER, TransactionType.VALUATION, true, [ PositionDirection.LONG ]);

	associateTypes(InstrumentType.CASH, TransactionType.DEPOSIT, true);
	associateTypes(InstrumentType.CASH, TransactionType.WITHDRAWAL, true);
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

	associateDirections(InstrumentType.EQUITY, PositionDirection.EVEN);
	associateDirections(InstrumentType.EQUITY, PositionDirection.LONG);
	associateDirections(InstrumentType.EQUITY, PositionDirection.SHORT);

	associateDirections(InstrumentType.FUND, PositionDirection.EVEN);
	associateDirections(InstrumentType.FUND, PositionDirection.LONG);

	associateDirections(InstrumentType.OTHER, PositionDirection.EVEN);
	associateDirections(InstrumentType.OTHER, PositionDirection.LONG);

	associateDirections(InstrumentType.CASH, PositionDirection.EVEN);
	associateDirections(InstrumentType.CASH, PositionDirection.LONG);
	associateDirections(InstrumentType.CASH, PositionDirection.SHORT);

	return TransactionValidator;
})();
