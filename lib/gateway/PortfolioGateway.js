const array = require('@barchart/common-js/lang/array'),
	assert = require('@barchart/common-js/lang/assert'),
	Day = require('@barchart/common-js/lang/Day'),
	Disposable = require('@barchart/common-js/lang/Disposable'),
	Enum = require('@barchart/common-js/lang/Enum'),
	is = require('@barchart/common-js/lang/is'),
	promise = require('@barchart/common-js/lang/promise');

const TransactionType = require('@barchart/portfolio-api-common/lib/data/TransactionType');

const BrokerageReportAvailabilitySchema = require('@barchart/portfolio-api-common/lib/serialization/reports/BrokerageReportAvailabilitySchema'),
	PortfolioSchema = require('@barchart/portfolio-api-common/lib/serialization/PortfolioSchema'),
	PositionSummarySchema = require('@barchart/portfolio-api-common/lib/serialization/PositionSummarySchema'),
	PositionSchema = require('@barchart/portfolio-api-common/lib/serialization/PositionSchema'),
	TransactionSchema = require('@barchart/portfolio-api-common/lib/serialization/TransactionSchema');

const PositionSummaryFrame = require('@barchart/portfolio-api-common/lib/data/PositionSummaryFrame');

const EndpointBuilder = require('@barchart/common-js/api/http/builders/EndpointBuilder'),
	Gateway = require('@barchart/common-js/api/http/Gateway'),
	FailureReason = require('@barchart/common-js/api/failures/FailureReason'),
	FailureType = require('@barchart/common-js/api/failures/FailureType'),
	ProtocolType = require('@barchart/common-js/api/http/definitions/ProtocolType'),
	ErrorInterceptor = require('@barchart/common-js/api/http/interceptors/ErrorInterceptor'),
	RequestInterceptor = require('@barchart/common-js/api/http/interceptors/RequestInterceptor'),
	ResponseInterceptor = require('@barchart/common-js/api/http/interceptors/ResponseInterceptor'),
	VerbType = require('@barchart/common-js/api/http/definitions/VerbType');

const Configuration = require('./../common/Configuration'),
	JwtProvider = require('../security/JwtProvider');

