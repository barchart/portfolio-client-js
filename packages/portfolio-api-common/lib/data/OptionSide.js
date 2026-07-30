const Enum = require('@barchart/common-js/lang/Enum');

module.exports = (() => {
	'use strict';

	/**
	 * Indicates whether an option conveys the right to buy or
	 * sell the underlying instrument.
	 *
	 * @public
	 * @extends {Enum}
	 * @param {String} code
	 * @param {String} description
	 */
	class OptionSide extends Enum {
		constructor(code, description) {
			super(code, description);
		}

		/**
		 * The right to buy the underlying instrument.
		 *
		 * @public
		 * @static
		 * @returns {OptionSide}
		 */
		static get CALL() {
			return call;
		}

		/**
		 * The right to sell the underlying instrument.
		 *
		 * @public
		 * @static
		 * @returns {OptionSide}
		 */
		static get PUT() {
			return put;
		}

		/**
		 * @public
		 * @static
		 * @param {String} code
		 * @returns {OptionSide|null}
		 */
		static parse(code) {
			return Enum.fromCode(OptionSide, code);
		}

		toString() {
			return `[OptionSide (code=${this.code})]`;
		}
	}

	const put = new OptionSide('PUT', 'Put');
	const call = new OptionSide('CALL', 'Call');

	return OptionSide;
})();
