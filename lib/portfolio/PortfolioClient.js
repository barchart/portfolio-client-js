const assert = require('@barchart/common-js/lang/assert'),
	is = require('@barchart/common-js/lang/is'),
	connection = require('@barchart/common-js/lang/connection'),
	RestAction = require('@barchart/common-js/network/rest/RestAction'),
	RestEndpoint = require('@barchart/common-js/network/rest/RestEndpoint'),
	RestParser = require('@barchart/common-js/network/rest/RestParser'),
	RestProvider = require('@barchart/common-js/network/rest/browser/XhrRestProvider');

const PortfolioSchemas = require('@barchart/common-portfolio/data/serialization/json/PortfolioSchema'),
	PositionSchemas = require('@barchart/common-portfolio/data/serialization/json/PositionSchema'),
	TransactionSchemas = require('@barchart/common-portfolio/data/serialization/json/TransactionSchema');

module.exports = (() => {
	'use strict';

	/**
	 * @public
	 */
	class PortfolioClient {
		constructor() {
			this._restProvider = new RestProvider(PortfolioClient.getHost(), PortfolioClient.getPort(), PortfolioClient.getSecure());

			this._getPorfoliosEndpoint = new RestEndpoint(RestAction.Retrieve, ['dev', 'v1', 'user'], null, true, RestParser.getJsonParserForSchema(PortfolioSchemas.COMPLETE.schema));
			this._getPositionsEndpoint = new RestEndpoint(RestAction.Retrieve, ['dev', 'v1', 'user', 'portfolio'], null, true, RestParser.getJsonParserForSchema(PositionSchemas.COMPLETE.schema));
			this._getTransactionsEndpoint = new RestEndpoint(RestAction.Retrieve, ['dev', 'v1', 'user', 'portfolio', 'position', 'recent'], null, true, RestParser.getJsonParserForSchema(TransactionSchemas.SIMPLE.schema));
			this._getTransactionsDisplayEndpoint = new RestEndpoint(RestAction.Retrieve, ['dev', 'v1', 'user', 'portfolio', 'position', 'complete'], null, true, RestParser.getJsonParserForSchema(TransactionSchemas.DISPLAY.schema));

			this._getLegacyPortfoliosEndpoint = new RestEndpoint(RestAction.Retrieve, ['dev', 'legacy', 'user'], null, true, RestParser.getJsonParserForSchema(PortfolioSchemas.COMPLETE.schema));
		}

		getPortfolios(user, token) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(user, 'user', String);
					assert.argumentIsRequired(token, 'token', String);

					return this._restProvider.call(this._getPorfoliosEndpoint, {user: user}, token);
				});
		}

		getPositions(user, portfolio, token) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(user, 'user', String);
					assert.argumentIsRequired(portfolio, 'portfolio', String);
					assert.argumentIsRequired(token, 'token', String);

					return this._restProvider.call(this._getPositionsEndpoint, {user: user, portfolio: portfolio}, token);

				});
		}

		getTransactions(user, portfolio, position, token) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(user, 'user', String);
					assert.argumentIsRequired(portfolio, 'portfolio', String);
					assert.argumentIsRequired(position, 'position', String);
					assert.argumentIsRequired(token, 'token', String);

					return this._restProvider.call(this._getTransactionsEndpoint, {user: user, portfolio: portfolio, position:position}, token);
				});
		}

		getDisplayTransactions(user, portfolio, position, token) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(user, 'user', String);
					assert.argumentIsRequired(portfolio, 'portfolio', String);
					assert.argumentIsRequired(position, 'position', String);
					assert.argumentIsRequired(token, 'token', String);

					return this._restProvider.call(this._getTransactionsDisplayEndpoint, {user: user, portfolio: portfolio, position: position}, token);
				});
		}

		getLegacyPortfolios(user, token) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(user, 'user', String);
					assert.argumentIsRequired(token, 'token', String);

					return this._restProvider.call(this._getLegacyPortfoliosEndpoint, {user: user}, token);
				});
		}

		/**
		 * Returns the TCP port of the remote server.
		 *
		 * @returns {number}
		 */
		static getPort() {
			return 443;
		}

		/**
		 * Returns a Boolean value, indicating if the connection to the
		 * remote server is secure.
		 *
		 * @static
		 * @returns {boolean}
		 */
		static getSecure() {
			return true;
		}

		/**
		 * Returns remote host of the API
		 *
		 * @static
		 * @returns {string}
		 */
		static getHost() {
			return '6e15z4hmta.execute-api.us-east-1.amazonaws.com';
		}
	}

	return PortfolioClient;
})();
