const assert = require('@barchart/common-js/lang/assert'),
	Enum = require('@barchart/common-js/lang/Enum');

module.exports = (() => {
	'use strict';

	/**
	 * An enumeration item that describes a strategy for calculating basis.
	 *
	 * @public
	 * @extends {Enum}
	 * @param {String} description
	 * @param {String} code
	 */
	class PortfolioType extends Enum {
		constructor(code, description) {
			super(code, description);
		}

		/**
		 * Given a code, returns the enumeration item.
		 *
		 * @public
		 * @param {String} code
		 * @returns {PortfolioType|null}
		 */
		static parse(code) {
			return Enum.fromCode(PortfolioType, code);
		}

		/**
		 * A valuation method that uses first-in, first-out methodology.
		 *
		 * @public
		 * @returns {PortfolioType}
		 */
		static get TFSA() {
			return tfsa;
		}

		/**
		 * A valuation method that uses first-in, first-out methodology.
		 *
		 * @public
		 * @returns {PortfolioType}
		 */
		static get RRSP() {
			return rrsp;
		}

		/**
		 * A valuation method that uses first-in, first-out methodology.
		 *
		 * @public
		 * @returns {PortfolioType}
		 */
		static get RRIF() {
			return rrif;
		}

		/**
		 * A valuation method that uses first-in, first-out methodology.
		 *
		 * @public
		 * @returns {PortfolioType}
		 */
		static get RESP() {
			return resp;
		}

		/**
		 * A valuation method that uses first-in, first-out methodology.
		 *
		 * @public
		 * @returns {PortfolioType}
		 */
		static get RDSP() {
			return rdsp;
		}

		/**
		 * A valuation method that uses first-in, first-out methodology.
		 *
		 * @public
		 * @returns {PortfolioType}
		 */
		static get IRA() {
			return ira;
		}

		/**
		 * A valuation method that uses first-in, first-out methodology.
		 *
		 * @public
		 * @returns {PortfolioType}
		 */
		static get CASH() {
			return cash;
		}

		/**
		 * A valuation method that uses first-in, first-out methodology.
		 *
		 * @public
		 * @returns {PortfolioType}
		 */
		static get OTHER() {
			return other;
		}

		toString() {
			return '[PortfolioType]';
		}
	}

	const tfsa = new PortfolioType('TFSA', 'Tax-Free Savings (TFSA)');
	const rrsp = new PortfolioType('RRSP', 'Retirement Savings (RRSP)');
	const rrif = new PortfolioType('RRIF', 'Retirement Income (RRIF)');
	const resp = new PortfolioType('RESP', 'Education Savings (RESP)');
	const rdsp = new PortfolioType('RDSP', 'Disability Savings (RDSP)');
	const ira = new PortfolioType('IRA', 'Individual Retirement Account (IRA)');
	const cash = new PortfolioType('CASH', 'Taxable (Cash)');
	const other = new PortfolioType('OTHER', 'Other Assets');

	return PortfolioType;
})();
