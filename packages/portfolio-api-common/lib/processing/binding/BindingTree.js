const Tree = require('@barchart/common-js/collections/Tree');

module.exports = (() => {
	'use strict';

	/**
	 * A tree data structure. Each instance represents a node, holding
	 * an item, a reference to the parent node, and a reference to
	 * children nodes. Child nodes and their binding values are kept in the same order.
	 *
	 * @public
	 * @param {*} value - The value of the node.
	 * @param {Tree=} parent - The parent node. If not supplied, this will be the root node.
	 */
	class BindingTree extends Tree {
		constructor(value, parent) {
			super(value, parent);

			this._children2 = [ ];
		}

		/**
		 * Returns the collection of children values.
		 *
		 * @public
		 * @returns {Array<*>}
		 */
		getChildren2() {
			return this._children2;
		}

		/**
		 * Adds a child node, optionally inserting it according to a comparator.
		 *
		 * @public
		 * @param {*} value - The value of the child.
		 * @param {Function=} comparator - The comparator used to order child values.
		 * @returns {BindingTree}
		 */
		addChild(value, comparator) {
			const returnRef = new BindingTree(value, this);
			let index = this._children.length;

			if (comparator) {
				const insertionIndex = this._children.findIndex(child => comparator(value, child.getValue()) < 0);

				if (insertionIndex !== -1) {
					index = insertionIndex;
				}
			}

			this._children.splice(index, 0, returnRef);
			this._children2.splice(index, 0, value.binding);

			return returnRef;
		}

		/**
		 * Removes a child node.
		 *
		 * @public
		 * @param {Tree} node - The child to remove.
		 */
		removeChild(node) {
			for (let i = this._children.length - 1; !(i < 0); i--) {
				const child = this._children[i];

				if (child === node) {
					this._children.splice(i, 1);
					this._children2.splice(i, 1);

					child._parent = null;

					child._children.splice(0, child._children.length);
					child._children2.splice(0, child._children2.length);

					break;
				}
			}
		}

		toString() {
			return '[BindingTree]';
		}
	}

	return BindingTree;
})();
