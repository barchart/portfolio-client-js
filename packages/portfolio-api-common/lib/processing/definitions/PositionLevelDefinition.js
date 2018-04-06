const assert = require('@barchart/common-js/lang/assert'),
	Currency = require('@barchart/common-js/lang/Currency'),
	is = require('@barchart/common-js/lang/is');

const InstrumentType = require('./../../data/InstrumentType');

const PositionLevelType = require('./PositionLevelType');

module.exports = (() => {
	'use strict';

	/**
	 * Defines a grouping level within a tree of positions. A level could represent a
	 * group of multiple positions (e.g. all equities or all positions for a portfolio).
	 * Alternately, a level could also represent a single position.
	 *
	 * @public
	 * @param {String} name
	 * @param {PositionLevelDefinition~keySelector} keySelector
	 * @param {PositionLevelDefinition~descriptionSelector} descriptionSelector
	 * @param {PositionLevelDefinition~currencySelector} currencySelector
	 * @param {Array.<PositionLevelDefinition~RequiredGroup>=} requiredGroups
	 * @param {Boolean=} single
	 * @param {Boolean=} aggregateCash
	 * @param {Function=} requiredGroupGenerator
	 */
	class PositionLevelDefinition {
		constructor(name, type, keySelector, descriptionSelector, currencySelector, requiredGroups, single, aggregateCash, requiredGroupGenerator) {
			assert.argumentIsRequired(name, 'name', String);
			assert.argumentIsRequired(type, 'type', PositionLevelType, 'PositionLevelType');
			assert.argumentIsRequired(keySelector, 'keySelector', Function);
			assert.argumentIsRequired(descriptionSelector, 'descriptionSelector', Function);
			assert.argumentIsRequired(currencySelector, 'currencySelector', Function);

			if (requiredGroups) {
				assert.argumentIsArray(requiredGroups, 'requiredGroups', String);
			}

			assert.argumentIsOptional(single, 'single', Boolean);
			assert.argumentIsOptional(aggregateCash, 'aggregateCash', Boolean);
			assert.argumentIsOptional(requiredGroupGenerator, 'requiredGroupGenerator', Function);

			this._name = name;
			this._type = type;

			this._keySelector = keySelector;
			this._descriptionSelector = descriptionSelector;
			this._currencySelector = currencySelector;

			this._requiredGroups = requiredGroups || [ ];

			this._single = is.boolean(single) && single;
			this._aggregateCash = is.boolean(aggregateCash) && aggregateCash;

			this._requiredGroupGenerator = requiredGroupGenerator || (input => null);
		}

		/**
		 * The name of the grouping level.
		 *
		 * @public
		 * @returns {String}
		 */
		get name() {
			return this._name;
		}

		/**
		 * A general description of the type of items grouped together.
		 *
		 * @public
		 * @return {PositionLevelType}
		 */
		get type() {
			return this._type;
		}

		/**
		 * A function, when given a {@link PositionItem} returns a string that is used
		 * to group {@link PositionItem} instances into different groups.
		 *
		 * @public
		 * @returns {PositionLevelDefinition~keySelector}
		 */
		get keySelector() {
			return this._keySelector;
		}

		/**
		 * A function, when given a {@link PositionItem} returns a string used to describe the
		 * group.
		 *
		 * @public
		 * @returns {PositionLevelDefinition~descriptionSelector}
		 */
		get descriptionSelector() {
			return this._descriptionSelector;
		}

		/**
		 * A function, when given a {@link PositionItem} returns the {@link Currency} used to
		 * display values for the group.
		 *
		 * @public
		 * @returns {PositionLevelDefinition~currencySelector}
		 */
		get currencySelector() {
			return this._currencySelector;
		}

		/**
		 * Indicates the required groups (i.e. descriptions). The allows for the creation of empty
		 * groups.
		 *
		 * @public
		 * @returns {Array<String>}
		 */
		get requiredGroups() {
			return this._requiredGroups;
		}

		/**
		 * Indicates if the grouping level is meant to only contain a single item.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get single() {
			return this._single;
		}

		/**
		 * Indicates if the grouping level should aggregate cash positions.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get aggregateCash() {
			return this._aggregateCash;
		}

		/**
		 * Given an input, potentially creates a new {@link PositionLevelDefinition~RequiredGroup}.
		 *
		 * @public
		 * @param {*} input
		 * @returns {PositionLevelDefinition~RequiredGroup|null}
		 */
		generateRequiredGroup(input) {
			const requiredGroup = this._requiredGroupGenerator(input);

			if (requiredGroup !== null) {
				this._requiredGroups.push(requiredGroup);
			}

			return requiredGroup;
		}

		/**
		 * Builds a {@link PositionLevelDefinition~RequiredGroup} for a portfolio.
		 *
		 * @public
		 * @static
		 * @param {Object} portfolio
		 * @return {PositionLevelDefinition~RequiredGroup}
		 */
		static buildRequiredGroupForPortfolio(portfolio) {
			return {
				key: PositionLevelDefinition.getKeyForPortfolioGroup(portfolio),
				description: PositionLevelDefinition.getDescriptionForPortfolioGroup(portfolio),
				currency: Currency.CAD
			};
		}

		static getKeyForPortfolioGroup(portfolio) {
			assert.argumentIsRequired(portfolio, 'portfolio', Object);

			return portfolio.portfolio;
		}

		static getDescriptionForPortfolioGroup(portfolio) {
			assert.argumentIsRequired(portfolio, 'portfolio', Object);

			return portfolio.name;
		}

		static getRequiredGroupGeneratorForPortfolio() {
			return (portfolio) => {
				let requiredGroup;

				if (is.object(portfolio) && is.string(portfolio.portfolio) && is.string(portfolio.name)) {
					requiredGroup = PositionLevelDefinition.buildRequiredGroupForPortfolio(portfolio);
				} else {
					requiredGroup = null;
				}

				return requiredGroup;
			};
		}

		/**
		 * Builds a {@link PositionLevelDefinition~RequiredGroup} for an asset class.
		 *
		 * @public
		 * @static
		 * @param {InstrumentType} type
		 * @param {Currency} currency
		 * @return {PositionLevelDefinition~RequiredGroup}
		 */
		static buildRequiredGroupForAssetClass(type, currency) {
			return {
				key: PositionLevelDefinition.getKeyForAssetClassGroup(type, currency),
				description: PositionLevelDefinition.getDescriptionForAssetClassGroup(type, currency),
				currency: currency
			};
		}

		static getKeyForAssetClassGroup(type, currency) {
			assert.argumentIsRequired(type, 'type', InstrumentType, 'InstrumentType');
			assert.argumentIsRequired(currency, 'currency', Currency, 'Currency');

			return `${type.code}|${currency.code}`;
		}

		static getDescriptionForAssetClassGroup(type, currency) {
			assert.argumentIsRequired(type, 'type', InstrumentType, 'InstrumentType');
			assert.argumentIsRequired(currency, 'currency', Currency, 'Currency');

			return `${type.alternateDescription}${currency.code === 'CAD' ? '' : ` (${currency.alternateDescription})`}`;
		}

		toString() {
			return '[PositionLevelDefinition]';
		}
	}

	/**
	 * A callback used to determine the eligibility for membership of a {@link PositionItem}
	 * within a group.
	 *
	 * @public
	 * @callback PositionLevelDefinition~keySelector
	 * @param {PositionItem} item
	 * @returns {String}
	 */

	/**
	 * A callback used to determine the human-readable name of a group. This function should
	 * return the same value for any {@link PositionItem} in the group.
	 *
	 * @public
	 * @callback PositionLevelDefinition~descriptionSelector
	 * @param {PositionItem} item
	 * @returns {String}
	 */

	/**
	 * A callback used to determine the display {@link Currency} for the group. This function should
	 * return the same value for any {@link PositionItem} in the group.
	 *
	 * @public
	 * @callback PositionLevelDefinition~currencySelector
	 * @param {PositionItem} item
	 * @returns {Currency}
	 */

	/**
	 * The data required to construct a group.
	 *
	 * @public
	 * @typedef PositionLevelDefinition~RequiredGroup
	 * @type {Object}
	 * @property {String} key
	 * @property {String} description
	 * @property {Currency} currency
	 */

	return PositionLevelDefinition;
})();
