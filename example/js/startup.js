const version = require('./../../lib/index').version;

const Currency = require('@barchart/common-js/lang/Currency');
const Day = require('@barchart/common-js/lang/Day');
const Decimal = require('@barchart/common-js/lang/Decimal');
const Timezones = require('@barchart/common-js/lang/Timezones');

const TransactionType = require('@barchart/portfolio-api-common/lib/data/TransactionType');
const ValuationType = require('@barchart/portfolio-api-common/lib/data/ValuationType');

const JwtGateway = require('./../../lib/gateway/jwt/JwtGateway');
const PortfolioGateway = require('./../../lib/gateway/PortfolioGateway');

module.exports = (() => {
	'use strict';

	var PageModel = function() {
		var that = this;

		that.gateway = null;

		that.user = ko.observable('d46fba70-21d3-413d-a1bc-a5a37d9de46c');
		that.userLegacy = ko.observable('00000000');

		that.connected = ko.observable(false);
		that.connecting = ko.observable(false);

		that.activeTemplate = ko.observable('disconnected-template');
		that.console = ko.observableArray([ ]);

		that.portfolio = ko.observable();
		that.position = ko.observable();
		that.transaction = ko.observable();

		that.clientVersion = ko.observable(version);

		var getPortfolios = function() {
			var action = 'portfolioGateway.readPortfolios()';

			that.gateway.readPortfolios(that.portfolio() || null)
				.then((data) => {
					writeConsoleText(action, true);
					writeConsoleObject(data);
				}).catch((e) => {
					writeConsoleText(action, true);
					writeConsoleObject(e);

					that.setConsoleMode();
				});
		};
		var createPortfolio = function () {
			var action = 'portfolioGateway.createPortfolio()';

			var portfolio = {
				name: `Random ${Math.random()}`,
				timezone: Timezones.AMERICA_NEW_YORK,
				dates: {
					create: Day.getToday(),
					cash: Day.getToday()
				},
				defaults: {
					currency: Currency.CAD,
					reinvest: true,
					valuation: ValuationType.AVERAGE_COST
				},
				miscellany: {
					testing: {
						nested: 'yes'
					}
				}
			};

			that.gateway.createPortfolio(portfolio)
				.then((data) => {
					writeConsoleText(action, true);
					writeConsoleObject(data);
				}).catch((e) => {
					writeConsoleText(action, true);
					writeConsoleObject(e);

					that.setConsoleMode();
				});
		};
		var updatePortfolio = function() {
			var action = 'portfolioGateway.updatePortfolio()';

			var portfolio = {
				name: `Random ${Math.random()}`,
				timezone: 'America/New_York',
				dates: {
					cash: Day.getToday()
				},
				defaults: {
					currency: 'CAD',
					reinvest: true,
					valuation: 'AVG'
				},
				data: {}
			};

			if (!that.portfolio()) {
				toastr.info('A "portfolio" is required.');
				return;
			}

			that.gateway.updatePortfolio(portfolio)
				.then((data) => {
					writeConsoleText(action, true);
					writeConsoleObject(data);
				}).catch((e) => {
					writeConsoleText(action, true);
					writeConsoleObject(e);

					that.setConsoleMode();
				});
		};
		var deletePortfolio = function() {
			var action = 'portfolioGateway.deletePortfolio()';

			if (!that.portfolio()) {
				toastr.info('A "portfolio" is required.');
				return;
			}

			that.gateway.deletePortfolio(that.portfolio())
				.then((data) => {
					writeConsoleText(action, true);
					writeConsoleObject(data);
				}).catch((e) => {
					writeConsoleText(action, true);
					writeConsoleObject(e);

					that.setConsoleMode();
				});
		};
		var getPositions = function() {
			var action = 'portfolioGateway.readPositions()';

			that.gateway.readPositions(that.portfolio() || null, that.position() || null, true)
				.then((data) => {
					writeConsoleText(action, true);
					writeConsoleObject(data);
				}).catch((e) => {
					writeConsoleText(action, true);
					writeConsoleObject(e);

					that.setConsoleMode();
				});
		};
		var readPositionSummaries = function() {
			var action = 'portfolioGateway.readPositionSummaries()';

			that.gateway.readPositionSummaries(that.portfolio() || null, that.position() || null, [ 'YEARLY', 'YTD' ], 1)
				.then((data) => {
					writeConsoleText(action, true);
					writeConsoleObject(data);
				}).catch((e) => {
					writeConsoleText(action, true);
					writeConsoleObject(e);

					that.setConsoleMode();
				});
		};
		var deletePosition = function() {
			var action = 'portfolioGateway.deletePosition()';

			if (!that.portfolio()) {
				toastr.info('A "portfolio" is required.');
				return;
			}

			if (!that.position()) {
				toastr.info('A "position" is required.');
				return;
			}

			that.gateway.deletePosition(that.portfolio(), that.position())
				.then((data) => {
					writeConsoleText(action, true);
					writeConsoleObject(data);
				}).catch((e) => {
					writeConsoleText(action, true);
					writeConsoleObject(e);

					that.setConsoleMode();
				});
		};
		var getTransactions = function() {
			var action = 'portfolioGateway.readTransactions()';

			var portfolio = that.portfolio();
			var position = that.position();

			if (!portfolio) {
				toastr.info('A "portfolio" is required.');
				return;
			}

			that.gateway.readTransactions(that.portfolio(), that.position() || null)
				.then((data) => {
					writeConsoleText(action, true);
					writeConsoleObject(data);
				}).catch((e) => {
					writeConsoleText(action, true);
					writeConsoleObject(e);

					that.setConsoleMode();
				});
		};
		var getTransactionsFormatted = function() {
			var action = 'portfolioGateway.readTransactionsFormatted()';

			var portfolio = that.portfolio();
			var position = that.position();

			if (!portfolio) {
				toastr.info('A "portfolio" is required.');
				return;
			}

			that.gateway.readTransactionsFormatted(that.portfolio(), that.position() || null)
				.then((data) => {
					writeConsoleText(action, true);
					writeConsoleObject(data);
				}).catch((e) => {
					writeConsoleText(action, true);
					writeConsoleObject(e);

					that.setConsoleMode();
				});
		};
		var createBuyTransaction = function() {
			var action = 'portfolioGateway.createTransaction()';

			if (!that.portfolio()) {
				toastr.info('A "portfolio" is required.');
				return;
			}

			var transaction = {
				portfolio: that.portfolio(),
				position: that.position() || null,
				type: TransactionType.BUY,
				instrument: {
					name: 'International Business Machines',
					currency: Currency.USD,
					symbol: {
						barchart: 'IBM',
						display: 'IBM'
					}
				},
				currency: Currency.CAD,
				date: Day.getToday(),
				price: Decimal.parse(5),
				quantity: Decimal.parse(100),
				fee: Decimal.ZERO
			};

			that.gateway.createTransaction(transaction)
				.then((data) => {
					writeConsoleText(action, true);
					writeConsoleObject(data);

					that.position(data.position);
				}).catch((e) => {
					writeConsoleText(action, true);
					writeConsoleObject(e);

					that.setConsoleMode();
				});
		};
		var createSellTransaction = function() {
			var action = 'portfolioGateway.createTransaction()';

			if (!that.portfolio()) {
				toastr.info('A "portfolio" is required.');
				return;
			}

			if (!that.position()) {
				toastr.info('A "position" is required.');
				return;
			}

			var transaction = {
				portfolio: that.portfolio(),
				position: that.position(),
				type: TransactionType.SELL,
				currency: Currency.CAD,
				date: Day.getToday(),
				price: Decimal.parse(5),
				quantity: Decimal.parse(100),
				fee: Decimal.ZERO
			};

			that.gateway.createTransaction(transaction)
				.then((data) => {
					writeConsoleText(action, true);
					writeConsoleObject(data);
				}).catch((e) => {
					writeConsoleText(action, true);
					writeConsoleObject(e);

					that.setConsoleMode();
				});
		};
		var createBuyShortTransaction = function() {
			var action = 'portfolioGateway.createTransaction()';

			if (!that.portfolio()) {
				toastr.info('A "portfolio" is required.');
				return;
			}

			var transaction = {
				portfolio: that.portfolio(),
				position: that.position() || null,
				type: TransactionType.BUY_SHORT,
				instrument: {
					name: 'International Business Machines',
					currency: Currency.USD,
					symbol: {
						barchart: 'IBM',
						display: 'IBM'
					}
				},
				currency: Currency.CAD,
				date: Day.getToday(),
				price: Decimal.parse(5),
				quantity: Decimal.parse(100),
				fee: Decimal.ZERO
			};

			that.gateway.createTransaction(transaction)
				.then((data) => {
					writeConsoleText(action, true);
					writeConsoleObject(data);
				}).catch((e) => {
					writeConsoleText(action, true);
					writeConsoleObject(e);

					that.setConsoleMode();
				});
		};
		var createSellShortTransaction = function() {
			var action = 'portfolioGateway.createTransaction()';

			if (!that.portfolio()) {
				toastr.info('A "portfolio" is required.');
				return;
			}

			if (!that.position()) {
				toastr.info('A "position" is required.');
				return;
			}

			var transaction = {
				portfolio: that.portfolio(),
				position: that.position(),
				type: TransactionType.SELL_SHORT,
				instrument: {
					name: 'International Business Machines',
					currency: Currency.USD,
					symbol: {
						barchart: 'IBM',
						display: 'IBM'
					}
				},
				currency: Currency.CAD,
				date: Day.getToday(),
				price: Decimal.parse(5),
				quantity: Decimal.parse(100),
				fee: Decimal.ZERO
			};

			that.gateway.createTransaction(transaction)
				.then((data) => {
					writeConsoleText(action, true);
					writeConsoleObject(data);
				}).catch((e) => {
					writeConsoleText(action, true);
					writeConsoleObject(e);

					that.setConsoleMode();
				});
		};
		var createDividendTransaction = function() {
			var action = 'portfolioGateway.createTransaction()';

			if (!that.portfolio()) {
				toastr.info('A "portfolio" is required.');
				return;
			}

			if (!that.position()) {
				toastr.info('A "position" is required.');
				return;
			}

			var transaction = {
				portfolio: that.portfolio(),
				position: that.position(),
				type: TransactionType.DIVIDEND,
				currency: Currency.CAD,
				date: Day.getToday(),
				price: Decimal.parse(5),
				quantity: Decimal.parse(100),
				rate: Decimal.parse(0.125),
				effective: Day.getToday(),
				fee: Decimal.ZERO
			};

			that.gateway.createTransaction(transaction)
				.then((data) => {
					writeConsoleText(action, true);
					writeConsoleObject(data);
				}).catch((e) => {
					writeConsoleText(action, true);
					writeConsoleObject(e);

					that.setConsoleMode();
				});
		};
		var createDividendReinvestTransaction = function() {
			var action = 'portfolioGateway.createTransaction()';

			if (!that.portfolio()) {
				toastr.info('A "portfolio" is required.');
				return;
			}

			if (!that.position()) {
				toastr.info('A "position" is required.');
				return;
			}

			var transaction = {
				portfolio: that.portfolio(),
				position: that.position(),
				type: TransactionType.DIVIDEND_REINVEST,
				currency: Currency.CAD,
				date: Day.getToday(),
				price: Decimal.parse(5),
				quantity: Decimal.parse(100),
				rate: Decimal.parse(0.125),
				effective: Day.getToday(),
				fee: Decimal.ZERO
			};

			that.gateway.createTransaction(transaction)
				.then((data) => {
					writeConsoleText(action, true);
					writeConsoleObject(data);
				}).catch((e) => {
					writeConsoleText(action, true);
					writeConsoleObject(e);

					that.setConsoleMode();
				});
		};
		var createDividendStockTransaction = function() {
			var action = 'portfolioGateway.createTransaction()';

			if (!that.portfolio()) {
				toastr.info('A "portfolio" is required.');
				return;
			}

			if (!that.position()) {
				toastr.info('A "position" is required.');
				return;
			}

			var transaction = {
				portfolio: that.portfolio(),
				position: that.position(),
				type: TransactionType.DIVIDEND_STOCK,
				currency: Currency.CAD,
				date: Day.getToday(),
				price: Decimal.parse(5),
				quantity: Decimal.parse(100),
				rate: Decimal.parse(0.125),
				effective: Day.getToday(),
				fee: Decimal.ZERO
			};

			that.gateway.createTransaction(transaction)
				.then((data) => {
					writeConsoleText(action, true);
					writeConsoleObject(data);
				}).catch((e) => {
					writeConsoleText(action, true);
					writeConsoleObject(e);

					that.setConsoleMode();
				});
		};
		var createDistributionCashTransaction = function() {
			var action = 'portfolioGateway.createTransaction()';

			if (!that.portfolio()) {
				toastr.info('A "portfolio" is required.');
				return;
			}

			if (!that.position()) {
				toastr.info('A "position" is required.');
				return;
			}

			var transaction = {
				portfolio: that.portfolio(),
				position: that.position(),
				type: TransactionType.DISTRIBUTION_CASH,
				currency: Currency.CAD,
				date: Day.getToday(),
				price: Decimal.parse(5),
				quantity: Decimal.parse(100),
				rate: Decimal.parse(0.125),
				effective: Day.getToday(),
				fee: Decimal.ZERO
			};

			that.gateway.createTransaction(transaction)
				.then((data) => {
					writeConsoleText(action, true);
					writeConsoleObject(data);
				}).catch((e) => {
					writeConsoleText(action, true);
					writeConsoleObject(e);

					that.setConsoleMode();
				});
		};
		var createDistributionFundTransaction = function() {
			var action = 'portfolioGateway.createTransaction()';

			if (!that.portfolio()) {
				toastr.info('A "portfolio" is required.');
				return;
			}

			if (!that.position()) {
				toastr.info('A "position" is required.');
				return;
			}

			var transaction = {
				portfolio: that.portfolio(),
				position: that.position(),
				type: TransactionType.DISTRIBUTION_FUND,
				currency: Currency.CAD,
				date: Day.getToday(),
				price: Decimal.parse(5),
				quantity: Decimal.parse(100),
				rate: Decimal.parse(0.125),
				effective: Day.getToday(),
				fee: Decimal.ZERO
			};

			that.gateway.createTransaction(transaction)
				.then((data) => {
					writeConsoleText(action, true);
					writeConsoleObject(data);
				}).catch((e) => {
					writeConsoleText(action, true);
					writeConsoleObject(e);

					that.setConsoleMode();
				});
		};
		var createSplitTransaction = function() {
			var action = 'portfolioGateway.createTransaction()';

			if (!that.portfolio()) {
				toastr.info('A "portfolio" is required.');
				return;
			}

			if (!that.position()) {
				toastr.info('A "position" is required.');
				return;
			}

			var transaction = {
				portfolio: that.portfolio(),
				position: that.position(),
				type: TransactionType.SPLIT,
				currency: Currency.CAD,
				date: Day.getToday(),
				numerator: Decimal.parse(3),
				denominator: Decimal.parse(1),
				effective: Day.getToday(),
				fee: Decimal.ZERO
			};

			that.gateway.createTransaction(transaction)
				.then((data) => {
					writeConsoleText(action, true);
					writeConsoleObject(data);
				}).catch((e) => {
					writeConsoleText(action, true);
					writeConsoleObject(e);

					that.setConsoleMode();
				});
		};
		var createFeeTransaction = function() {
			var action = 'portfolioGateway.createTransaction()';

			if (!that.portfolio()) {
				toastr.info('A "portfolio" is required.');
				return;
			}

			if (!that.position()) {
				toastr.info('A "position" is required.');
				return;
			}

			var transaction = {
				portfolio: that.portfolio(),
				position: that.position(),
				type: TransactionType.FEE,
				date: Day.getToday(),
				effective: Day.getToday(),
				fee: Decimal.ZERO
			};

			that.gateway.createTransaction(transaction)
				.then((data) => {
					writeConsoleText(action, true);
					writeConsoleObject(data);
				}).catch((e) => {
					writeConsoleText(action, true);
					writeConsoleObject(e);

					that.setConsoleMode();
				});
		};
		var createFeeUnitsTransaction = function() {
			var action = 'portfolioGateway.createTransaction()';

			if (!that.portfolio()) {
				toastr.info('A "portfolio" is required.');
				return;
			}

			if (!that.position()) {
				toastr.info('A "position" is required.');
				return;
			}

			var transaction = {
				portfolio: that.portfolio(),
				position: that.position(),
				type: TransactionType.FEE_UNITS,
				date: Day.getToday(),
				effective: Day.getToday(),
				fee: Decimal.ZERO,
				price: Decimal.parse(5)
			};

			that.gateway.createTransaction(transaction)
				.then((data) => {
					writeConsoleText(action, true);
					writeConsoleObject(data);
				}).catch((e) => {
					writeConsoleText(action, true);
					writeConsoleObject(e);

					that.setConsoleMode();
				});
		};
		var createDepositTransaction = function() {
			var action = 'portfolioGateway.createTransaction()';

			if (!that.portfolio()) {
				toastr.info('A "portfolio" is required.');
				return;
			}

			if (!that.position()) {
				toastr.info('A "position" is required.');
				return;
			}

			var transaction = {
				portfolio: that.portfolio(),
				position: that.position(),
				type: TransactionType.DEPOSIT,
				date: Day.getToday(),
				amount: Decimal.parse(5),
				fee: Decimal.ZERO
			};

			that.gateway.createTransaction(transaction)
				.then((data) => {
					writeConsoleText(action, true);
					writeConsoleObject(data);
				}).catch((e) => {
					writeConsoleText(action, true);
					writeConsoleObject(e);

					that.setConsoleMode();
				});
		};
		var createWithdrawalTransaction = function() {
			var action = 'portfolioGateway.createTransaction()';

			if (!that.portfolio()) {
				toastr.info('A "portfolio" is required.');
				return;
			}

			if (!that.position()) {
				toastr.info('A "position" is required.');
				return;
			}

			var transaction = {
				portfolio: that.portfolio(),
				position: that.position(),
				type: TransactionType.WITHDRAWAL,
				date: Day.getToday(),
				amount: Decimal.parse(5),
				fee: Decimal.ZERO
			};

			that.gateway.createTransaction(transaction)
				.then((data) => {
					writeConsoleText(action, true);
					writeConsoleObject(data);
				}).catch((e) => {
					writeConsoleText(action, true);
					writeConsoleObject(e);

					that.setConsoleMode();
				});
		};
		var createValuationTransaction = function() {
			var action = 'portfolioGateway.createTransaction()';

			if (!that.portfolio()) {
				toastr.info('A "portfolio" is required.');
				return;
			}

			if (!that.position()) {
				toastr.info('A "position" is required.');
				return;
			}

			var transaction = {
				portfolio: that.portfolio(),
				position: that.position(),
				type: TransactionType.VALUATION,
				date: Day.getToday(),
				value: Decimal.parse(5),
				fee: Decimal.ZERO
			};

			that.gateway.createTransaction(transaction)
				.then((data) => {
					writeConsoleText(action, true);
					writeConsoleObject(data);
				}).catch((e) => {
					writeConsoleText(action, true);
					writeConsoleObject(e);

					that.setConsoleMode();
				});
		};
		var createIncomeTransaction = function() {
			var action = 'portfolioGateway.createTransaction()';

			if (!that.portfolio()) {
				toastr.info('A "portfolio" is required.');
				return;
			}

			if (!that.position()) {
				toastr.info('A "position" is required.');
				return;
			}

			var transaction = {
				portfolio: that.portfolio(),
				position: that.position(),
				type: TransactionType.INCOME,
				date: Day.getToday(),
				income: Decimal.parse(5),
				fee: Decimal.ZERO
			};

			that.gateway.createTransaction(transaction)
				.then((data) => {
					writeConsoleText(action, true);
					writeConsoleObject(data);
				}).catch((e) => {
					writeConsoleText(action, true);
					writeConsoleObject(e);

					that.setConsoleMode();
				});
		};
		var deleteTransaction = function() {
			var action = 'portfolioGateway.deleteTransaction()';

			if (!that.portfolio()) {
				toastr.info('A "portfolio" is required.');
				return;
			}

			if (!that.position()) {
				toastr.info('A "position" is required.');
				return;
			}

			if (!that.transaction()) {
				toastr.info('A "transaction" is required.');
				return;
			}

			that.gateway.deleteTransaction(that.portfolio(), that.position(), that.transaction())
				.then((data) => {
					writeConsoleText(action, true);
					writeConsoleObject(data);
				}).catch((e) => {
					writeConsoleText(action, true);
					writeConsoleObject(e);

					that.setConsoleMode();
				});
		};

		that.modes = ko.observableArray([
			{ text: 'Get Portfolios', action: getPortfolios },
			{ text: 'Create Portfolio', action: createPortfolio },
			{ text: 'Update Portfolio', action: updatePortfolio },
			{ text: 'Delete Portfolio', action: deletePortfolio },

			{ text: 'Get Positions', action: getPositions },
			{ text: 'Get Positions Summaries', action: readPositionSummaries },
			{ text: 'Delete Position', action: deletePosition },

			{ text: 'Get Transactions', action: getTransactions },
			{ text: 'Get Transactions (Formatted)', action: getTransactionsFormatted },

			{ text: 'Create Buy Transaction', action: createBuyTransaction },
			{ text: 'Create Sell Transaction', action: createSellTransaction },
			{ text: 'Create BuyShort Transaction', action: createBuyShortTransaction },
			{ text: 'Create SellShort Transaction', action: createSellShortTransaction },
			{ text: 'Create Dividend Transaction', action: createDividendTransaction },
			{ text: 'Create Dividend Reinvest Transaction', action: createDividendReinvestTransaction },
			{ text: 'Create Dividend Stock Transaction', action: createDividendStockTransaction },
			{ text: 'Create Distribution Cash Transaction', action: createDistributionCashTransaction },
			{ text: 'Create Distribution Fund Transaction', action: createDistributionFundTransaction },
			{ text: 'Create Split Transaction', action: createSplitTransaction },
			{ text: 'Create Fee Transaction', action: createFeeTransaction },
			{ text: 'Create Fee Units Transaction', action: createFeeUnitsTransaction },
			{ text: 'Create Deposit Transaction', action: createDepositTransaction },
			{ text: 'Create Withdrawal Transaction', action: createWithdrawalTransaction },
			{ text: 'Create Valuation Transaction', action: createValuationTransaction },
			{ text: 'Create Income Transaction', action: createIncomeTransaction },

			{ text: 'Delete Transaction', action: deleteTransaction }
		]);

		that.mode = ko.observable(that.modes()[0]);


		that.canConnect = ko.computed(function() {
			return !that.connecting() && !that.connected();
		});
		that.canDisconnect = ko.computed(function() {
			return that.connected();
		});

		var writeConsoleText = function(text, clear) {
			if (clear) {
				that.console.removeAll();
			}

			that.console.push(text);
		};

		var writeConsoleObject = function(data) {
			that.console.push(JSON.stringify(data, null, 2));
		};

		that.setConsoleMode = function() {
			that.activeTemplate('portfolio-console-template');
		};

		that.connect = function() {
			that.disconnect();

			if (!that.user() || !that.userLegacy()) {
				return;
			}

			that.connecting(true);

			PortfolioGateway.forDevelopment(JwtGateway.forDevelopmentClient(that.user(), that.userLegacy()))
				.then((gateway) => {
					that.gateway = gateway;

					that.connecting(false);
					that.connected(true);

					that.setConsoleMode();

					getPortfolios();
				});
		};
		that.disconnect = function() {
			if (that.gateway === null) {
				return;
			}

			if (that.gateway) {
				that.gateway.dispose();
				that.gateway = null;
			}

			that.console.removeAll();

			that.connecting(false);
			that.connected(false);

			that.activeTemplate('disconnected-template');
		};

		that.setMode = function(mode) {
			that.mode(mode);

			that.execute();
		};
		that.execute = function() {
			that.mode().action();
		};

		that.handleLoginKeypress = function(d, e) {
			var enterKey = e.keyCode === 13;

			if (enterKey) {
				that.connect();
			}

			return !enterKey;
		};
	};

	var pageModel;

	$(document).ready(function() {
		pageModel = new PageModel();

		ko.applyBindings(pageModel, $('body')[0]);
	});
})();