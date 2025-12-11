const assert = require('@barchart/common-js/lang/assert'),
	Enum = require('@barchart/common-js/lang/Enum');

module.exports = (() => {
	'use strict';

	/**
	 * An enumeration item that describes a strategy for calculating basis.
	 *
	 * @public
	 * @extends {Enum}
	 * @param {String} code
	 * @param {Boolean} processing
	 */
	class SnapTradeLinkStatus extends Enum {
		constructor(code, processing) {
			super(code, code);

			assert.argumentIsRequired(processing, 'processing', Boolean);

			this._processing = processing;
		}

		get processing() {
			return this._processing;
		}

		static get LINKING() {
			return linking;
		}

		static get LINKED() {
			return linked;
		}

		static get REFRESHING() {
			return refreshing;
		}

		static get FAILED() {
			return failed;
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

	const linking = new SnapTradeLinkStatus('LINKING', true);
	const linked = new SnapTradeLinkStatus('LINKED', false);
	const refreshing = new SnapTradeLinkStatus('REFRESHING', true);
	const failed = new SnapTradeLinkStatus('FAILED', false);

	return SnapTradeLinkStatus;
})();
