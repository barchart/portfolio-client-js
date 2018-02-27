const assert = require('@barchart/common-js/lang/assert'),
	Currency = require('@barchart/common-js/lang/Currency'),
	DataType = require('@barchart/common-js/serialization/json/DataType'),
	Enum = require('@barchart/common-js/lang/Enum'),
	is = require('@barchart/common-js/lang/is'),
	SchemaBuilder = require('@barchart/common-js/serialization/json/builders/SchemaBuilder');

const ValuationType = require('./../data/ValuationType');

module.exports = (() => {
	'use strict';

	/**
	 * The schemas which can be used to represent a position objects.
	 *
	 * @public
	 * @extends {Enum}
	 */
	class PositionSchema extends Enum {
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

		toString() {
			return '[PositionSchema]';
		}
	}

	const complete = new PositionSchema(SchemaBuilder.withName('Complete')
		.withField('user', DataType.STRING)
		.withField('portfolio', DataType.STRING)
		.withField('sequence', DataType.NUMBER)
		.withField('instrument.id', DataType.STRING)
		.withField('instrument.name', DataType.STRING)
		.withField('instrument.type', DataType.STRING)
		.withField('instrument.currency', DataType.forEnum(Currency, 'Currency'))
		.withField('instrument.delist', DataType.DAY, true)
		.withField('instrument.symbol.barchart', DataType.STRING, true)
		.withField('instrument.symbol.display', DataType.STRING, true)
		.withField('position', DataType.STRING)
		.withField('open', DataType.BOOLEAN, true)
		.withField('transaction', DataType.NUMBER)
		.withField('valuation', DataType.forEnum(ValuationType, 'ValuationType'))
		.withField('reinvest', DataType.BOOLEAN)
		.withField('snapshot.date', DataType.DAY)
		.withField('snapshot.open', DataType.DECIMAL)
		.withField('snapshot.buys', DataType.DECIMAL)
		.withField('snapshot.sells', DataType.DECIMAL)
		.withField('snapshot.gain', DataType.DECIMAL)
		.withField('snapshot.basis', DataType.DECIMAL)
		.withField('snapshot.income', DataType.DECIMAL)
		.withField('snapshot.value', DataType.DECIMAL)
		.withField('legacy.system', DataType.STRING, true)
		.withField('legacy.user', DataType.STRING, true)
		.withField('legacy.portfolio', DataType.STRING, true)
		.withField('legacy.position', DataType.STRING, true)
		.withField('system.version', DataType.NUMBER, true)
		.schema
	);

	const simple = new PositionSchema(SchemaBuilder.withName('Simple')
		.withField('position', DataType.STRING)
		.withField('instrument.id', DataType.STRING)
		.withField('instrument.name', DataType.STRING)
		.withField('instrument.type', DataType.STRING)
		.withField('instrument.currency', DataType.forEnum(Currency, 'Currency'))
		.withField('instrument.delist', DataType.DAY, true)
		.withField('instrument.symbol.barchart', DataType.STRING, true)
		.withField('instrument.symbol.display', DataType.STRING, true)
		.withField('snapshot.date', DataType.DAY)
		.withField('snapshot.open', DataType.DECIMAL)
		.withField('snapshot.buys', DataType.DECIMAL)
		.withField('snapshot.sells', DataType.DECIMAL)
		.withField('snapshot.gain', DataType.DECIMAL)
		.withField('snapshot.basis', DataType.DECIMAL)
		.withField('snapshot.income', DataType.DECIMAL)
		.withField('snapshot.value', DataType.DECIMAL)
		.schema
	);

	return PositionSchema;
})();
