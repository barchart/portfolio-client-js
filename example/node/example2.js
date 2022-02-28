const process = require('process');

const PortfolioGateway = require('./../../lib/gateway/PortfolioGateway'),
	JwtProvider = require('./../../lib/security/JwtProvider');

const Currency = require('@barchart/common-js/lang/Currency'),
	Timezones = require('@barchart/common-js/lang/Timezones');

console.info(`Example: Starting Node.js example script #2 (create a new portfolio)`);

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
	console.error('A user identifier must be specified. Usage example: "node example2.js user-123 barchart"');
	process.exit();
}

if (typeof(userId) !== 'string' || userId.length === 0) {
	console.error('A context identifier must be specified. Usage example: "node example2.js user-123 barchart"');
	process.exit();
}

console.info(`Example: Initializing PortfolioGateway and connecting to test environment as [ ${userId}@${contextId} ].`);

PortfolioGateway.forTest(JwtProvider.forTest(userId, contextId)).then((pg) => {
	portfolioGateway = pg;

	console.info(`Example: Creating a new portfolio.`);

	const data = {
		name: 'My First Portfolio',
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
		});
}).then(() => {
	console.info(`Example: Node.js example script #2 completed normally.`);
}).catch((e) => {
	console.info(`Example: Node.js example script #2 failed.`, e);
}).then(() => {
	if (portfolioGateway !== null) {
		console.info(`Example: Disposing [ PortfolioGateway ] instance.`);

		portfolioGateway.dispose();
	}

	console.info(`Example: Node.js example script #2 terminating.`);
});