const assert = require('@barchart/common-js/lang/assert');

const PositionGroupBinding = require('./PositionGroupBinding');

module.exports = (() => {
	'use strict';

	/**
	 * A node in the position binding tree.
	 *
	 * @public
	 * @param {PositionGroupBinding|null=} value
	 */
	class PositionBindingNode {
		constructor(value) {
			assert.argumentIsOptional(value, 'value', PositionGroupBinding, 'PositionGroupBinding');

			this.value = value || null;
			this.children = [ ];
		}

		/**
		 * Returns a string representation of the node.
		 *
		 * @public
		 * @returns {String}
		 */
		toString() {
			return '[PositionBindingNode]';
		}
	}

	return PositionBindingNode;
})();
