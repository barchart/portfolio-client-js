const assert = require('@barchart/common-js/lang/assert'),
	is = require('@barchart/common-js/lang/is'),
	Currency = require('@barchart/common-js/lang/Currency'),
	DataType = require('@barchart/common-js/serialization/json/DataType'),
	Enum = require('@barchart/common-js/lang/Enum'),
	Schema = require('@barchart/common-js/serialization/json/Schema'),
	SchemaBuilder = require('@barchart/common-js/serialization/json/builders/SchemaBuilder');

const TransactionType = require('./../data/TransactionType');

module.exports = (() => {
	'use strict';

	/**
	 * The schemas which can be used to represent transaction objects.
	 *
	 * @public
	 * @extends {Enum}
	 */
	class TransactionSchema extends Enum {
		constructor(schema) {
			super(schema.name, schema.name);

			this._schema = schema;
		}

		/**
		 * The actual {@link Schema}.
		 *
		 * @public
		 * @returns {Schema}
		 */
		get schema() {
			return this._schema;
		}

		/**
		 * Returns the appropriate schema for creating a transaction of the
		 * supplied type.
		 *
		 * @public
		 * @static
		 * @param {String|TransactionType} transactionType
		 * @returns {TransactionSchema|null}
		 */
		static forType(transactionType) {
			let code;

			if (transactionType instanceof TransactionType) {
				code = transactionType.code;
			} else {
				code = transactionType;
			}

			let schema;

			if (is.string(code)) {
				schema = Enum.fromCode(code);
			} else {
				schema = null;
			}

			return schema;
		}

		/**
		 * The complete transaction schema.
		 *
		 * @static
		 * @public
		 * @returns {TransactionSchema}
		 */
		static get COMPLETE() {
			return complete;
		}

		/**
		 * Transaction data transmitted to the client, omitting some system data.
		 *
		 * @static
		 * @public
		 * @returns {TransactionSchema}
		 */
		static get CLIENT() {
			return client;
		}

		static get BUY() {
			return buy;
		}

		static get SELL() {
			return sell;
		}

		static get BUY_SHORT() {
			return buyShort;
		}

		static get SELL_SHORT() {
			return sellShort;
		}

		static get DIVIDEND() {
			return dividend;
		}

		static get DIVIDEND_REINVEST() {
			return dividendReinvest;
		}

		static get DIVIDEND_STOCK() {
			return dividendStock;
		}

		static get DISTRIBUTION_CASH() {
			return distributionCash;
		}

		static get DISTRIBUTION_FUND() {
			return distributionFund;
		}

		static get SPLIT() {
			return split;
		}

		static get FEE() {
			return fee;
		}

		static get FEE_UNITS() {
			return feeUnits;
		}

		static get DEPOSIT() {
			return deposit;
		}

		static get WITHDRAWAL() {
			return withdrawal;
		}

		static get DEBIT() {
			return debit;
		}

		static get CREDIT() {
			return credit;
		}

		static get VALUATION() {
			return valuation;
		}

		static get INCOME() {
			return income;
		}

		toString() {
			return '[TransactionSchema]';
		}
	}

	const complete = new TransactionSchema(SchemaBuilder.withName('complete')
		.withField('portfolio', DataType.STRING)
		.withField('position', DataType.STRING)
		.withField('sequence', DataType.NUMBER)
		.withField('type', DataType.forEnum(TransactionType, 'TransactionType'))
		.withField('date', DataType.DAY)
		.withField('description', DataType.STRING, true)
		.withField('amount', DataType.DECIMAL)
		.withField('quantity', DataType.DECIMAL)
		.withField('fee', DataType.DECIMAL, true)
		.withField('reference.position', DataType.STRING, true)
		.withField('reference.sequence', DataType.NUMBER, true)
		.withField('snapshot.open', DataType.DECIMAL)
		.withField('snapshot.buys', DataType.DECIMAL)
		.withField('snapshot.sells', DataType.DECIMAL)
		.withField('snapshot.gain', DataType.DECIMAL)
		.withField('snapshot.basis', DataType.DECIMAL)
		.withField('snapshot.income', DataType.DECIMAL)
		.withField('snapshot.value', DataType.DECIMAL)
		.withField('legacy.system', DataType.STRING, true)
		.withField('legacy.user', DataType.STRING, true)
		.withField('legacy.portfolio', DataType.STRING)
		.withField('legacy.position', DataType.STRING, true)
		.withField('legacy.transaction', DataType.STRING, true)
		.withField('trade.price', DataType.DECIMAL, true)
		.withField('dividend.rate', DataType.DECIMAL, true)
		.withField('dividend.effective', DataType.DAY, true)
		.withField('dividend.price', DataType.DECIMAL, true)
		.withField('dividend.amount', DataType.DECIMAL, true)
		.withField('dividend.reference', DataType.STRING, true)
		.withField('split.numerator', DataType.DECIMAL, true)
		.withField('split.denominator', DataType.DECIMAL, true)
		.withField('split.effective', DataType.DAY, true)
		.withField('split.reference', DataType.STRING, true)
		.withField('charge.amount', DataType.DECIMAL, true)
		.withField('income.amount', DataType.DECIMAL, true)
		.withField('valuation.value', DataType.DECIMAL, true)
		.withField('system.sequence', DataType.NUMBER)
		.withField('system.version', DataType.STRING)
		.withField('system.timestamp', DataType.TIMESTAMP)
		.schema
	);

	const client = new TransactionSchema(SchemaBuilder.withName('client')
		.withField('portfolio', DataType.STRING)
		.withField('position', DataType.STRING)
		.withField('sequence', DataType.NUMBER)
		.withField('type', DataType.forEnum(TransactionType, 'TransactionType'))
		.withField('date', DataType.DAY)
		.withField('description', DataType.STRING, true)
		.withField('amount', DataType.DECIMAL)
		.withField('quantity', DataType.DECIMAL)
		.withField('fee', DataType.DECIMAL, true)
		.withField('reference.position', DataType.STRING, true)
		.withField('reference.sequence', DataType.NUMBER, true)
		.withField('snapshot.open', DataType.DECIMAL)
		.withField('snapshot.buys', DataType.DECIMAL)
		.withField('snapshot.sells', DataType.DECIMAL)
		.withField('snapshot.gain', DataType.DECIMAL)
		.withField('snapshot.basis', DataType.DECIMAL)
		.withField('snapshot.income', DataType.DECIMAL)
		.withField('snapshot.value', DataType.DECIMAL)
		.withField('trade.price', DataType.DECIMAL, true)
		.withField('dividend.rate', DataType.DECIMAL, true)
		.withField('dividend.effective', DataType.DAY, true)
		.withField('dividend.price', DataType.DECIMAL, true)
		.withField('dividend.amount', DataType.DECIMAL, true)
		.withField('dividend.reference', DataType.STRING, true)
		.withField('split.numerator', DataType.DECIMAL, true)
		.withField('split.denominator', DataType.DECIMAL, true)
		.withField('split.effective', DataType.DAY, true)
		.withField('split.reference', DataType.STRING, true)
		.withField('charge.amount', DataType.DECIMAL, true)
		.withField('income.amount', DataType.DECIMAL, true)
		.withField('valuation.value', DataType.DECIMAL, true)
		.schema
	);

	const buy = new TransactionSchema(SchemaBuilder.withName('B')
		.withField('type', DataType.forEnum(TransactionType, 'TransactionType'))
		.withField('position', DataType.STRING, true)
		.withField('instrument.name', DataType.STRING, true)
		.withField('instrument.type', DataType.STRING, true)
		.withField('instrument.currency', DataType.forEnum(Currency, 'Currency'), true)
		.withField('instrument.symbol.barchart', DataType.STRING, true)
		.withField('instrument.symbol.display', DataType.STRING, true)
		.withField('currency', DataType.forEnum(Currency, 'Currency'))
		.withField('date', DataType.DAY)
		.withField('price', DataType.DECIMAL)
		.withField('quantity', DataType.DECIMAL)
		.withField('fee', DataType.DECIMAL, true)
		.schema
	);

	const sell = new TransactionSchema(SchemaBuilder.withName('S')
		.withField('type', DataType.forEnum(TransactionType, 'TransactionType'))
		.withField('position', DataType.STRING, true)
		.withField('currency', DataType.forEnum(Currency, 'Currency'))
		.withField('date', DataType.DAY)
		.withField('price', DataType.DECIMAL)
		.withField('quantity', DataType.DECIMAL)
		.withField('fee', DataType.DECIMAL, true)
		.schema
	);

	const buyShort = new TransactionSchema(SchemaBuilder.withName('BS')
		.withField('type', DataType.forEnum(TransactionType, 'TransactionType'))
		.withField('position', DataType.STRING, true)
		.withField('currency', DataType.forEnum(Currency, 'Currency'))
		.withField('date', DataType.DAY)
		.withField('price', DataType.DECIMAL)
		.withField('quantity', DataType.DECIMAL)
		.withField('fee', DataType.DECIMAL, true)
		.schema
	);

	const sellShort = new TransactionSchema(SchemaBuilder.withName('SS')
		.withField('type', DataType.forEnum(TransactionType, 'TransactionType'))
		.withField('position', DataType.STRING, true)
		.withField('currency', DataType.forEnum(Currency, 'Currency'))
		.withField('date', DataType.DAY)
		.withField('price', DataType.DECIMAL)
		.withField('quantity', DataType.DECIMAL)
		.withField('fee', DataType.DECIMAL, true)
		.schema
	);

	const dividend = new TransactionSchema(SchemaBuilder.withName('DV')
		.withField('type', DataType.forEnum(TransactionType, 'TransactionType'))
		.withField('position', DataType.STRING, true)
		.withField('currency', DataType.forEnum(Currency, 'Currency'))
		.withField('date', DataType.DAY)
		.withField('rate', DataType.DECIMAL)
		.withField('open', DataType.DECIMAL, true)
		.withField('effective', DataType.DAY, true)
		.withField('fee', DataType.DECIMAL, true)
		.schema
	);

	const dividendReinvest = new TransactionSchema(SchemaBuilder.withName('DX')
		.withField('type', DataType.forEnum(TransactionType, 'TransactionType'))
		.withField('position', DataType.STRING, true)
		.withField('currency', DataType.forEnum(Currency, 'Currency'))
		.withField('date', DataType.DAY)
		.withField('rate', DataType.DECIMAL)
		.withField('open', DataType.DECIMAL, true)
		.withField('effective', DataType.DAY, true)
		.withField('price', DataType.DECIMAL)
		.withField('fee', DataType.DECIMAL, true)
		.schema
	);

	const dividendStock = new TransactionSchema(SchemaBuilder.withName('DS')
		.withField('type', DataType.forEnum(TransactionType, 'TransactionType'))
		.withField('position', DataType.STRING, true)
		.withField('currency', DataType.forEnum(Currency, 'Currency'))
		.withField('date', DataType.DAY)
		.withField('rate', DataType.DECIMAL)
		.withField('open', DataType.DECIMAL, true)
		.withField('effective', DataType.DAY, true)
		.withField('price', DataType.DECIMAL)
		.withField('fee', DataType.DECIMAL, true)
		.schema
	);

	const distributionCash = new TransactionSchema(SchemaBuilder.withName('DC')
		.withField('type', DataType.forEnum(TransactionType, 'TransactionType'))
		.withField('position', DataType.STRING, true)
		.withField('currency', DataType.forEnum(Currency, 'Currency'))
		.withField('date', DataType.DAY)
		.withField('rate', DataType.DECIMAL)
		.withField('open', DataType.DECIMAL, true)
		.withField('effective', DataType.DAY, true)
		.withField('fee', DataType.DECIMAL, true)
		.schema
	);

	const distributionFund = new TransactionSchema(SchemaBuilder.withName('DF')
		.withField('type', DataType.forEnum(TransactionType, 'TransactionType'))
		.withField('position', DataType.STRING, true)
		.withField('currency', DataType.forEnum(Currency, 'Currency'))
		.withField('date', DataType.DAY)
		.withField('rate', DataType.DECIMAL)
		.withField('open', DataType.DECIMAL, true)
		.withField('effective', DataType.DAY, true)
		.withField('fee', DataType.DECIMAL, true)
		.schema
	);

	const split = new TransactionSchema(SchemaBuilder.withName('SP')
		.withField('type', DataType.forEnum(TransactionType, 'TransactionType'))
		.withField('position', DataType.STRING, true)
		.withField('currency', DataType.forEnum(Currency, 'Currency'))
		.withField('date', DataType.DAY)
		.withField('numerator', DataType.DECIMAL)
		.withField('denominator', DataType.DECIMAL)
		.withField('effective', DataType.DAY, true)
		.withField('fee', DataType.DECIMAL, true)
		.schema
	);

	const fee = new TransactionSchema(SchemaBuilder.withName('F')
		.withField('type', DataType.forEnum(TransactionType, 'TransactionType'))
		.withField('position', DataType.STRING, true)
		.withField('currency', DataType.forEnum(Currency, 'Currency'))
		.withField('date', DataType.DAY)
		.withField('fee', DataType.DECIMAL)
		.schema
	);

	const feeUnits = new TransactionSchema(SchemaBuilder.withName('FU')
		.withField('type', DataType.forEnum(TransactionType, 'TransactionType'))
		.withField('position', DataType.STRING, true)
		.withField('currency', DataType.forEnum(Currency, 'Currency'))
		.withField('date', DataType.DAY)
		.withField('fee', DataType.DECIMAL)
		.withField('price', DataType.DECIMAL)
		.schema
	);

	const deposit = new TransactionSchema(SchemaBuilder.withName('D')
		.withField('type', DataType.forEnum(TransactionType, 'TransactionType'))
		.withField('position', DataType.STRING, true)
		.withField('currency', DataType.forEnum(Currency, 'Currency'))
		.withField('date', DataType.DAY)
		.withField('amount', DataType.DECIMAL)
		.withField('fee', DataType.DECIMAL, true)
		.schema
	);

	const withdrawal = new TransactionSchema(SchemaBuilder.withName('W')
		.withField('type', DataType.forEnum(TransactionType, 'TransactionType'))
		.withField('position', DataType.STRING, true)
		.withField('currency', DataType.forEnum(Currency, 'Currency'))
		.withField('date', DataType.DAY)
		.withField('amount', DataType.DECIMAL)
		.withField('fee', DataType.DECIMAL, true)
		.schema
	);

	const debit = new TransactionSchema(SchemaBuilder.withName('DR')
		.withField('type', DataType.forEnum(TransactionType, 'TransactionType'))
		.withField('position', DataType.STRING, true)
		.withField('currency', DataType.forEnum(Currency, 'Currency'))
		.withField('date', DataType.DAY)
		.withField('amount', DataType.DECIMAL)
		.withField('fee', DataType.DECIMAL, true)
		.schema
	);

	const credit = new TransactionSchema(SchemaBuilder.withName('CR')
		.withField('type', DataType.forEnum(TransactionType, 'TransactionType'))
		.withField('position', DataType.STRING, true)
		.withField('currency', DataType.forEnum(Currency, 'Currency'))
		.withField('date', DataType.DAY)
		.withField('amount', DataType.DECIMAL)
		.withField('fee', DataType.DECIMAL, true)
		.schema
	);

	const valuation = new TransactionSchema(SchemaBuilder.withName('V')
		.withField('type', DataType.forEnum(TransactionType, 'TransactionType'))
		.withField('position', DataType.STRING, true)
		.withField('currency', DataType.forEnum(Currency, 'Currency'))
		.withField('date', DataType.DAY)
		.withField('value', DataType.DECIMAL)
		.withField('fee', DataType.DECIMAL, true)
		.schema
	);

	const income = new TransactionSchema(SchemaBuilder.withName('I')
		.withField('type', DataType.forEnum(TransactionType, 'TransactionType'))
		.withField('position', DataType.STRING, true)
		.withField('currency', DataType.forEnum(Currency, 'Currency'))
		.withField('date', DataType.DAY)
		.withField('income', DataType.DECIMAL)
		.withField('fee', DataType.DECIMAL, true)
		.schema
	);

	const map = { };

	function addSchemaToMap(type, schema) {
		map[type.code] = schema;
	}

	addSchemaToMap(TransactionType.BUY, buy);
	addSchemaToMap(TransactionType.SELL, sell);
	addSchemaToMap(TransactionType.BUY_SHORT, buyShort);
	addSchemaToMap(TransactionType.SELL_SHORT, sellShort);
	addSchemaToMap(TransactionType.DIVIDEND, dividend);
	addSchemaToMap(TransactionType.DIVIDEND_STOCK, dividendStock);
	addSchemaToMap(TransactionType.DIVIDEND_REINVEST, dividendReinvest);
	addSchemaToMap(TransactionType.SPLIT, split);
	addSchemaToMap(TransactionType.FEE, fee);
	addSchemaToMap(TransactionType.FEE_UNITS, feeUnits);
	addSchemaToMap(TransactionType.DEPOSIT, deposit);
	addSchemaToMap(TransactionType.WITHDRAWAL, withdrawal);
	addSchemaToMap(TransactionType.VALUATION, valuation);
	addSchemaToMap(TransactionType.INCOME, income);

	return TransactionSchema;
})();
