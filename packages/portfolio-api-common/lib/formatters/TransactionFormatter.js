const assert = require('@barchart/common-js/lang/assert'),
	is = require('@barchart/common-js/lang/is');

const TransactionType = require('./../data/TransactionType');

module.exports = (() => {
	'use strict';

	/**
	 * Static configuration data.
	 *
	 * @public
	 */
	class TransactionFormatter {
		constructor(schema) {

		}

		/**
		 * Formats transactions by adding "formatted" attribute
		 * and "instrument" attribute from position
		 *
		 * @public
		 * @static
		 * @param {Array} transactions
		 * @param {Array} positions
		 * @param {String} returnType - Whether the return values should be appended to the transaction
		 * 	
		 * @returns {Array}
		 */
		static format(transactions, positions, returnType) {
			assert.argumentIsRequired(transactions, 'transactions', Array);
			assert.argumentIsRequired(positions, 'positions', Array);

			const positionMap = {};

			positions.map((p) => positionMap[p.position] = p.instrument);

			return transactions.map((transaction) => {
				transaction.instrument = positionMap[transaction.position];

				let formatted = getBasicTransaction(transaction);

				if (formatters.has(transaction.type)) {
					const formatterFunction = formatters.get(transaction.type);

					formatted = Object.assign({}, formatted, formatterFunction(transaction));
				}

				if (returnType === 'append') {
					transaction.formatted = formatted;

					return transaction;
				}

				return formatted;
			});
		}

		toString() {
			return '[TransactionFormatter]';
		}
	}

	const getBasicTransaction = (t) => {
		return {
			date: t.date,
			type: t.type,
			sequence: t.sequence,
			instrument: t.instrument
		};
	};

	const formatters = new Map();
	
	const buySellFormatter = (t) => {
		return {
			boughtSold: t.quantity,
			price: t.trade.price,
			fee: t.fee,
			total: t.amount
		};
	};
	formatters.set(TransactionType.BUY, buySellFormatter);
	formatters.set(TransactionType.SELL, buySellFormatter);
	formatters.set(TransactionType.BUY_SHORT, buySellFormatter);
	formatters.set(TransactionType.SELL_SHORT, buySellFormatter);

	formatters.set(TransactionType.DIVIDEND, (t) => {
		return {
			shares: t.snapshot.open,
			total: t.dividend.amout,
			rate: t.dividend.rate
		};
	});

	formatters.set(TransactionType.DIVIDEND_STOCK, (t) => {
		const shares = t.snapshot.open.subtract(t.quantity);
		const rate = (is.object(t.dividend) && is.string(t.dividend.rate)) || '';

		return {
			boughtSold: t.quantity,
			shares: shares,
			rate: rate
		};
	});

	formatters.set(TransactionType.DISTRIBUTION_CASH, (t) => {
		return {
			shares: t.snapshot.open,
			total: t.dividend.amount,
			rate: t.dividend.rate
		};
	});

	formatters.set(TransactionType.DIVIDEND_REINVEST, (t) => {
		return {
			shares: t.snapshot.open.subtract(t.quantity),
			price: t.dividend.price,
			fee: t.fee,
			total: t.quantity,
			rate: t.dividend.rate
		}
	});

	formatters.set(TransactionType.DISTRIBUTION_FUND, (t) => {
		return {
			shares: t.snapshot.open.subtract(t.quantity),
			fee: t.fee
		}
	});

	formatters.set(TransactionType.INCOME, (t) => {
		return {
			total: t.income.amount
		};	
	});

	formatters.set(TransactionType.FEE, (t) => {
		return {
			total: t.charge.amount
		};
	});

	formatters.set(TransactionType.FEE_UNITS, (t) => {
		return {
			total: t.charge.amount,
			boughtSold: t.quantity
		};
	});

	formatters.set(TransactionType.SPLIT, (t) => {
		return {
			shares: t.quantity,
			rate: t.split.numerator.divide(t.split.denominator)
		};
	});

	formatters.set(TransactionType.VALUATION, (t) => {
		return {
			price: t.valuation.value
		};
	});

	const cashFormatter = (t) => {
		return {
			total: t.quantity
		};
	};

	formatters.set(TransactionType.DEPOSIT, cashFormatter);
	formatters.set(TransactionType.WITHDRAWAL, cashFormatter);

	formatters.set(TransactionType.DEBIT, (t) => {
		const formatted = cashFormatter(t);

		formatted.description = t.description;

		return formatted;
	});

	formatters.set(TransactionType.CREDIT, (t) => {
		const formatted = cashFormatter(t);

		formatted.description = t.description;

		return formatted;
	});

	return TransactionFormatter;
})();