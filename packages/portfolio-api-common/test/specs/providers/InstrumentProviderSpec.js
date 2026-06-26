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

			expect({
				pathKeys: endpoint.path.parameters.map(parameter => parameter.key),
				queryKeys: endpoint.query.parameters.map(parameter => parameter.key),
				symbol: payload.symbol
			}).toEqual({
				pathKeys: [ 'instruments', 'symbol' ],
				queryKeys: [ ],
				symbol: 'XDTE'
			});
		});

		it('should normalize crypto instrument metadata in single-instrument responses', () => {
			expect(result.instrument).toEqual({
				currency: 'USD',
				name: 'Bitcoin',
				symbolType: 999
			});
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

			expect({
				pathKeys: endpoint.path.parameters.map(parameter => parameter.key),
				queryKeys: endpoint.query.parameters.map(parameter => parameter.key),
				symbols: payload.symbols
			}).toEqual({
				pathKeys: [ 'instruments' ],
				queryKeys: [ 'symbols' ],
				symbols: 'XDTE,TSLA,OIY00'
			});
		});

		it('should normalize crypto instrument metadata in batch responses', () => {
			expect(result.instruments).toEqual([
				{
					currency: 'USD',
					name: 'Bitcoin',
					symbolType: 999
				}, {
					name: 'Tesla Inc.',
					symbolType: 1
				}
			]);
		});
	});
});
