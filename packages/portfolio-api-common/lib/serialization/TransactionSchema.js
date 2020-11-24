const is = require('@barchart/common-js/lang/is'),
	Currency = require('@barchart/common-js/lang/Currency'),
	DataType = require('@barchart/common-js/serialization/json/DataType'),
	Enum = require('@barchart/common-js/lang/Enum'),
	Schema = require('@barchart/common-js/serialization/json/Schema'),
	SchemaBuilder = require('@barchart/common-js/serialization/json/builders/SchemaBuilder');

const InstrumentType = require('./../data/InstrumentType'),
	PositionDirection = require('./../data/PositionDirection'),
	TransactionType = require('./../data/TransactionType');

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
		static forCreate(transactionType) {
			let code;

			if (transactionType instanceof TransactionType) {
				code = transactionType.code;
			} else {
				code = transactionType;
			}

			let schema;

			if (is.string(code)) {
				schema = Enum.fromCode(TransactionSchema, code);
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

		static get DEPOSIT() {
			return deposit;
		}

		static get WITHDRAWAL() {
			return withdrawal;
		}

		static get VALUATION() {
			return valuation;
		}

		static get DELIST() {
			return delist;
		}

		static get INCOME() {
			return income;
		}

		toString() {
			return `[TransactionSchema (code=${this.code})]`;
		}
	}

	const complete = new TransactionSchema(SchemaBuilder.withName('complete')
		.withField('portfolio', DataType.STRING)
		.withField('position', DataType.STRING)
		.withField('transaction', DataType.STRING)
		.withField('sequence', DataType.NUMBER)
		.withField('type', DataType.forEnum(TransactionType, 'TransactionType'))
		.withField('date', DataType.DAY)
		.withField('description', DataType.STRING, true)
		.withField('amount', DataType.DECIMAL)
		.withField('quantity', DataType.DECIMAL)
		.withField('fee', DataType.DECIMAL, true)
		.withField('reference.position', DataType.STRING, true)
		.withField('reference.transaction', DataType.STRING, true)
		.withField('snapshot.open', DataType.DECIMAL)
		.withField('snapshot.direction', DataType.forEnum(PositionDirection, 'PositionDirection'))
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
		.withField('merger.numerator', DataType.DECIMAL, true)
		.withField('merger.denominator', DataType.DECIMAL, true)
		.withField('spinoff.numerator', DataType.DECIMAL, true)
		.withField('spinoff.denominator', DataType.DECIMAL, true)
		.withField('charge.amount', DataType.DECIMAL, true)
		.withField('income.amount', DataType.DECIMAL, true)
		.withField('valuation.rate', DataType.DECIMAL, true)
		.withField('valuation.value', DataType.DECIMAL, true)
		.withField('system.sequence', DataType.NUMBER)
		.withField('system.version', DataType.STRING)
		.withField('system.timestamp', DataType.TIMESTAMP)
		.schema
	);

	const client = new TransactionSchema(SchemaBuilder.withName('client')
		.withField('portfolio', DataType.STRING)
		.withField('position', DataType.STRING)
		.withField('transaction', DataType.STRING)
		.withField('sequence', DataType.NUMBER)
		.withField('type', DataType.forEnum(TransactionType, 'TransactionType'))
		.withField('date', DataType.DAY)
		.withField('description', DataType.STRING, true)
		.withField('amount', DataType.DECIMAL)
		.withField('quantity', DataType.DECIMAL)
		.withField('fee', DataType.DECIMAL, true)
		.withField('reference.position', DataType.STRING, true)
		.withField('reference.transaction', DataType.NUMBER, true)
		.withField('snapshot.open', DataType.DECIMAL)
		.withField('snapshot.direction', DataType.forEnum(PositionDirection, 'PositionDirection'))
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
		.withField('split.numerator', DataType.DECIMAL, true)
		.withField('split.denominator', DataType.DECIMAL, true)
		.withField('split.effective', DataType.DAY, true)
		.withField('split.reference', DataType.STRING, true)
		.withField('merger.numerator', DataType.DECIMAL, true)
		.withField('merger.denominator', DataType.DECIMAL, true)
		.withField('spinoff.numerator', DataType.DECIMAL, true)
		.withField('spinoff.denominator', DataType.DECIMAL, true)
		.withField('charge.amount', DataType.DECIMAL, true)
		.withField('income.amount', DataType.DECIMAL, true)
		.withField('valuation.rate', DataType.DECIMAL, true)
		.withField('valuation.value', DataType.DECIMAL, true)
		.schema
	);

	const buy = new TransactionSchema(SchemaBuilder.withName(TransactionType.BUY.code)
		.withField('portfolio', DataType.STRING)
		.withField('position', DataType.STRING)
		.withField('sequence', DataType.NUMBER, true)
		.withField('type', DataType.forEnum(TransactionType, 'TransactionType'))
		.withField('instrument.name', DataType.STRING, true)
		.withField('instrument.exchange', DataType.STRING, true)
		.withField('instrument.code', DataType.NUMBER, true)
		.withField('instrument.type', DataType.forEnum(InstrumentType, 'InstrumentType'), true)
		.withField('instrument.currency', DataType.forEnum(Currency, 'Currency'), true)
		.withField('instrument.symbol.barchart', DataType.STRING, true)
		.withField('instrument.symbol.display', DataType.STRING, true)
		.withField('date', DataType.DAY)
		.withField('price', DataType.DECIMAL, true)
		.withField('quantity', DataType.DECIMAL)
		.withField('fee', DataType.DECIMAL, true)
		.withField('reinvest', DataType.BOOLEAN, true)
		.withField('cash', DataType.BOOLEAN, true)
		.withField('force', DataType.BOOLEAN, true)
		.schema
	);

	const sell = new TransactionSchema(SchemaBuilder.withName(TransactionType.SELL.code)
		.withField('portfolio', DataType.STRING)
		.withField('position', DataType.STRING)
		.withField('sequence', DataType.NUMBER, true)
		.withField('type', DataType.forEnum(TransactionType, 'TransactionType'))
		.withField('date', DataType.DAY)
		.withField('price', DataType.DECIMAL, true)
		.withField('quantity', DataType.DECIMAL)
		.withField('fee', DataType.DECIMAL, true)
		.withField('force', DataType.BOOLEAN, true)
		.withField('close', DataType.BOOLEAN, true)
		.schema
	);

	const buyShort = new TransactionSchema(SchemaBuilder.withName(TransactionType.BUY_SHORT.code)
		.withField('portfolio', DataType.STRING)
		.withField('position', DataType.STRING)
		.withField('sequence', DataType.NUMBER, true)
		.withField('type', DataType.forEnum(TransactionType, 'TransactionType'))
		.withField('date', DataType.DAY)
		.withField('price', DataType.DECIMAL)
		.withField('quantity', DataType.DECIMAL)
		.withField('fee', DataType.DECIMAL, true)
		.withField('force', DataType.BOOLEAN, true)
		.withField('close', DataType.BOOLEAN, true)
		.schema
	);

	const sellShort = new TransactionSchema(SchemaBuilder.withName(TransactionType.SELL_SHORT.code)
		.withField('portfolio', DataType.STRING)
		.withField('position', DataType.STRING)
		.withField('sequence', DataType.NUMBER, true)
		.withField('type', DataType.forEnum(TransactionType, 'TransactionType'))
		.withField('instrument.name', DataType.STRING, true)
		.withField('instrument.exchange', DataType.STRING, true)
		.withField('instrument.code', DataType.NUMBER, true)
		.withField('instrument.type', DataType.forEnum(InstrumentType, 'InstrumentType'), true)
		.withField('instrument.currency', DataType.forEnum(Currency, 'Currency'), true)
		.withField('instrument.symbol.barchart', DataType.STRING, true)
		.withField('instrument.symbol.display', DataType.STRING, true)
		.withField('date', DataType.DAY)
		.withField('price', DataType.DECIMAL)
		.withField('quantity', DataType.DECIMAL)
		.withField('fee', DataType.DECIMAL, true)
		.withField('reinvest', DataType.BOOLEAN, true)
		.withField('cash', DataType.BOOLEAN, true)
		.withField('force', DataType.BOOLEAN, true)
		.schema
	);

	const fee = new TransactionSchema(SchemaBuilder.withName(TransactionType.FEE.code)
		.withField('portfolio', DataType.STRING)
		.withField('position', DataType.STRING)
		.withField('sequence', DataType.NUMBER, true)
		.withField('type', DataType.forEnum(TransactionType, 'TransactionType'))
		.withField('date', DataType.DAY)
		.withField('fee', DataType.DECIMAL)
		.withField('force', DataType.BOOLEAN, true)
		.schema
	);

	const deposit = new TransactionSchema(SchemaBuilder.withName(TransactionType.DEPOSIT.code)
		.withField('portfolio', DataType.STRING)
		.withField('position', DataType.STRING)
		.withField('sequence', DataType.NUMBER, true)
		.withField('type', DataType.forEnum(TransactionType, 'TransactionType'))
		.withField('instrument.type', DataType.forEnum(InstrumentType, 'InstrumentType'), true)
		.withField('instrument.currency', DataType.forEnum(Currency, 'Currency'), true)
		.withField('date', DataType.DAY)
		.withField('amount', DataType.DECIMAL)
		.withField('force', DataType.BOOLEAN, true)
		.schema
	);

	const withdrawal = new TransactionSchema(SchemaBuilder.withName(TransactionType.WITHDRAWAL.code)
		.withField('portfolio', DataType.STRING)
		.withField('position', DataType.STRING)
		.withField('sequence', DataType.NUMBER, true)
		.withField('type', DataType.forEnum(TransactionType, 'TransactionType'))
		.withField('instrument.type', DataType.forEnum(InstrumentType, 'InstrumentType'), true)
		.withField('instrument.currency', DataType.forEnum(Currency, 'Currency'), true)
		.withField('date', DataType.DAY)
		.withField('amount', DataType.DECIMAL)
		.withField('force', DataType.BOOLEAN, true)
		.schema
	);

	const valuation = new TransactionSchema(SchemaBuilder.withName(TransactionType.VALUATION.code)
		.withField('portfolio', DataType.STRING)
		.withField('position', DataType.STRING)
		.withField('sequence', DataType.NUMBER, true)
		.withField('type', DataType.forEnum(TransactionType, 'TransactionType'))
		.withField('date', DataType.DAY)
		.withField('rate', DataType.DECIMAL, true)
		.withField('value', DataType.DECIMAL, true)
		.withField('force', DataType.BOOLEAN, true)
		.schema
	);

	const delist = new TransactionSchema(SchemaBuilder.withName(TransactionType.DELIST.code)
		.withField('portfolio', DataType.STRING)
		.withField('position', DataType.STRING)
		.withField('sequence', DataType.NUMBER, true)
		.withField('type', DataType.forEnum(TransactionType, 'TransactionType'))
		.withField('date', DataType.DAY)
		.withField('force', DataType.BOOLEAN, true)
		.schema
	);

  const income = new TransactionSchema(SchemaBuilder.withName(TransactionType.INCOME.code)
		.withField('portfolio', DataType.STRING)
		.withField('position', DataType.STRING)
		.withField('sequence', DataType.NUMBER, true)
		.withField('type', DataType.forEnum(TransactionType, 'TransactionType'))
		.withField('date', DataType.DAY)
		.withField('income', DataType.DECIMAL)
		.withField('fee', DataType.DECIMAL, true)
		.withField('force', DataType.BOOLEAN, true)
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
	addSchemaToMap(TransactionType.FEE, fee);
	addSchemaToMap(TransactionType.DEPOSIT, deposit);
	addSchemaToMap(TransactionType.WITHDRAWAL, withdrawal);
	addSchemaToMap(TransactionType.VALUATION, valuation);
	addSchemaToMap(TransactionType.DELIST, delist);
	addSchemaToMap(TransactionType.INCOME, income);

	return TransactionSchema;
})();
