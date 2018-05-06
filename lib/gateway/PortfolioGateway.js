const assert = require('@barchart/common-js/lang/assert'),
	Day = require('@barchart/common-js/lang/Day'),
	Disposable = require('@barchart/common-js/lang/Disposable'),
	Enum = require('@barchart/common-js/lang/Enum'),
	is = require('@barchart/common-js/lang/is');

const TransactionType = require('@barchart/portfolio-api-common/lib/data/TransactionType');

const PortfolioSchema = require('@barchart/portfolio-api-common/lib/serialization/PortfolioSchema'),
	PositionSummarySchema = require('@barchart/portfolio-api-common/lib/serialization/PositionSummarySchema'),
	PositionSchema = require('@barchart/portfolio-api-common/lib/serialization/PositionSchema'),
	TransactionSchema = require('@barchart/portfolio-api-common/lib/serialization/TransactionSchema');

const PositionSummaryFrame = require('@barchart/portfolio-api-common/lib/data/PositionSummaryFrame');

const EndpointBuilder = require('@barchart/common-js/api/http/builders/EndpointBuilder'),
	Gateway = require('@barchart/common-js/api/http/Gateway'),
	FailureReason = require('@barchart/common-js/api/failures/FailureReason'),
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
	 * @param {String} environment - A description of the environment we're connecting to.
	 * @param {RequestInterceptor=} requestInterceptor - A request interceptor used with each request (typically used to inject JWT tokens).
	 * @extends {Disposable}
	 */
	class PortfolioGateway extends Disposable {
		constructor(protocol, host, port, environment, requestInterceptor) {
			super();

			this._started = false;
			this._startPromise = null;

			this._environment = environment;

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
				.withRequestInterceptor(RequestInterceptor.PLAIN_TEXT_RESPONSE)
				.withRequestInterceptor(requestInterceptorToUse)
				.withResponseInterceptor(responseInterceptorForPortfolioDeserialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._createPortfolioEndpoint = EndpointBuilder.for('create-portfolio', 'create portfolio')
				.withVerb(VerbType.POST)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('portfolios', 'portfolios');
				})
				.withBody('portfolio')
				.withRequestInterceptor(RequestInterceptor.PLAIN_TEXT_RESPONSE)
				.withRequestInterceptor(RequestInterceptor.fromDelegate(createPortfolioRequestInterceptor))
				.withRequestInterceptor(requestInterceptorToUse)
				.withResponseInterceptor(responseInterceptorForPortfolioDeserialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._updatePortfolioEndpoint = EndpointBuilder.for('update-portfolio', 'update portfolio')
				.withVerb(VerbType.PUT)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('portfolios', 'portfolios')
						.withVariableParameter('portfolio', 'portfolio', 'portfolio', false);
				})
				.withBody('portfolio')
				.withRequestInterceptor(RequestInterceptor.PLAIN_TEXT_RESPONSE)
				.withRequestInterceptor(RequestInterceptor.fromDelegate(updatePortfolioRequestInterceptor))
				.withRequestInterceptor(requestInterceptorToUse)
				.withResponseInterceptor(responseInterceptorForPortfolioDeserialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._deletePortfolioEndpoint = EndpointBuilder.for('delete-portfolio', 'delete portfolio')
				.withVerb(VerbType.DELETE)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('portfolios', 'portfolios')
						.withVariableParameter('portfolio', 'portfolio', 'portfolio', false);
				})
				.withRequestInterceptor(requestInterceptorToUse)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._readPositionsEndpoint = EndpointBuilder.for('read-positions', 'read positions')
				.withVerb(VerbType.GET)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('portfolios', 'portfolios')
						.withVariableParameter('portfolio', 'portfolio', 'portfolio', false)
						.withLiteralParameter('positions', 'positions')
						.withVariableParameter('position', 'position', 'position', false);
				})
				.withQueryBuilder((qb) => {
					qb.withVariableParameter('includePreviousPrice', 'includePreviousPrice', 'includePreviousPrice', true);
				})
				.withRequestInterceptor(requestInterceptorToUse)
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
					pb.withLiteralParameter('portfolios', 'portfolios')
						.withVariableParameter('portfolio', 'portfolio', 'portfolio', false)
						.withLiteralParameter('positions', 'positions')
						.withVariableParameter('position', 'position', 'position', false);
				})
				.withBody('portfolio')
				.withRequestInterceptor(RequestInterceptor.PLAIN_TEXT_RESPONSE)
				.withRequestInterceptor(RequestInterceptor.fromDelegate(updatePositionRequestInterceptor))
				.withRequestInterceptor(requestInterceptorToUse)
				.withResponseInterceptor(responseInterceptorForPositionDeserialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._deletePositionEndpoint = EndpointBuilder.for('delete-position', 'delete position')
				.withVerb(VerbType.DELETE)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('portfolios', 'portfolios')
						.withVariableParameter('portfolio', 'portfolio', 'portfolio', false)
						.withLiteralParameter('positions', 'positions')
						.withVariableParameter('position', 'position', 'position', false);
				})
				.withRequestInterceptor(requestInterceptorToUse)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._readPositionSummariesEndpoint = EndpointBuilder.for('read-position-summaries', 'read position summaries')
				.withVerb(VerbType.GET)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('portfolios', 'portfolios')
						.withVariableParameter('portfolio', 'portfolio', 'portfolio', false)
						.withLiteralParameter('summaries', 'summaries')
						.withVariableParameter('position', 'position', 'position',  false);
				})
				.withQueryBuilder((qb) => {
					qb.withVariableParameter('frames', 'frames', 'frames', true, frames => frames.map(f => f.code).join())
						.withVariableParameter('periods', 'periods', 'periods', true)
						.withVariableParameter('start', 'start', 'start', true, s => s.format());
				})
				.withRequestInterceptor(requestInterceptorToUse)
				.withRequestInterceptor(RequestInterceptor.PLAIN_TEXT_RESPONSE)
				.withResponseInterceptor(responseInterceptorForPositionSummaryDeserialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._readTransactionsEndpoint = EndpointBuilder.for('read-transactions', 'read transactions')
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
				.withQueryBuilder((qb) => {
					qb.withLiteralParameter('mode', 'mode', 'text');
				})
				.withRequestInterceptor(RequestInterceptor.PLAIN_TEXT_RESPONSE)
				.withRequestInterceptor(requestInterceptorToUse)
				.withResponseInterceptor(responseInterceptorForTransactionDeserialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._createTransactionEndpoint = EndpointBuilder.for('create-transaction', 'create transaction')
				.withVerb(VerbType.POST)
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
				.withQueryBuilder((qb) => {
					qb.withVariableParameter('type', 'type', 'type', false, i => i.code);
				})
				.withBody('portfolio data')
				.withRequestInterceptor(requestInterceptorToUse)
				.withResponseInterceptor(responseInterceptorForTransactionMutateDeserialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._deleteTransactionEndpoint = EndpointBuilder.for('delete-transaction', 'delete transaction')
				.withVerb(VerbType.DELETE)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('portfolios', 'portfolios')
						.withVariableParameter('portfolio', 'portfolio', 'portfolio', false)
						.withLiteralParameter('positions', 'positions')
						.withVariableParameter('position', 'position', 'position', false)
						.withLiteralParameter('transactions', 'transactions')
						.withVariableParameter('sequence', 'sequence', 'sequence', false);
				})
				.withQueryBuilder((qb) => {
					qb.withVariableParameter('force', 'force', 'force', false)
						.withVariableParameter('echo', 'echo', 'echo', false);
				})
				.withRequestInterceptor(requestInterceptorToUse)
				.withResponseInterceptor(responseInterceptorForTransactionMutateDeserialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._readTransactionsReportEndpoint = EndpointBuilder.for('read-transaction-report', 'read transaction report')
				.withVerb(VerbType.GET)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('portfolios', 'portfolios')
						.withVariableParameter('portfolio', 'portfolio', 'portfolio', false)
						.withLiteralParameter('positions', 'positions')
						.withVariableParameter('position', 'position', 'position', true)
						.withLiteralParameter('transactions', 'transactions')
						.withLiteralParameter('formatted', 'formatted');
				})
				.withRequestInterceptor(requestInterceptorToUse)
				.withResponseInterceptor(ResponseInterceptor.DATA)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;
		}

		/**
		 * Returns a description of the environment (e.g. development or production).
		 *
		 * @public
		 * @return {*}
		 */
		get environment() {
			return this._environment;
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
		 * Creates a portfolio
		 *
		 * @public
		 * @param {Object} portfolio
		 * @return {Promise.<Portfolio>}
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
		 * Updates a portfolio
		 *
		 * @public
		 * @param {Object} portfolio
		 * @return {Promise.<Portfolio>}
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
		 * Deletes a portfolio
		 *
		 * @public
		 * @param {String} portfolio - ID of the portfolio to update
		 * @return {Promise.<Portfolio>}
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
		 * Retrieves positions for a user, a user's portfolio, or a single position.
		 *
		 * @public
		 * @param {String=} portfolio
		 * @param {String=} position
		 * @param {Boolean=} includePreviousPrice
		 * @returns {Promise.<Position[]>}
		 */
		readPositions(portfolio, position, includePreviousPrice) {
			return Promise.resolve()
				.then(() => {
					checkStart.call(this);

					assert.argumentIsOptional(portfolio, 'portfolio', String);
					assert.argumentIsOptional(position, 'position', String);
					assert.argumentIsOptional(includePreviousPrice, 'includePreviousPrice', Boolean);

					return Gateway.invoke(this._readPositionsEndpoint, { portfolio: portfolio || '*', position: position || '*', includePreviousPrice: includePreviousPrice });
				});
		}

		/**
		 * Updates a position
		 *
		 * @public
		 * @param {Object} position
		 * @return {Promise.<Position>}
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
		 * Retrieves positions for a user, a user's portfolio, or a single position.
		 *
		 * @public
		 * @param {String=} portfolio
		 * @param {String=} position
		 * @param {Array.<PositionSummaryFrame>=|Array.<String>=} frames
		 * @param {Number=} periods
		 * @param {Day=|String=} start
		 * @returns {Promise.<Position[]>}
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

					const query = {
						portfolio: portfolio || '*',
						position: position || '*'
					};

					if (frames) {
						query.frames = frames.map((frame) => {
							if (is.string(frame)) {
								return Enum.fromCode(PositionSummaryFrame, frame);
							} else {
								return frame;
							}
						});
					}

					if (periods) {
						query.periods = periods;
					}

					if (start) {
						let s;

						if (is.string(start)) {
							s = Day.parse(start);
						} else {
							s = start;
						}

						query.start = s;
					}

					return Gateway.invoke(this._readPositionSummariesEndpoint, query);
				});
		}

		/**
		 * Deletes a position.
		 *
		 * @public
		 * @param {String} portfolio
		 * @param {String} position
		 * @returns {Promise.<Position[]>}
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
		 * Retrieves transactions for a portfolio, or a single position.
		 *
		 * @public
		 * @param {Object} transaction
		 * @returns {Promise.<TransactionMutateResult>}
		 */
		createTransaction(transaction) {
			return Promise.resolve()
				.then(() => {
					checkStart.call(this);

					assert.argumentIsRequired(transaction, 'transaction', Object);
					assert.argumentIsRequired(transaction.portfolio, 'transaction.portfolio', String);
					assert.argumentIsOptional(transaction.position, 'transaction.position', String);

					let code;

					if (is.string(transaction.type)) {
						assert.argumentIsRequired(transaction.type.code, 'transaction.type.code', String);

						code = transaction.type;
					} else {
						assert.argumentIsRequired(transaction.type, 'transaction.type', TransactionType, 'TransactionType');

						code = transaction.type.code;
					}

					if (!transaction.position) {
						transaction.position = 'new';
					}

					const schema = TransactionSchema.forCreate(Enum.fromCode(TransactionType, code));

					return Gateway.invoke(this._createTransactionEndpoint, schema.schema.format(transaction));
				});
		}

		/**
		 * Deletes a transaction.
		 *
		 * @public
		 * @param {String} portfolio
		 * @param {String} position
		 * @param {Number} transaction
		 * @param {Boolean=} force
		 * @param {Boolean=} echo
		 * @returns {Promise.<TransactionMutateResult>}
		 */
		deleteTransaction(portfolio, position, sequence, force, echo) {
			return Promise.resolve()
				.then(() => {
					checkStart.call(this);

					assert.argumentIsRequired(portfolio, 'portfolio', String);
					assert.argumentIsRequired(position, 'position', String);
					assert.argumentIsRequired(sequence, 'sequence', Number);
					assert.argumentIsOptional(force, 'force', Boolean);
					assert.argumentIsOptional(echo, 'echo', Boolean);

					return Gateway.invoke(this._deleteTransactionEndpoint, { portfolio: portfolio, position: position, sequence: sequence, force: is.boolean(force) && force, echo: is.boolean(echo) && echo });
				});
		}

		/**
		 * Retrieves transactions for a portfolio, or a single position.
		 *
		 * @public
		 * @param {String} portfolio
		 * @param {String=} position
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

		readTransactionsFormatted(portfolio, position) {
			return Promise.resolve()
				.then(() => {
					checkStart.call(this);

					assert.argumentIsRequired(portfolio, 'portfolio', String);
					assert.argumentIsOptional(position, 'position', String);

					return Gateway.invoke(this._readTransactionsReportEndpoint, { portfolio: portfolio, position: position || '*' });
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
		static forLocal(requestInterceptor) {
			return Promise.resolve(requestInterceptor)
				.then((requestInterceptor) => {
					assert.argumentIsOptional(requestInterceptor, 'requestInterceptor', RequestInterceptor, 'RequestInterceptor');

					return start(new PortfolioGateway('http', Configuration.localHost, 3000, requestInterceptor));
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

					return start(new PortfolioGateway('https', Configuration.developmentHost, 443, 'development', requestInterceptor));
				});
		}

		/**
		 * Creates and starts a new {@link PortfolioGateway} for use in the staging environment.
		 *
		 * @public
		 * @static
		 * @param {RequestInterceptor=|Promise.<RequestInterceptor>=} requestInterceptor - A request interceptor used with each request (typically used to inject JWT tokens).
		 * @returns {Promise.<PortfolioGateway>}
		 */
		static forStaging(requestInterceptor) {
			return Promise.resolve(requestInterceptor)
				.then((requestInterceptor) => {
					assert.argumentIsOptional(requestInterceptor, 'requestInterceptor', RequestInterceptor, 'RequestInterceptor');

					return start(new PortfolioGateway('https', Configuration.stagingHost, 443, 'staging', requestInterceptor));
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

					return start(new PortfolioGateway('https', Configuration.productionHost, 443, 'production', requestInterceptor));
				});
		}

		_onDispose() {
			return;
		}
		
		toString() {
			return '[PortfolioGateway]';
		}
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

	const responseInterceptorForTransactionDeserialization = ResponseInterceptor.fromDelegate((response, ignored) => {
		try {
			return JSON.parse(response.data, TransactionSchema.CLIENT.schema.getReviver());
		} catch (e) {
			console.error('Error deserializing transaction data', e);
		}
	});

	const responseInterceptorForTransactionMutateDeserialization = ResponseInterceptor.fromDelegate((response, ignored) => {
		try {
			const saved = response.data.positions.saved.map(p => JSON.parse(p, PositionSchema.CLIENT.schema.getReviver()));
			const deleted = response.data.positions.deleted.map(p => JSON.parse(p, PositionSchema.CLIENT.schema.getReviver()));
			const summaries = response.data.summaries.map(s => JSON.parse(s, PositionSummarySchema.CLIENT.schema.getReviver()));

			const returnRef = {
				positions: {
					saved: saved,
					deleted: deleted
				},
				summaries: summaries
			};

			if (response.data.transactions) {
				returnRef.transactions = response.data.transactions;
			}

			return returnRef;
		} catch (e) {
			console.error('Error deserializing mutate transaction data', e);
		}
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

	/**
	 * The result of transaction create operation.
	 *
	 * @typedef TransactionMutateResult
	 * @type {Object}
	 * @property {Array.<Object>} positions - All positions updated as a consequence of processing the transaction.
	 * @property {Array.<Object>} summaries - All position summaries updated as a consequence of processing the transaction.
	 * @property {Boolean} replaced - If true, the position (and position summaries) need to be replaced.
	 */

 	return PortfolioGateway;
})();