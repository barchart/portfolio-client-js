const DataType = require('@barchart/common-js/serialization/json/DataType'),
	Enum = require('@barchart/common-js/lang/Enum'),
	Schema = require('@barchart/common-js/serialization/json/Schema'),
	SchemaBuilder = require('@barchart/common-js/serialization/json/builders/SchemaBuilder');

const PositionSummaryFrame = require('./../data/PositionSummaryFrame');

module.exports = (() => {
	'use strict';

	/**
	 * Schema used to represent availability of a brokerage report.
	 *
	 * @public
	 * @extends {Enum}
	 */
	class BrokerageReportAvailabilitySchema extends Enum {
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
		 * @returns {BrokerageReportAvailabilitySchema}
		 */
		static get COMPLETE() {
			return complete;
		}

		toString() {
			return '[BrokerageReportAvailabilitySchema]';
		}
	}

	const complete = new BrokerageReportAvailabilitySchema(SchemaBuilder.withName('complete')
		.withField('start', DataType.DAY)
		.withField('end', DataType.DAY)
		.withField('frame', DataType.forEnum(PositionSummaryFrame, 'PositionSummaryFrame'))
		.schema
	);

	return BrokerageReportAvailabilitySchema;
})();
