const process = require('process');

const PortfolioGateway = require('./../../lib/gateway/PortfolioGateway'),
	JwtProvider = require('./../../lib/security/JwtProvider');

console.info(`Example: Starting Node.js example script #5 (query positions)`);

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
	console.error('A user identifier must be specified. Usage example: "node example5.js user-123 barchart"');
	process.exit();
}

if (typeof(userId) !== 'string' || userId.length === 0) {
	console.error('A context identifier must be specified. Usage example: "node example5.js user-123 barchart"');
	process.exit();
}

console.info(`Example: Initializing PortfolioGateway and connecting to test environment as [ ${userId}@${contextId} ].`);

PortfolioGateway.forTest(JwtProvider.forTest(userId, contextId)).then((pg) => {
	portfolioGateway = pg;

	console.info(`Example: Querying all positions for user [ ${userId}@${contextId} ].`);

	return portfolioGateway.readPositions()
		.then((positions) => {
			const portfolios = positions.reduce((a, p) => a.add(p.portfolio), new Set());

			console.info(`Example: Successfully queried [ ${positions.length} ] position(s) in [ ${portfolios.size} ] portfolio(s).`);
		});
}).then(() => {
	console.info(`Example: Node.js example script #5 completing normally.`);
}).catch((e) => {
	console.info(`Example: Node.js example script #5 failed.`, e);
}).then(() => {
	if (portfolioGateway !== null) {
		console.info(`Example: Disposing [ PortfolioGateway ] instance.`);

		portfolioGateway.dispose();
	}

	console.info(`Example: Node.js example script #5 terminating.`);
});