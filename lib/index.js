const JwtGateway = require('./gateway/jwt/JwtGateway'),
	PortfolioGateway = require('./gateway/PortfolioGateway');

module.exports = (() => {
	'use strict';

	return {
		JwtGateway: JwtGateway,
		PortfolioGateway: PortfolioGateway,
		version: '1.2.6'
	};
})();