module.exports = (() => {
	'use strict';

	/**
	 * Aggregated position data intended for binding to a user interface.
	 *
	 * @public
	 * @param {Object} formatted
	 * @param {Object=} actions
	 */
	class PositionGroupBinding {
		constructor(formatted, actions) {
			this.formatted = formatted;
			this._actions = actions || { };
		}

		/**
		 * Returns formatted data.
		 *
		 * @public
		 * @returns {Object}
		 */
		get data() {
			return this.formatted;
		}

		/**
		 * Returns the binding identifier.
		 *
		 * @public
		 * @returns {Number}
		 */
		get id() {
			return this.formatted.id;
		}

		/**
		 * Returns the binding key.
		 *
		 * @public
		 * @returns {String}
		 */
		get key() {
			return this.formatted.key;
		}

		/**
		 * Returns the binding description.
		 *
		 * @public
		 * @returns {String}
		 */
		get description() {
			return this.formatted.description;
		}

		/**
		 * Set a flag to indicate if parent groups should exclude this group's
		 * items from their calculations.
		 *
		 * @public
		 * @param {Boolean} value
		 */
		setExcluded(value) {
			return this._actions.setExcluded(value);
		}

		/**
		 * Sets the filter mode for the group.
		 *
		 * @public
		 * @param {FilterMode} mode
		 */
		setFilterMode(mode) {
			return this._actions.setFilterMode(mode);
		}

		/**
		 * Changes the group currency.
		 *
		 * @public
		 * @param {Currency} currency
		 */
		changeCurrency(currency) {
			return this._actions.changeCurrency(currency);
		}

		/**
		 * Returns a string representation of the binding.
		 *
		 * @public
		 * @returns {String}
		 */
		toString() {
			return '[PositionGroupBinding]';
		}
	}

	return PositionGroupBinding;
})();
