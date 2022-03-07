const process = require('process');

const PortfolioGateway = require('./../../lib/gateway/PortfolioGateway'),
	JwtProvider = require('./../../lib/security/JwtProvider');

console.info(`Example: Starting Node.js example script #6 (query transactions)`);

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
	console.error('A user identifier must be specified. Usage example: "node example6.js user-123 barchart"');
	process.exit();
}

if (typeof(userId) !== 'string' || userId.length === 0) {
	console.error('A context identifier must be specified. Usage example: "node example6.js user-123 barchart"');
	process.exit();
}

console.info(`Example: Initializing PortfolioGateway and connecting to test environment as [ ${userId}@${contextId} ].`);

PortfolioGateway.forTest(JwtProvider.forTest(userId, contextId)).then((pg) => {
	portfolioGateway = pg;

	console.info(`Example: Querying all positions, regardless of portfolio, for user [ ${userId}@${contextId} ].`);

	return portfolioGateway.readPositions()
		.then((positions) => {
			console.info(`Example: Successfully queried [ ${positions.length} ] position(s).`);

			if (positions.length !== 0) {
				return positions[0];
			} else {
				return null;
			}
		}).then((position) => {
			if (position === null) {
				console.warn(`Example: User [ ${userId}@${contextId} ] has no positions, unable to query transactions.`);

				return;
			}

			console.info(`Example: Reading transactions for position [ ${position.position} ] in portfolio [ ${position.portfolio} ].`);

			return portfolioGateway.readTransactions(position.portfolio, position.position)
				.then((transactions) => {
					console.info(`Example: Reads transactions. Position [ ${position.position} ] for [ ${position.instrument.symbol.barchart} ] has [ ${transactions.length} ] transactions, as follows:`);

					transactions.forEach((t) => {
						console.log(`Example: Transaction sequence [ #${t.sequence} ] executed on [ ${t.date.format()} ]: [ ${t.type.description} ].`);
					});
				});
		});
}).then(() => {
	console.info(`Example: Node.js example script #6 completing normally.`);
}).catch((e) => {
	console.info(`Example: Node.js example script #6 failed.`, e);
}).then(() => {
	if (portfolioGateway !== null) {
		console.info(`Example: Disposing [ PortfolioGateway ] instance.`);

		portfolioGateway.dispose();
	}

	console.info(`Example: Node.js example script #6 terminating.`);
});