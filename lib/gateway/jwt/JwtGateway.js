const assert = require('@barchart/common-js/lang/assert'),
	Disposable = require('@barchart/common-js/lang/Disposable'),
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
	 * @param {Endpoint} endpoint
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

			this._refreshInterval = refreshInterval || 0;
			this._refreshJitter = Math.floor(this._refreshInterval / 10);
		}

		/**
		 * Initializes the connection to the remote server and returns a promise
		 * containing the current instance
		 *
		 * @public
		 * @returns {Promise<JwtGateway>}
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
		 * @returns {Promise<String>}
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

			let refreshPromise = null;
			let refreshTime = null;

			const refreshToken = () => {
				if (refreshPromise === null || (this._refreshInterval > 0 && refreshTime !== null && getTime() > (refreshTime + this._refreshInterval + this._refreshJitter))) {
					refreshPromise = scheduler.backoff(() => this.readToken(), 750, 'Read JWT token', 3)
						.then((token) => {
							refreshTime = getTime();

							return token;
						}).catch((e) => {
							refreshPromise = null;
							refreshTime = null;

							return Promise.reject(e);
						});
				}

				return refreshPromise;
			};

			const delegate = (options, endpoint) => {
				return refreshToken()
					.then((token) => {
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
		 * @param {String} userLegacyId - The legacy identifier of the user to impersonate.
		 * @returns {Promise<JwtGateway>}
		 */
		static forDevelopment(userId, userLegacyId) {
			return start(new JwtGateway(forDevelopment(userId, userLegacyId), 180000));
		}

		/**
		 * Creates and starts a new {@link RequestInterceptor} for use in the development environment.
		 *
		 * @public
		 * @static
		 * @param {String} userId - The identifier of the user to impersonate.
		 * @returns {Promise<RequestInterceptor>}
		 */
		static forDevelopmentClient(userId, userLegacyId) {
			return JwtGateway.forDevelopment(userId, userLegacyId)
				.then((jwtGateway) => {
					return jwtGateway.toRequestInterceptor();
				});
		}

		/**
		 * Creates and starts a new {@link JwtGateway} for use in the staging environment.
		 *
		 * @public
		 * @static
		 * @param {Promise<RequestInterceptor>} externalRequestInterceptorPromise
		 * @returns {Promise<JwtGateway>}
		 */
		static forStaging(externalRequestInterceptorPromise) {
			return externalRequestInterceptorPromise.then((externalRequestInterceptor) => {
				return start(new JwtGateway(forStaging(externalRequestInterceptor), 300000));
			});
		}

		/**
		 * Creates and starts a new {@link RequestInterceptor} for use in the staging environment.
		 *
		 * @public
		 * @static
		 * @param {Promise<RequestInterceptor>} externalRequestInterceptorPromise
		 * @returns {Promise<RequestInterceptor>}
		 */
		static forStagingClient(externalRequestInterceptorPromise) {
			return JwtGateway.forStaging(externalRequestInterceptorPromise)
				.then((jwtGateway) => {
					return jwtGateway.toRequestInterceptor();
				});
		}

		/**
		 * Creates and starts a new {@link JwtGateway} for use in the production environment.
		 *
		 * @public
		 * @static
		 * @param {Promise<RequestInterceptor>} externalRequestInterceptorPromise
		 * @returns {Promise<JwtGateway>}
		 */
		static forProduction(externalRequestInterceptorPromise) {
			return externalRequestInterceptorPromise.then((externalRequestInterceptor) => {
				return start(new JwtGateway(forProduction(externalRequestInterceptor), 300000));
			});
		}

		/**
		 * Creates and starts a new {@link RequestInterceptor} for use in the production environment.
		 *
		 * @public
		 * @static
		 * @param {Promise<RequestInterceptor>} externalRequestInterceptorPromise
		 * @returns {Promise<RequestInterceptor>}
		 */
		static forProductionClient(externalRequestInterceptorPromise) {
			return JwtGateway.forProduction(externalRequestInterceptorPromise)
				.then((jwtGateway) => {
					return jwtGateway.toRequestInterceptor();
				});
		}

		/**
		 * Creates and starts a new {@link JwtGateway} for use in the internal admin environment.
		 *
		 * @public
		 * @static
		 * @param {String} userId - The identifier of the user to impersonate.
		 * @param {String} userLegacyId - The legacy identifier of the user to impersonate.
		 * @returns {Promise<JwtGateway>}
		 */
		static forAdmin(userId, userLegacyId) {
			return start(new JwtGateway(forAdmin(userId, userLegacyId), 180000));
		}

		/**
		 * Creates and starts a new {@link RequestInterceptor} for use in the internal admin environment.
		 *
		 * @public
		 * @static
		 * @param {String} userId - The identifier of the user to impersonate.
		 * @returns {Promise<RequestInterceptor>}
		 */
		static forAdminClient(userId, userLegacyId) {
			return JwtGateway.forAdmin(userId, userLegacyId)
				.then((jwtGateway) => {
					return jwtGateway.toRequestInterceptor();
				});
		}

		/**
		 * Creates and starts a new {@link JwtGateway} for use in the demo environment.
		 *
		 * @public
		 * @static
		 * @param {String} userId - The identifier of the user to impersonate.
		 * @returns {Promise<JwtGateway>}
		 */
		static forDemo(userId) {
			return start(new JwtGateway(forDemo(userId), 180000));
		}

		/**
		 * Creates and starts a new {@link RequestInterceptor} for use in the demo environment.
		 *
		 * @public
		 * @static
		 * @param {String} userId - The identifier of the user to impersonate.
		 * @returns {Promise<RequestInterceptor>}
		 */
		static forDemoClient(userId) {
			return JwtGateway.forDemo(userId)
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

	function getTime() {
		return (new Date()).getTime();
	}

	function forDevelopment(userId, legacyUserId) {
		return EndpointBuilder.for('read-jwt-token-for-development', 'lookup user identity')
			.withVerb(VerbType.GET)
			.withProtocol(ProtocolType.HTTPS)
			.withHost(Configuration.developmentHost)
			.withPathBuilder((pb) => {
				pb.withLiteralParameter('token', 'token')
					.withLiteralParameter('barchart', 'barchart')
					.withLiteralParameter('generator', 'generator');
			})
			.withQueryBuilder((qb) => {
				qb.withLiteralParameter('user', 'userId', userId)
					.withLiteralParameter('legacy user', 'userLegacyId', legacyUserId)
					.withLiteralParameter('user context', 'userContext', 'TGAM')
					.withLiteralParameter('user permission level', 'userPermissions', 'registered');
			})
			.withResponseInterceptor(ResponseInterceptor.DATA)
			.endpoint;
	}

	function forStaging(externalRequestInterceptor) {
		return EndpointBuilder.for('translate-jwt-token-for-staging', 'lookup Barchart user identity')
			.withVerb(VerbType.GET)
			.withProtocol(ProtocolType.HTTPS)
			.withHost(Configuration.stagingHost)
			.withPathBuilder((pb) => {
				pb.withLiteralParameter('token', 'token')
					.withLiteralParameter('system', 'tgam')
					.withLiteralParameter('converter', 'converter');
			})
			.withRequestInterceptor(externalRequestInterceptor)
			.withResponseInterceptor(ResponseInterceptor.DATA)
			.endpoint;
	}

	function forDemo(userId) {
		return EndpointBuilder.for('read-jwt-token-for-demo', 'lookup user identity')
			.withVerb(VerbType.GET)
			.withProtocol(ProtocolType.HTTPS)
			.withHost(Configuration.demoHost)
			.withPathBuilder((pb) => {
				pb.withLiteralParameter('token', 'token')
				.withLiteralParameter('barchart', 'barchart')
				.withLiteralParameter('generator', 'generator');
			})
			.withQueryBuilder((qb) => {
				qb.withLiteralParameter('user', 'userId', userId)
				.withLiteralParameter('legacy user', 'userLegacyId', userId)
				.withLiteralParameter('user context', 'userContext', 'Barchart')
				.withLiteralParameter('user permission level', 'userPermissions', 'registered');
			})
			.withResponseInterceptor(ResponseInterceptor.DATA)
			.endpoint;
	}

	function forProduction(externalRequestInterceptor) {
		return EndpointBuilder.for('translate-jwt-token-for-production', 'lookup Barchart user identity')
			.withVerb(VerbType.GET)
			.withProtocol(ProtocolType.HTTPS)
			.withHost(Configuration.productionHost)
			.withPathBuilder((pb) => {
				pb.withLiteralParameter('token', 'token')
					.withLiteralParameter('system', 'tgam')
					.withLiteralParameter('converter', 'converter');
			})
			.withRequestInterceptor(externalRequestInterceptor)
			.withResponseInterceptor(ResponseInterceptor.DATA)
			.endpoint;
	}

	function forAdmin(userId, legacyUserId) {
		return EndpointBuilder.for('read-jwt-token-for-admin', 'lookup user identity')
			.withVerb(VerbType.GET)
			.withProtocol(ProtocolType.HTTPS)
			.withHost(Configuration.adminHost)
			.withPathBuilder((pb) => {
				pb.withLiteralParameter('token', 'token')
					.withLiteralParameter('barchart', 'barchart')
					.withLiteralParameter('generator', 'generator');
			})
			.withQueryBuilder((qb) => {
				if (userId) {
					qb.withLiteralParameter('user', 'userId', userId);
				}

				if (legacyUserId) {
					qb.withLiteralParameter('legacy user', 'userLegacyId', legacyUserId);
				}

				qb.withLiteralParameter('user context', 'userContext', 'TGAM')
					.withLiteralParameter('user permission level', 'userPermissions', 'registered');
			})
			.withResponseInterceptor(ResponseInterceptor.DATA)
			.endpoint;
	}

	return JwtGateway;
})();