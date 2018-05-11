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
	 * @param {Boolean} canShort
	 * @param {Boolean} canSwitchDirection
	 * @param {Boolean} usesSymbols
	 * @param {Function} usesSymbols
	 */
	class InstrumentType extends Enum {
		constructor(code, description, alternateDescription, canReinvest, canShort, canSwitchDirection, usesSymbols, generator) {
			super(code, description);

			assert.argumentIsRequired(alternateDescription, 'alternateDescription', String);
			assert.argumentIsRequired(canReinvest, 'canReinvest', Boolean);
			assert.argumentIsRequired(canShort, 'canShort', Boolean);
			assert.argumentIsRequired(canSwitchDirection, 'canSwitchDirection', Boolean);
			assert.argumentIsRequired(usesSymbols, 'usesSymbols', Boolean);
			assert.argumentIsRequired(generator, 'generator', Function);

			this._alternateDescription = alternateDescription;
			this._canReinvest = canReinvest;
			this._canShort = canShort;
			this._canSwitchDirection = canSwitchDirection;
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
		 * Indicates if short-selling is possible for this instrument type.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get canShort() {
			return this._canShort;
		}

		/**
		 * Indicates if one transaction is allowed to switch a position size from
		 * positive to negative (or vice versa).
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get canSwitchDirection() {
			return this._canSwitchDirection;
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
		 * @param {Object} instrument
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
		 * @public
		 * @static
		 * @param {Object} instrument
		 * @returns {String}
		 */
		static generateIdentifier(instrument) {
			return map[instrument.type.code].generateIdentifier(instrument);
		}

		/**
		 *
		 * @public
		 * @static
		 * @param code
		 * @return {InstrumentType}
		 */
		static fromSymbolType(code) {
			assert.argumentIsRequired(code, 'code', Number);

			if (code === 1 || code === 6 || code === 7) {
				return InstrumentType.EQUITY;
			} else if (code === 5 || code == 15) {
				return InstrumentType.FUND;
			} else {
				throw new Error('Unable to determine InstrumentType for [', code, ']');
			}
		}

		toString() {
			return '[InstrumentType]';
		}
	}

	const cash = new InstrumentType('CASH', 'cash', 'Cash', false, false, true, false, (instrument) => `BARCHART-${instrument.type.code}-${instrument.currency.code}`);
	const equity = new InstrumentType('EQUITY', 'equity', 'Equities', true, true, false, true, (instrument) => `BARCHART-${instrument.type.code}-${instrument.symbol.barchart}`);
	const fund = new InstrumentType('FUND', 'mutual fund', 'Funds', true, false, false, true, (instrument) => `BARCHART-${instrument.type.code}-${instrument.symbol.barchart}`);
	const other = new InstrumentType('OTHER', 'other', 'Other', false, false, false, false, (instrument) => `BARCHART-${instrument.type.code}-${uuid.v4()}`);

	const map = { };

	map[cash.code] = cash;
	map[equity.code] = equity;
	map[fund.code] = fund;
	map[other.code] = other;

	return InstrumentType;
})();
