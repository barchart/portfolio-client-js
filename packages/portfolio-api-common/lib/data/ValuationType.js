const Enum = require('@barchart/common-js/lang/Enum');

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
	class ValuationType extends Enum {
		constructor(code, description) {
			super(code, description);
		}

		/**
		 * Given a code, returns the enumeration item.
		 *
		 * @public
		 * @param {String} code
		 * @returns {ValuationType|null}
		 */
		static parse(code) {
			return Enum.fromCode(ValuationType, code);
		}

		/**
		 * A valuation method that uses average costing.
		 *
		 * @public
		 * @returns {ValuationType}
		 */
		static get AVERAGE_COST() {
			return averageCost;
		}

		/**
		 * A valuation method that uses first-in, first-out methodology.
		 *
		 * @public
		 * @returns {ValuationType}
		 */
		static get FIFO() {
			return fifo;
		}

		toString() {
			return '[ValuationType]';
		}
	}

	const fifo = new ValuationType('FIFO', 'first in, first out');
	const averageCost = new ValuationType('AVG', 'average cost');

	return ValuationType;
})();
