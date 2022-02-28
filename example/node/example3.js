const process = require('process');

const PortfolioGateway = require('./../../lib/gateway/PortfolioGateway'),
	JwtProvider = require('./../../lib/security/JwtProvider');

const Day = require('@barchart/common-js/lang/Day'),
	Decimal = require('@barchart/common-js/lang/Decimal'),
	Currency = require('@barchart/common-js/lang/Currency'),
	Timezones = require('@barchart/common-js/lang/Timezones');

const TransactionType = require('@barchart/portfolio-api-common/lib/data/TransactionType');

console.info(`Example: Starting Node.js example script #3 (create portfolio and execute transaction)`);

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
	console.error('A user identifier must be specified. Usage example: "node example3.js user-123 barchart"');
	process.exit();
}

if (typeof(userId) !== 'string' || userId.length === 0) {
	console.error('A context identifier must be specified. Usage example: "node example3.js user-123 barchart"');
	process.exit();
}

console.info(`Example: Initializing PortfolioGateway and connecting to test environment as [ ${userId}@${contextId} ].`);

PortfolioGateway.forTest(JwtProvider.forTest(userId, contextId)).then((pg) => {
	portfolioGateway = pg;

	return Promise.resolve()
		.then(() => {
			console.info(`Example: Creating a new portfolio for user [ ${userId}@${contextId} ].`);

			const data = {
				name: "My Second Portfolio",
				timezone: Timezones.AMERICA_NEW_YORK,
				defaults: {
					cash: false,
					currency: Currency.USD,
					reinvest: false
				}
			};

			return portfolioGateway.createPortfolio(data)
				.then((portfolio) => {
					console.info(`Example: Created portfolio [ ${portfolio.portfolio} ].`);

					return portfolio;
				});
		}).then((portfolio) => {
			console.info(`Example: Executing a BUY transaction (for a new position) in portfolio [ ${portfolio.portfolio} ].`);

			const data = {
				portfolio: portfolio.portfolio,
				position: 'new',
				type: TransactionType.BUY,
				instrument: {
					symbol: {
						barchart: 'AAPL',
						display: 'AAPL'
					}
				},
				date: new Day(2022, 1, 3),
				price: new Decimal(182.56),
				quantity: new Decimal(100)
			};

			return portfolioGateway.createTransaction(data)
				.then((result) => {
					const position = result.positions.saved.find(p => p.instrument.symbol.barchart === data.instrument.symbol.barchart);

					console.info(`Example: Transaction executed; new position identifier [ ${position.position} ]`);
				});
		});
}).then(() => {
	console.info(`Example: Node.js example script #3 completing normally.`);
}).catch((e) => {
	console.info(`Example: Node.js example script #3 failed.`, e);
}).then(() => {
	if (portfolioGateway !== null) {
		console.info(`Example: Disposing [ PortfolioGateway ] instance.`);

		portfolioGateway.dispose();
	}

	console.info(`Example: Node.js example script #3 terminating.`);
});