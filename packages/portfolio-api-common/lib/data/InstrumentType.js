const assert = require('@barchart/common-js/lang/assert'),
	Enum = require('@barchart/common-js/lang/Enum');

module.exports = (() => {
	'use strict';

	/**
	 * An enumeration used to classify instruments.
	 *
	 * @public
	 * @extends {Enum}
	 * @param {String} description
	 * @param {String} groupDescription
	 * @param {String} code
	 * @param {Boolean} canReinvest
	 */
	class InstrumentType extends Enum {
		constructor(code, description, groupDescription, canReinvest) {
			super(code, description);

			this._groupDescription = groupDescription;
			this._canReinvest = canReinvest;
		}

		get groupDescription() {
			return this._groupDescription;
		}

		/**
		 * Indicates if the instrument type allows automatic reinvestment.
		 *
		 * @returns {Boolean}
		 */
		get canReinvest() {
			return this._canReinvest;
		}

		/**
		 * Cash.
		 *
		 * @public
		 * @returns {InstrumentType}
		 */
		static get CASH() {
			return cash;
		}

		/**
		 * An equity issue.
		 *
		 * @public
		 * @returns {InstrumentType}
		 */
		static get EQUITY() {
			return equity;
		}

		/**
		 * A mutual fund.
		 *
		 * @public
		 * @returns {InstrumentType}
		 */
		static get FUND() {
			return fund;
		}

		/**
		 * An undefined asset (e.g. a house, or a collectible, or a salvaged alien spaceship).
		 *
		 * @public
		 * @returns {InstrumentType}
		 */
		static get OTHER() {
			return other;
		}

		toString() {
			return '[InstrumentType]';
		}
	}

	const cash = new InstrumentType('CASH', 'cash', 'Cash', false);
	const equity = new InstrumentType('EQUITY', 'equity', 'Equities', true);
	const fund = new InstrumentType('FUND', 'mutual fund', 'Funds', true);
	const other = new InstrumentType('OTHER', 'other', 'Other', false);

	return InstrumentType;
})();
