const Currency = require('@barchart/common-js/lang/Currency'),
	DataType = require('@barchart/common-js/serialization/json/DataType'),
	Enum = require('@barchart/common-js/lang/Enum'),
	Schema = require('@barchart/common-js/serialization/json/Schema'),
	SchemaBuilder = require('@barchart/common-js/serialization/json/builders/SchemaBuilder');

const PositionDirection = require('./../data/PositionDirection'),
	PositionSummaryFrame = require('./../data/PositionSummaryFrame');

module.exports = (() => {
	'use strict';

	/**
	 * The schemas which can be used to represent position summary objects.
	 *
	 * @public
	 * @extends {Enum}
	 */
	class PositionSummarySchema extends Enum {
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
		 * The complete position summary schema.
		 *
		 * @static
		 * @public
		 * @returns {PositionSummarySchema}
		 */
		static get COMPLETE() {
			return complete;
		}

		/**
		 * Position summary data transmitted to the client, omitting some system data.
		 *
		 * @static
		 * @public
		 * @returns {PositionSummarySchema}
		 */
		static get CLIENT() {
			return client;
		}

		toString() {
			return '[PositionSummarySchema]';
		}
	}

	const complete = new PositionSummarySchema(SchemaBuilder.withName('complete')
		.withField('user', DataType.STRING)
		.withField('portfolio', DataType.STRING)
		.withField('position', DataType.STRING)
		.withField('frame', DataType.forEnum(PositionSummaryFrame, 'PositionSummaryFrame'))
		.withField('start.date', DataType.DAY)
		.withField('start.sequence', DataType.NUMBER)
		.withField('start.open', DataType.DECIMAL)
		.withField('start.direction', DataType.forEnum(PositionDirection, 'PositionDirection'))
		.withField('start.basis', DataType.DECIMAL)
		.withField('start.value', DataType.DECIMAL)
		.withField('end.date', DataType.DAY)
		.withField('end.sequence', DataType.NUMBER)
		.withField('end.open', DataType.DECIMAL)
		.withField('end.direction', DataType.forEnum(PositionDirection, 'PositionDirection'))
		.withField('end.basis', DataType.DECIMAL)
		.withField('end.value', DataType.DECIMAL)
		.withField('period.buys', DataType.DECIMAL)
		.withField('period.sells', DataType.DECIMAL)
		.withField('period.income', DataType.DECIMAL)
		.withField('period.realized', DataType.DECIMAL)
		.withField('period.unrealized', DataType.DECIMAL)
		.withField('system.sequence', DataType.NUMBER)
		.withField('system.version', DataType.STRING)
		.schema
	);

	const client = new PositionSummarySchema(SchemaBuilder.withName('client')
		.withField('user', DataType.STRING)
		.withField('portfolio', DataType.STRING)
		.withField('position', DataType.STRING)
		.withField('frame', DataType.forEnum(PositionSummaryFrame, 'PositionSummaryFrame'))
		.withField('start.date', DataType.DAY)
		.withField('start.sequence', DataType.NUMBER)
		.withField('start.open', DataType.DECIMAL)
		.withField('start.direction', DataType.forEnum(PositionDirection, 'PositionDirection'))
		.withField('start.basis', DataType.DECIMAL)
		.withField('start.value', DataType.DECIMAL)
		.withField('end.date', DataType.DAY)
		.withField('end.sequence', DataType.NUMBER)
		.withField('end.open', DataType.DECIMAL)
		.withField('end.direction', DataType.forEnum(PositionDirection, 'PositionDirection'))
		.withField('end.basis', DataType.DECIMAL)
		.withField('end.value', DataType.DECIMAL)
		.withField('period.buys', DataType.DECIMAL)
		.withField('period.sells', DataType.DECIMAL)
		.withField('period.income', DataType.DECIMAL)
		.withField('period.realized', DataType.DECIMAL)
		.withField('period.unrealized', DataType.DECIMAL)
		.schema
	);

	return PositionSummarySchema;
})();
