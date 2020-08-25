const PortfolioGateway = require('./../../lib/gateway/PortfolioGateway'),
	JwtProvider = require('./../../lib/security/JwtProvider');

console.info(`Example: Node.js example script started.`);

let portfolioGateway = null;

process.on('SIGINT', () => {
	console.info('Example: Processing SIGINT');

	if (portfolioGateway !== null) {
		portfolioGateway.dispose();
	}

	process.exit();
});

process.on('unhandledRejection', (error) => {
	console.error('Unhandled Promise Rejection', error);
});

process.on('uncaughtException', (error) => {
	console.error('Unhandled Error', error);
});

const userId = process.argv[2];
const contextId = process.argv[3];

const symbol = process.argv[4];

if (typeof(userId) !== 'string' || userId.length === 0) {
	console.error('A user identifier must be specified. Usage example: "node example.js user-123"');
	process.exit();
}

console.info(`Example: Initializing PortfolioGateway, connecting to test environment as [ ${userId} ] [ ${contextId} ].`);

PortfolioGateway.forDevelopment(JwtProvider.forDevelopment(userId, contextId))
	.then((gateway) => {
		portfolioGateway = gateway;

		console.info(`Example: Retrieving portfolio(s) for [ ${userId} ] [ ${contextId} ].`);

		return portfolioGateway.readPortfolios()
			.then((portfolios) => {
				console.info(`Example: Retrieved [ ${portfolios.length} ] portfolio(s) for [ ${userId} ] [ ${contextId} ].`);
			});
	}).then(() => {
		console.info(`Example: Querying positions(s) for [ ${userId} ] [ ${contextId} ] [ ${symbol} ].`);

		return portfolioGateway.queryPositionsForSymbol(symbol)
			.then((portfolios) => {
				console.info(`Example: Retrieved [ ${portfolios.length} ] portion(s) for [ ${userId} ] [ ${contextId} ] [ ${symbol} ].`);
			});
	}).then(() => {
		portfolioGateway.dispose();

		console.info(`Example: Node.js example script completed normally.`);
	});