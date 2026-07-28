const BindingTree = require('./../../../../lib/processing/binding/BindingTree');

describe('When a binding tree is used', () => {
	'use strict';

	function createValue(key) {
		return {
			key: key,
			binding: {
				key: key
			}
		};
	}

	it('should keep child nodes and child bindings in the same order', () => {
		const tree = new BindingTree();
		const valueA = createValue('a');
		const valueB = createValue('b');

		const childA = tree.addChild(valueA);
		const childB = tree.addChild(valueB);

		expect({
			children: tree.getChildren(),
			bindings: tree.getChildren2()
		}).toEqual({
			children: [ childA, childB ],
			bindings: [ valueA.binding, valueB.binding ]
		});
	});

	it('should insert child nodes and child bindings in sorted order', () => {
		const tree = new BindingTree();
		const valueA = createValue('a');
		const valueB = createValue('b');
		const comparator = (a, b) => a.key.localeCompare(b.key);

		const childB = tree.addChild(valueB, comparator);
		const childA = tree.addChild(valueA, comparator);

		expect({
			children: tree.getChildren(),
			bindings: tree.getChildren2()
		}).toEqual({
			children: [ childA, childB ],
			bindings: [ valueA.binding, valueB.binding ]
		});
	});

	it('should retain the child bindings array when children are inserted in sorted order', () => {
		const tree = new BindingTree();
		const bindings = tree.getChildren2();
		const comparator = (a, b) => a.key.localeCompare(b.key);

		tree.addChild(createValue('b'), comparator);
		tree.addChild(createValue('a'), comparator);

		expect(tree.getChildren2()).toBe(bindings);
	});

	it('should remove the matching binding when a child node is removed', () => {
		const tree = new BindingTree();
		const value = createValue('a');
		const child = tree.addChild(value);

		child.addChild(createValue('a-1'));

		tree.removeChild(child);

		expect({
			childBindings: child.getChildren2(),
			childChildren: child.getChildren(),
			childParent: child.getParent(),
			treeBindings: tree.getChildren2(),
			treeChildren: tree.getChildren()
		}).toEqual({
			childBindings: [ ],
			childChildren: [ ],
			childParent: null,
			treeBindings: [ ],
			treeChildren: [ ]
		});
	});

	it('should ignore removal of a node which is not a child', () => {
		const tree = new BindingTree();
		const child = tree.addChild(createValue('a'));
		const other = new BindingTree(createValue('b'));

		tree.removeChild(other);

		expect({
			children: tree.getChildren(),
			bindings: tree.getChildren2()
		}).toEqual({
			children: [ child ],
			bindings: [ child.getValue().binding ]
		});
	});
});
