const Currency = require('@barchart/common-js/lang/Currency');

const PositionLevelDefinition = require('./../../../../lib/processing/definitions/PositionLevelDefinition'),
	PositionLevelType = require('./../../../../lib/processing/definitions/PositionLevelType'),
	PositionTreeDefinition = require('./../../../../lib/processing/definitions/PositionTreeDefinition');

describe('When a position tree definition is created', () => {
	'use strict';

	function createLevelDefinition() {
		return new PositionLevelDefinition(
			'Total',
			PositionLevelType.OTHER,
			item => item.key,
			item => item.description,
			item => item.currency || Currency.USD
		);
	}

	it('should expose the configured name, level definitions, and exclusion dependencies', () => {
		const definitions = [ createLevelDefinition() ];
		const exclusionDependencies = [ 'by portfolio' ];
		const treeDefinition = new PositionTreeDefinition('by position', definitions, exclusionDependencies);

		expect({
			definitions: treeDefinition.definitions,
			exclusionDependencies: treeDefinition.exclusionDependencies,
			name: treeDefinition.name
		}).toEqual({
			definitions: definitions,
			exclusionDependencies: exclusionDependencies,
			name: 'by position'
		});
	});

	it('should default exclusion dependencies to an empty array', () => {
		const treeDefinition = new PositionTreeDefinition('by position', [ createLevelDefinition() ]);

		expect(treeDefinition.exclusionDependencies).toEqual([ ]);
	});

	it('should reject invalid level definitions', () => {
		expect(() => new PositionTreeDefinition('by position', [ { } ])).toThrow();
	});

	it('should reject invalid exclusion dependencies', () => {
		expect(() => new PositionTreeDefinition('by position', [ createLevelDefinition() ], 'by portfolio')).toThrow();
	});

	it('should provide a string representation', () => {
		const treeDefinition = new PositionTreeDefinition('by position', [ createLevelDefinition() ]);

		expect(treeDefinition.toString()).toEqual('[PositionTreeDefinitions]');
	});
});
