const Currency = require('@barchart/common-js/lang/Currency');

const PositionLevelDefinition = require('./../../../../lib/processing/definitions/PositionLevelDefinition'),
	PositionLevelType = require('./../../../../lib/processing/definitions/PositionLevelType');

describe('When a position level definition is created', () => {
	'use strict';

	function createDefinition(requiredGroups, requiredGroupGenerator) {
		return new PositionLevelDefinition(
			'Total',
			PositionLevelType.OTHER,
			item => item.key,
			item => item.description,
			item => item.currency,
			requiredGroups,
			requiredGroupGenerator
		);
	}

	describe('with required groups', () => {
		it('should accept groups with a key, description, and currency', () => {
			const requiredGroups = [
				{
					key: 'totals',
					description: 'Total',
					currency: Currency.USD
				}
			];

			expect(() => createDefinition(requiredGroups)).not.toThrow();
		});

		it('should reject a group without a key', () => {
			const requiredGroups = [
				{
					description: 'Total',
					currency: Currency.USD
				}
			];

			expect(() => createDefinition(requiredGroups)).toThrow();
		});

		it('should reject a group without a description', () => {
			const requiredGroups = [
				{
					key: 'totals',
					currency: Currency.USD
				}
			];

			expect(() => createDefinition(requiredGroups)).toThrow();
		});

		it('should reject a group without a valid currency', () => {
			const requiredGroups = [
				{
					key: 'totals',
					description: 'Total',
					currency: 'USD'
				}
			];

			expect(() => createDefinition(requiredGroups)).toThrow();
		});
	});

	describe('with a required group generator', () => {
		it('should add a valid generated group', () => {
			const requiredGroup = {
				key: 'totals',
				description: 'Total',
				currency: Currency.USD
			};
			const definition = createDefinition([ ], () => requiredGroup);

			expect(definition.generateRequiredGroup()).toBe(requiredGroup);
			expect(definition.requiredGroups).toEqual([ requiredGroup ]);
		});

		it('should reject an invalid generated group', () => {
			const definition = createDefinition([ ], () => {
				return {
					key: 'totals',
					description: 'Total',
					currency: 'USD'
				};
			});

			expect(() => definition.generateRequiredGroup()).toThrow();
			expect(definition.requiredGroups).toEqual([ ]);
		});
	});
});
