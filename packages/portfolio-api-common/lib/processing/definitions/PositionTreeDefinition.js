const assert = require('@barchart/common-js/lang/assert');

const PositionLevelDefinition = require('./PositionLevelDefinition');

module.exports = (() => {
	'use strict';

	/**
	 * Defines the structure for a tree of positions.
	 *
	 * @public
	 * @param {String} name
	 * @param {Array.<PositionLevelDefinition>} definitions
	 */
	class PositionTreeDefinitions {
		constructor(name, definitions) {
			assert.argumentIsRequired(name, 'name', String);
			assert.argumentIsArray(definitions, 'definitions', PositionLevelDefinition, 'PositionLevelDefinition');

			this._name = name;
			this._definitions = definitions;
		}

		/**
		 * The name of the tree.
		 *
		 * @returns {String}
		 */
		get name() {
			return this._name;
		}

		/**
		 * An ordered list of {@link PositionLevelDefinitions} that describes the
		 * levels of the tree. The first item represents the top-most level of the
		 * tree (i.e. the children of the root node) and the last item represents the
		 * bottom-most level of the tree (i.e. leaf nodes).
		 *
		 * @public
		 * @returns {Array.<PositionTreeDefinition>}
		 */
		get definitions() {
			return this._definitions;
		}

		toString() {
			return '[PositionTreeDefinitions]';
		}
	}

	return PositionTreeDefinitions;
})();
