const assert = require('@barchart/common-js/lang/assert'),
	Currency = require('@barchart/common-js/lang/Currency'),
	DataType = require('@barchart/common-js/serialization/json/DataType'),
	Enum = require('@barchart/common-js/lang/Enum'),
	SchemaBuilder = require('@barchart/common-js/serialization/json/builders/SchemaBuilder');

const TransactionType = require('./../data/TransactionType');

module.exports = (() => {
	'use strict';

	/**
	 * The schemas which can be used to represent a transaction objects.
	 *
	 * @public
	 * @extends {Enum}
	 */
	class TransactionSchema extends Enum {
		constructor(schema) {
			super(schema.name, schema.name);

			this._schema = schema;
		}

		get schema() {
			return this._schema;
		}

		static get COMPLETE() {
			return complete;
		}

		static get SIMPLE() {
			return simple;
		}

		static get DISPLAY() {
			return display;
		}

		static get DOWNLOAD() {
			return download;
		}

		static get SNAPSHOT() {
			return snapshot;
		}

		toString() {
			return '[TransactionSchema]';
		}
	}

	const complete = new TransactionSchema(SchemaBuilder.withName('Complete')
		.withField('sequence', DataType.NUMBER)
		.withField('date', DataType.DAY)
		.withField('description', DataType.STRING)
		.withField('amount', DataType.DECIMAL)
		.schema
	);

	const simple = new TransactionSchema(SchemaBuilder.withName('Simple')
		.withField('sequence', DataType.NUMBER)
		.withField('date', DataType.DAY)
		.withField('description', DataType.STRING)
		.withField('amount', DataType.DECIMAL)
		.schema
	);

	const display = new TransactionSchema(SchemaBuilder.withName('Display')
		.withField('sequence', DataType.NUMBER)
		.withField('type', DataType.forEnum(TransactionType, 'TransactionType'))
		.withField('date', DataType.DAY)
		.withField('amount', DataType.DECIMAL)
		.withField('quantity', DataType.DECIMAL)
		.withField('fee', DataType.DECIMAL)
		.withField('snapshot.open', DataType.DECIMAL)
		.withField('trade.price', DataType.DECIMAL, true)
		.withField('dividend.rate', DataType.DECIMAL, true)
		.withField('dividend.amount', DataType.DECIMAL, true)
		.withField('charge.amount', DataType.DECIMAL, true)
		.withField('income.amount', DataType.DECIMAL, true)
		.withField('valuation.value', DataType.DECIMAL, true)
		.schema
	);

	const download = new TransactionSchema(SchemaBuilder.withName('Download')
		.withField('sequence', DataType.NUMBER)
		.withField('type', DataType.forEnum(TransactionType, 'TransactionType'))
		.withField('date', DataType.DAY)
		.withField('amount', DataType.DECIMAL)
		.withField('quantity', DataType.DECIMAL)
		.withField('fee', DataType.DECIMAL)
		.withField('snapshot.open', DataType.DECIMAL)
		.withField('trade.price', DataType.DECIMAL, true)
		.withField('dividend.rate', DataType.DECIMAL, true)
		.withField('dividend.amount', DataType.DECIMAL, true)
		.withField('charge.amount', DataType.DECIMAL, true)
		.withField('income.amount', DataType.DECIMAL, true)
		.withField('valuation.value', DataType.DECIMAL, true)
		.schema);

	const snapshot = new TransactionSchema(SchemaBuilder.withName('Snapshot')
		.withField('position', DataType.STRING)
		.withField('sequence', DataType.NUMBER)
		.withField('date', DataType.DAY)
		.withField('snapshot.open', DataType.DECIMAL)
		.withField('snapshot.gain', DataType.DECIMAL)
		.withField('snapshot.basis', DataType.DECIMAL)
		.withField('snapshot.income', DataType.DECIMAL)
		.withField('snapshot.value', DataType.DECIMAL)
		.schema
	);

	return TransactionSchema;
})();
