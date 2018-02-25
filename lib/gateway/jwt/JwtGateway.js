const assert = require('@barchart/common-js/lang/assert'),
	Disposable = require('@barchart/common-js/lang/Disposable'),
	Enum = require('@barchart/common-js/lang/Enum'),
	is = require('@barchart/common-js/lang/is'),
	Scheduler = require('@barchart/common-js/timing/Scheduler');

const EndpointBuilder = require('@barchart/common-js/api/http/builders/EndpointBuilder'),
	Endpoint = require('@barchart/common-js/api/http/definitions/Endpoint'),
	FailureReason = require('@barchart/common-js/api/failures/FailureReason'),
	FailureType = require('@barchart/common-js/api/failures/FailureType'),
	Gateway = require('@barchart/common-js/api/http/Gateway'),
	ProtocolType = require('@barchart/common-js/api/http/definitions/ProtocolType'),
	RequestInterceptor = require('@barchart/common-js/api/http/interceptors/RequestInterceptor'),
	ResponseInterceptor = require('@barchart/common-js/api/http/interceptors/ResponseInterceptor'),
	VerbType = require('@barchart/common-js/api/http/definitions/VerbType');

const Configuration = require('./../../common/Configuration');

module.exports = (() => {
	'use strict';

	/**
	 * Web service gateway for translating external JWT tokens into standardized
	 * Barchart JWT tokens.
	 *
	 * @public
	 * @param {Enpoint} endpoint
	 * @param {Number=} refreshInterval - Interval, in milliseconds, which a token refresh should occur. If zero, the token does not need to be refreshed.
	 * @extends {Disposable}
	 */
	class JwtGateway extends Disposable {
		constructor(endpoint, refreshInterval) {
			super();

			assert.argumentIsRequired(endpoint, 'endpoint', Endpoint, 'Endpoint');
			assert.argumentIsOptional(refreshInterval, 'refreshInterval', Number);

			this._started = false;
			this._startPromise = null;

			this._endpoint = endpoint;
			this._refreshInterval = refreshInterval || null;
		}

		/**
		 * Initializes the connection to the remote server and returns a promise
		 * containing the current instance
		 *
		 * @public
		 * @returns {Promise.<JwtGateway>}
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

								return Promise.reject(e);
							});
					}

					return this._startPromise;
				});
		}

		/**
		 * Retrieves a JWT token from the remote server.
		 *
		 * @public
		 * @returns {Promise.<String>}
		 */
		readToken() {
			return Promise.resolve()
				.then(() => {
					checkStart.call(this);

					return Gateway.invoke(this._endpoint);
				}).catch((e) => {
					const failure = FailureReason.forRequest({ endpoint: this._endpoint })
						.addItem(FailureType.REQUEST_IDENTITY_FAILURE)
						.format();

					return Promise.reject(failure);
				});
		}

		/**
		 * Returns a {@link RequestInterceptor} suitable for use with other API calls.
		 *
		 * @public
		 * @returns {RequestInterceptor}
		 */
		toRequestInterceptor() {
			const scheduler = new Scheduler();

			let cachePromise = null;
			let cacheDisposable = null;

			const refreshToken = () => {
				const refreshPromise = scheduler.backoff(() => this.readToken(), 100, 'Read JWT token', 3)
					.then((token) => {
						if (this._refreshInterval) {
							cachePromise = refreshPromise;
						}

						if (cacheDisposable === null) {
							cacheDisposable = scheduler.repeat(() => refreshToken(), this._refreshInterval, 'Refresh JWT token');
						}

						return token;
					}).catch((e) => {
						if (cacheDisposable !== null) {
							cacheDisposable.dispose();

							cacheDisposable = null;
							cachePromise = null;
						}

						return Promise.reject(e);
					});

				return refreshPromise;
			};

			const delegate = (options, endpoint) => {
				let tokenPromise;

				if (cachePromise !== null) {
					tokenPromise = cachePromise;
				}  else {
					tokenPromise = refreshToken();
				}

				return tokenPromise.then((token) => {
					options.headers = options.headers || { };
					options.headers.Authorization = `Bearer ${token}`;

					return options;
				}).catch((e) => {
					const failure = FailureReason.forRequest({ endpoint: endpoint })
						.addItem(FailureType.REQUEST_IDENTITY_FAILURE)
						.format();

					return Promise.reject(failure);
				});
			};

			return RequestInterceptor.fromDelegate(delegate);
		}

		/**
		 * Creates and starts a new {@link JwtGateway} for use in the development environment.
		 *
		 * @public
		 * @static
		 * @param {String} userId - The identifier of the user to impersonate.
		 * @returns {Promise.<JwtGateway>}
		 */
		static forDevelopment(userId) {
			return start(new JwtGateway(forDevelopment(userId), 60000));
		}

		/**
		 * Creates and starts a new {@link RequestInterceptor} for use in the development environment.
		 *
		 * @public
		 * @static
		 * @param {String} userId - The identifier of the user to impersonate.
		 * @returns {Promise.<RequestInterceptor>}
		 */
		static forDevelopmentClient(userId) {
			return JwtGateway.forDevelopment(userId)
				.then((jwtGateway) => {
					return jwtGateway.toRequestInterceptor();
				});
		}

		/**
		 * Creates and starts a new {@link JwtGateway} for use in the production environment.
		 *
		 * @public
		 * @static
		 * @param {RequestInterceptor} externalRequestInterceptor
		 * @returns {Promise.<JwtGateway>}
		 */
		static forProduction(externalRequestInterceptor) {
			assert.argumentIsRequired(externalRequestInterceptor, 'externalRequestInterceptor', RequestInterceptor, 'RequestInterceptor');

			return start(new JwtGateway(forProduction(), 300000));
		}

		/**
		 * Creates and starts a new {@link RequestInterceptor} for use in the development environment.
		 *
		 * @public
		 * @static
		 * @param {RequestInterceptor} externalRequestInterceptor
		 * @returns {Promise.<RequestInterceptor>}
		 */
		static forProductionClient(externalRequestInterceptor) {
			return JwtGateway.forProduction(externalRequestInterceptor)
				.then((jwtGateway) => {
					return jwtGateway.toRequestInterceptor();
				});
		}

		_onDispose() {
			return;
		}

		toString() {
			return '[JwtGateway]';
		}
	}

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

	function forDevelopment(userId) {
		return EndpointBuilder.for('translate-jwt-token-for-development', 'lookup Barchart user identity')
			.withVerb(VerbType.GET)
			.withProtocol(ProtocolType.HTTPS)
			.withHost((Configuration.developmentHost)
			.withPathBuilder((pb) => pb.withLiteralParameter('token', 'token').withLiteralParameter('system', 'barchart').withLiteralParameter('generator', 'generator'))
			.withQueryBuilder((qb) => qb.withLiteralParameter('user', 'userId', userId))
			.withResponseInterceptor(ResponseInterceptor.DATA)
			.endpoint;
	}

	function forProduction(externalRequestInterceptor) {
		return EndpointBuilder.for('translate-jwt-token-for-production', 'lookup Barchar user identity')
			.withVerb(VerbType.GET)
			.withProtocol(ProtocolType.HTTPS)
			.withHost(Configuration.productionHost)
			.withPathBuilder((pb) => pb.withLiteralParameter('token', 'token').withLiteralParameter('system', 'tgam').withLiteralParameter('converter', 'converter'))
			.withRequestInterceptor(externalRequestInterceptor)
			.withResponseInterceptor(ResponseInterceptor.DATA)
			.withResponseInterceptor(ResponseInterceptor.fromDelegate((response) => {
				return response.token;
			}))
			.endpoint;
	}

	return JwtGateway;
})();