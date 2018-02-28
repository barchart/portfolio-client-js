const assert = require('@barchart/common-js/lang/assert'),
	Currency = require('@barchart/common-js/lang/Currency'),
	DataType = require('@barchart/common-js/serialization/json/DataType'),
	Enum = require('@barchart/common-js/lang/Enum'),
	is = require('@barchart/common-js/lang/is'),
	SchemaBuilder = require('@barchart/common-js/serialization/json/builders/SchemaBuilder'),
	Timezones = require('@barchart/common-js/lang/Timezones');

const ValuationType = require('./../data/ValuationType');

module.exports = (() => {
	'use strict';

	/**
	 * The schemas which can be used to represent a portfolio objects.
	 *
	 * @public
	 * @extends {Enum}
	 */
	class PortfolioSchema extends Enum {
		constructor(schema) {
			super(schema.name, schema.name);

			this._schema = schema;
		}

		get schema() {
			return this._schema;
		}

		static get CREATE() {
			return create;
		}

		static get COMPLETE() {
			return complete;
		}

		toString() {
			return '[PortfolioSchema]';
		}
	}

	const complete = new PortfolioSchema(SchemaBuilder.withName('Complete')
		.withField('user', DataType.STRING)
		.withField('portfolio', DataType.STRING)
		.withField('name', DataType.STRING)
		.withField('timezone', DataType.forEnum(Timezones, 'Timezone'))
		.withField('dates.create', DataType.DAY)
		.withField('dates.cash', DataType.DAY, true)
		.withField('defaults.currency', DataType.forEnum(Currency, 'Currency'))
		.withField('defaults.reinvest', DataType.BOOLEAN, true)
		.withField('defaults.valuation', DataType.forEnum(ValuationType, 'ValuationType'))
		.withField('legacy.system', DataType.STRING, true)
		.withField('legacy.user', DataType.STRING, true)
		.withField('legacy.portfolio', DataType.STRING, true)
		.withField('legacy.warnings', DataType.NUMBER, true)
		.withField('legacy.drops', DataType.NUMBER, true)
		.withField('system.version', DataType.NUMBER, true)
		.schema
	);

	const create = new PortfolioSchema(SchemaBuilder.withName('Create')
		.withField('user', DataType.STRING)
		.withField('portfolio', DataType.STRING)
		.withField('name', DataType.STRING)
		.withField('timezone', DataType.forEnum(Timezones, 'Timezone'))
		.withField('dates.create', DataType.DAY)
		.withField('dates.cash', DataType.DAY, true)
		.withField('defaults.currency', DataType.forEnum(Currency, 'Currency'))
		.withField('defaults.reinvest', DataType.BOOLEAN, true)
		.withField('defaults.valuation', DataType.forEnum(ValuationType, 'ValuationType'))
		.withField('legacy.system', DataType.STRING, true)
		.withField('legacy.user', DataType.STRING, true)
		.withField('system.version', DataType.NUMBER, true)
		.schema
	);

	return PortfolioSchema;
})();
