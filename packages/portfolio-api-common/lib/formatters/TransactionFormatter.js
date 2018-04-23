const assert = require('@barchart/common-js/lang/assert'),
	Decimal = require('@barchart/common-js/lang/Decimal'),
	is = require('@barchart/common-js/lang/is'),
	formatter = require('@barchart/common-js/lang/formatter');

const TransactionType = require('./../data/TransactionType');

module.exports = (() => {
	'use strict';

	/**
	 * Static utility for formatting transaction data in human-readable form.
	 *
	 * @public
	 */
	class TransactionFormatter {
		constructor(schema) {

		}

		/**
		 * Maps transaction objects into new objects whose properties are human-readable or,
		 * optionally returns the original objects with a "formatted" property appended to
		 * each transaction.
		 *
		 * @public
		 * @static
		 * @param {Array<Object>} transactions
		 * @param {Array<Object>} positions
		 * @param {Boolean=} append - Warning, if true, the transaction array will be mutated.
		 * @returns {Array}
		 */
		static format(transactions, positions, append) {
			assert.argumentIsArray(transactions, 'transactions');
			assert.argumentIsArray(positions, 'positions');
			assert.argumentIsOptional(append, 'append', Boolean);

			const instruments = positions.reduce((map, p) => {
				const instrument = Object.assign({ }, p.instrument || { });

				delete instrument.id;

				map[p.position] = instrument;

				return map;
			}, { });

			return transactions.reduce((list, transaction) => {
				const position = transaction.position;

				if (instruments.hasOwnProperty(position)) {
					let instrument = instruments[position];
					let formatted = getBasicTransaction(transaction, instrument);

					if (formatters.has(transaction.type)) {
						const formatterFunction = formatters.get(transaction.type);
						const formattedTransaction = formatterFunction(transaction);

						Object.keys(formattedTransaction).map((key) => {
							if (!is.undefined(formattedTransaction[key]) && formattedTransaction[key] instanceof Decimal) {
								const precision = instrument.currency.precision;

								formattedTransaction[key] = formatter.numberToString(formattedTransaction[key].toFloat(), precision, ',');
							}
						});

						formatted = Object.assign({}, formatted, formattedTransaction);
					}

					let transactionToInsert;

					if (append) {
						transaction.formatted = formatted;

						transactionToInsert = transaction;
					} else {
						transactionToInsert = formatted;
					}

					list.push(transactionToInsert);
				}

				return list;
			}, [ ]);
		}

		toString() {
			return '[TransactionFormatter]';
		}
	}

	const getBasicTransaction = (t, i) => {
		return {
			date: t.date,
			type: t.type.display,
			sequence: t.sequence,
			instrument: i,
			position: t.position
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
		};
	});

	formatters.set(TransactionType.DISTRIBUTION_FUND, (t) => {
		return {
			shares: t.snapshot.open.subtract(t.quantity),
			fee: t.fee
		};
	});

	formatters.set(TransactionType.INCOME, (t) => {
		return {
			total: t.income.amount
		};	
	});

	formatters.set(TransactionType.FEE, (t) => {
		return {
			fee: t.charge.amount,
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