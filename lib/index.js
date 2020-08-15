const JwtGateway = require('./security/JwtGateway'),
	PortfolioGateway = require('./gateway/PortfolioGateway');

module.exports = (() => {
	'use strict';

	return {
		JwtGateway: JwtGateway,
		PortfolioGateway: PortfolioGateway,
		version: '3.0.1'
	};
})();