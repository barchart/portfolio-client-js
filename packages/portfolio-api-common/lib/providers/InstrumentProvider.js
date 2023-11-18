const assert = require('@barchart/common-js/lang/assert'),
	is = require('@barchart/common-js/lang/is'),
	promise = require('@barchart/common-js/lang/promise');

const EndpointBuilder = require('@barchart/common-js/api/http/builders/EndpointBuilder'),
	ErrorInterceptor = require('@barchart/common-js/api/http/interceptors/ErrorInterceptor'),
	Gateway = require('@barchart/common-js/api/http/Gateway'),
	ProtocolType = require('@barchart/common-js/api/http/definitions/ProtocolType'),
	ResponseInterceptor = require('@barchart/common-js/api/http/interceptors/ResponseInterceptor'),
	VerbType = require('@barchart/common-js/api/http/definitions/VerbType');

module.exports = (() => {
	'use strict';

	const MAXIMUM_WAIT_BEFORE_TIMEOUT_IN_MILLISECONDS = 3 * 1000;

	const cache = { };

	/**
	 * A utility that downloads instrument metadata (i.e. instrument "profile" data).
	 *
	 * @public
	 */
	class InstrumentProvider {
		constructor() {
		}

		/**
		 * Returns a promise for instrument metadata (i.e. "profile" data). If no instrument
		 * can be found with a matching symbol, the promise is rejected.
		 *
		 * @public
		 * @async
		 * @param {String} symbol
		 * @returns {Promise<Object>}
		 */
		async getInstrument(symbol) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(symbol, 'symbol', String);

					return promise.timeout(Gateway.invoke(getInstrumentLookupEndpoint(), {symbol}), MAXIMUM_WAIT_BEFORE_TIMEOUT_IN_MILLISECONDS, 'instrument lookup')
							.catch((e) => {
								delete cache[symbol];

								let message;

								if (is.string(e) && e === 'timeout') {
									message = `Instrument lookup for [ ${symbol} ] failed due to timed out`;
								} else {
									message = `Instrument lookup for [ ${symbol} ] failed due to an unspecified error`;
								}

								return Promise.reject(message);
							}).then((result) => {
								if (result.instrument === null) {
									return Promise.reject(`Instrument lookup for [ ${symbol} ] failed, the instrument does not exist`);
								}

								return result;
							});
				});
		}

		toString() {
			return '[InstrumentProvider]';
		}
	}

	function buildInstrumentLookupEndpoint(host) {
		return EndpointBuilder.for('query-instrument', 'query instrument')
			.withVerb(VerbType.GET)
			.withProtocol(ProtocolType.HTTPS)
			.withHost(host)
			.withPort(443)
			.withPathBuilder((pb) => {
				pb.withLiteralParameter('instruments', 'instruments')
					.withVariableParameter('symbol', 'symbol', 'symbol');
			})
			.withResponseInterceptor(ResponseInterceptor.DATA)
			.withErrorInterceptor(ErrorInterceptor.GENERAL)
			.endpoint;
	}

	const instrumentLookupEndpoints = new Map();

	function getInstrumentLookupEndpoint() {
		const host = 'instruments-prod.aws.barchart.com';

		if (!instrumentLookupEndpoints.has(host)) {
			instrumentLookupEndpoints.set(host, buildInstrumentLookupEndpoint(host));
		}

		return instrumentLookupEndpoints.get(host);
	}

	return InstrumentProvider;
})();