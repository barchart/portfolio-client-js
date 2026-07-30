const Enum = require('@barchart/common-js/lang/Enum');

module.exports = (() => {
	'use strict';

	/**
	 * An enumeration item that describes a strategy for importing positions
	 * into a SnapTrade-linked account.
	 *
	 * @public
	 * @extends {Enum}
	 * @param {String} code
	 */
	class SnapTradeLinkMode extends Enum {
		constructor(code) {
			super(code, code);
		}

		static get STANDARD() {
			return standard;
		}

		static get LIMITED() {
			return limited;
		}

		/**
		 * Given a code, returns the enumeration item.
		 *
		 * @public
		 * @param {String} code
		 * @returns {SnapTradeLinkMode|null}
		 */
		static parse(code) {
			return Enum.fromCode(SnapTradeLinkMode, code);
		}

		toString() {
			return `[SnapTradeLinkMode (code=${this.code})]`;
		}
	}

	const standard = new SnapTradeLinkMode('STANDARD');
	const limited = new SnapTradeLinkMode('LIMITED');

	return SnapTradeLinkMode;
})();
