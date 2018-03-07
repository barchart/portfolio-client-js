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
		static get localHost() {
			return '127.0.0.1';
		}

		/**
		 * The host of the development system.
		 *
		 * @public
		 * @static
		 * @returns {String}
		 */
		static get developmentHost() {
			return 'g4zerhpif5.execute-api.us-east-1.amazonaws.com/dev';
		}

		/**
		 * The host of the production system.
		 *
		 * @public
		 * @static
		 * @returns {String}
		 */
		static get productionHost() {
			return 'g4zerhpif5.execute-api.us-east-1.amazonaws.com/prod';
		}

		toString() {
			return '[Configuration]';
		}
	}

	return Configuration;
})();