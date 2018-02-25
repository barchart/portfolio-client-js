const PortfolioGateway = require('./gateway/PortfolioGateway');

module.exports = (() => {
	'use strict';

	return {
		PortfolioGateway: PortfolioGateway,
		version: '1.1.0'
	};
})();