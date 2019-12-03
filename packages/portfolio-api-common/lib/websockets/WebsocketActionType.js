const assert = require('@barchart/common-js/lang/assert'),
	Enum = require('@barchart/common-js/lang/Enum');

module.exports = (() => {
	'use strict';

	/**
	 * Types of websocket response actions.
	 *
	 * @public
	 * @extends {Enum}
	 * @param {String} code
	 * @param {String} description
	 * @param {String} action
	 */
	class WebsocketActionType extends Enum {
		constructor(code, description, action) {
			super(code, description);

			assert.argumentIsRequired(action, 'action', String);

			this._action = action;
		}

		/**
		 * An action of websocket response
		 *
		 * @public
		 * @returns {String}
		 */
		get action() {
			return this._action;
		}

		/**
		 * Action type for creating new portfolio.
		 *
		 * @public
		 * @static
		 * @returns {WebsocketActionType}
		 */
		static get PORTFOLIO_CREATE() {
			return portfolioCreate;
		}

		/**
		 * Action type for deleting portfolio.
		 *
		 * @public
		 * @static
		 * @returns {WebsocketActionType}
		 */
		static get PORTFOLIO_DELETE() {
			return portfolioDelete;
		}

		/**
		 * Action type for updating new portfolio.
		 *
		 * @public
		 * @static
		 * @returns {WebsocketActionType}
		 */
		static get PORTFOLIO_UPDATE() {
			return portfolioUpdate;
		}

		/**
		 * Action type for creating new transaction.
		 *
		 * @public
		 * @static
		 * @returns {WebsocketActionType}
		 */
		static get TRANSACTION_CREATE() {
			return transactionCreate;
		}

		/**
		 * Action type for deleting transaction.
		 *
		 * @public
		 * @static
		 * @returns {WebsocketActionType}
		 */
		static get TRANSACTION_DELETE() {
			return transactionDelete;
		}

		/**
		 * Action type for editing transaction.
		 *
		 * @public
		 * @static
		 * @returns {WebsocketActionType}
		 */
		static get TRANSACTION_EDIT() {
			return transactionEdit;
		}

		/**
		 * Action type for batching transaction.
		 *
		 * @public
		 * @static
		 * @returns {WebsocketActionType}
		 */
		static get TRANSACTION_BATCH() {
			return transactionBatch;
		}

		/**
		 * Action type for deleting position.
		 *
		 * @public
		 * @static
		 * @returns {WebsocketActionType}
		 */
		static get POSITION_DELETE() {
			return positionDelete;
		}

		/**
		 * Action type for updating position.
		 *
		 * @public
		 * @static
		 * @returns {WebsocketActionType}
		 */
		static get POSITION_UPDATE() {
			return positionUpdate;
		}
	}

	const portfolioCreate = new WebsocketActionType('PORTFOLIO_CREATE', 'Create portfolio action', 'portfolio/create');
	const portfolioDelete = new WebsocketActionType('PORTFOLIO_DELETE', 'Delete portfolio action', 'portfolio/delete');
	const portfolioUpdate = new WebsocketActionType('PORTFOLIO_UPDATE', 'Update portfolio action', 'portfolio/update');

	const transactionCreate = new WebsocketActionType('TRANSACTION_CREATE', 'Create transaction action', 'transaction/create');
	const transactionDelete = new WebsocketActionType('TRANSACTION_DELETE', 'Delete transaction action', 'transaction/delete');
	const transactionEdit = new WebsocketActionType('TRANSACTION_EDIT', 'Edit transaction action', 'transaction/edit');
	const transactionBatch = new WebsocketActionType('TRANSACTION_BATCH', 'Batch transaction action', 'transaction/batch');

	const positionDelete = new WebsocketActionType('POSITION_DELETE', 'Delete position action', 'position/delete');
	const positionUpdate = new WebsocketActionType('POSITION_UPDATE', 'Update position action', 'position/update');

	return WebsocketActionType;
})();
