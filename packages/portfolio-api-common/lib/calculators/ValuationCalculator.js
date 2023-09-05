const Decimal = require('@barchart/common-js/lang/Decimal'),
	is = require('@barchart/common-js/lang/is');

const InstrumentType = require('./../data/InstrumentType');

module.exports = (() => {
	'use strict';

	/**
	 * Static utilities for calculating the value of a position.
	 *
	 * @public
	 */
	class ValuationCalculator {
		constructor() {

		}

		/**
		 * Calculates the value of a position.
		 *
		 * @public
		 * @static
		 * @param {Object} instrument
		 * @param {Decimal|Number} price
		 * @param {Decimal|Number} quantity
		 * @returns {null|Decimal}
		 */
		static calculate(instrument, price, quantity) {
			let priceToUse = null;

			if (is.number(price)) {
				priceToUse = new Decimal(price);
			} else if (price instanceof Decimal) {
				priceToUse = price;
			}

			if (priceToUse === null) {
				return null;
			}

			const calculator = calculators.get(instrument.type);

			return calculator(instrument, priceToUse, quantity);
		}

		toString() {
			return `[ValuationCalculator]`;
		}
	}

	function calculateForCash(instrument, price, quantity) {
		return new Decimal(quantity);
	}

	function calculateForEquity(instrument, price, quantity) {
		return price.multiply(quantity);
	}

	function calculateForEquityOption(instrument, price, quantity) {
		const priceMultiplier = instrument.option.multiplier;

		return price.multiply(priceMultiplier).multiply(quantity);
	}

	function calculateForFund(instrument, price, quantity) {
		return price.multiply(quantity);
	}

	function calculateForFuture(instrument, price, quantity) {
		const minimumTick = instrument.future.tick;
		const minimumTickValue = instrument.future.value;

		return price.divide(minimumTick).multiply(minimumTickValue).multiply(quantity);
	}

	function calculateForFutureOption(instrument, price, quantity) {
		const minimumTick = instrument.option.tick;
		const minimumTickValue = instrument.option.value;

		return price.divide(minimumTick).multiply(minimumTickValue).multiply(quantity);
	}

	function calculateForOther(instrument, price, quantity) {
		return price.multiply(quantity);
	}

	const calculators = new Map();

	calculators.set(InstrumentType.CASH, calculateForCash);
	calculators.set(InstrumentType.EQUITY, calculateForEquity);
	calculators.set(InstrumentType.EQUITY_OPTION, calculateForEquityOption);
	calculators.set(InstrumentType.FUND, calculateForFund);
	calculators.set(InstrumentType.FUTURE, calculateForFuture);
	calculators.set(InstrumentType.FUTURE_OPTION, calculateForFutureOption);
	calculators.set(InstrumentType.OTHER, calculateForOther);

	return ValuationCalculator;
})();
