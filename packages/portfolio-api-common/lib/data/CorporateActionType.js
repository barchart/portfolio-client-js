const Enum = require('@barchart/common-js/lang/Enum'),
	is = require('@barchart/common-js/lang/is');

module.exports = (() => {
	'use strict';

	class CorporateActionType extends Enum {
		constructor(code, description, internal) {
			super(code, description);

			this._internal = is.boolean(internal) && internal;
		}

		get internal() {
			return this._internal;
		}

		static get DIVIDEND() {
			return dividend;
		}

		static get SPLIT() {
			return split;
		}

		static get JOB() {
			return job;
		}
	}

	const dividend = new CorporateActionType('DIVIDEND', 'Dividend', false);
	const split = new CorporateActionType('SPLIT', 'Split', false);
	const job = new CorporateActionType('JOB', 'Job', true);

	return CorporateActionType;
})();
