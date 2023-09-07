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
	 * @param {String} code
	 * @param {String} description
	 * @param {String} alternateDescription
	 * @param {Boolean} canExistEmpty
	 * @param {Boolean} canReinvest
	 * @param {Boolean} canShort
	 * @param {Boolean} canSwitchDirection
	 * @param {Boolean} usesSymbols
	 * @param {Boolean} hasCorporateActions
	 * @param {Boolean} allowFractional
	 * @param {Boolean} closeFractional
	 * @param {Boolean} roundQuantity
	 * @param {Boolean} strictOrdering
	 * @param {Function} generator
	 */
	class InstrumentType extends Enum {
		constructor(code, description, alternateDescription, canExistEmpty, canReinvest, canShort, canSwitchDirection, usesSymbols, hasCorporateActions, allowFractional, closeFractional, roundQuantity, strictOrdering, generator) {
			super(code, description);

			assert.argumentIsRequired(alternateDescription, 'alternateDescription', String);
			assert.argumentIsRequired(canExistEmpty, 'canExistEmpty', Boolean);
			assert.argumentIsRequired(canReinvest, 'canReinvest', Boolean);
			assert.argumentIsRequired(canShort, 'canShort', Boolean);
			assert.argumentIsRequired(canSwitchDirection, 'canSwitchDirection', Boolean);
			assert.argumentIsRequired(usesSymbols, 'usesSymbols', Boolean);
			assert.argumentIsRequired(hasCorporateActions, 'hasCorporateActions', Boolean);
			assert.argumentIsRequired(allowFractional, 'allowFractional', Boolean);
			assert.argumentIsRequired(closeFractional, 'closeFractional', Boolean);
			assert.argumentIsRequired(roundQuantity, 'roundQuantity', Boolean);
			assert.argumentIsRequired(strictOrdering, 'strictOrdering', Boolean);
			assert.argumentIsRequired(generator, 'generator', Function);

			this._alternateDescription = alternateDescription;

			this._canExistEmpty = canExistEmpty;
			this._canReinvest = canReinvest;
			this._canShort = canShort;
			this._canSwitchDirection = canSwitchDirection;
			this._usesSymbols = usesSymbols;
			this._hasCorporateActions = hasCorporateActions;
			this._allowFractional = allowFractional;
			this._closeFractional = closeFractional;
			this._roundQuantity = roundQuantity;
			this._strictOrdering = strictOrdering;

			this._generator = generator;
		}

		/**
		 * A human-readable description.
		 *
		 * @public
		 * @returns {String}
		 */
		get alternateDescription() {
			return this._alternateDescription;
		}

		/**
		 * Indicates if the position can exist without any associated transactions.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get canExistEmpty() {
			return this._canExistEmpty;
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
		 * Indicates if corporate actions are possible for this type of instrument.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get hasCorporateActions() {
			return this._hasCorporateActions;
		}

		/**
		 * Indicates if a position can have a fractional value; otherwise, only
		 * integer values are allowed.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get allowFractional() {
			return this._allowFractional;
		}

		/**
		 * Indicates if fractional shares should be closed when the position
		 * size is less than one (or some of the fractional shares are closed).
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get closeFractional() {
			return this._closeFractional;
		}

		/**
		 * Indicates if transaction sequences must be honored before calculating position
		 * totals.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get strictOrdering() {
			return this._strictOrdering;
		}

		/**
		 * Indicates transaction quantities should be rounded.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get roundQuantity() {
			return this._roundQuantity;
		}

		/**
		 * Indicates if the instrument is a futures contract.
		 *
		 * @public
		 * @returns {boolean}
		 */
		get future() {
			return this === future;
		}

		/**
		 * Indicates if the instrument is an option contract.
		 *
		 * @public
		 * @returns {boolean}
		 */
		get option() {
			return this === equityOption || this === futureOption;
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
		 * An option on equity shares.
		 *
		 * @public
		 * @static
		 * @returns {InstrumentType}
		 */
		static get EQUITY_OPTION() {
			return equityOption;
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
		 * A futures contract.
		 *
		 * @public
		 * @static
		 * @returns {InstrumentType}
		 */
		static get FUTURE() {
			return future;
		}

		/**
		 * An option on a futures contract.
		 *
		 * @public
		 * @static
		 * @returns {InstrumentType}
		 */
		static get FUTURE_OPTION() {
			return futureOption;
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
		 * @public
		 * @static
		 * @param {String} code
		 * @returns {InstrumentType|null}
		 */
		static parse(code) {
			return Enum.fromCode(InstrumentType, code);
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
			const type = Enum.fromCode(InstrumentType, instrument.type.code);

			return type.generateIdentifier(instrument);
		}

		/**
		 *
		 * @public
		 * @static
		 * @param {Number} code
		 * @returns {InstrumentType}
		 */
		static fromSymbolType(code) {
			assert.argumentIsRequired(code, 'code', Number);

			if (code === 1 || code === 6 || code === 7 || code === 11) {
				return InstrumentType.EQUITY;
			} else if (code === 34) {
				return InstrumentType.EQUITY_OPTION;
			} else if (code === 5 || code == 15) {
				return InstrumentType.FUND;
			} else if (code === 2) {
				return InstrumentType.FUTURE;
			} else if (code === 12) {
				return InstrumentType.FUTURE_OPTION;
			} else {
				throw new Error(`Unable to determine InstrumentType for [ ${code} ]`);
			}
		}

		toString() {
			return `[InstrumentType (code=${this.code})]`;
		}
	}

	const cash = new InstrumentType('CASH', 'cash', 'Cash', true, false, false, true, false, false, true, false, false, false, instrument => `BARCHART-${instrument.type.code}-${instrument.currency.code}`);
	const equity = new InstrumentType('EQUITY', 'equity', 'Equities', false, true, true, false, true, true, true, true, true, true, instrument => `BARCHART-${instrument.type.code}-${instrument.symbol.barchart}`);
	const equityOption = new InstrumentType('EQUITY_OPTION', 'equity option', 'Equity Options', false, false, true, false, true, false, false, false, false, true, instrument => `BARCHART-${instrument.type.code}-${instrument.symbol.barchart}`);
	const fund = new InstrumentType('FUND', 'mutual fund', 'Funds', false, true, false, false, true, true, true,false, true, true, instrument => `BARCHART-${instrument.type.code}-${instrument.symbol.barchart}`);
	const future = new InstrumentType('FUTURE', 'futures contract', 'Futures', false, false, true, false, true, false, false, false, false, true, instrument => `BARCHART-${instrument.type.code}-${instrument.symbol.barchart}`);
	const futureOption = new InstrumentType('FUTURE_OPTION', 'futures option', 'Futures Options', false, false, true, false, true, false, false, false, false, true, instrument => `BARCHART-${instrument.type.code}-${instrument.symbol.barchart}`);
	const other = new InstrumentType('OTHER', 'other', 'Other', false, false, false, false, false, false, true,false, true, true, instrument => `BARCHART-${instrument.type.code}-${uuid.v4()}`);

	return InstrumentType;
})();
