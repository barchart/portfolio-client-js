const PositionSchema = require('./../../../lib/serialization/PositionSchema');

describe('When positions are serialized', () => {
	'use strict';

	describe('for a read operation (user error #1)', () => {
		let position;
		let serialized;

		beforeEach(() => {
			position = {
				"user": "855e15c0-9e32-40ac-9bd9-5f0cc2780111",
				"portfolio": "c2a743e8-8efa-4a88-9a6c-9202d3fec29f",
				"instrument": {
					"id": "TGAM-CASH-USD",
					"name": "US Dollar",
					"type": "CASH",
					"currency": "USD"
				},
				"position": "a5cdc2e8-d9c6-4a1f-8f05-e271a5824f87",
				"transaction": 2987,
				"cash": true,
				"valuation": "AVG",
				"snapshot": {
					"date": "2020-06-11",
					"open": "222105.56",
					"direction": "LONG",
					"buys": "0",
					"sells": "0",
					"gain": "0",
					"basis": "0",
					"income": "0",
					"value": "0"
				},
				latest: {
					date: "2020-06-11",
					gain: "0"
				},
				"system": {
					"calculate": {
						"processors": 1
					},
					"locked": false
				}
			};

			serialized = JSON.stringify(position);
		});

		describe('and the data is deserialized', () => {
			let deserialized;

			beforeEach(() => {
				const reviver = PositionSchema.CLIENT.schema.getReviver();

				deserialized = JSON.parse(serialized, reviver);
			});

			it('the deserialized data should be an object', () => {
				expect(typeof deserialized).toEqual('object');
			});

			it('the deserialized data should be correct', () => {
				expect(deserialized.position).toEqual(position.position);
			});
		});
	});
});
