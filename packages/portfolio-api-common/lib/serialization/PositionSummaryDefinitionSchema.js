const DataType = require('@barchart/common-js/serialization/json/DataType'),
	Enum = require('@barchart/common-js/lang/Enum'),
	Schema = require('@barchart/common-js/serialization/json/Schema'),
	SchemaBuilder = require('@barchart/common-js/serialization/json/builders/SchemaBuilder');

const PositionSummaryFrame = require('./../data/PositionSummaryFrame');

module.exports = (() => {
	'use strict';

	/**
	 * The schemas which can be used to represent position summary objects.
	 *
	 * @public
	 * @extends {Enum}
	 */
	class PositionSummaryDefinitionSchema extends Enum {
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
		 * The complete position summary definition schema.
		 *
		 * @static
		 * @public
		 * @returns {PositionSummaryDefinitionSchema}
		 */
		static get COMPLETE() {
			return complete;
		}

		toString() {
			return '[PositionSummaryDefinitionSchema]';
		}
	}

	const complete = new PositionSummaryDefinitionSchema(SchemaBuilder.withName('complete')
		.withField('start', DataType.DAY)
		.withField('end', DataType.DAY)
		.withField('frame', DataType.forEnum(PositionSummaryFrame, 'PositionSummaryFrame'))
		.schema
	);

	return PositionSummaryDefinitionSchema;
})();
