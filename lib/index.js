const JwtGateway = require('./security/JwtGateway'),
	PortfolioGateway = require('./gateway/PortfolioGateway');

module.exports = (() => {
	'use strict';

	return {
		JwtGateway: JwtGateway,
		PortfolioGateway: PortfolioGateway,
		version: '1.5.1'
	};
})();