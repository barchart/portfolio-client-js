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
	 * @param {String} description
	 * @param {Boolean} processing
	 */
	class SnapTradeLinkStatus extends Enum {
		constructor(code, description, processing) {
			super(code, description);

			assert.argumentIsRequired(processing, 'processing', Boolean);

			this._processing = processing;
		}

		get processing() {
			return this._processing;
		}

		static get WAITING() {
			return waiting;
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

	const waiting = new SnapTradeLinkStatus('WAITING', 'Waiting', false);
	const linking = new SnapTradeLinkStatus('LINKING', 'Linking', true);
	const linked = new SnapTradeLinkStatus('LINKED', 'Linked', false);
	const refreshing = new SnapTradeLinkStatus('REFRESHING', 'Refreshing', true);
	const failed = new SnapTradeLinkStatus('FAILED', 'Failed', false);

	return SnapTradeLinkStatus;
})();
