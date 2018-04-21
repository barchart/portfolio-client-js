const assert = require('@barchart/common-js/lang/assert'),
	Enum = require('@barchart/common-js/lang/Enum');

module.exports = (() => {
	'use strict';

	/**
	 * An enumeration item that describes a type of transaction.
	 *
	 * @public
	 * @extends {Enum}
	 * @param {String} code
	 * @param {String} description
	 * @param {String} display
	 * @param {Boolean} purchase
	 * @param {Boolean} sale
	 * @param {Boolean} income
	 * @param {Boolean} opening
	 * @param {Boolean} closing
	 * @param {Boolean} fee
	 */
	class TransactionType extends Enum {
		constructor(code, description, display, purchase, sale, income, opening, closing, fee) {
			super(code, description);

			assert.argumentIsRequired(display, 'display', String);
			assert.argumentIsRequired(purchase, 'purchase', Boolean);
			assert.argumentIsRequired(sale, 'sale', Boolean);
			assert.argumentIsRequired(income, 'income', Boolean);
			assert.argumentIsRequired(opening, 'opening', Boolean);
			assert.argumentIsRequired(closing, 'closing', Boolean);
			assert.argumentIsRequired(fee, 'fee', Boolean);

			this._display = display;
			this._purchase = purchase;
			this._sale = sale;
			this._income = income;
			this._opening = opening;
			this._closing = closing;
			this._fee = fee
		}

		/**
		 * A human-readable description of the transaction type.
		 *
		 * @public
		 * @returns {String}
		 */
		get display() {
			return this._display;
		}

		/**
		 * Indicates if the transaction was a trade.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get trade() {
			return this._purchase || this._sale;
		}

		/**
		 * Indicates if the trade was a purchase.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get purchase() {
			return this._purchase;
		}

		/**
		 * Indicates if the trade was a sale.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get sale() {
			return this._sale;
		}

		/**
		 * Indicates if the transaction was an income payment.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get income() {
			return this._income;
		}

		/**
		 * Indicates if the transactions opens the position (i.e. increases its
		 * magnitude).
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get opening() {
			return this._opening;
		}

		/**
		 * Indicates if the transactions closes the position (i.e. decreases its
		 * magnitude).
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get closing() {
			return this._closing;
		}

		/**
		 * Indicates if the transactions is a fee (which neither opens or closes) the
		 * position.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get fee() {
			return this._fee;
		}

		/**
		 * A purchase.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get BUY() {
			return buy;
		}

		/**
		 * A sale.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get SELL() {
			return sell;
		}

		/**
		 * A purchase (in a short position).
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get BUY_SHORT() {
			return buyShort;
		}

		/**
		 * A short sale.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get SELL_SHORT() {
			return sellShort;
		}

		/**
		 * A cash dividend.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get DIVIDEND() {
			return dividend;
		}

		/**
		 * A cash dividend, reinvested.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get DIVIDEND_REINVEST() {
			return dividendReinvest;
		}

		/**
		 * A stock dividend.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get DIVIDEND_STOCK() {
			return dividendStock;
		}

		/**
		 * A mutual fund distribution in cash.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get DISTRIBUTION_CASH() {
			return distributionCash;
		}

		/**
		 * A mutual fund distribution in units.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get DISTRIBUTION_FUND() {
			return distributionFund;
		}

		/**
		 * A split.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get SPLIT() {
			return split;
		}

		/**
		 * A fee.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get FEE() {
			return fee;
		}

		/**
		 * A mutual fund fee, which is paid in units.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get FEE_UNITS() {
			return feeUnits;
		}

		/**
		 * A deposit.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get DEPOSIT() {
			return deposit;
		}

		/**
		 * A withdrawal.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get WITHDRAWAL() {
			return withdrawal;
		}

		/**
		 * A system-generated withdrawal, arising from another transaction.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get DEBIT() {
			return debit;
		}

		/**
		 * A system-generated deposit, arising from another transaction.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get CREDIT() {
			return credit;
		}

		/**
		 * A valuation event.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get VALUATION() {
			return valuation;
		}

		/**
		 * Other Income.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get INCOME() {
			return income;
		}

		toString() {
			return '[TransactionType]';
		}
	}

	const buy = new TransactionType('B', 'Buy', 'Buy', true, false, false, true,  false, false);
	const sell = new TransactionType('S', 'Sell', 'Sell', false, true, false, false, true, false);
	const buyShort = new TransactionType('BS', 'Buy To Cover', 'Buy To Cover', true, false, false, false, true, false);
	const sellShort = new TransactionType('SS', 'Sell Short', 'Sell Short', false, true, false, true, false, false);
	const dividend = new TransactionType('DV', 'Dividend', 'Dividend', false, false, true, false, false, false);
	const dividendReinvest = new TransactionType('DX', 'Dividend (Reinvested)', 'Dividend Reinvest', false, false, false, true, false, false);
	const dividendStock = new TransactionType('DS', 'Dividend (Stock)', 'Dividend Stock', false, false, false, true, false, false);
	const split = new TransactionType('SP', 'Split', 'Split', false, false, false, true, false, false);
	const fee = new TransactionType('F', 'Fee', 'Fee', false, false, false, true, false, true);
	const feeUnits = new TransactionType('FU', 'Fee Units', 'Fee', false, false, false, false, true, false);

	const distributionCash = new TransactionType('DC', 'Distribution (Cash)', 'Cash Distribution', false, false, true, false, false, false);
	const distributionFund = new TransactionType('DF', 'Distribution (Units)', 'Unit Distribution', false, false, false, true, false, false);

	const deposit = new TransactionType('D', 'Deposit', 'Deposit', false, false, false, false, false, false);
	const withdrawal = new TransactionType('W', 'Withdrawal', 'Withdrawal', false, false, false, false, false, false);
	const debit = new TransactionType('DR', 'Debit', 'Debit', false, false, false, false, false, false);
	const credit = new TransactionType('CR', 'Credit', 'Credit', false, false, false, false, false, false);

	const valuation = new TransactionType('V', 'Valuation', 'Valuation', false, false, false, false, false, false);
	const income = new TransactionType('I', 'Income', 'Income', false, false, true, false, false, false);

	return TransactionType;
})();
