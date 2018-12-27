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
		 * If true, the corporate action is fictitious -- used only for internal
		 * system purposes.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get internal() {
			return this._internal;
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
		 * A delisting.
		 *
		 * @public
		 * @static
		 * @returns {CorporateActionType}
		 */
		static get DELIST() {
			return delist;
		}
	}

	const symbolChange = new CorporateActionType('SYMBOL_CHANGE', 'Symbol Change', false);
	const nameChange = new CorporateActionType('NAME_CHANGE', 'Name Change', false);
	const dividend = new CorporateActionType('DIVIDEND', 'Dividend', false);
	const split = new CorporateActionType('SPLIT', 'Split', false);
	const delist = new CorporateActionType('DELIST', 'Delist', false);

	return CorporateActionType;
})();
