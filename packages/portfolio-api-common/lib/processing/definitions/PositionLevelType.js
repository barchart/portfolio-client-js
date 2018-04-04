const Enum = require('@barchart/common-js/lang/Enum');

module.exports = (() => {
	'use strict';

	class PositionLevelType extends Enum {
		constructor(code) {
			super(code, code);
		}

		static get PORTFOLIO() {
			return portfolio;
		}

		static get POSITION() {
			return position;
		}

		static get OTHER() {
			return other;
		}
	}

	const portfolio = new PositionLevelType('PORTFOLIO');
	const position = new PositionLevelType('POSITION');
	const other = new PositionLevelType('OTHER');

	return PositionLevelType;
})();
