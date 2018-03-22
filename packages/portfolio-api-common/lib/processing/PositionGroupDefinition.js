const assert = require('@barchart/common-js/lang/assert'),
	is = require('@barchart/common-js/lang/is');

module.exports = (() => {
	'use strict';

	/**
	 * @public
	 */
	class PositionGroupDefinition {
		constructor(name, keySelector, descriptionSelector, currencySelector, requiredGroups, single) {
			this._name = name;

			this._keySelector = keySelector;
			this._descriptionSelector = descriptionSelector;
			this._currencySelector = currencySelector;

			this._requiredGroups = requiredGroups || [ ];
			this._single = is.boolean(single) && single;
		}

		get name() {
			return this._name;
		}

		get keySelector() {
			return this._keySelector;
		}

		get descriptionSelector() {
			return this._descriptionSelector;
		}

		get currencySelector() {
			return this._currencySelector;
		}

		get requiredGroups() {
			return this._requiredGroups;
		}

		toString() {
			return '[PositionGroupDefinition]';
		}
	}

	return PositionGroupDefinition;
})();
