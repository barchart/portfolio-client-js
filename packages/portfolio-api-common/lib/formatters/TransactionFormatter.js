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
		 * Maps transaction objects into new objects whose properties are human-readable.
		 *
		 * @public
		 * @static
		 * @param {Object[]} transactions
		 * @param {Object[]} positions
		 * @param {Boolean=} descending
		 * @returns {Array}
		 */
		static format(transactions, positions, descending) {
			assert.argumentIsArray(transactions, 'transactions');
			assert.argumentIsArray(positions, 'positions');
			assert.argumentIsOptional(descending, 'descending', Boolean);

			const instruments = positions.reduce((map, p) => {
				const instrument = Object.assign({ }, p.instrument || { });

				map[p.position] = instrument;

				return map;
			}, { });

			const list = transactions.reduce((accumulator, transaction) => {
				const position = transaction.position;

				if (instruments.hasOwnProperty(position)) {
					let instrument = instruments[position];
					let formatted = { instrument: instrument };

					const formatterFunctions = formatters.get(transaction.type);

					formatterFunctions.forEach((formatterFunction) => {
						formatterFunction(transaction, formatted);
					});

					Object.keys(formatted).forEach((key) => {
						const value = formatted[key];

						if (value instanceof Decimal) {
							const precision = instrument.currency.precision;

							formatted[key] = formatter.numberToString(value.toFloat(), precision, ',');
						}
					});

					accumulator.push(formatted);
				}

				return accumulator;
			}, [ ]);

			let comparator;

			if (is.boolean(descending) && descending) {
				comparator = comparatorDescending;
			} else {
				comparator = comparatorAscending;
			}

			list.sort(comparator);

			list.forEach((t) => {
				delete t.instrument.id;
			});

			return list;
		}

		/**
		 * Sorts an array of formatted transaction objects.
		 *
		 * @public
		 * @static
		 * @param {Object[]} transactions
		 * @param {Boolean=} descending
		 * @returns {Array}
		 */
		sort(transactions, descending) {
			assert.argumentIsArray(transactions, 'transactions');
			assert.argumentIsOptional(descending, 'descending', Boolean);

			let comparator;

			if (is.boolean(descending) && descending) {
				comparator = comparatorDescending;
			} else {
				comparator = comparatorAscending;
			}

			return transactions.sort(comparator);
		}

		toString() {
			return '[TransactionFormatter]';
		}
	}

	const basicFormatter = (t, f) => {
		f.date = t.date;
		f.type = t.type.display;
		f.code = t.type.code;
		f.sequence = t.sequence;
		f.position = t.position;
		f.open = t.snapshot.open;
	};

	const averageCostFormatter = (t, f) => {
		const basis = t.snapshot.basis;
		const open = t.snapshot.open;

		let average;

		if (basis && open && !open.getIsZero()) {
			average = basis.divide(open).absolute();
		} else {
			average = '';
		}

		f.average = average;
	};

	const buySellFormatter = (t, f) => {
		f.boughtSold = t.quantity;
		f.price = t.trade.price;
		f.fee = t.fee;
		f.total = t.amount;
	};

	const dividendFormatter = (t, f) => {
		f.total = t.dividend.amount;
		f.rate = t.dividend.rate;

		f.shares = t.dividend.amount.divide(t.dividend.rate);
	};

	const distributionCashFormatter = (t, f) => {
		f.total = t.dividend.amount;
		f.rate = t.dividend.rate;

		f.shares = t.dividend.amount.divide(t.dividend.rate);
	};

	const dividendReinvestFormatter = (t, f) => {
		f.boughtSold = t.quantity;

		if (f.fee && !f.fee.getIsZero()) {
			f.fee = t.fee;
		}

		f.price = t.dividend.price;
		f.rate = t.dividend.rate;

		f.shares = t.snapshot.open.subtract(t.quantity);
	};

	const distributionReinvestFormatter = (t, f) => {
		f.boughtSold = t.quantity;

		if (f.fee && !f.fee.getIsZero()) {
			f.fee = t.fee;
		}

		f.price = t.dividend.price;
		f.rate = t.dividend.rate;

		f.shares = t.snapshot.open.subtract(t.quantity);
	};

	const dividendStockFormatter = (t, f) => {
		f.boughtSold = t.quantity;

		if (f.fee && !f.fee.getIsZero()) {
			f.fee = t.fee;
		}

		if (t.dividend) {
			if (t.dividend.numerator && t.dividend.denominator) {
				f.rate = t.dividend.numerator.divide(t.dividend.denominator);
			} else if (t.dividend.rate) {
				f.rate = t.dividend.rate;
			}

			if (t.dividend.price) {
				f.price = t.dividend.price;
			}
		}

		f.shares = t.snapshot.open.subtract(t.quantity);
	};

	const distributionFundFormatter = (t, f) => {
		f.boughtSold = t.quantity;

		if (f.fee && !f.fee.getIsZero()) {
			f.fee = t.fee;
		}

		if (t.dividend) {
			if (t.dividend.numerator && t.dividend.denominator) {
				f.rate = t.dividend.numerator.divide(t.dividend.denominator);
			} else if (t.dividend.rate) {
				f.rate = t.dividend.rate;
			}

			if (t.dividend.price) {
				f.price = t.dividend.price;
			}
		}

		f.shares = t.snapshot.open.subtract(t.quantity);
	};

	const incomeFormatter = (t, f) => {
		f.total = t.income.amount;
	};

	const feeFormatter = (t, f) => {
		f.fee = t.charge.amount;
		f.total = t.charge.amount;
	};

	const feeUnitsFormatter = (t, f) => {
		f.boughtSold = t.quantity;
	};

	const splitFormatter = (t, f) => {
		f.rate = t.split.numerator.divide(t.split.denominator);

		f.shares = t.snapshot.open.subtract(t.quantity);
	};

	const valuationFormatter = (t, f) => {
		let rate;

		if (t.valuation.rate) {
			rate = t.valuation.rate;
		} else if (t.snapshot.open.getIsZero()) {
			rate = null;
		} else {
			rate = t.valuation.value.divide(t.snapshot.open);
		}

		f.price = rate;
	};

	const cashFormatter = (t, f) => {
		f.total = t.quantity;
	};

	const debitFormatter = (t, f) => {
		f.description = t.description;
	};

	const creditFormatter = (t, f) => {
		f.description = t.description;
	};

	const formatters = new Map();

	formatters.set(TransactionType.BUY, [ basicFormatter, buySellFormatter, averageCostFormatter ]);
	formatters.set(TransactionType.SELL, [ basicFormatter, buySellFormatter, averageCostFormatter ]);
	formatters.set(TransactionType.BUY_SHORT, [ basicFormatter, buySellFormatter, averageCostFormatter ]);
	formatters.set(TransactionType.SELL_SHORT, [ basicFormatter, buySellFormatter, averageCostFormatter ]);
	formatters.set(TransactionType.DIVIDEND, [ basicFormatter, dividendFormatter, averageCostFormatter ]);
	formatters.set(TransactionType.DIVIDEND_STOCK, [ basicFormatter, dividendStockFormatter, averageCostFormatter ]);
	formatters.set(TransactionType.DIVIDEND_REINVEST, [ basicFormatter, dividendReinvestFormatter, averageCostFormatter ]);
	formatters.set(TransactionType.DISTRIBUTION_CASH, [ basicFormatter, distributionCashFormatter, averageCostFormatter ]);
	formatters.set(TransactionType.DISTRIBUTION_FUND, [ basicFormatter, distributionFundFormatter, averageCostFormatter ]);
	formatters.set(TransactionType.DISTRIBUTION_REINVEST, [ basicFormatter, distributionReinvestFormatter, averageCostFormatter ]);
	formatters.set(TransactionType.INCOME, [ basicFormatter, incomeFormatter, averageCostFormatter ]);
	formatters.set(TransactionType.FEE, [ basicFormatter, feeFormatter, averageCostFormatter ]);
	formatters.set(TransactionType.FEE_UNITS, [ basicFormatter, feeUnitsFormatter, averageCostFormatter ]);
	formatters.set(TransactionType.SPLIT, [ basicFormatter, splitFormatter, averageCostFormatter ]);
	formatters.set(TransactionType.VALUATION, [ basicFormatter, valuationFormatter, averageCostFormatter ]);
	formatters.set(TransactionType.DELIST, [ basicFormatter, averageCostFormatter ]);
	formatters.set(TransactionType.DEPOSIT, [ basicFormatter, cashFormatter ]);
	formatters.set(TransactionType.WITHDRAWAL, [ basicFormatter, cashFormatter ]);
	formatters.set(TransactionType.DEBIT, [ basicFormatter, cashFormatter, debitFormatter ]);
	formatters.set(TransactionType.CREDIT, [ basicFormatter, cashFormatter, creditFormatter ]);

	function getInstrumentTypePriority(type) {
		if (type === InstrumentType.CASH) {
			return 1;
		} else {
			return 0;
		}
	}

	const comparatorAscending = ComparatorBuilder.startWith((a, b) => Day.compareDays(a.date, b.date))
		.thenBy((a, b) => comparators.compareNumbers(getInstrumentTypePriority(a.instrument.type), getInstrumentTypePriority(b.instrument.type)))
		.thenBy((a, b) => comparators.compareStrings(a.instrument.id, b.instrument.id))
		.thenBy((a, b) => comparators.compareNumbers(a.sequence, b.sequence))
		.toComparator();

	const comparatorDescending = ComparatorBuilder.startWith((a, b) => comparatorAscending(b, a))
		.toComparator();

	return TransactionFormatter;
})();
