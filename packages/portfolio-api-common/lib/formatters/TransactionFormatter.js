const assert = require('@barchart/common-js/lang/assert'),
	ComparatorBuilder = require('@barchart/common-js/collections/sorting/ComparatorBuilder'),
	comparators = require('@barchart/common-js/collections/sorting/comparators'),
	Day = require('@barchart/common-js/lang/Day'),
	Decimal = require('@barchart/common-js/lang/Decimal'),
	is = require('@barchart/common-js/lang/is'),
	formatter = require('@barchart/common-js/lang/formatter');

formatter.numberToFraction = require('@barchart/marketdata-api-js/lib/utilities/format/fraction');

const InstrumentType = require('./../data/InstrumentType'),
	TransactionType = require('./../data/TransactionType');

const AveragePriceCalculator = require('./../calculators/AveragePriceCalculator');

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
		 * @param {Boolean=} fractions
		 * @returns {Array}
		 */
		static format(transactions, positions, descending, fractions) {
			assert.argumentIsArray(transactions, 'transactions');
			assert.argumentIsArray(positions, 'positions');
			assert.argumentIsOptional(descending, 'descending', Boolean);
			assert.argumentIsOptional(fractions, 'fractions', Boolean);

			const instruments = positions.reduce((map, p) => {
				const instrument = Object.assign({ }, p.instrument || { });

				map[p.position] = instrument;

				return map;
			}, { });

			const list = transactions.reduce((accumulator, transaction) => {
				const position = transaction.position;

				if (instruments.hasOwnProperty(position)) {
					let instrument = instruments[position];
					let formatted = { instrument, raw: { } };

					const formatterFunctions = formatters.get(transaction.type);

					formatterFunctions.forEach((formatterFunction) => {
						formatterFunction(transaction, formatted);
					});

					Object.keys(formatted).forEach((key) => {
						const value = formatted[key];

						if (value instanceof Decimal) {
							if (fractions && (instrument.type === InstrumentType.FUTURE || instrument.type === InstrumentType.FUTURE_OPTION) && keys.fractions.some(k => k === key)) {
								const code = instrument.code;

								const rounded = code.roundToNearestTick(value.toFloat(), instrument.future.tick, true);

								formatted[key] = formatter.numberToFraction(rounded, code.fractionFactor, code.fractionDigits, '-', true);
							} else {
								const precision = instrument.currency.precision;

								formatted[key] = formatter.numberToString(value.toFloat(), precision, ',');
							}
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

	const keys = { };

	keys.fractions = [ 'average', 'price' ];

	const basicFormatter = (t, f) => {
		f.date = t.date;
		f.type = t.type.display;
		f.code = t.type.code;
		f.sequence = t.sequence;
		f.position = t.position;
		f.open = t.snapshot.open;
		f.transaction = t.transaction;

		f.raw.open = getRawForDecimal(f.open);
	};

	const averageCostFormatter = (t, f) => {
		const basis = t.snapshot.basis;
		const open = t.snapshot.open;

		let average;

		if (basis && open && !open.getIsZero()) {
			average = AveragePriceCalculator.calculate(f.instrument, basis, open);
		} else {
			average = '';
		}

		f.average = average;
		f.raw.average = getRawForDecimal(average);
	};

	const buySellFormatter = (t, f) => {
		f.boughtSold = t.quantity;
		f.price = t.trade.price;
		f.fee = t.fee;
		f.total = t.amount;
		f.raw.total = getRawForDecimal(f.total);
		f.raw.price = getRawForDecimal(f.price);
		f.raw.boughtSold = getRawForDecimal(f.boughtSold);
	};

	const dividendFormatter = (t, f) => {
		f.total = t.dividend.amount;
		f.rate = t.dividend.rate;

		let shares;
		
		if (t.dividend.open) {
			shares = t.dividend.open;
		} else {
			if (!t.dividend.rate.getIsZero()) {
				if (t.dividend.native) {
					shares = t.dividend.native.divide(t.dividend.rate);
				} else {
					shares = t.dividend.amount.divide(t.dividend.rate);
				}
			} else {
				shares = '';
			}

			if (shares) {
				const rounded = shares.round(0);

				if (rounded.subtract(shares).absolute().getIsLessThan(0.01)) {
					shares = rounded;
				} else {
					shares = shares.round(2);
				}
			}
		}

		f.shares = shares;

		if (t.dividend.currency) {
			f.currency = t.dividend.currency;
		}

		if (t.dividend.native) {
			f.native = t.dividend.native;
			f.raw.native = getRawForDecimal(f.native);
		}

		f.raw.rate = getRawForDecimal(f.rate);
		f.raw.shares = getRawForDecimal(f.shares);
		f.raw.total = getRawForDecimal(f.total);
	};

	const distributionCashFormatter = (t, f) => {
		f.total = t.dividend.amount;
		f.rate = t.dividend.rate;

		let shares;

		if (t.dividend.open) {
			shares = t.dividend.open;
		} else {
			if (!t.dividend.rate.getIsZero()) {
				if (t.dividend.native) {
					shares = t.dividend.native.divide(t.dividend.rate);
				} else {
					shares = t.dividend.amount.divide(t.dividend.rate);
				}
			} else {
				shares = '';
			}

			if (shares) {
				const rounded = shares.round(0);

				if (rounded.subtract(shares).absolute().getIsLessThan(0.01)) {
					shares = rounded;
				} else {
					shares = shares.round(2);
				}
			}	
		}

		f.shares = shares;

		if (t.dividend.currency) {
			f.currency = t.dividend.currency;
		}

		if (t.dividend.native) {
			f.native = t.dividend.native;
			f.raw.native = getRawForDecimal(f.native);
		}

		f.raw.rate = getRawForDecimal(f.rate);
		f.raw.shares = getRawForDecimal(f.shares);
		f.raw.total = getRawForDecimal(f.total);
	};

	const dividendReinvestFormatter = (t, f) => {
		f.boughtSold = t.quantity;

		if (f.fee && !f.fee.getIsZero()) {
			f.fee = t.fee;
		}

		if (t.dividend.currency) {
			f.currency = t.dividend.currency;
		}

		f.price = t.dividend.price;
		f.rate = t.dividend.rate;

		f.shares = t.snapshot.open.subtract(t.quantity);

		f.raw.rate = getRawForDecimal(f.rate);
		f.raw.shares = getRawForDecimal(f.shares);
		f.raw.price = getRawForDecimal(f.price);
		f.raw.boughtSold = getRawForDecimal(f.boughtSold);
	};

	const distributionReinvestFormatter = (t, f) => {
		f.boughtSold = t.quantity;

		if (f.fee && !f.fee.getIsZero()) {
			f.fee = t.fee;
		}

		if (t.dividend.currency) {
			f.currency = t.dividend.currency;
		}

		f.price = t.dividend.price;
		f.rate = t.dividend.rate;

		f.shares = t.snapshot.open.subtract(t.quantity);

		f.raw.rate = getRawForDecimal(f.rate);
		f.raw.shares = getRawForDecimal(f.shares);
		f.raw.price = getRawForDecimal(f.price);
		f.raw.boughtSold = getRawForDecimal(f.boughtSold);
	};

	const dividendStockFormatter = (t, f) => {
		f.boughtSold = t.quantity;

		if (f.fee && !f.fee.getIsZero()) {
			f.fee = t.fee;
		}

		if (t.dividend) {
			let rate;

			if (t.dividend.numerator && t.dividend.denominator) {
				if (!t.dividend.denominator.getIsZero()) {
					rate = t.dividend.numerator.divide(t.dividend.denominator);
				} else {
					rate = '';
				}
			} else if (t.dividend.rate) {
				rate = t.dividend.rate;
			}

			f.rate = rate;

			f.raw.rate = getRawForDecimal(f.rate);

			if (t.dividend.price) {
				f.price = t.dividend.price;
				f.raw.price = getRawForDecimal(f.price);
			}
		}

		f.shares = t.snapshot.open.subtract(t.quantity);

		f.raw.shares = getRawForDecimal(f.shares);
		f.raw.boughtSold = getRawForDecimal(f.boughtSold);
	};

	const distributionFundFormatter = (t, f) => {
		f.boughtSold = t.quantity;

		if (f.fee && !f.fee.getIsZero()) {
			f.fee = t.fee;
		}

		if (t.dividend) {
			let rate;

			if (t.dividend.numerator && t.dividend.denominator) {
				if (!t.dividend.denominator.getIsZero()) {
					rate = t.dividend.numerator.divide(t.dividend.denominator);
				} else {
					rate = '';
				}
			} else if (t.dividend.rate) {
				rate = t.dividend.rate;
			}

			f.rate = rate;

			f.raw.rate = getRawForDecimal(f.rate);

			if (t.dividend.price) {
				f.price = t.dividend.price;
				f.raw.price = getRawForDecimal(f.price);
			}
		}

		f.shares = t.snapshot.open.subtract(t.quantity);

		f.raw.shares = getRawForDecimal(f.shares);
		f.raw.boughtSold = getRawForDecimal(f.boughtSold);
	};

	const incomeFormatter = (t, f) => {
		f.total = t.income.amount;
		f.raw.total = getRawForDecimal(f.total);
	};

	const feeFormatter = (t, f) => {
		f.fee = t.charge.amount;
		f.total = t.charge.amount;
		f.raw.total = getRawForDecimal(f.total);
	};

	const feeUnitsFormatter = (t, f) => {
		f.boughtSold = t.quantity;
		f.raw.boughtSold = getRawForDecimal(f.boughtSold);
	};

	const splitFormatter = (t, f) => {
		f.boughtSold = t.quantity;

		let rate;

		if (!t.split.denominator.getIsZero()) {
			rate = t.split.numerator.divide(t.split.denominator);
		} else {
			rate = '';
		}

		f.rate = rate;

		f.shares = t.snapshot.open.subtract(t.quantity);

		f.raw.rate = getRawForDecimal(f.rate);
		f.raw.shares = getRawForDecimal(f.shares);
		f.raw.boughtSold = getRawForDecimal(f.boughtSold);
	};

	const valuationFormatter = (t, f) => {
		let rate;

		if (t.valuation.rate) {
			rate = t.valuation.rate;
		} else if (t.snapshot.open.getIsZero()) {
			rate = null;
		} else {
			if (!t.snapshot.open.getIsZero()) {
				rate = t.valuation.value.divide(t.snapshot.open);
			} else {
				rate = '';
			}
		}

		f.price = rate;
		f.raw.price = getRawForDecimal(f.price);
	};

	const cashFormatter = (t, f) => {
		f.total = t.quantity;
		f.raw.total = getRawForDecimal(f.total);
	};

	const debitFormatter = (t, f) => {
		f.description = t.description;
	};

	const creditFormatter = (t, f) => {
		f.description = t.description;
	};

	const mergerFormatter = (t, f) => {
		f.boughtSold = t.quantity;

		let rate;

		if (!t.merger.denominator.getIsZero()) {
			rate = t.merger.numerator.divide(t.merger.denominator);
		} else {
			rate = '';
		}

		f.rate = rate;

		f.shares = t.snapshot.open.subtract(t.quantity);

		f.raw.rate = getRawForDecimal(f.rate);
		f.raw.shares = getRawForDecimal(f.shares);
		f.raw.boughtSold = getRawForDecimal(f.boughtSold);
	};

	const spinoffFormatter = (t, f) => {
		f.boughtSold = t.quantity;

		let rate;

		if (!t.spinoff.denominator.getIsZero()) {
			rate = t.spinoff.numerator.divide(t.spinoff.denominator);
		} else {
			rate = '';
		}

		f.rate = rate;

		f.shares = t.snapshot.open.subtract(t.quantity);

		f.raw.rate = getRawForDecimal(f.rate);
		f.raw.shares = getRawForDecimal(f.shares);
		f.raw.boughtSold = getRawForDecimal(f.boughtSold);
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
	formatters.set(TransactionType.MERGER_OPEN, [ basicFormatter, averageCostFormatter ]);
	formatters.set(TransactionType.MERGER_CLOSE, [ basicFormatter, mergerFormatter ]);
	formatters.set(TransactionType.SPINOFF, [ basicFormatter, spinoffFormatter, averageCostFormatter ]);
	formatters.set(TransactionType.SPINOFF_OPEN, [ basicFormatter, averageCostFormatter ]);

	function getInstrumentTypePriority(type) {
		if (type === InstrumentType.CASH) {
			return 1;
		} else {
			return 0;
		}
	}
	
	function getRawForDecimal(value) {
		return value && value instanceof Decimal ? value.toFloat() : value;
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
