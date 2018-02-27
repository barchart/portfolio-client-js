const assert = require('@barchart/common-js/lang/assert'),
	Disposable = require('@barchart/common-js/lang/Disposable'),
	Enum = require('@barchart/common-js/lang/Enum'),
	is = require('@barchart/common-js/lang/is');

const EndpointBuilder = require('@barchart/common-js/api/http/builders/EndpointBuilder'),
	Gateway = require('@barchart/common-js/api/http/Gateway'),
	ProtocolType = require('@barchart/common-js/api/http/definitions/ProtocolType'),
	ErrorInterceptor = require('@barchart/common-js/api/http/interceptors/ErrorInterceptor'),
	RequestInterceptor = require('@barchart/common-js/api/http/interceptors/RequestInterceptor'),
	ResponseInterceptor = require('@barchart/common-js/api/http/interceptors/ResponseInterceptor'),
	VerbType = require('@barchart/common-js/api/http/definitions/VerbType');

const Configuration = require('./../common/Configuration');

module.exports = (() => {
	'use strict';

	/**
	 * Web service gateway for invoking the Portfolio API.
	 *
	 * @public
	 * @param {String} protocol - The protocol to use (either HTTP or HTTPS).
	 * @param {String} host - The host name of the Portfolio web service.
	 * @param {Number} port - The TCP port number of the Portfolio web service.
	 * @param {RequestInterceptor=} requestInterceptor - A request interceptor used with each request (typically used to inject JWT tokens).
	 * @extends {Disposable}
	 */
	class PortfolioGateway extends Disposable {
		constructor(protocol, host, port, requestInterceptor) {
			super();

			this._started = false;
			this._startPromise = null;

			const protocolType = Enum.fromCode(ProtocolType, protocol.toUpperCase());

			let requestInterceptorToUse;

			if (requestInterceptor) {
				requestInterceptorToUse = requestInterceptor;
			} else {
				requestInterceptorToUse = RequestInterceptor.EMPTY;
			}

			this._readPortfoliosEndpoint = EndpointBuilder.for('read-portfolios', 'read portfolios')
				.withVerb(VerbType.GET)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('portfolios', 'portfolios')
						.withVariableParameter('portfolio', 'portfolio', 'portfolio', false);
				})
				.withRequestInterceptor(requestInterceptorToUse)
				.withResponseInterceptor(responseInterceptorForPortfolioDeserialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._readTransactionsEndpoint = EndpointBuilder.for('read-transactions', 'read portfolio transactions')
				.withVerb(VerbType.GET)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('portfolios', 'portfolios')
						.withVariableParameter('portfolio', 'portfolio', 'portfolio', false)
						.withLiteralParameter('positions', 'positions')
						.withVariableParameter('position', 'position', 'position', false)
						.withLiteralParameter('transactions', 'transactions');
				})
				.withRequestInterceptor(requestInterceptorToUse)
				.withResponseInterceptor(responseInterceptorForTransactionDeserialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;
		}

		/**
		 * Initializes the connection to the remote server and returns a promise
		 * containing the current instance.
		 *
		 * @public
		 * @returns {Promise.<PortfolioGateway>}
		 */
		start() {
			return Promise.resolve()
				.then(() => {
					if (this._startPromise === null) {
						this._startPromise = Promise.resolve()
							.then(() => {
								this._started = true;

								return this;
							}).catch((e) => {
								this._startPromise = null;

								throw e;
							});
					}

					return this._startPromise;
				});
		}

		/**
		 * Reads all portfolios for a user, or a single portfolio.
		 *
		 * @public
		 * @param {String=} portfolio
		 * @return {Promise.<Portfolio[]>}
		 */
		readPortfolios(portfolio) {
			return Promise.resolve()
				.then(() => {
					checkStart.call(this);

					assert.argumentIsOptional(portfolio, 'portfolio', String);

					return Gateway.invoke(this._readPortfoliosEndpoint, { portfolio: portfolio || '*' });
				});
		}

		/**
		 * Retrieves transactions for a portfolio, or a single position.
		 *
		 * @public
		 * @returns {Promise.<Transaction[]>}
		 */
		readTransactions(portfolio, position) {
			return Promise.resolve()
				.then(() => {
					checkStart.call(this);

					assert.argumentIsRequired(portfolio, 'portfolio', String);
					assert.argumentIsOptional(position, 'position', String);

					return Gateway.invoke(this._readTransactionsEndpoint, { portfolio: portfolio, position: position || '*' });
				});
		}

		/**
		 * Creates and starts a new {@link PortfolioGateway} for use in the development environment.
		 *
		 * @public
		 * @static
		 * @param {RequestInterceptor=|Promise.<RequestInterceptor>=} requestInterceptor - A request interceptor used with each request (typically used to inject JWT tokens).
		 * @returns {Promise.<PortfolioGateway>}
		 */
		static forDevelopment(requestInterceptor) {
			return Promise.resolve(requestInterceptor)
				.then((requestInterceptor) => {
					assert.argumentIsOptional(requestInterceptor, 'requestInterceptor', RequestInterceptor, 'RequestInterceptor');

					return start(new PortfolioGateway('https', Configuration.developmentHost, 443, requestInterceptor));
				});
		}

		/**
		 * Creates and starts a new {@link PortfolioGateway} for use in the production environment.
		 *
		 * @public
		 * @static
		 * @param {RequestInterceptor=|Promise.<RequestInterceptor>=} requestInterceptor - A request interceptor used with each request (typically used to inject JWT tokens).
		 * @returns {Promise.<PortfolioGateway>}
		 */
		static forProduction(requestInterceptor) {
			return Promise.resolve(requestInterceptor)
				.then((requestInterceptor) => {
					assert.argumentIsOptional(requestInterceptor, 'requestInterceptor', RequestInterceptor, 'RequestInterceptor');

					return start(new PortfolioGateway('https', Configuration.productionHost, 443, requestInterceptor));
				});
		}

		_onDispose() {
			return;
		}
		
		toString() {
			return '[PortfolioGateway]';
		}
	}

	const responseInterceptorForPortfolioDeserialization = ResponseInterceptor.fromDelegate((response, ignored) => {
		return response.data;
	});

	const responseInterceptorForTransactionDeserialization = ResponseInterceptor.fromDelegate((response, ignored) => {
		return response.data;
	});

	function start(gateway) {
		return gateway.start()
			.then(() => {
				return gateway;
			});
	}

	function checkStart() {
		if (this.getIsDisposed()) {
			throw new Error('Unable to use gateway, the gateway has been disposed.');
		}

		if (!this._started) {
			throw new Error('Unable to use gateway, the gateway has not started.');
		}
	}

 	return PortfolioGateway;
})();