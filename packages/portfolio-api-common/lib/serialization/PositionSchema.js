const assert = require('@barchart/common-js/lang/assert'),
	Currency = require('@barchart/common-js/lang/Currency'),
	DataType = require('@barchart/common-js/serialization/json/DataType'),
	Enum = require('@barchart/common-js/lang/Enum'),
	is = require('@barchart/common-js/lang/is'),
	Schema = require('@barchart/common-js/serialization/json/Schema'),
	SchemaBuilder = require('@barchart/common-js/serialization/json/builders/SchemaBuilder');

const InstrumentType = require('./../data/InstrumentType'),
	PositionDirection = require('./../data/PositionDirection'),
	ValuationType = require('./../data/ValuationType');

module.exports = (() => {
	'use strict';

	/**
	 * The schemas which can be used to represent position objects.
	 *
	 * @public
	 * @extends {Enum}
	 */
	class PositionSchema extends Enum {
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
		 * The complete position schema.
		 *
		 * @static
		 * @public
		 * @returns {PositionSchema}
		 */
		static get COMPLETE() {
			return complete;
		}

		/**
		 * Position data transmitted to the client, omitting some system data.
		 *
		 * @static
		 * @public
		 * @returns {PositionSchema}
		 */
		static get CLIENT() {
			return client;
		}

		/**
		 * Data required to update a position.
		 *
		 * @static
		 * @public
		 * @returns {PositionSchema}
		 */
		static get UPDATE() {
			return update;
		}

		toString() {
			return '[PositionSchema]';
		}
	}

	const complete = new PositionSchema(SchemaBuilder.withName('complete')
		.withField('user', DataType.STRING)
		.withField('portfolio', DataType.STRING)
		.withField('instrument.id', DataType.STRING)
		.withField('instrument.name', DataType.STRING)
		.withField('instrument.type', DataType.forEnum(InstrumentType, 'InstrumentType'))
		.withField('instrument.currency', DataType.forEnum(Currency, 'Currency'))
		.withField('instrument.delist', DataType.DAY, true)
		.withField('instrument.symbol.barchart', DataType.STRING, true)
		.withField('instrument.symbol.display', DataType.STRING, true)
		.withField('position', DataType.STRING)
		.withField('open', DataType.BOOLEAN, true)
		.withField('transaction', DataType.NUMBER)
		.withField('valuation', DataType.forEnum(ValuationType, 'ValuationType'))
		.withField('reinvest', DataType.BOOLEAN, true)
		.withField('snapshot.date', DataType.DAY)
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
		.withField('legacy.portfolio', DataType.STRING, true)
		.withField('legacy.position', DataType.STRING, true)
		.withField('system.version', DataType.NUMBER, true)
		.withField('root', DataType.STRING, true)
		.schema
	);

	const client = new PositionSchema(SchemaBuilder.withName('client')
		.withField('user', DataType.STRING)
		.withField('portfolio', DataType.STRING)
		.withField('instrument.id', DataType.STRING)
		.withField('instrument.name', DataType.STRING)
		.withField('instrument.type', DataType.forEnum(InstrumentType, 'InstrumentType'))
		.withField('instrument.currency', DataType.forEnum(Currency, 'Currency'))
		.withField('instrument.delist', DataType.DAY, true)
		.withField('instrument.symbol.barchart', DataType.STRING, true)
		.withField('instrument.symbol.display', DataType.STRING, true)
		.withField('position', DataType.STRING)
		.withField('open', DataType.BOOLEAN, true)
		.withField('transaction', DataType.NUMBER)
		.withField('valuation', DataType.forEnum(ValuationType, 'ValuationType'))
		.withField('reinvest', DataType.BOOLEAN, true)
		.withField('snapshot.date', DataType.DAY)
		.withField('snapshot.open', DataType.DECIMAL)
		.withField('snapshot.direction', DataType.forEnum(PositionDirection, 'PositionDirection'))
		.withField('snapshot.buys', DataType.DECIMAL)
		.withField('snapshot.sells', DataType.DECIMAL)
		.withField('snapshot.gain', DataType.DECIMAL)
		.withField('snapshot.basis', DataType.DECIMAL)
		.withField('snapshot.income', DataType.DECIMAL)
		.withField('snapshot.value', DataType.DECIMAL)
		.withField('previous', DataType.NUMBER, true)
		.schema
	);

	const update = new PositionSchema(SchemaBuilder.withName('update')
		.withField('portfolio', DataType.STRING)
		.withField('position', DataType.STRING)
		.withField('reinvest', DataType.BOOLEAN, true)
		.schema
	);

	return PositionSchema;
})();
