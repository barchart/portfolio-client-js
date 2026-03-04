const Gateway = require('@barchart/common-js/api/http/Gateway');

const InstrumentProvider = require('./../../../lib/providers/InstrumentProvider');

describe('After the InstrumentProvider utility is initialized', () => {
	'use strict';

	describe('and a single instrument is requested', () => {
		let provider;
		let result;

		beforeEach(async () => {
			provider = new InstrumentProvider();

			spyOn(Gateway, 'invoke').and.returnValue(Promise.resolve({
				instrument: {
					name: 'Bitcoin - USD',
					symbolType: 18
				}
			}));

			result = await provider.getInstrument('XDTE');
		});

		it('should call the single-instrument endpoint with a path symbol parameter', () => {
			const endpoint = Gateway.invoke.calls.argsFor(0)[0];
			const payload = Gateway.invoke.calls.argsFor(0)[1];

			expect(endpoint.path.parameters.length).toEqual(2);
			expect(endpoint.path.parameters[0].key).toEqual('instruments');
			expect(endpoint.path.parameters[1].key).toEqual('symbol');
			expect(endpoint.query.parameters.length).toEqual(0);
			expect(payload.symbol).toEqual('XDTE');
		});

		it('should normalize crypto instrument metadata in single-instrument responses', () => {
			expect(result.instrument.name).toEqual('Bitcoin');
			expect(result.instrument.currency).toEqual('USD');
			expect(result.instrument.symbolType).toEqual(999);
		});
	});

	describe('and multiple instruments are requested', () => {
		let provider;
		let result;

		beforeEach(async () => {
			provider = new InstrumentProvider();

			spyOn(Gateway, 'invoke').and.returnValue(Promise.resolve({
				instruments: [
					{
						name: 'Bitcoin - USD',
						symbolType: 18
					},
					{
						name: 'Tesla Inc.',
						symbolType: 1
					}
				]
			}));

			result = await provider.getInstruments([ 'XDTE', 'TSLA', 'OIY00' ]);
		});

		it('should call the instruments endpoint with a comma-separated symbols query parameter', () => {
			const endpoint = Gateway.invoke.calls.argsFor(0)[0];
			const payload = Gateway.invoke.calls.argsFor(0)[1];

			expect(endpoint.path.parameters.length).toEqual(1);
			expect(endpoint.path.parameters[0].key).toEqual('instruments');
			expect(endpoint.query.parameters.length).toEqual(1);
			expect(endpoint.query.parameters[0].key).toEqual('symbols');
			expect(payload.symbols).toEqual('XDTE,TSLA,OIY00');
		});

		it('should normalize crypto instrument metadata in batch responses', () => {
			expect(result.instruments[0].name).toEqual('Bitcoin');
			expect(result.instruments[0].currency).toEqual('USD');
			expect(result.instruments[0].symbolType).toEqual(999);
			expect(result.instruments[1].name).toEqual('Tesla Inc.');
			expect(result.instruments[1].symbolType).toEqual(1);
		});
	});
});
