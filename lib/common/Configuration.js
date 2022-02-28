module.exports = (() => {
	'use strict';

	/**
	 * Static configuration data.
	 *
	 * @public
	 * @ignore
	 */
	class Configuration {
		constructor() {

		}

		/**
		 * The hostname of the REST API for the development environment (intended for Barchart use only).
		 *
		 * @public
		 * @static
		 * @returns {String}
		 */
		static get developmentHost() {
			return 'portfolio-dev.aws.barchart.com';
		}

		/**
		 * The hostname of the REST API for the test environment (public use allowed).
		 *
		 * @public
		 * @static
		 * @returns {String}
		 */
		static get testHost() {
			return 'portfolio-test.aws.barchart.com';
		}

		/**
		 * The hostname of the REST API for the staging environment (public use allowed).
		 *
		 * @public
		 * @static
		 * @returns {String}
		 */
		static get stagingHost() {
			return 'portfolio-stage.aws.barchart.com';
		}

		/**
		 * The hostname of the REST API for the demo environment (intended for Barchart use only).
		 *
		 * @public
		 * @static
		 * @returns {String}
		 */
		static get demoHost() {
			return 'portfolio-demo.aws.barchart.com';
		}

		/**
		 * The hostname of the REST API for the production environment (public use allowed).
		 *
		 * @public
		 * @static
		 * @returns {String}
		 */
		static get productionHost() {
			return 'portfolio.aws.barchart.com';
		}

		/**
		 * The hostname of the REST API for the admin environment (intended for Barchart use only).
		 *
		 * @public
		 * @static
		 * @returns {String}
		 */
		static get adminHost() {
			return 'portfolio-admin.aws.barchart.com';
		}

		/**
		 * The hostname of REST API which generates impersonation tokens for non-secure
		 * test and demo environments.
		 *
		 * @public
		 * @static
		 * @returns {string}
		 */
		static get getJwtImpersonationHost() {
			return 'jwt-public-prod.aws.barchart.com';
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

		toString() {
			return '[Configuration]';
		}
	}

	return Configuration;
})();