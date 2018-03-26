const assert = require('@barchart/common-js/lang/assert'),
	is = require('@barchart/common-js/lang/is');

module.exports = (() => {
	'use strict';

	/**
	 * Defines a grouping level within a tree of positions. A level could represent a
	 * group of multiple positions (e.g. all equities or all positions for a portfolio).
	 * Alternately, a level could also represent a single position.
	 *
	 * @public
	 * @param {String} name
	 * @param {PositionLevelDefinition~keySelector} keySelector
	 * @param {PositionLevelDefinition~descriptionSelector} descriptionSelector
	 * @param {PositionLevelDefinition~currencySelector} currencySelector
	 * @param {Array.<PositionLevelDefinition~RequiredGroup>=} requiredGroups
	 * @param {Boolean=} single
	 */
	class PositionLevelDefinition {
		constructor(name, keySelector, descriptionSelector, currencySelector, requiredGroups, single) {
			assert.argumentIsRequired(name, 'name', String);
			assert.argumentIsRequired(keySelector, 'keySelector', Function);
			assert.argumentIsRequired(descriptionSelector, 'descriptionSelector', Function);
			assert.argumentIsRequired(currencySelector, 'currencySelector', Function);

			if (requiredGroups) {
				assert.argumentIsArray(requiredGroups, 'requiredGroups', String);
			}

			assert.argumentIsOptional(single, 'single', Boolean);

			this._name = name;

			this._keySelector = keySelector;
			this._descriptionSelector = descriptionSelector;
			this._currencySelector = currencySelector;

			this._requiredGroups = requiredGroups || [ ];
			this._single = is.boolean(single) && single;
		}

		/**
		 * The name of the grouping level.
		 *
		 * @public
		 * @returns {String}
		 */
		get name() {
			return this._name;
		}

		/**
		 * A function, when given a {@link PositionItem} returns a string that is used
		 * to group {@link PositionItem} instances into different groups.
		 *
		 * @public
		 * @returns {PositionLevelDefinition~keySelector}
		 */
		get keySelector() {
			return this._keySelector;
		}

		/**
		 * A function, when given a {@link PositionItem} returns a string used to describe the
		 * group.
		 *
		 * @public
		 * @returns {PositionLevelDefinition~descriptionSelector}
		 */
		get descriptionSelector() {
			return this._descriptionSelector;
		}

		/**
		 * A function, when given a {@link PositionItem} returns the {@link Currency} used to
		 * display values for the group.
		 *
		 * @public
		 * @returns {PositionLevelDefinition~currencySelector}
		 */
		get currencySelector() {
			return this._currencySelector;
		}

		/**
		 * Indicates the required groups (i.e. descriptions). The allows for the creation of empty
		 * groups.
		 *
		 * @public
		 * @returns {Array<String>}
		 */
		get requiredGroups() {
			return this._requiredGroups;
		}

		/**
		 * Indicates if the grouping level is meant to only contain a single item.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get single() {
			return this._single;
		}

		toString() {
			return '[PositionLevelDefinition]';
		}
	}

	/**
	 * A callback used to determine the eligibility for membership of a {@link PositionItem}
	 * within a group.
	 *
	 * @public
	 * @callback PositionLevelDefinition~keySelector
	 * @param {PositionItem} session
	 * @returns {String}
	 */

	/**
	 * A callback used to determine the human-readable name of a group. This function should
	 * return the same value for any {@link PositionItem} in the group.
	 *
	 * @public
	 * @callback PositionLevelDefinition~descriptionSelector
	 * @param {PositionItem} session
	 * @returns {String}
	 */

	/**
	 * A callback used to determine the display {@link Currency} for the group. This function should
	 * return the same value for any {@link PositionItem} in the group.
	 *
	 * @public
	 * @callback PositionLevelDefinition~currencySelector
	 * @param {PositionItem} session
	 * @returns {Currency}
	 */

	/**
	 * The data required to construct a group.
	 *
	 * @public
	 * @typedef PositionLevelDefinition~RequiredGroup
	 * @type {Object}
	 * @property {String} key
	 * @property {String} description
	 * @property {Currency} currency
	 */

	return PositionLevelDefinition;
})();
