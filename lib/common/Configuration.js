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
			return 'portfolio-dev.aws.barchart.com/dev';
		}

		/**
		 * The host of the staging system.
		 *
		 * @public
		 * @static
		 * @returns {String}
		 */
		static get stagingHost() {
			return 'portfolio-stage.aws.barchart.com/stage';
		}

		/**
		 * The host of the production system.
		 *
		 * @public
		 * @static
		 * @returns {String}
		 */
		static get productionHost() {
			return 'portfolio.aws.barchart.com/prod';
		}

		/**
		 * The host of the internal admin system.
		 *
		 * @public
		 * @static
		 * @return {String}
		 */
		static get adminHost() {
			return 'portfolio-admin.aws.barchart.com/admin';
		}

		toString() {
			return '[Configuration]';
		}
	}

	return Configuration;
})();