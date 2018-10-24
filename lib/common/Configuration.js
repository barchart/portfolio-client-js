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
			return 'ldnddf3nsh.execute-api.us-east-1.amazonaws.com/dev';
		}

		/**
		 * The host of the staging system.
		 *
		 * @public
		 * @static
		 * @returns {String}
		 */
		static get stagingHost() {
			return '24ok2r76k6.execute-api.us-east-1.amazonaws.com/stage';
		}

		/**
		 * The host of the production system.
		 *
		 * @public
		 * @static
		 * @returns {String}
		 */
		static get productionHost() {
			return 'o77obtxxr4.execute-api.us-east-1.amazonaws.com/prod';
		}

		/**
		 * The host of the internal admin system.
		 *
		 * @public
		 * @static
		 * @return {String}
		 */
		static get adminHost() {
			return '38moiq7ek9.execute-api.us-east-1.amazonaws.com/admin';
		}

		toString() {
			return '[Configuration]';
		}
	}

	return Configuration;
})();