const assert = require('@barchart/common-js/lang/assert'),
	ComparatorBuilder = require('@barchart/common-js/collections/sorting/ComparatorBuilder'),
	comparators = require('@barchart/common-js/collections/sorting/comparators'),
	Day = require('@barchart/common-js/lang/Day'),
	Decimal = require('@barchart/common-js/lang/Decimal'),
	is = require('@barchart/common-js/lang/is'),
	formatter = require('@barchart/common-js/lang/formatter');

const InstrumentType = require('./../data/InstrumentType'),
	TransactionType = require('./../data/TransactionType');

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
		 * Maps transaction objects into new objects whose properties are human-readable (or
		 * mutates the original objects, adding a "formatted" property to each transaction).
		 *
		 * @public
		 * @static
		 * @param {Array.<Object>} transactions
		 * @param {Array.<Object>} positions
		 * @param {Boolean=} mutate
		 * @returns {Array}
		 */
		static format(transactions, positions, mutate) {
			assert.argumentIsArray(transactions, 'transactions');
			assert.argumentIsArray(positions, 'positions');
			assert.argumentIsOptional(mutate, 'mutate', Boolean);

			const instruments = positions.reduce((map, p) => {
				const instrument = Object.assign({ }, p.instrument || { });

				map[p.position] = instrument;

				return map;
			}, { });

			const a = transactions.reduce((list, transaction) => {
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

					if (mutate) {
						transaction.formatted = formatted;

						transactionToInsert = transaction;
					} else {
						transactionToInsert = formatted;
					}

					list.push(transactionToInsert);
				}

				return list;
			}, [ ]);

			a.sort(comparator);

			a.forEach((t) => {
				delete t.instrument.id;
			});

			return a;
		}

		/**
		 * Sorts an array of formatted transaction objects.
		 *
		 * @public
		 * @static
		 * @param {Array.<Object>} transactions
		 * @returns {Array}
		 */
		sort(transactions) {
			return transactions.sort(comparator);
		}

		toString() {
			return '[TransactionFormatter]';
		}
	}

	const getBasicTransaction = (t, i) => {
		return {
			date: t.date,
			type: t.type.display,
			code: t.type.code,
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
			total: t.dividend.amount,
			rate: t.dividend.rate
		};
	});

	formatters.set(TransactionType.DIVIDEND_STOCK, (t) => {
		const rate = (is.object(t.dividend) && is.string(t.dividend.rate)) || '';

		return {
			boughtSold: t.quantity,
			shares: t.snapshot.open.subtract(t.quantity),
			rate: rate
		};
	});

	formatters.set(TransactionType.DIVIDEND_REINVEST, (t) => {
		return {
			boughtSold: t.quantity,
			shares: t.snapshot.open.subtract(t.quantity),
			price: t.dividend.price,
			fee: t.fee,
			rate: t.dividend.rate
		};
	});

	formatters.set(TransactionType.DISTRIBUTION_CASH, (t) => {
		return {
			shares: t.snapshot.open,
			total: t.dividend.amount,
			rate: t.dividend.rate
		};
	});

	formatters.set(TransactionType.DISTRIBUTION_FUND, (t) => {
		let rate;
		let price;

		if (t.rate && t.price) {
			rate = t.rate;
			price = t.price;
		} else {
			rate = null;
			price = null;
		}

		return {
			boughtSold: t.quantity,
			shares: t.snapshot.open.subtract(t.quantity),
			fee: t.fee
		};
	});

	formatters.set(TransactionType.DISTRIBUTION_REINVEST, (t) => {
		return {
			shares: t.snapshot.open.subtract(t.quantity),
			price: t.dividend.price,
			fee: t.fee,
			rate: t.dividend.rate
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
		let rate;

		if (t.valuation.rate) {
			rate = t.valuation.rate;
		} else if (t.snapshot.open.getIsZero()) {
			rate = null;
		} else {
			rate = t.valuation.value.divide(t.snapshot.open);
		}

		return {
			price: rate
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

	function getInstrumentTypePriority(type) {
		if (type === InstrumentType.CASH) {
			return 1;
		} else {
			return 0;
		}
	}

	const comparator = ComparatorBuilder.startWith((a, b) => {
		return Day.compareDays(a.date, b.date);
	}).thenBy((a, b) => {
		return comparators.compareNumbers(getInstrumentTypePriority(a.instrument.type), getInstrumentTypePriority(b.instrument.type));
	}).thenBy((a, b) => {
		return comparators.compareStrings(a.instrument.id, b.instrument.id);
	}).thenBy((a, b) => {
		return comparators.compareNumbers(a.sequence, b.sequence);
	}).toComparator();

	return TransactionFormatter;
})();