const assert = require('@barchart/common-js/lang/assert'),
	Currency = require('@barchart/common-js/lang/Currency'),
	DataType = require('@barchart/common-js/serialization/json/DataType'),
	Enum = require('@barchart/common-js/lang/Enum'),
	is = require('@barchart/common-js/lang/is'),
	Schema = require('@barchart/common-js/serialization/json/Schema'),
	SchemaBuilder = require('@barchart/common-js/serialization/json/builders/SchemaBuilder'),
	Timezones = require('@barchart/common-js/lang/Timezones');

const ValuationType = require('./../data/ValuationType');

module.exports = (() => {
	'use strict';

	/**
	 * The schemas which can be used to represent portfolio objects.
	 *
	 * @public
	 * @extends {Enum}
	 */
	class PortfolioSchema extends Enum {
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
		 * The complete portfolio schema.
		 *
		 * @static
		 * @public
		 * @returns {PortfolioSchema}
		 */
		static get COMPLETE() {
			return complete;
		}

		/**
		 * Portfolio data transmitted to the client, omitting some system data.
		 *
		 * @static
		 * @public
		 * @returns {PortfolioSchema}
		 */
		static get CLIENT() {
			return client;
		}

		/**
		 * Data required to create a portfolio.
		 *
		 * @static
		 * @public
		 * @returns {PortfolioSchema}
		 */
		static get CREATE() {
			return create;
		}

		/**
		 * Data required to update a portfolio.
		 *
		 * @static
		 * @public
		 * @returns {PortfolioSchema}
		 */
		static get UPDATE() {
			return update;
		}

		toString() {
			return '[PortfolioSchema]';
		}
	}

	const complete = new PortfolioSchema(SchemaBuilder.withName('complete')
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
		.withField('miscellany', DataType.AD_HOC, true)
		.withField('system.sequence', DataType.NUMBER)
		.withField('system.version', DataType.STRING)
		.withField('system.timestamp', DataType.TIMESTAMP)
		.schema
	);

	const client = new PortfolioSchema(SchemaBuilder.withName('client')
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
		.withField('miscellany', DataType.AD_HOC, true)
		.schema
	);

	const create = new PortfolioSchema(SchemaBuilder.withName('create')
		.withField('name', DataType.STRING)
		.withField('timezone', DataType.forEnum(Timezones, 'Timezone'))
		.withField('dates.cash', DataType.DAY, true)
		.withField('defaults.currency', DataType.forEnum(Currency, 'Currency'))
		.withField('defaults.reinvest', DataType.BOOLEAN, true)
		.withField('defaults.valuation', DataType.forEnum(ValuationType, 'ValuationType'))
		.withField('miscellany', DataType.AD_HOC, true)
		.schema
	);

	const update = new PortfolioSchema(SchemaBuilder.withName('update')
		.withField('name', DataType.STRING)
		.withField('timezone', DataType.forEnum(Timezones, 'Timezone'))
		.withField('dates.cash', DataType.DAY, true)
		.withField('defaults.currency', DataType.forEnum(Currency, 'Currency'))
		.withField('defaults.reinvest', DataType.BOOLEAN, true)
		.withField('defaults.valuation', DataType.forEnum(ValuationType, 'ValuationType'))
		.withField('miscellany', DataType.AD_HOC, true)
		.schema
	);

	return PortfolioSchema;
})();
