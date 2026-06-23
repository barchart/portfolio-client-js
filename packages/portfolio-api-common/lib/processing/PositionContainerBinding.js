const assert = require('@barchart/common-js/lang/assert');

const PositionBindingNode = require('./PositionBindingNode');

module.exports = (() => {
	'use strict';

	/**
	 * Position container data intended for binding to a user interface.
	 *
	 * @public
	 * @param {Object[]} portfolios
	 */
	class PositionContainerBinding {
		constructor(portfolios) {
			this.portfolios = portfolios;
			this.trees = { };
		}

		/**
		 * Adds a tree binding.
		 *
		 * @public
		 * @param {String} name
		 * @param {PositionBindingNode} tree
		 */
		addTree(name, tree) {
			assert.argumentIsRequired(name, 'name', String);
			assert.argumentIsRequired(tree, 'tree', PositionBindingNode, 'PositionBindingNode');

			this.trees[name] = tree;
		}

		/**
		 * Returns a single group binding from one of the trees.
		 *
		 * @public
		 * @param {String} name
		 * @param {String[]} keys
		 * @returns {PositionGroupBinding|null}
		 */
		getGroup(name, keys) {
			assert.argumentIsRequired(name, 'name', String);
			assert.argumentIsArray(keys, 'keys', String);

			const node = findNode(this.trees[name], keys);

			return node ? node.value : null;
		}

		/**
		 * Returns child group bindings from one of the trees.
		 *
		 * @public
		 * @param {String} name
		 * @param {String[]} keys
		 * @returns {PositionGroupBinding[]}
		 */
		getGroups(name, keys) {
			assert.argumentIsRequired(name, 'name', String);
			assert.argumentIsArray(keys, 'keys', String);

			const node = findNode(this.trees[name], keys);

			if (!node) {
				return [ ];
			}

			return node.children.map(child => child.value);
		}

		/**
		 * Returns a string representation of the binding.
		 *
		 * @public
		 * @returns {String}
		 */
		toString() {
			return '[PositionContainerBinding]';
		}
	}

	function findNode(tree, keys) {
		if (!tree) {
			return null;
		}

		return keys.reduce((node, key) => {
			if (!node) {
				return null;
			}

			return node.children.find((child) => {
				return child.value && child.value.data.key === key;
			}) || null;
		}, tree);
	}

	return PositionContainerBinding;
})();
