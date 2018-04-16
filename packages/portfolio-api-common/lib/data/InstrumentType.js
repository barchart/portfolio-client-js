const uuid = require('uuid');

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
	 * @param {String} alternateDescription
	 * @param {String} code
	 * @param {Boolean} canReinvest
	 * @param {Boolean} usesSymbols
	 */
	class InstrumentType extends Enum {
		constructor(code, description, alternateDescription, canReinvest, usesSymbols, generator) {
			super(code, description);

			assert.argumentIsRequired(alternateDescription, 'alternateDescription', String);
			assert.argumentIsRequired(canReinvest, 'canReinvest', Boolean);
			assert.argumentIsRequired(usesSymbols, 'usesSymbols', Boolean);
			assert.argumentIsRequired(generator, 'generator', Function);

			this._alternateDescription = alternateDescription;
			this._canReinvest = canReinvest;
			this._usesSymbols = usesSymbols;

			this._generator = generator;
		}

		/**
		 * A human-readable description.
		 *
		 * @public
		 * @return {String}
		 */
		get alternateDescription() {
			return this._alternateDescription;
		}

		/**
		 * Indicates if the instrument type allows automatic reinvestment.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get canReinvest() {
			return this._canReinvest;
		}

		/**
		 * Indicates if an instrument of this type can be represented by a symbol.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get usesSymbols() {
			return this._usesSymbols;
		}

		/**
		 * Generates an identifier for the instrument.
		 *
		 * @public
		 * @param instrument
		 * @returns {String}
		 */
		generateIdentifier(instrument) {
			assert.argumentIsRequired(instrument, 'instrument');

			if (instrument.type !== this) {
				throw new Error('Unable to generate instrument identifier for incompatible type.');
			}

			return this._generator(instrument);
		}

		/**
		 * Cash.
		 *
		 * @public
		 * @static
		 * @returns {InstrumentType}
		 */
		static get CASH() {
			return cash;
		}

		/**
		 * An equity issue.
		 *
		 * @public
		 * @static
		 * @returns {InstrumentType}
		 */
		static get EQUITY() {
			return equity;
		}

		/**
		 * A mutual fund.
		 *
		 * @public
		 * @static
		 * @returns {InstrumentType}
		 */
		static get FUND() {
			return fund;
		}

		/**
		 * An undefined asset (e.g. a house, or a collectible, or a salvaged alien spaceship).
		 *
		 * @public
		 * @static
		 * @returns {InstrumentType}
		 */
		static get OTHER() {
			return other;
		}

		/**
		 * Generates an identifier for the instrument.
		 *
		 * @static
		 * @public
		 * @param instrument
		 * @returns {String}
		 */
		static generateIdentifier(instrument) {
			return map[instrument.type.code].generateIdentifier(instrument);
		}

		toString() {
			return '[InstrumentType]';
		}
	}

	const cash = new InstrumentType('CASH', 'cash', 'Cash', false, false, (instrument) => `BARCHART-${instrument.type.code}-${instrument.currency.code}`);
	const equity = new InstrumentType('EQUITY', 'equity', 'Equities', true, true, (instrument) => `BARCHART-${instrument.type.code}-${instrument.symbol.barchart}`);
	const fund = new InstrumentType('FUND', 'mutual fund', 'Funds', true, true, (instrument) => `BARCHART-${instrument.type.code}-${instrument.symbol.barchart}`);
	const other = new InstrumentType('OTHER', 'other', 'Other', false, false, (instrument) => `BARCHART-${instrument.type.code}-${uuid.v4()}`);

	const map = { };

	map[cash.code] = cash;
	map[equity.code] = equity;
	map[fund.code] = fund;
	map[other.code] = other;

	return InstrumentType;
})();
