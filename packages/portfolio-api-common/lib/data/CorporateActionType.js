const Enum = require('@barchart/common-js/lang/Enum'),
	is = require('@barchart/common-js/lang/is');

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
	}

	const split = new CorporateActionType('SPLIT', 'Split', false);
	const dividend = new CorporateActionType('DIVIDEND', 'Dividend', false);
	const stockDividend = new CorporateActionType('STOCK_DIVIDEND', 'Stock Dividend', false);
	const symbolChange = new CorporateActionType('SYMBOL_CHANGE', 'Symbol Change', false);
	const nameChange = new CorporateActionType('NAME_CHANGE', 'Name Change', false);
	const delist = new CorporateActionType('DELIST', 'Delist', false);
	const merger = new CorporateActionType('MERGER', 'Merger', false);

	return CorporateActionType;
})();
