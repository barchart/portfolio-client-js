const Enum = require('@barchart/common-js/lang/Enum');

module.exports = (() => {
	'use strict';

	/**
	 * Types of corporate actions.
	 *
	 * @public
	 * @extends {Enum}
	 * @param {String} code
	 * @param {String} description
	 */
	class CorporateActionType extends Enum {
		constructor(code, description) {
			super(code, description);
		}

		/**
		 * A split.
		 *
		 * @public
		 * @static
		 * @returns {CorporateActionType}
		 */
		static get SPLIT() {
			return split;
		}

		/**
		 * A dividend.
		 *
		 * @public
		 * @static
		 * @returns {CorporateActionType}
		 */
		static get DIVIDEND() {
			return dividend;
		}

		/**
		 * A stock dividend.
		 *
		 * @public
		 * @static
		 * @returns {CorporateActionType}
		 */
		static get STOCK_DIVIDEND() {
			return stockDividend;
		}

		/**
		 * A symbol change.
		 *
		 * @public
		 * @static
		 * @returns {CorporateActionType}
		 */
		static get SYMBOL_CHANGE() {
			return symbolChange;
		}

		/**
		 * A name change.
		 *
		 * @public
		 * @static
		 * @returns {CorporateActionType}
		 */
		static get NAME_CHANGE() {
			return nameChange;
		}

		/**
		 * A delisting.
		 *
		 * @public
		 * @static
		 * @returns {CorporateActionType}
		 */
		static get DELIST() {
			return delist;
		}

		/**
		 * A merging.
		 *
		 * @public
		 * @static
		 * @returns {CorporateActionType}
		 */
		static get MERGER() {
			return merger;
		}

		/**
		 * A spinoff.
		 *
		 * @public
		 * @static
		 * @returns {CorporateActionType}
		 */
		static get SPINOFF() {
			return spinoff;
		}

		/**
		 * @public
		 * @static
		 * @param {String} code
		 * @returns {CorporateActionType|null}
		 */
		static parse(code) {
			return Enum.fromCode(CorporateActionType, code);
		}

		toString() {
			return `[CorporateActionType (code=${this.code})]`;
		}
	}

	const split = new CorporateActionType('SPLIT', 'Split');
	const dividend = new CorporateActionType('DIVIDEND', 'Dividend');
	const stockDividend = new CorporateActionType('STOCK_DIVIDEND', 'Stock Dividend');
	const symbolChange = new CorporateActionType('SYMBOL_CHANGE', 'Symbol Change');
	const nameChange = new CorporateActionType('NAME_CHANGE', 'Name Change');
	const delist = new CorporateActionType('DELIST', 'Delist');
	const merger = new CorporateActionType('MERGER', 'Merger');
	const spinoff = new CorporateActionType('SPINOFF', 'Spinoff');

	return CorporateActionType;
})();
