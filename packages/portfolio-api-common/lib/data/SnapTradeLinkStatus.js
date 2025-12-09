const Enum = require('@barchart/common-js/lang/Enum');

module.exports = (() => {
	'use strict';

	/**
	 * An enumeration item that describes a strategy for calculating basis.
	 *
	 * @public
	 * @extends {Enum}
	 * @param {String} description
	 * @param {String} code
	 */
	class SnapTradeLinkStatus extends Enum {
		constructor(code) {
			super(code, code);
		}

		static get LINKING() {
			return linking;
		}

		static get LINKED() {
			return linked;
		}

		static get UNLINKING() {
			return unlinking;
		}

		static get UNLINKED() {
			return unlinked;
		}

		/**
		 * Given a code, returns the enumeration item.
		 *
		 * @public
		 * @param {String} code
		 * @returns {SnapTradeLinkStatus|null}
		 */
		static parse(code) {
			return Enum.fromCode(SnapTradeLinkStatus, code);
		}

		toString() {
			return `[SnapTradeLinkStatus (code=${this.code})]`;
		}
	}

	const linking = new SnapTradeLinkStatus('LINKING');
	const linked = new SnapTradeLinkStatus('LINKED');

	const unlinking = new SnapTradeLinkStatus('UNLINKING');
	const unlinked = new SnapTradeLinkStatus('UNLINKED');

	return SnapTradeLinkStatus;
})();
