const JwtProvider = require('./security/JwtProvider'),
	PortfolioGateway = require('./gateway/PortfolioGateway');

module.exports = (() => {
	'use strict';

	return {
		JwtProvider: JwtProvider,
		PortfolioGateway: PortfolioGateway,
		version: '13.0.0'
	};
})();
