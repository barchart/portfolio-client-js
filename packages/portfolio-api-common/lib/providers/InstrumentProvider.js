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

	const DEFAULT_MAXIMUM_WAIT_BEFORE_TIMEOUT_IN_MILLISECONDS = 3 * 1000;

	/**
	 * A utility that downloads instrument metadata (i.e. instrument "profile" data).
	 *
	 * @public
	 * @param {Number=} waitInMilliseconds - The maximum amount of time to wait for the response from server.
	 */
	class InstrumentProvider {
		constructor(waitInMilliseconds) {
			assert.argumentIsOptional(waitInMilliseconds, 'waitInMillis', Number);

			this._waitInMilliseconds = waitInMilliseconds || DEFAULT_MAXIMUM_WAIT_BEFORE_TIMEOUT_IN_MILLISECONDS;
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

					return promise.timeout(Gateway.invoke(instrumentLookupEndpoint, { symbol }), this._waitInMilliseconds, 'instrument lookup')
							.catch((e) => {
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

	const instrumentLookupEndpoint = EndpointBuilder.for('query-instrument', 'query instrument')
		.withVerb(VerbType.GET)
		.withProtocol(ProtocolType.HTTPS)
		.withHost('instruments-prod.aws.barchart.com')
		.withPort(443)
		.withPathBuilder((pb) => {
			pb.withLiteralParameter('instruments', 'instruments')
				.withVariableParameter('symbol', 'symbol', 'symbol');
		})
		.withResponseInterceptor(ResponseInterceptor.DATA)
		.withErrorInterceptor(ErrorInterceptor.GENERAL)
		.endpoint;

	return InstrumentProvider;
})();