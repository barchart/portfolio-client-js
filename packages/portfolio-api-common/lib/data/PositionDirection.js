const assert = require('@barchart/common-js/lang/assert'),
	Decimal = require('@barchart/common-js/lang/Decimal'),
	Enum = require('@barchart/common-js/lang/Enum');

module.exports = (() => {
	'use strict';

	/**
	 * Describes a position size -- positive values are long, negative values
	 * are short and zero values are even.
	 *
	 * @public
	 * @extends {Enum}
	 * @param {String} code
	 * @param {String} description
	 * @param {sign} sign
	 */
	class PositionDirection extends Enum {
		constructor(code, description, sign) {
			super(code, description);

			assert.argumentIsRequired(sign, 'sign', String);
			
			this._sign = sign;
		}

		/**
		 * A description of the positiveness or negativeness of the size of the
		 * position.
		 *
		 * @public
		 * @returns {String}
		 */
		get sign() {
			return this._sign;
		}

		/**
		 * Indicates if the position size is positive (i.e. is {@link PositionDirection.LONG}).
		 *
		 * @public
		 * @returns {boolean}
		 */
		get positive() {
			return this === long;
		}

		/**
		 * Indicates if the position size is negative (i.e. is {@link PositionDirection.SHORT}).
		 *
		 * @public
		 * @returns {boolean}
		 */
		get negative() {
			return this === short;
		}

		/**
		 * Indicates if the position size is zero (i.e. is {@link PositionDirection.EVEN}).
		 *
		 * @public
		 * @returns {boolean}
		 */
		get closed() {
			return this === even;
		}

		/**
		 * A positive quantity position.
		 * 
		 * @public
		 * @static
		 * @returns {PositionDirection}
		 */
		static get LONG() {
			return long;
		}

		/**
		 * A positive quantity position.
		 *
		 * @public
		 * @static
		 * @returns {PositionDirection}
		 */
		static get SHORT() {
			return short;
		}

		/**
		 * A zero quantity position.
		 *
		 * @public
		 * @static
		 * @returns {PositionDirection}
		 */
		static get EVEN() {
			return even;
		}

		/**
		 * @public
		 * @static
		 * @param {String} code
		 * @returns {PositionDirection|null}
		 */
		static parse(code) {
			return Enum.fromCode(PositionDirection, code);
		}

		/**
		 * Given an open quantity, returns a {@link PositionDirection} that
		 * describes the quantity.
		 *
		 * @public
		 * @static
		 * @param {Decimal} open
		 * @returns {PositionDirection}
		 */
		static for(open) {
			assert.argumentIsRequired(open, 'open', Decimal, 'Decimal');
			
			if (open.getIsPositive()) {
				return long;
			} else if (open.getIsNegative()) {
				return short;
			} else {
				return even;
			}
		}

		toString() {
			return `[PositionDirection (code=${this.code})]`;
		}
	}

	const long = new PositionDirection('LONG', 'Long', 'positive');
	const short = new PositionDirection('SHORT', 'Short', 'negative');
	const even = new PositionDirection('EVEN', 'Even', 'zero');

	return PositionDirection;
})();
