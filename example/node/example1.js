const process = require('process');

const PortfolioGateway = require('./../../lib/gateway/PortfolioGateway'),
	JwtProvider = require('./../../lib/security/JwtProvider');

console.info(`Example: Starting Node.js example script #1 (build a PortfolioGateway)`);

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
	console.error('A user identifier must be specified. Usage example: "node example1.js user-123 barchart"');
	process.exit();
}

if (typeof(userId) !== 'string' || userId.length === 0) {
	console.error('A context identifier must be specified. Usage example: "node example1.js user-123 barchart"');
	process.exit();
}

console.info(`Example: Creating JwtProvider (generates JWT for [ ${userId}@${contextId} ], suitable for test environment)`);

const jwtProvider = JwtProvider.forTest(userId, contextId);

console.info(`Example: Startup a new PortfolioGateway, passing the JwtProvider (active user will be [ ${userId}@${contextId} ]).`);

const gatewayStartPromise = PortfolioGateway.forTest(jwtProvider, 'example script #1');

gatewayStartPromise.then((pg) => {
	console.info(`Example: Portfolio Gateway started and ready for use.`);

	portfolioGateway = pg;

	console.info(`Example: Querying Barchart Portfolio Service.`);

	return portfolioGateway.readVersion()
		.then((result) => {
			console.info(`Example: Queried Barchart Portfolio Service - connected to [ ${result.environment} ] environment, running version [ ${result.version} ].`);
		});
}).then(() => {
	console.info(`Example: Node.js example script #1 completing normally.`);
}).catch((e) => {
	console.info(`Example: Node.js example script #1 failed.`, e);
}).then(() => {
	if (portfolioGateway !== null) {
		console.info(`Example: Disposing [ PortfolioGateway ] instance.`);

		portfolioGateway.dispose();
	}

	console.info(`Example: Node.js example script #1 terminating.`);
});