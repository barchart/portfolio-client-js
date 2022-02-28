const process = require('process');

const PortfolioGateway = require('./../../lib/gateway/PortfolioGateway'),
	JwtProvider = require('./../../lib/security/JwtProvider');

console.info(`Example: Starting Node.js example script #4 (query portfolios)`);

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

if (typeof(userId) !== 'string' || userId.length === 0) {
	console.error('A user identifier must be specified. Usage example: "node example4.js user-123 barchart"');
	process.exit();
}

if (typeof(userId) !== 'string' || userId.length === 0) {
	console.error('A context identifier must be specified. Usage example: "node example4.js user-123 barchart"');
	process.exit();
}

console.info(`Example: Initializing PortfolioGateway and connecting to test environment as [ ${userId}@${contextId} ].`);

PortfolioGateway.forTest(JwtProvider.forTest(userId, contextId)).then((pg) => {
	portfolioGateway = pg;

	console.info(`Example: Querying portfolios for user [ ${userId}@${contextId} ].`);

	return portfolioGateway.readPortfolios()
		.then((portfolios) => {
			console.info(`Example: Successfully queried [ ${portfolios.length} ] portfolio(s).`);

			portfolios.forEach((p) => {
				console.log(`Example: Portfolio [ ${p.portfolio} ] is named [ ${p.name} ].`);
			});
		});
}).then(() => {
	console.info(`Example: Node.js example script #4 completing normally.`);
}).catch((e) => {
	console.info(`Example: Node.js example script #4 failed.`, e);
}).then(() => {
	if (portfolioGateway !== null) {
		console.info(`Example: Disposing [ PortfolioGateway ] instance.`);

		portfolioGateway.dispose();
	}

	console.info(`Example: Node.js example script #4 terminating.`);
});