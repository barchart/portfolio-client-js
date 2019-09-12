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
				.withRequestInterceptor(RequestInterceptor.fromDelegate(updatePositionRequestInterceptor))
				.withRequestInterceptor(requestInterceptorToUse)
				.withResponseInterceptor(responseInterceptorForPositionMutateDeserialization)
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
				.withBody('transaction')
				.withRequestInterceptor(requestInterceptorToUse)
				.withResponseInterceptor(responseInterceptorForPositionMutateDeserializationForRemoval)
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
						.withVariableParameter('start', 'start', 'start', true, x => x.format());
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
					qb.withVariableParameter('type', 'type', 'type', false, x => x.code);
				})
				.withBody('transaction')
				.withRequestInterceptor(requestInterceptorToUse)
				.withResponseInterceptor(responseInterceptorForPositionMutateDeserialization)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._batchTransactionEndpoint = EndpointBuilder.for('batch-transactions', 'batch transactions')
				.withVerb(VerbType.POST)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('portfolios', 'portfolios')
						.withVariableParameter('portfolio', 'portfolio', 'portfolio', false)
						.withLiteralParameter('positions', 'positions')
						.withLiteralParameter('multiple', 'multiple')
						.withLiteralParameter('transactions', 'transactions');
				})
				.withBody('transactions')
				.withRequestInterceptor(requestInterceptorToUse)
				.withResponseInterceptor(ResponseInterceptor.DATA)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._editTransactionEndpoint = EndpointBuilder.for('edit-transaction', 'edit transaction')
				.withVerb(VerbType.POST)
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
					qb.withVariableParameter('type', 'type', 'type', false, x => x.code);
				})
				.withBody('transaction')
				.withRequestInterceptor(requestInterceptorToUse)
				.withResponseInterceptor(responseInterceptorForPositionMutateDeserialization)
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
						.withVariableParameter('echoStart', 'echoStart', 'echoStart', true, x => x.format())
						.withVariableParameter('echoEnd', 'echoEnd', 'echoEnd', true, x => x.format());
				})
				.withRequestInterceptor(requestInterceptorToUse)
				.withResponseInterceptor(responseInterceptorForPositionMutateDeserializationForRemoval)
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
				.withQueryBuilder((qb) => {
					qb.withVariableParameter('start', 'start', 'start', true, x => x.format())
						.withVariableParameter('end', 'end', 'end', true, x => x.format())
						.withVariableParameter('page', 'page', 'page', true)
						.withVariableParameter('sequence', 'sequence', 'sequence', true)
						.withVariableParameter('count', 'count', 'count', true)
						.withVariableParameter('descending', 'descending', 'descending', true);
				})
				.withRequestInterceptor(requestInterceptorToUse)
				.withResponseInterceptor(ResponseInterceptor.DATA)
				.withErrorInterceptor(ErrorInterceptor.GENERAL)
				.endpoint;

			this._readBrokerageReportAvailabilityEndpoint = EndpointBuilder.for('read-brokerage-report-availability', 'read brokerage report availability')
				.withVerb(VerbType.GET)
				.withProtocol(protocolType)
				.withHost(host)
				.withPort(port)
				.withPathBuilder((pb) => {
					pb.withLiteralParameter('portfolios', 'portfolios')
						.withVariableParameter('portfolio', 'portfolio', 'portfolio', false)
						.withLiteralParameter('reports', 'reports')
						.withLiteralParameter('brokerage', 'brokerage')
						.withLiteralParameter('availability', 'availability');
				})
				.withQueryBuilder((qb) => {
					qb.withVariableParameter('frames', 'frames', 'frames', true, frames => frames.map(f => f.code).join());
				})
				.withRequestInterceptor(requestInterceptorToUse)
				.withRequestInterceptor(RequestInterceptor.PLAIN_TEXT_RESPONSE)
				.withResponseInterceptor(responseInterceptorForBrokerageReportAvailabilityDeserialization)
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
		 * @returns {*}
		 */
		get environment() {
			return this._environment;
		}

		/**
		 * Initializes the connection to the remote server and returns a promise
		 * containing the current instance.
		 *
		 * @public
		 * @returns {Promise<PortfolioGateway>}
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
		 * @returns {Promise<Portfolio[]>}
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
		 * Creates a portfolio.
		 *
		 * @public
		 * @param {Object} portfolio
		 * @returns {Promise<Portfolio>}
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
		 * Creates a new portfolio and immediately populates it with transactions.
		 *
		 * @public
		 * @param {Object} portfolio
		 * @returns {Promise<Portfolio>}
		 */
		importPortfolio(portfolio, transactions) {
			return Promise.resolve()
				.then(() => {
					checkStart.call(this);

					return this.createPortfolio(portfolio)
						.then((portfolio) => {
							return this.batchTransactions(portfolio, transactions);
						});
				});
		}

		/**
		 * Updates a portfolio.
		 *
		 * @public
		 * @param {Object} portfolio
		 * @returns {Promise<Portfolio>}
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
		 * Deletes a portfolio.
		 *
		 * @public
		 * @param {String} portfolio - ID of the portfolio to update
		 * @returns {Promise<Portfolio>}
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
		 * @returns {Promise<Position[]>}
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
		 * Updates a position.
		 *
		 * @public
		 * @param {Object} position
		 * @returns {Promise<Position>}
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
		 * Returns a promise which resolves as soon as the position's lock status
		 * changes to false.
		 * 
		 * @public
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
		 * Retrieves positions for a user, a user's portfolio, or a single position.
		 *
		 * @public
		 * @param {String=} portfolio
		 * @param {String=} position
		 * @param {Array<PositionSummaryFrame>=|Array<String>=} frames
		 * @param {Number=} periods
		 * @param {Day=|String=} start
		 * @returns {Promise<Position[]>}
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
		 * Deletes a position.
		 *
		 * @public
		 * @param {String} portfolio
		 * @param {String} position
		 * @returns {Promise<Position[]>}
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
		 * Creates a new transaction.
		 *
		 * @public
		 * @param {Object} transaction
		 * @returns {Promise<TransactionMutateResult>}
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
		 * Creates one or more new transactions.
		 *
		 * @public
		 * @param {Object} transaction
		 * @returns {Promise}
		 */
		batchTransactions(portfolio, transactions) {
			return Promise.resolve()
				.then(() => {
					checkStart.call(this);

					assert.argumentIsRequired(portfolio, 'portfolio', Object);
					assert.argumentIsArray(transactions, 'transactions', Object);

					const payload = { };

					payload.portfolio = portfolio.portfolio;
					payload.transactionTypes = [ ];
					payload.transactionItems = [ ];

					transactions.forEach((transaction) => {
						transaction.portfolio = portfolio.portfolio;

						if (!transaction.position) {
							transaction.position = 'new';
						}

						const code = getTransactionTypeCode(transaction);
						const schema = getTransactionSchema(transaction);

						payload.transactionTypes.push(code);
						payload.transactionItems.push(JSON.stringify(schema.schema.format(transaction)));
					});

					return Gateway.invoke(this._batchTransactionEndpoint, payload);
				});
		}

		/**
		 * Edits a transaction.
		 *
		 * @public
		 * @param {Object} transaction
		 * @returns {Promise<TransactionMutateResult>}
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
		 * Deletes a transaction.
		 *
		 * @public
		 * @param {String} portfolio
		 * @param {String} position
		 * @param {Number} sequence
		 * @param {Boolean=} force
		 * @param {Day=} echoStart
		 * @param {Day=} echoEnd
		 * @returns {Promise<TransactionMutateResult>}
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
		 * @param {String} portfolio
		 * @param {String=} position
		 * @returns {Promise<Transaction[]>}
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
		 * Retrieves transactions, where the property values are suitable for display,
		 * for a portfolio, or a single position.
		 *
		 * @public
		 * @param {String} portfolio
		 * @param {String=} position
		 * @param {Day=} startDay
		 * @param {Day=} endDay
		 * @oaram {Boolean=} descending
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
		 * Returns all position summary definitions for a portfolio.
		 *
		 * @public
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
		 * Creates and starts a new {@link PortfolioGateway} for use in the development environment.
		 *
		 * @public
		 * @static
		 * @param {RequestInterceptor=|Promise<RequestInterceptor>=} requestInterceptor - A request interceptor used with each request (typically used to inject JWT tokens).
		 * @returns {Promise<PortfolioGateway>}
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
		 * @param {RequestInterceptor=|Promise<RequestInterceptor>=} requestInterceptor - A request interceptor used with each request (typically used to inject JWT tokens).
		 * @returns {Promise<PortfolioGateway>}
		 */
		static forStaging(requestInterceptor) {
			return Promise.resolve(requestInterceptor)
				.then((requestInterceptor) => {
					assert.argumentIsOptional(requestInterceptor, 'requestInterceptor', RequestInterceptor, 'RequestInterceptor');

					return start(new PortfolioGateway('https', Configuration.stagingHost, 443, 'staging', requestInterceptor));
				});
		}

		/**
		 * Creates and starts a new {@link PortfolioGateway} for use in the demo environment.
		 *
		 * @public
		 * @static
		 * @param {RequestInterceptor=|Promise<RequestInterceptor>=} requestInterceptor - A request interceptor used with each request (typically used to inject JWT tokens).
		 * @returns {Promise<PortfolioGateway>}
		 */
		static forDemo(requestInterceptor) {
			return Promise.resolve(requestInterceptor)
				.then((requestInterceptor) => {
					assert.argumentIsOptional(requestInterceptor, 'requestInterceptor', RequestInterceptor, 'RequestInterceptor');

					return start(new PortfolioGateway('https', Configuration.demoHost, 443, 'demo', requestInterceptor));
				});
		}

		/**
		 * Creates and starts a new {@link PortfolioGateway} for use in the production environment.
		 *
		 * @public
		 * @static
		 * @param {RequestInterceptor=|Promise<RequestInterceptor>=} requestInterceptor - A request interceptor used with each request (typically used to inject JWT tokens).
		 * @returns {Promise<PortfolioGateway>}
		 */
		static forProduction(requestInterceptor) {
			return Promise.resolve(requestInterceptor)
				.then((requestInterceptor) => {
					assert.argumentIsOptional(requestInterceptor, 'requestInterceptor', RequestInterceptor, 'RequestInterceptor');

					return start(new PortfolioGateway('https', Configuration.productionHost, 443, 'production', requestInterceptor));
				});
		}

		/**
		 * Creates and starts a new {@link PortfolioGateway} for use in the administration environment.
		 *
		 * @public
		 * @static
		 * @param {RequestInterceptor=|Promise<RequestInterceptor>=} requestInterceptor - A request interceptor used with each request (typically used to inject JWT tokens).
		 * @returns {Promise<PortfolioGateway>}
		 */
		static forAdmin(requestInterceptor) {
			return Promise.resolve(requestInterceptor)
				.then((requestInterceptor) => {
					assert.argumentIsOptional(requestInterceptor, 'requestInterceptor', RequestInterceptor, 'RequestInterceptor');

					return start(new PortfolioGateway('https', Configuration.adminHost, 443, 'admin', requestInterceptor));
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

	function extractInstrumentId(position) {
		return position.instrument.id;
	}

	function deserializePositionMutateData(data, removing) {
		try {
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

			if (response.data.transactions) {
				returnRef.transactions = data.transactions;
			}

			return returnRef;

	}

	/**
	 * The result of transaction create operation.
	 *
	 * @typedef TransactionMutateResult
	 * @type {Object}
	 * @property {Object[]} positions - All positions updated as a consequence of processing the transaction.
	 * @property {Object[]} summaries - All position summaries updated as a consequence of processing the transaction.
	 * @property {Boolean} replaced - If true, the position (and position summaries) need to be replaced.
	 */

 	return PortfolioGateway;
})();