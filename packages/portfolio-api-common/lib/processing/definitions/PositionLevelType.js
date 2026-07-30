const Enum = require('@barchart/common-js/lang/Enum');

module.exports = (() => {
	'use strict';

	/**
	 * Describes the contents of a grouping level within a tree of positions.
	 * This is an attribute of a {@link PositionLevelDefinition}.
	 *
	 * @public
	 * @extends {Enum}
	 */
	class PositionLevelType extends Enum {
		constructor(code) {
			super(code, code);
		}

		/**
		 * A level of grouping for positions which share the same instrument.
		 *
		 * @public
		 * @static
		 * @returns {PositionLevelType}
		 */
		static get INSTRUMENT() {
			return instrument;
		}

		/**
		 * A level of grouping that represents an entire portfolio's contents.
		 *
		 * @public
		 * @static
		 * @returns {PositionLevelType}
		 */
		static get PORTFOLIO() {
			return portfolio;
		}

		/**
		 * A level of grouping that represents a single positions (i.e. guaranteed to
		 * be a leaf node in a grouping tree).
		 *
		 * @public
		 * @static
		 * @return {PositionLevelType}
		 */
		static get POSITION() {
			return position;
		}

		/**
		 * A level of grouping that doesn't fit into any other explicitly defined
		 * category. This could be an intermediate level of grouping (e.g. an asset
		 * class within a portfolio).
		 *
		 * @public
		 * @static
		 * @return {PositionLevelType}
		 */
		static get OTHER() {
			return other;
		}
	}

	const instrument = new PositionLevelType('INSTRUMENT');
	const portfolio = new PositionLevelType('PORTFOLIO');
	const position = new PositionLevelType('POSITION');
	const other = new PositionLevelType('OTHER');

	return PositionLevelType;
})();
