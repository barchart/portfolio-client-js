module.exports = (() => {
	'use strict';

	/**
	 * Static configuration data.
	 *
	 * @public
	 */
	class Configuration {
		constructor() {

		}

		/**
		 * The host of the development system.
		 *
		 * @public
		 * @static
		 * @returns {String}
		 */
		static get developmentHost() {
			return 'a8yojohcfb.execute-api.us-east-1.amazonaws.com/dev';
		}

		/**
		 * The host of the production system.
		 *
		 * @public
		 * @static
		 * @returns {String}
		 */
		static get productionHost() {
			return 'a8yojohcfb.execute-api.us-east-1.amazonaws.com/prod';
		}

		toString() {
			return '[Configuration]';
		}
	}

	return Configuration;
})();