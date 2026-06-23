module.exports = (() => {
	'use strict';

	/**
	 * Aggregated position data intended for binding to a user interface.
	 *
	 * @public
	 * @param {Object} formatted
	 */
	class PositionGroupBinding {
		constructor(formatted) {
			this.formatted = formatted;
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
