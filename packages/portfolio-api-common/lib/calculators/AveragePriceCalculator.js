const Decimal = require('@barchart/common-js/lang/Decimal'),
	is = require('@barchart/common-js/lang/is');

const InstrumentType = require('./../data/InstrumentType');

module.exports = (() => {
	'use strict';

	/**
	 * Static utilities for calculating the average price of a position.
	 *
	 * @public
	 */
	class AveragePriceCalculator {
		constructor() {

		}

		/**
		 * Calculates the average price of a position.
		 *
		 * @public
		 * @static
		 * @param {Object} instrument
		 * @param {Decimal|Number} basis
		 * @param {Decimal|Number} quantity
		 * @returns {null|Decimal}
		 */
		static calculate(instrument, basis, quantity) {
			let basisToUse = null;

			if (is.number(basis)) {
				basisToUse = new Decimal(basis);
			} else if (basis instanceof Decimal) {
				basisToUse = basis;
			}

			const calculator = calculators.get(instrument.type);

			return calculator(instrument, basisToUse, quantity);
		}

		toString() {
			return `[AveragePriceCalculator]`;
		}
	}

	function calculateForCash(instrument, basis, quantity) {
		return Decimal.ONE;
	}

	function calculateForEquity(instrument, basis, quantity) {
		if (basis === null) {
			return null;
		}

		if (quantity === Decimal.ZERO || quantity === 0) {
			return null;
		}

		return basis.divide(quantity).opposite();
	}

	function calculateForEquityOption(instrument, basis, quantity) {
		if (basis === null) {
			return null;
		}

		if (quantity === Decimal.ZERO || quantity === 0) {
			return null;
		}

		const multiplier = instrument.option.multiplier;

		return basis.divide(quantity).divide(multiplier).opposite();
	}

	function calculateForFund(instrument, basis, quantity) {
		if (basis === null) {
			return null;
		}

		if (quantity === Decimal.ZERO || quantity === 0) {
			return null;
		}

		return basis.divide(quantity).opposite();
	}

	function calculateForFuture(instrument, basis, quantity) {
		if (basis === null) {
			return null;
		}

		if (quantity === Decimal.ZERO || quantity === 0) {
			return null;
		}

		const minimumTick = instrument.future.tick;
		const minimumTickValue = instrument.future.value;

		return basis.divide(quantity).multiply(minimumTick).divide(minimumTickValue).opposite();
	}

	function calculateForFutureOption(instrument, basis, quantity) {
		if (basis === null) {
			return null;
		}

		if (quantity === Decimal.ZERO || quantity === 0) {
			return null;
		}

		const minimumTick = instrument.option.tick;
		const minimumTickValue = instrument.option.value;

		return basis.divide(quantity).multiply(minimumTick).divide(minimumTickValue).opposite();
	}

	function calculateForOther(instrument, basis, quantity) {
		if (basis === null) {
			return null;
		}

		if (quantity === Decimal.ZERO || quantity === 0) {
			return null;
		}

		return basis.divide(quantity).opposite();
	}

	const calculators = new Map();

	calculators.set(InstrumentType.CASH, calculateForCash);
	calculators.set(InstrumentType.EQUITY, calculateForEquity);
	calculators.set(InstrumentType.EQUITY_OPTION, calculateForEquityOption);
	calculators.set(InstrumentType.FUND, calculateForFund);
	calculators.set(InstrumentType.FUTURE, calculateForFuture);
	calculators.set(InstrumentType.FUTURE_OPTION, calculateForFutureOption);
	calculators.set(InstrumentType.OTHER, calculateForOther);

	return AveragePriceCalculator;
})();
