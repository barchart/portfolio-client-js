const assert = require('@barchart/common-js/lang/assert');

const PositionLevelDefinition = require('./PositionLevelDefinition');

module.exports = (() => {
	'use strict';

	/**
	 * Defines the structure for a tree of positions.
	 *
	 * @public
	 * @param {String} name
	 * @param {PositionLevelDefinition[]} definitions
	 * @param {String[]=} exclusionDependencies
	 */
	class PositionTreeDefinitions {
		constructor(name, definitions, exclusionDependencies) {
			assert.argumentIsRequired(name, 'name', String);
			assert.argumentIsArray(definitions, 'definitions', PositionLevelDefinition, 'PositionLevelDefinition');

			if (exclusionDependencies) {
				assert.argumentIsArray(exclusionDependencies, 'exclusionDependencies', String);
			}

			this._name = name;
			this._definitions = definitions;
			this._exclusionDependencies = exclusionDependencies || [ ];
		}

		/**
		 * The name of the tree.
		 *
		 * @public
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
		 * @returns {PositionLevelDefinitions>[]}
		 */
		get definitions() {
			return this._definitions;
		}

		/**
		 * Returns the names of other trees which should be impacted when a
		 * group (from the current tree) is excluded.
		 *
		 * @public
		 * @returns {String[]}
		 */
		get exclusionDependencies() {
			return this._exclusionDependencies;
		}

		toString() {
			return '[PositionTreeDefinitions]';
		}
	}

	return PositionTreeDefinitions;
})();
