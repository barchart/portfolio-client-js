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
				return 'i98b1sdxp6.execute-api.us-east-1.amazonaws.com/stage';
			} else if (host === Configuration.productionHost) {
				return 'xos40seq3e.execute-api.us-east-1.amazonaws.com/prod';
			} else if (host === Configuration.adminHost) {
				return 'q1x45oxon1.execute-api.us-east-1.amazonaws.com/admin';
			} else if (host === Configuration.demoHost) {
				return 'b9132ukaob.execute-api.us-east-1.amazonaws.com/demo';
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
		 * The host of the public demo system.
		 *
		 * @public
		 * @static
		 * @return {String}
		 */
		static get demoHost() {
			return 'portfolio-demo.aws.barchart.com';
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