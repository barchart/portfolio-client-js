const Tree = require('@barchart/common-js/collections/Tree');

const PositionBindingNode = require('./PositionBindingNode');

module.exports = (() => {
	'use strict';

	/**
	 * A tree data structure which maintains a side-by-side binding tree.
	 *
	 * @public
	 * @param {*} value - The value of the node.
	 * @param {Tree=} parent - The parent node. If not supplied, this will be the root node.
	 */
	class BindingTree extends Tree {
		constructor(value, parent) {
			super(value, parent);

			this._binding = new PositionBindingNode(value ? value.binding : null);
		}

		/**
		 * Returns the binding node associated with this tree node.
		 *
		 * @public
		 * @returns {PositionBindingNode}
		 */
		get binding() {
			return this._binding;
		}

		/**
		 * Adds a child node to the current node and returns a reference
		 * to the child node.
		 *
		 * @public
		 * @param {*} value - The value of the child.
		 * @returns {BindingTree}
		 */
		addChild(value) {
			const returnRef = new BindingTree(value, this);

			this._children.push(returnRef);
			this._binding.children.push(returnRef.binding);

			return returnRef;
		}

		/**
		 * Removes a child node.
		 *
		 * @public
		 * @param {Tree} node - The child to remove.
		 */
		removeChild(node) {
			const index = this._children.indexOf(node);

			if (index < 0) {
				return;
			}

			this._children.splice(index, 1);
			this._binding.children.splice(index, 1);

			node._parent = null;

			node._children.splice(0, node._children.length);
			node._binding.children.splice(0, node._binding.children.length);
		}

		/**
		 * Returns a string representation of the tree.
		 *
		 * @public
		 * @returns {String}
		 */
		toString() {
			return '[BindingTree]';
		}
	}

	return BindingTree;
})();