module.exports = (() => {
	'use strict';

	const REST_API_VERSION = 'v1';
	const REST_API_SECURE_PROTOCOL = 'https';
	const REST_API_SECURE_PORT = 443;

	/**
	 * The **central component of the SDK**. It is responsible for connecting to Barchart's
	 * Portfolio Service. It can be used to query, edit, and delete portfolios.
	 *
	 * @public
	 * @param {String} protocol - The protocol of the Portfolio web service (either http or https).
	 * @param {String} host - The hostname of the Portfolio web service.
	 * @param {Number} port - The TCP port number of the Portfolio web service.
	 * @param {String} environment - A description of the environment we're connecting to.
	 * @param {String=} product - A code for the product which is using the gateway.
	 * @extends {Disposable}
	 */
	class PortfolioGateway extends Disposable {
		constructor(protocol, host, port, environment, product) {
			super();

			this._environment = environment;

			this._jwtProvider = null;

			this._started = false;
			this._startPromise = null;

			const requestInterceptor = RequestInterceptor.fromDelegate((options, endpoint) => {
				return Promise.resolve()
					.then(() => {
						return this._jwtProvider.getToken()
							.then((token) => {
								options.headers = options.headers || {};
								options.headers.Authorization = `Bearer ${token}`;

								if (is.string(product) && product.length > 0) {
									options.headers['X-Barchart-Product'] = product;
								}

								return options;
							});
					}).catch((e) => {
						const failure = FailureReason.forRequest({ endpoint: endpoint })
							.addItem(FailureType.REQUEST_IDENTITY_FAILURE)
							.format();

						return Promise.reject(failure);
					});
			});

			const protocolType = Enum.fromCode(ProtocolType, protocol.toUpperCase());

			this._readPortfoliosEndpoint = EndpointBuilder.for('read-portfolios', 'read portfolios')
				.withVerb(VerbType.GET)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('version', REST_API_VERSION)
						.withLiteralParameter('portfolios', 'portfolios')
						.withVariableParameter('portfolio', 'portfolio', 'portfolio', false);
				})
				.withRequestInterceptor(RequestInterceptor.PLAIN_TEXT_RESPONSE)
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(responseInterceptorForPortfolioDeserialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._createPortfolioEndpoint = EndpointBuilder.for('create-portfolio', 'create portfolio')
				.withVerb(VerbType.POST)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('version', REST_API_VERSION)
						.withLiteralParameter('portfolios', 'portfolios');
				})
				.withBody('portfolio')
				.withRequestInterceptor(RequestInterceptor.PLAIN_TEXT_RESPONSE)
				.withRequestInterceptor(RequestInterceptor.fromDelegate(createPortfolioRequestInterceptor))
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(responseInterceptorForPortfolioDeserialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._updatePortfolioEndpoint = EndpointBuilder.for('update-portfolio', 'update portfolio')
				.withVerb(VerbType.PUT)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('version', REST_API_VERSION)
						.withLiteralParameter('portfolios', 'portfolios')
						.withVariableParameter('portfolio', 'portfolio', 'portfolio', false);
				})
				.withBody('portfolio')
				.withRequestInterceptor(RequestInterceptor.PLAIN_TEXT_RESPONSE)
				.withRequestInterceptor(RequestInterceptor.fromDelegate(updatePortfolioRequestInterceptor))
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(responseInterceptorForPortfolioDeserialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._deletePortfolioEndpoint = EndpointBuilder.for('delete-portfolio', 'delete portfolio')
				.withVerb(VerbType.DELETE)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('version', REST_API_VERSION)
						.withLiteralParameter('portfolios', 'portfolios')
						.withVariableParameter('portfolio', 'portfolio', 'portfolio', false);
				})
				.withRequestInterceptor(requestInterceptor)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._readPositionsEndpoint = EndpointBuilder.for('read-positions', 'read positions')
				.withVerb(VerbType.GET)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('version', REST_API_VERSION)
						.withLiteralParameter('portfolios', 'portfolios')
						.withVariableParameter('portfolio', 'portfolio', 'portfolio', false)
						.withLiteralParameter('positions', 'positions')
						.withVariableParameter('position', 'position', 'position', false);
				})
				.withQueryBuilder((qb) => {
					qb.withVariableParameter('open', 'open', 'open', true)
						.withVariableParameter('symbol', 'symbol', 'symbol', true)
						.withVariableParameter('includePreviousPrice', 'includePreviousPrice', 'includePreviousPrice', true);
				})
				.withRequestInterceptor(requestInterceptor)
				.withRequestInterceptor(RequestInterceptor.PLAIN_TEXT_RESPONSE)
				.withResponseInterceptor(responseInterceptorForPositionDeserialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._updatePositionEndpoint = EndpointBuilder.for('update-position', 'update position')
				.withVerb(VerbType.PUT)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('version', REST_API_VERSION)
						.withLiteralParameter('portfolios', 'portfolios')
						.withVariableParameter('portfolio', 'portfolio', 'portfolio', false)
						.withLiteralParameter('positions', 'positions')
						.withVariableParameter('position', 'position', 'position', false);
				})
				.withBody('portfolio')
				.withRequestInterceptor(RequestInterceptor.fromDelegate(updatePositionRequestInterceptor))
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(responseInterceptorForPositionMutateDeserialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._deletePositionEndpoint = EndpointBuilder.for('delete-position', 'delete position')
				.withVerb(VerbType.DELETE)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('version', REST_API_VERSION)
						.withLiteralParameter('portfolios', 'portfolios')
						.withVariableParameter('portfolio', 'portfolio', 'portfolio', false)
						.withLiteralParameter('positions', 'positions')
						.withVariableParameter('position', 'position', 'position', false);
				})
				.withBody('transaction')
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(responseInterceptorForPositionMutateDeserializationForRemoval)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._readPositionSummariesEndpoint = EndpointBuilder.for('read-position-summaries', 'read position summaries')
				.withVerb(VerbType.GET)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('version', REST_API_VERSION)
						.withLiteralParameter('portfolios', 'portfolios')
						.withVariableParameter('portfolio', 'portfolio', 'portfolio', false)
						.withLiteralParameter('summaries', 'summaries')
						.withVariableParameter('position', 'position', 'position',  false);
				})
				.withQueryBuilder((qb) => {
					qb.withVariableParameter('frames', 'frames', 'frames', true, frames => frames.map(f => f.code).join())
						.withVariableParameter('periods', 'periods', 'periods', true)
						.withVariableParameter('start', 'start', 'start', true, x => x.format());
				})
				.withRequestInterceptor(requestInterceptor)
				.withRequestInterceptor(RequestInterceptor.PLAIN_TEXT_RESPONSE)
				.withResponseInterceptor(responseInterceptorForPositionSummaryDeserialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._readPositionValuationsAvailabilityEndpoint = EndpointBuilder.for('read-position-valuations-availability', 'read position valuations availability')
				.withVerb(VerbType.GET)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('version', REST_API_VERSION)
						.withLiteralParameter('portfolios', 'portfolios')
						.withVariableParameter('portfolio', 'portfolio', 'portfolio', false)
						.withLiteralParameter('values', 'values')
						.withLiteralParameter('availability', 'availability');
				})
				.withRequestInterceptor(RequestInterceptor.PLAIN_TEXT_RESPONSE)
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(responseInterceptorForDeserialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._readPositionValuationsEndpoint = EndpointBuilder.for('read-position-valuations', 'read position valuations')
				.withVerb(VerbType.GET)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('version', REST_API_VERSION)
						.withLiteralParameter('portfolios', 'portfolios')
						.withVariableParameter('portfolio', 'portfolio', 'portfolio', false)
						.withLiteralParameter('positions', 'positions')
						.withVariableParameter('position', 'position', 'position',  false)
						.withLiteralParameter('values', 'values');
				})
				.withRequestInterceptor(RequestInterceptor.PLAIN_TEXT_RESPONSE)
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(ResponseInterceptor.DATA)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._queryPositionValuationsEndpoint = EndpointBuilder.for('query-position-valuations', 'query position valuations')
				.withVerb(VerbType.GET)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('version', REST_API_VERSION)
						.withLiteralParameter('values', 'values');
				})
				.withQueryBuilder((qb) => {
					qb.withVariableParameter('symbol', 'symbol', 'symbol', false);
				})
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(ResponseInterceptor.DATA)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._readTransactionsEndpoint = EndpointBuilder.for('read-transactions', 'read transactions')
				.withVerb(VerbType.GET)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('version', REST_API_VERSION)
						.withLiteralParameter('portfolios', 'portfolios')
						.withVariableParameter('portfolio', 'portfolio', 'portfolio', false)
						.withLiteralParameter('positions', 'positions')
						.withVariableParameter('position', 'position', 'position', false)
						.withLiteralParameter('transactions', 'transactions')
						.withVariableParameter('sequence', 'sequence', 'sequence', false);
				})
				.withRequestInterceptor(RequestInterceptor.PLAIN_TEXT_RESPONSE)
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(responseInterceptorForTransactionDeserialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._createTransactionEndpoint = EndpointBuilder.for('create-transaction', 'create transaction')
				.withVerb(VerbType.POST)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('version', REST_API_VERSION)
						.withLiteralParameter('portfolios', 'portfolios')
						.withVariableParameter('portfolio', 'portfolio', 'portfolio', false)
						.withLiteralParameter('positions', 'positions')
						.withVariableParameter('position', 'position', 'position', false)
						.withLiteralParameter('transactions', 'transactions');
				})
				.withQueryBuilder((qb) => {
					qb.withVariableParameter('type', 'type', 'type', false, x => x.code);
				})
				.withBody('transaction')
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(responseInterceptorForPositionMutateDeserialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._editTransactionEndpoint = EndpointBuilder.for('edit-transaction', 'edit transaction')
				.withVerb(VerbType.POST)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('version', REST_API_VERSION)
						.withLiteralParameter('portfolios', 'portfolios')
						.withVariableParameter('portfolio', 'portfolio', 'portfolio', false)
						.withLiteralParameter('positions', 'positions')
						.withVariableParameter('position', 'position', 'position', false)
						.withLiteralParameter('transactions', 'transactions')
						.withVariableParameter('sequence', 'sequence', 'sequence', false);
				})
				.withQueryBuilder((qb) => {
					qb.withVariableParameter('type', 'type', 'type', false, x => x.code);
				})
				.withBody('transaction')
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(responseInterceptorForPositionMutateDeserialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._switchTransactionEndpoint = EndpointBuilder.for('switch-transaction', 'switch transaction')
				.withVerb(VerbType.POST)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('version', REST_API_VERSION)
						.withLiteralParameter('portfolios', 'portfolios')
						.withVariableParameter('portfolio', 'portfolio', 'portfolio', false)
						.withLiteralParameter('positions', 'positions')
						.withVariableParameter('position', 'position', 'position', false)
						.withLiteralParameter('transactions', 'transactions')
						.withVariableParameter('sequence', 'sequence', 'sequence', false);
				})
				.withQueryBuilder((qb) => {
					qb.withVariableParameter('switch', 'switch', 'switch', false, x => x.code);
				})
				.withBody()
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(responseInterceptorForPositionMutateDeserialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._deleteTransactionEndpoint = EndpointBuilder.for('delete-transaction', 'delete transaction')
				.withVerb(VerbType.DELETE)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('version', REST_API_VERSION)
						.withLiteralParameter('portfolios', 'portfolios')
						.withVariableParameter('portfolio', 'portfolio', 'portfolio', false)
						.withLiteralParameter('positions', 'positions')
						.withVariableParameter('position', 'position', 'position', false)
						.withLiteralParameter('transactions', 'transactions')
						.withVariableParameter('sequence', 'sequence', 'sequence', false);
				})
				.withQueryBuilder((qb) => {
					qb.withVariableParameter('force', 'force', 'force', false)
						.withVariableParameter('echoStart', 'echoStart', 'echoStart', true, x => x.format())
						.withVariableParameter('echoEnd', 'echoEnd', 'echoEnd', true, x => x.format());
				})
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(responseInterceptorForPositionMutateDeserializationForRemoval)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._readTransactionsReportEndpoint = EndpointBuilder.for('read-transaction-report', 'read transaction report')
				.withVerb(VerbType.GET)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('version', REST_API_VERSION)
						.withLiteralParameter('portfolios', 'portfolios')
						.withVariableParameter('portfolio', 'portfolio', 'portfolio', false)
						.withLiteralParameter('positions', 'positions')
						.withVariableParameter('position', 'position', 'position', true)
						.withLiteralParameter('transactions-formatted', 'transactions-formatted');
				})
				.withQueryBuilder((qb) => {
					qb.withVariableParameter('start', 'start', 'start', true, x => x.format())
						.withVariableParameter('end', 'end', 'end', true, x => x.format())
						.withVariableParameter('page', 'page', 'page', true)
						.withVariableParameter('sequence', 'sequence', 'sequence', true)
						.withVariableParameter('count', 'count', 'count', true)
						.withVariableParameter('descending', 'descending', 'descending', true);
				})
				.withRequestInterceptor(requestInterceptor)
				.withResponseInterceptor(ResponseInterceptor.DATA)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._readWealthscopeTokenEndpoint = EndpointBuilder.for('read-wealthscope-token', 'read wealthscope token')
				.withVerb(VerbType.GET)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('version', REST_API_VERSION)
						.withLiteralParameter('portfolios', 'portfolios')
						.withVariableParameter('portfolio', 'portfolio', 'portfolio', false)
						.withLiteralParameter('wealthscope', 'wealthscope')
						.withLiteralParameter('token', 'token');
				})
				.withRequestInterceptor(requestInterceptor)
				.withRequestInterceptor(RequestInterceptor.PLAIN_TEXT_RESPONSE)
				.withResponseInterceptor(responseInterceptorForWealthscopeToken)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._readBrokerageReportAvailabilityEndpoint = EndpointBuilder.for('read-brokerage-report-availability', 'read brokerage report availability')
				.withVerb(VerbType.GET)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('version', REST_API_VERSION)
						.withLiteralParameter('portfolios', 'portfolios')
						.withVariableParameter('portfolio', 'portfolio', 'portfolio', false)
						.withLiteralParameter('reports', 'reports')
						.withLiteralParameter('brokerage', 'brokerage')
						.withLiteralParameter('availability', 'availability');
				})
				.withQueryBuilder((qb) => {
					qb.withVariableParameter('frames', 'frames', 'frames', true, frames => frames.map(f => f.code).join());
				})
				.withRequestInterceptor(requestInterceptor)
				.withRequestInterceptor(RequestInterceptor.PLAIN_TEXT_RESPONSE)
				.withResponseInterceptor(responseInterceptorForBrokerageReportAvailabilityDeserialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._readVersionEndpoint = EndpointBuilder.for('read-api-version', 'read api version')
				.withVerb(VerbType.GET)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('version', REST_API_VERSION)
						.withLiteralParameter('system', 'system')
						.withLiteralParameter('version', 'version');
				})
				.withRequestInterceptor(requestInterceptor)
				.withRequestInterceptor(RequestInterceptor.PLAIN_TEXT_RESPONSE)
				.withResponseInterceptor(responseInterceptorForDeserialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._brokerageReportUrlGenerator = (user, portfolio, frame, end) => {
				return `https://${Configuration.getBrokerageHost(host)}/reports/portfolios/${portfolio}/frames/${frame.code}/date/${end.format()}/${user}`;
			};
		}

		/**
		 * Returns a description of the environment (e.g. development or production).
		 *
		 * @public
		 * @returns {String}
		 */
		get environment() {
			return this._environment;
		}

		/**
		 * Attempts to establish a connection to the backend. This function should be invoked
		 * immediately following instantiation. Once the resulting promise resolves, a
		 * connection has been established and other instance methods can be used.
		 *
		 * @public
		 * @param {JwtProvider} jwtProvider
		 * @returns {Promise<PortfolioGateway>}
		 */
		connect(jwtProvider) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(jwtProvider, 'jwtProvider', JwtProvider, 'JwtProvider');

					if (this._startPromise === null) {
						this._startPromise = Promise.resolve()
							.then(() => {
								this._started = true;

								this._jwtProvider = jwtProvider;

								return this;
							}).catch((e) => {
								this._started = false;
								this._startPromise = null;

								this._jwtProvider = null;

								throw e;
							});
					}

					return this._startPromise;
				});
		}

		/**
		 * Creates a new portfolio for the current user.
		 *
		 * @public
		 * @param {Schema.PortfolioCreate} portfolio - Data regarding the portfolio to create.
		 * @returns {Promise<Schema.Portfolio>}
		 */
		createPortfolio(portfolio) {
			return Promise.resolve()
				.then(() => {
					checkStart.call(this);

					assert.argumentIsRequired(portfolio, 'portfolio', Object);

					return Gateway.invoke(this._createPortfolioEndpoint, PortfolioSchema.CREATE.schema.format(portfolio));
				});
		}

		/**
		 * Updates a portfolio.
		 *
		 * @public
		 * @param {Schema.PortfolioUpdate} portfolio
		 * @returns {Promise<Schema.Portfolio>}
		 */
		updatePortfolio(portfolio) {
			return Promise.resolve()
				.then(() => {
					checkStart.call(this);

					assert.argumentIsRequired(portfolio, 'portfolio', Object);

					return Gateway.invoke(this._updatePortfolioEndpoint, PortfolioSchema.UPDATE.schema.format(portfolio));
				});
		}

		/**
		 * Deletes a portfolio. All data associated with the portfolio will also be
		 * deleted (e.g. positions, transactions, etc).
		 *
		 * @public
		 * @param {String} portfolio - The identifier of the portfolio to delete.
		 * @returns {Promise}
		 */
		deletePortfolio(portfolio) {
			return Promise.resolve()
				.then(() => {
					checkStart.call(this);

					assert.argumentIsRequired(portfolio, 'portfolio', String);

					return Gateway.invoke(this._deletePortfolioEndpoint, { portfolio: portfolio });
				});
		}

		/**
		 * Reads all portfolios (or a single portfolio) for the current user.
		 *
		 * @public
		 * @param {String=} portfolio - A portfolio identifier. If omitted, all portfolios for the current user will be returned.
		 * @returns {Promise<Schema.Portfolio[]>}
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
		 * Updates a position.
		 *
		 * @public
		 * @param {Schema.PositionUpdate} position
		 * @returns {Promise<Schema.Position>}
		 */
		updatePosition(position) {
			return Promise.resolve()
				.then(() => {
					checkStart.call(this);

					assert.argumentIsRequired(position, 'position', Object);

					return Gateway.invoke(this._updatePositionEndpoint, PositionSchema.UPDATE.schema.format(position));
				});
		}

		/**
		 * Deletes a position (and all associated data, including transactions and summaries).
		 * An array of deleted  positions is returned (in some rare cases, deleting one position
		 * may cause other positions to be be deleted — for example, a position which was spun-off).
		 *
		 * @public
		 * @param {String} portfolio - The identifier of the portfolio which contains the position to delete.
		 * @param {String} position - The identifier of the position to delete.
		 * @returns {Promise<Schema.Position[]>}
		 */
		deletePosition(portfolio, position) {
			return Promise.resolve()
				.then(() => {
					checkStart.call(this);

					assert.argumentIsRequired(portfolio, 'portfolio', String);
					assert.argumentIsRequired(position, 'position', String);

					return Gateway.invoke(this._deletePositionEndpoint, { portfolio: portfolio, position: position });
				});
		}


		/**
		 * Retrieves all positions for a user, a user's portfolio, or a single position.
		 *
		 * @public
		 * @param {String=} portfolio - The identifier of the portfolio containing the desired positions. If omitted, all positions for the current user, regardless of portfolio, will be returned.
		 * @param {String=} position - The identifier of the specific position to read. If included, the "portfolio" parameter must be specified.
		 * @param {Boolean=} includePreviousPrice
		 * @returns {Promise<Schema.Position[]>}
		 */
		readPositions(portfolio, position, includePreviousPrice) {
			return Promise.resolve()
				.then(() => {
					checkStart.call(this);

					assert.argumentIsOptional(portfolio, 'portfolio', String);
					assert.argumentIsOptional(position, 'position', String);
					assert.argumentIsOptional(includePreviousPrice, 'includePreviousPrice', Boolean);

					return Gateway.invoke(this._readPositionsEndpoint, { portfolio: portfolio || '*', position: position || '*', includePreviousPrice: includePreviousPrice || false });
				});
		}

		/**
		 * Queries positions.
		 *
		 * @public
		 * @ignore
		 * @param {String} symbol
		 * @param {Boolean=} open
		 * @param {PositionSchema=} schema
		 * @returns {Promise<Schema.Position[]>}
		 */
		queryPositionsForSymbol(symbol, open, schema) {
			return Promise.resolve()
				.then(() => {
					checkStart.call(this);

					assert.argumentIsRequired(symbol, 'symbol', String);
					assert.argumentIsOptional(open, 'open', Boolean);

					const payload = { };

					payload.portfolio = '*';
					payload.position = '*';

					payload.symbol = symbol;

					if (open) {
						payload.open = open;
					}

					return Gateway.invoke(this._readPositionsEndpoint, payload);
				});
		}

		/**
		 * Returns a promise which resolves as soon as the position's lock status
		 * changes to false.
		 *
		 * @public
		 * @ignore
		 * @param {String} portfolio
		 * @param {String} position
		 * @returns {Promise}
		 */
		observePositionLock(portfolio, position) {
			return promise.build((resolveCallback) => {
				assert.argumentIsRequired(portfolio, 'portfolio', String);
				assert.argumentIsRequired(position, 'position', String);

				const scheduleCheck = (delay) => {
					setTimeout(() => {
						Gateway.invoke(this._readPositionsEndpoint, { portfolio: portfolio, position: position, includePreviousPrice: false })
							.then((positions) => {
								const p = positions.find(p => p.position === position);

								if (is.object(p)) {
									if (is.object(p.system) && is.object(p.system) && is.boolean(p.system.locked) && p.system.locked) {
										scheduleCheck(delay + 1000);
									} else {
										resolveCallback(p);
									}
								} else {
									resolveCallback(null);
								}
							}).catch((e) => {
								scheduleCheck(delay + 5000);
							});
					}, delay);
				};

				scheduleCheck(2500);
			});
		}

		/**
		 * Retrieves summaries for a user, a user's portfolio, or a single position.
		 *
		 * @public
		 * @ignore
		 * @param {String=} portfolio
		 * @param {String=} position
		 * @param {Array<PositionSummaryFrame>=|Array<String>=} frames
		 * @param {Number=} periods
		 * @param {Day=|String=} start
		 * @returns {Promise<Schema.Position[]>}
		 */
		readPositionSummaries(portfolio, position, frames, periods, start) {
			return Promise.resolve()
				.then(() => {
					checkStart.call(this);

					assert.argumentIsOptional(portfolio, 'portfolio', String);
					assert.argumentIsOptional(position, 'position', String);

					if (is.array(frames)) {
						if (frames.length > 0 && is.string(frames[ 0 ])) {
							assert.argumentIsArray(frames, 'frames', String);
						} else {
							assert.argumentIsArray(frames, 'frames', PositionSummaryFrame, 'PositionSummaryFrame');
						}
					} else {
						if (is.string(frames)) {
							assert.argumentIsOptional(frames, 'frames', String);
						} else {
							assert.argumentIsOptional(frames, 'frames', PositionSummaryFrame, 'PositionSummaryFrame');
						}
					}

					assert.argumentIsOptional(periods, 'periods', Number);
					assert.argumentIsOptional(start, 'start', Day);

					const payload = {
						portfolio: portfolio || '*',
						position: position || '*'
					};

					if (frames) {
						payload.frames = frames.map((frame) => {
							if (is.string(frame)) {
								return Enum.fromCode(PositionSummaryFrame, frame);
							} else {
								return frame;
							}
						});
					}

					if (periods) {
						payload.periods = periods;
					}

					if (start) {
						let s;

						if (is.string(start)) {
							s = Day.parse(start);
						} else {
							s = start;
						}

						payload.start = s;
					}

					return Gateway.invoke(this._readPositionSummariesEndpoint, payload);
				});
		}

		/**
		 * Retrieves end-of-day valuations for the entire portfolio (or a single position).
		 *
		 * @public
		 * @ignore
		 * @param {String} portfolio - The identifier of the portfolio.
		 * @param {String=} position - The identifier of the position. If omitted, that valuation history will be returned for the entire portfolio (i.e. sum of valuations for all positions contained in the portfolio).
		 * @param {Boolean=} parse - If true, the result will be a {@link Schema.ValuationContainer} object. Otherwise, the result will be a JSON-formatted string.
		 * @returns {Promise<String|Schema.ValuationContainer>}
		 */
		readPositionValuations(portfolio, position, parse) {
			return Promise.resolve()
				.then(() => {
					checkStart.call(this);

					assert.argumentIsRequired(portfolio, 'portfolio', String);
					assert.argumentIsOptional(position, 'position', String);

					const payload = { };

					payload.portfolio = portfolio;
					payload.position = position || '*';

					return Gateway.invoke(this._readPositionValuationsEndpoint, payload)
						.then((json) => {
							let result;

							if (parse) {
								result = JSON.parse(json);
							} else {
								result = json;
							}

							return result;
						});
				});
		}

		/**
		 * Retrieves values availability of the portfolio and it's positions.
		 *
		 * @public
		 * @ignore
		 * @param {String} portfolio
		 * @return {Promise<Schema.ValuationsAvailabilityResult>}
		 */
		readPositionValuationsAvailability(portfolio) {
			return Promise.resolve()
				.then(() => {
					checkStart.call(this);

					assert.argumentIsRequired(portfolio, 'portfolio', String);

					const payload = { };

					payload.portfolio = portfolio;

					return Gateway.invoke(this._readPositionValuationsAvailabilityEndpoint, payload);
				});
		}

		/**
		 * Queries end-of-day position valuations across all user portfolios.
		 *
		 * @public
		 * @ignore
		 * @param {String} symbol
		 * @return {Promise<Object[]>}
		 */
		queryPositionValuations(symbol) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(symbol, 'symbol', String);

					return Gateway.invoke(this._queryPositionValuationsEndpoint, { symbol });
				});
		}

		/**
		 * Creates a new transaction.
		 *
		 * @public
		 * @param {Schema.TransactionCreate} transaction
		 * @returns {Promise<Schema.TransactionMutateResult>}
		 */
		createTransaction(transaction) {
			return Promise.resolve()
				.then(() => {
					checkStart.call(this);

					assert.argumentIsRequired(transaction, 'transaction', Object);
					assert.argumentIsRequired(transaction.portfolio, 'transaction.portfolio', String);
					assert.argumentIsOptional(transaction.position, 'transaction.position', String);

					if (!transaction.position) {
						transaction.position = 'new';
					}

					const schema = getTransactionSchema(transaction);

					return Gateway.invoke(this._createTransactionEndpoint, schema.schema.format(transaction));
				});
		}

		/**
		 * Edits a transaction (e.g. change the date, price, quantity, etc).
		 *
		 * @public
		 * @param {Schema.Transaction} transaction
		 * @returns {Promise<Schema.TransactionMutateResult>}
		 */
		editTransaction(transaction) {
			return Promise.resolve()
				.then(() => {
					checkStart.call(this);

					assert.argumentIsRequired(transaction, 'transaction', Object);
					assert.argumentIsRequired(transaction.portfolio, 'transaction.portfolio', String);
					assert.argumentIsRequired(transaction.position, 'transaction.position', String);
					assert.argumentIsRequired(transaction.sequence, 'transaction.sequence', Number);

					const schema = getTransactionSchema(transaction);

					return Gateway.invoke(this._editTransactionEndpoint, schema.schema.format(transaction));
				});
		}

		/**
		 * Switch the reinvestment strategy for a single transaction.
		 *
		 * @public
		 * @ignore
		 * @param {Schema.Transaction} transaction
		 * @param {TransactionType} type
		 * @returns {Promise<Schema.TransactionMutateResult>}
		 */
		switchTransaction(transaction, type) {
			return Promise.resolve()
				.then(() => {
					checkStart.call(this);

					assert.argumentIsRequired(transaction, 'transaction', Object);
					assert.argumentIsRequired(transaction.portfolio, 'transaction.portfolio', String);
					assert.argumentIsRequired(transaction.position, 'transaction.position', String);
					assert.argumentIsRequired(transaction.sequence, 'transaction.sequence', Number);
					assert.argumentIsRequired(type, type, TransactionType, 'TransactionType');

					const schema = getTransactionSchema(transaction);
					const payload = schema.schema.format(transaction);

					payload.switch = type;

					return Gateway.invoke(this._switchTransactionEndpoint, payload);
				});
		}

		/**
		 * Deletes a transaction.
		 *
		 * @public
		 * @param {String} portfolio - The identifier of the portfolio which contains the targeted position.
		 * @param {String} position - The identifier of the targeted position.
		 * @param {Number} sequence - The sequence number of the transaction to delete.
		 * @param {Boolean=} force
		 * @param {Day=} echoStart
		 * @param {Day=} echoEnd
		 * @returns {Promise<Schema.TransactionMutateResult>}
		 */
		deleteTransaction(portfolio, position, sequence, force, echoStart, echoEnd) {
			return Promise.resolve()
				.then(() => {
					checkStart.call(this);

					assert.argumentIsRequired(portfolio, 'portfolio', String);
					assert.argumentIsRequired(position, 'position', String);
					assert.argumentIsRequired(sequence, 'sequence', Number);
					assert.argumentIsOptional(force, 'force', Boolean);
					assert.argumentIsOptional(echoStart, 'echoStart', Day, 'Day');
					assert.argumentIsOptional(echoEnd, 'echoEnd', Day, 'Day');

					let payload = { };

					payload.portfolio = portfolio;
					payload.position = position;
					payload.sequence = sequence;
					payload.force = is.boolean(force) && force;

					if (echoStart) {
						payload.echoStart = echoStart;
					}

					if (echoEnd) {
						payload.echoEnd = echoEnd;
					}

					return Gateway.invoke(this._deleteTransactionEndpoint, payload);
				});
		}

		/**
		 * Retrieves transactions for a portfolio, or a single position.
		 *
		 * @public
		 * @param {String} portfolio - The identifier of the portfolio containing the desired transactions.
		 * @param {String=} position - The identifier for the position to read transactions for. If included, the resulting transactions will be limited to the specified position. Otherwise, transactions for all positions in the portfolio, will be returned.
		 * @param {Number=} sequence - The sequence number of the specific transaction to read. If included, both the "portfolio" and "position" parameters must be specified.
		 * @returns {Promise<Schema.Transaction[]>}
		 */
		readTransactions(portfolio, position, sequence) {
			return Promise.resolve()
				.then(() => {
					checkStart.call(this);

					assert.argumentIsRequired(portfolio, 'portfolio', String);
					assert.argumentIsOptional(position, 'position', String);
					assert.argumentIsOptional(sequence, 'sequence', Number);

					return Gateway.invoke(this._readTransactionsEndpoint, { portfolio: portfolio, position: position || '*', sequence: is.number(sequence) ? sequence.toString() : '*' });
				});
		}

		/**
		 * Retrieves transactions, where the property values are suitable for display,
		 * for a portfolio, or a single position.
		 *
		 * @public
		 * @ignore
		 * @param {String} portfolio
		 * @param {String=} position
		 * @param {Day=} startDay
		 * @param {Day=} endDay
		 * @param {Boolean=} descending
		 * @returns {Promise<Object[]>}
		 */
		readTransactionsFormatted(portfolio, position, startDay, endDay, descending) {
			return Promise.resolve()
				.then(() => {
					checkStart.call(this);

					assert.argumentIsRequired(portfolio, 'portfolio', String);
					assert.argumentIsOptional(position, 'position', String);
					assert.argumentIsOptional(startDay, 'startDay', Day, 'Day');
					assert.argumentIsOptional(endDay, 'endDay', Day, 'Day');
					assert.argumentIsOptional(descending, 'descending', Boolean);

					const payload = { };

					payload.portfolio = portfolio;
					payload.position = position || '*';

					if (startDay) {
						payload.start = startDay;
					}

					if (endDay) {
						payload.end = endDay;
					}

					payload.descending = is.boolean(descending) && descending;

					return Gateway.invoke(this._readTransactionsReportEndpoint, payload);
				});
		}

		/**
		 * Reads a single page of formatted transactions.
		 *
		 * @public
		 * @ignore
		 * @param {String} portfolio
		 * @param {String} position
		 * @param {Number=} sequence
		 * @param {Number=} count
		 * @param {Boolean=} descending
		 * @returns {Promise<Object[]>}
		 */
		readTransactionsFormattedPage(portfolio, position, sequence, count, descending) {
			return Promise.resolve()
				.then(() => {
					checkStart.call(this);

					assert.argumentIsRequired(portfolio, 'portfolio', String);
					assert.argumentIsRequired(position, 'position', String);
					assert.argumentIsOptional(sequence, 'sequence', Number);
					assert.argumentIsOptional(count, 'count', Number);
					assert.argumentIsOptional(descending, 'descending', Boolean);

					const payload = { };

					payload.portfolio = portfolio;
					payload.position = position;

					payload.page = true;

					if (sequence) {
						payload.sequence = sequence;
					}

					if (count) {
						payload.count = count;
					}

					payload.descending = is.boolean(descending) && descending;

					return Gateway.invoke(this._readTransactionsReportEndpoint, payload);
				});
		}

		/**
		 * Retrieves end-of-day valuations for the entire portfolio (or a single position).
		 *
		 * @public
		 * @param {String} portfolio - The identifier of the portfolio.
		 * @param {String=} position - The identifier of the position. If omitted, that valuation history will be returned for the entire portfolio (i.e. sum of valuations for all positions contained in the portfolio).
		 * @returns {Promise<Schema.ValuationContainer>}
		 */
		readValuations(portfolio, position) {
			return this.readPositionValuations(portfolio, position, true);
		}

		/**
		 * Retrieves the status of end-of-day valuations for all positions contained
		 * within a portfolio.
		 *
		 * @public
		 * @param {String} portfolio - The identifier of the portfolio.
		 * @returns {Promise<Schema.ValuationsAvailabilityResult>}
		 */
		checkValuations(portfolio) {
			return this.readPositionValuationsAvailability(portfolio);
		}

		/**
		 * Reads a wealthscope token for a specific portfolio.
		 *
		 * @public
		 * @ignore
		 * @param {String} portfolio
		 * @return {Promise<String>}
		 */
		readWealthscopeToken(portfolio) {
			return Promise.resolve()
				.then(() => {
					checkStart.call(this);

					assert.argumentIsRequired(portfolio, 'portfolio', String);

					const payload = { };

					payload.portfolio = portfolio;

					return Gateway.invoke(this._readWealthscopeTokenEndpoint, payload);
				});
		}

		/**
		 * Returns all position summary definitions for a portfolio.
		 *
		 * @public
		 * @ignore
		 * @param {String} portfolio
		 */
		readBrokerageReportAvailability(portfolio) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(portfolio, 'portfolio', String);

					const payload = { };

					payload.portfolio = portfolio;

					return Gateway.invoke(this._readBrokerageReportAvailabilityEndpoint, payload);
				});
		}

		/**
		 * Generates a URL suitable for downloading a brokerage report (as a PDF).
		 *
		 * @public
		 * @ignore
		 * @param {String} user
		 * @param {String} portfolio
		 * @param {PositionSummaryFrame} frame
		 * @param {Day} end
		 * @return {Promise<String>}
		 */
		getBrokerageReportUrl(user, portfolio, frame, end) {
			return Promise.resolve()
				.then(() => {
					checkStart.call(this);

					assert.argumentIsRequired(user, 'user', String);
					assert.argumentIsRequired(portfolio, 'portfolio', String);
					assert.argumentIsRequired(frame, 'frame', PositionSummaryFrame, 'PositionSummaryFrame');
					assert.argumentIsRequired(end, 'end', Day, 'Day');

					return this._brokerageReportUrlGenerator(user, portfolio, frame, end);
				});
		}

		/**
		 * Returns current version of the Portfolio Service.
		 *
		 * @public
		 * @returns {Promise<Object>}
		 */
		readVersion() {
			return Promise.resolve()
				.then(() => {
					return Gateway.invoke(this._readVersionEndpoint);
				});
		}

		/**
		 * Creates and starts a new {@link PortfolioGateway} for use in the public test environment.
		 *
		 * @public
		 * @static
		 * @param {JwtProvider} jwtProvider
		 * @param {String=} product
		 * @returns {Promise<PortfolioGateway>}
		 */
		static forTest(jwtProvider, product) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(jwtProvider, 'jwtProvider', JwtProvider, 'JwtProvider');
					assert.argumentIsOptional(product, 'product', String);

					return start(new PortfolioGateway(REST_API_SECURE_PROTOCOL, Configuration.testHost, REST_API_SECURE_PORT, 'test', product), jwtProvider);
				});
		}

		/**
		 * Creates and starts a new {@link PortfolioGateway} for use in the private development environment.
		 *
		 * @public
		 * @ignore
		 * @static
		 * @param {JwtProvider} jwtProvider
		 * @param {String=} product
		 * @returns {Promise<PortfolioGateway>}
		 */
		static forDevelopment(jwtProvider, product) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(jwtProvider, 'jwtProvider', JwtProvider, 'JwtProvider');
					assert.argumentIsOptional(product, 'product', String);

					return start(new PortfolioGateway(REST_API_SECURE_PROTOCOL, Configuration.developmentHost, REST_API_SECURE_PORT, 'development', product), jwtProvider);
				});
		}

		/**
		 * Creates and starts a new {@link PortfolioGateway} for use in the private staging environment.
		 *
		 * @public
		 * @ignore
		 * @static
		 * @param {JwtProvider} jwtProvider
		 * @param {String=} product
		 * @returns {Promise<PortfolioGateway>}
		 */
		static forStaging(jwtProvider, product) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(jwtProvider, 'jwtProvider', JwtProvider, 'JwtProvider');
					assert.argumentIsOptional(product, 'product', String);

					return start(new PortfolioGateway(REST_API_SECURE_PROTOCOL, Configuration.stagingHost, REST_API_SECURE_PORT, 'staging', product), jwtProvider);
				});
		}

		/**
		 * Creates and starts a new {@link PortfolioGateway} for use in the public demo environment.
		 *
		 * @public
		 * @static
		 * @param {JwtProvider} jwtProvider
		 * @param {String=} product
		 * @returns {Promise<PortfolioGateway>}
		 */
		static forDemo(jwtProvider, product) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(jwtProvider, 'jwtProvider', JwtProvider, 'JwtProvider');
					assert.argumentIsOptional(product, 'product', String);

					return start(new PortfolioGateway(REST_API_SECURE_PROTOCOL, Configuration.demoHost, REST_API_SECURE_PORT, 'demo', product), jwtProvider);
				});
		}

		/**
		 * Creates and starts a new {@link PortfolioGateway} for use in the public production environment.
		 *
		 * @public
		 * @static
		 * @param {JwtProvider} jwtProvider
		 * @param {String=} product
		 * @returns {Promise<PortfolioGateway>}
		 */
		static forProduction(jwtProvider, product) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(jwtProvider, 'jwtProvider', JwtProvider, 'JwtProvider');
					assert.argumentIsOptional(product, 'product', String);

					return start(new PortfolioGateway(REST_API_SECURE_PROTOCOL, Configuration.productionHost, REST_API_SECURE_PORT, 'production', product), jwtProvider);
				});
		}

		/**
		 * Creates and starts a new {@link PortfolioGateway} for use in the private admin environment.
		 *
		 * @public
		 * @ignore
		 * @static
		 * @param {JwtProvider} jwtProvider
		 * @param {String=} product
		 * @returns {Promise<PortfolioGateway>}
		 */
		static forAdmin(jwtProvider, product) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(jwtProvider, 'jwtProvider', JwtProvider, 'JwtProvider');
					assert.argumentIsOptional(product, 'product', String);

					return start(new PortfolioGateway(REST_API_SECURE_PROTOCOL, Configuration.adminHost, REST_API_SECURE_PORT, 'admin', product), jwtProvider);
				});
		}

		_onDispose() {
			return;
		}

		toString() {
			return '[PortfolioGateway]';
		}
	}

	function getTransactionTypeCode(transaction) {
		let code;

		if (is.string(transaction.type)) {
			assert.argumentIsRequired(transaction.type, 'transaction.type', String);

			code = transaction.type;
		} else {
			assert.argumentIsRequired(transaction.type, 'transaction.type', TransactionType, 'TransactionType');

			code = transaction.type.code;
		}

		return code;
	}

	function getTransactionSchema(transaction) {
		return TransactionSchema.forCreate(Enum.fromCode(TransactionType, getTransactionTypeCode(transaction)));
	}

	const createPortfolioRequestInterceptor = (request) => {
		return FailureReason.validateSchema(PortfolioSchema.CREATE, request.data)
			.then(() => {
				return Promise.resolve(request);
			}).catch((e) => {
				console.error('Error serializing data to create a portfolio', e);

				return Promise.reject();
			});
	};

	const updatePortfolioRequestInterceptor = (request) => {
		return FailureReason.validateSchema(PortfolioSchema.UPDATE, request.data)
			.then(() => {
				return Promise.resolve(request);
			}).catch((e) => {
				console.error('Error serializing data to update a portfolio', e);

				return Promise.reject();
			});
	};

	const updatePositionRequestInterceptor = (request) => {
		return FailureReason.validateSchema(PositionSchema.UPDATE, request.data)
			.then(() => {
				return Promise.resolve(request);
			}).catch((e) => {
				console.error('Error serializing data to update a position', e);

				return Promise.reject();
			});
	};

	const responseInterceptorForPortfolioDeserialization = ResponseInterceptor.fromDelegate((response, ignored) => {
		try {
			return JSON.parse(response.data, PortfolioSchema.CLIENT.schema.getReviver());
		} catch (e) {
			console.log('Error deserializing portfolios', e);
		}
	});

	const responseInterceptorForPositionDeserialization = ResponseInterceptor.fromDelegate((response, ignored) => {
		try {
			return JSON.parse(response.data, PositionSchema.CLIENT.schema.getReviver());
		} catch (e) {
			console.log('Error deserializing positions', e);
		}
	});

	const responseInterceptorForPositionSummaryDeserialization = ResponseInterceptor.fromDelegate((response, ignored) => {
		try {
			return JSON.parse(response.data, PositionSummarySchema.CLIENT.schema.getReviver());
		} catch (e) {
			console.log('Error deserializing position summaries', e);
		}
	});

	const responseInterceptorForBrokerageReportAvailabilityDeserialization = ResponseInterceptor.fromDelegate((response, ignored) => {
		try {
			return JSON.parse(response.data, BrokerageReportAvailabilitySchema.COMPLETE.schema.getReviver());
		} catch (e) {
			console.log('Error deserializing brokerage report availability definition', e);
		}
	});

	const responseInterceptorForTransactionDeserialization = ResponseInterceptor.fromDelegate((response, ignored) => {
		try {
			return JSON.parse(response.data, TransactionSchema.CLIENT.schema.getReviver());
		} catch (e) {
			console.error('Error deserializing transaction data', e);
		}
	});

	const responseInterceptorForPositionMutateDeserialization = ResponseInterceptor.fromDelegate((response, ignored) => {
		try {
			return deserializePositionMutateData(response.data, false);
		} catch (e) {
			console.error('Error deserializing position mutate data', e);
		}
	});

	const responseInterceptorForPositionMutateDeserializationForRemoval = ResponseInterceptor.fromDelegate((response, ignored) => {
		try {
			return deserializePositionMutateData(response.data, true);
		} catch (e) {
			console.error('Error deserializing position mutate data', e);
		}
	});

	const responseInterceptorForWealthscopeToken = ResponseInterceptor.fromDelegate((response, ignored) => {
		try {
			return JSON.parse(response.data).token;
		} catch (e) {
			console.error('Error deserializing data', e);
		}
	});

	const responseInterceptorForDeserialization = ResponseInterceptor.fromDelegate((response, ignored) => {
		try {
			return JSON.parse(response.data);
		} catch (e) {
			console.error('Error deserializing data', e);
		}
	});

	function start(gateway, jwtProvider) {
		return gateway.connect(jwtProvider)
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

	function extractInstrumentId(position) {
		return position.instrument.id;
	}

	function deserializePositionMutateData(data, removing) {
		const saved = data.positions.saved.map(p => JSON.parse(p, PositionSchema.CLIENT.schema.getReviver()));
		const deleted = data.positions.deleted.map(p => JSON.parse(p, PositionSchema.CLIENT.schema.getReviver()));
		const summaries = data.summaries.map(s => JSON.parse(s, PositionSummarySchema.CLIENT.schema.getReviver()));

		const created = array.differenceBy(saved, deleted, extractInstrumentId).filter(p => p.transaction === 1 && !removing);
		const removed = array.differenceBy(deleted, saved, extractInstrumentId);
		const edited = array.differenceBy(array.unionBy(saved, deleted, extractInstrumentId), array.unionBy(created, removed, extractInstrumentId), extractInstrumentId);

		const returnRef = {
			actions: {
				created: created,
				removed: removed,
				edited: edited
			},
			positions: {
				saved: saved,
				deleted: deleted
			},
			summaries: summaries
		};

		if (data.transactions) {
			returnRef.transactions = data.transactions;
		}

		return returnRef;
	}

 	return PortfolioGateway;
})();
