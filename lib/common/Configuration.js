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

		static getBrokerageHost(host) {
			if (host === Configuration.developmentHost) {
				return '7enbtpamgg.execute-api.us-east-1.amazonaws.com/dev';
			} else if (host === Configuration.stagingHost) {
				return '';
			} else if (host === Configuration.productionHost) {
				return '';
			} else if (host === Configuration.adminHost) {
				return '';
			} else {
				return '';
			}
		}

		/**
		 * The host of the development system.
		 *
		 * @public
		 * @static
		 * @returns {String}
		 */
		static get developmentHost() {
			return 'portfolio-dev.aws.barchart.com';
		}

		/**
		 * The host of the staging system.
		 *
		 * @public
		 * @static
		 * @returns {String}
		 */
		static get stagingHost() {
			return 'portfolio-stage.aws.barchart.com';
		}

		/**
		 * The host of the production system.
		 *
		 * @public
		 * @static
		 * @returns {String}
		 */
		static get productionHost() {
			return 'portfolio.aws.barchart.com';
		}

		/**
		 * The host of the internal admin system.
		 *
		 * @public
		 * @static
		 * @return {String}
		 */
		static get adminHost() {
			return 'portfolio-admin.aws.barchart.com';
		}

		toString() {
			return '[Configuration]';
		}
	}

	return Configuration;
})();