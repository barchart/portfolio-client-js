(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
const assert = require('@barchart/common-js/lang/assert'),
	Enum = require('@barchart/common-js/lang/Enum');

module.exports = (() => {
	'use strict';

	/**
	 * An enumeration used to classify instruments.
	 *
	 * @public
	 * @extends {Enum}
	 * @param {String} description
	 * @param {String} alternateDescription
	 * @param {String} code
	 * @param {Boolean} canReinvest
	 * @param {Boolean} usesSymbols
	 */
	class InstrumentType extends Enum {
		constructor(code, description, alternateDescription, canReinvest, usesSymbols) {
			super(code, description);

			assert.argumentIsRequired(alternateDescription, 'alternateDescription', String);
			assert.argumentIsRequired(canReinvest, 'canReinvest', Boolean);
			assert.argumentIsRequired(usesSymbols, 'usesSymbols', Boolean);

			this._alternateDescription = alternateDescription;
			this._canReinvest = canReinvest;
			this._usesSymbols = usesSymbols;
		}

		/**
		 * A human-readable description.
		 *
		 * @public
		 * @return {String}
		 */
		get alternateDescription() {
			return this._alternateDescription;
		}

		/**
		 * Indicates if the instrument type allows automatic reinvestment.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get canReinvest() {
			return this._canReinvest;
		}

		/**
		 * Indicates if an instrument of this type can be represented by a symbol.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get usesSymbols() {
			return this._usesSymbols;
		}

		/**
		 * Cash.
		 *
		 * @public
		 * @static
		 * @returns {InstrumentType}
		 */
		static get CASH() {
			return cash;
		}

		/**
		 * An equity issue.
		 *
		 * @public
		 * @static
		 * @returns {InstrumentType}
		 */
		static get EQUITY() {
			return equity;
		}

		/**
		 * A mutual fund.
		 *
		 * @public
		 * @static
		 * @returns {InstrumentType}
		 */
		static get FUND() {
			return fund;
		}

		/**
		 * An undefined asset (e.g. a house, or a collectible, or a salvaged alien spaceship).
		 *
		 * @public
		 * @static
		 * @returns {InstrumentType}
		 */
		static get OTHER() {
			return other;
		}

		toString() {
			return '[InstrumentType]';
		}
	}

	const cash = new InstrumentType('CASH', 'cash', 'Cash', false, false);
	const equity = new InstrumentType('EQUITY', 'equity', 'Equities', true, true);
	const fund = new InstrumentType('FUND', 'mutual fund', 'Funds', true, true);
	const other = new InstrumentType('OTHER', 'other', 'Other', false, false);

	return InstrumentType;
})();

},{"@barchart/common-js/lang/Enum":16,"@barchart/common-js/lang/assert":19}],2:[function(require,module,exports){
const array = require('@barchart/common-js/lang/array'),
	assert = require('@barchart/common-js/lang/assert'),
	Day = require('@barchart/common-js/lang/Day'),
	Decimal = require('@barchart/common-js/lang/Decimal'),
	Enum = require('@barchart/common-js/lang/Enum'),
	is = require('@barchart/common-js/lang/is');

module.exports = (() => {
	'use strict';

	/**
	 * An enumeration used to define timeframes for position summaries.
	 *
	 * @public
	 * @extends {Enum}
	 * @param {String} code
	 * @param {String} description
	 * @param {Function} rangeCalculator
	 * @param {Function} startDateCalculator
	 * @param {Function} descriptionCalculator
	 */
	class PositionSummaryFrame extends Enum {
		constructor(code, description, rangeCalculator, startDateCalculator, descriptionCalculator) {
			super(code, description);

			assert.argumentIsRequired(rangeCalculator, 'rangeCalculator', Function);
			assert.argumentIsRequired(startDateCalculator, 'startDateCalculator', Function);
			assert.argumentIsRequired(descriptionCalculator, 'descriptionCalculator', Function);

			this._rangeCalculator = rangeCalculator;
			this._startDateCalculator = startDateCalculator;
			this._descriptionCalculator = descriptionCalculator;
		}

		/**
		 * Returns a human-readable description of the frame, given
		 * start and end dates.
		 *
		 * @public
		 * @return {PositionSummaryRange} range
		 * @return {String}
		 */
		describeRange(range) {
			return this._descriptionCalculator(range.start, range.end);
		}

		/**
		 * Returns the most recent ranges for the frame.
		 *
		 * @public
		 * @param {Number} periods
		 * @returns {Array.<PositionSummaryRange>}
		 */
		getRecentRanges(periods) {
			const startDate = this.getStartDate(periods);
			const transaction = { date: startDate, snapshot: { open: Decimal.ONE } };

			return this.getRanges([ transaction ]);
		}

		/**
		 * Returns the ranges for the set of {@link Transaction} objects.
		 *
		 * @public
		 * @param {Array.<Transaction>} transactions
		 * @returns {Array.<PositionSummaryRange>}
		 */
		getRanges(transactions) {
			assert.argumentIsArray(transactions, 'transactions');

			return this._rangeCalculator(getFilteredTransactions(transactions));
		}

		/**
		 * Returns the start date for a frame, a given number of periods ago.
		 *
		 * @public
		 * @param {Number} periods
		 * @returns {Day}
		 */
		getStartDate(periods) {
			assert.argumentIsRequired(periods, 'periods', Number);

			return this._startDateCalculator(periods);
		}

		/**
		 * A summary for a calendar year.
		 *
		 * @public
		 * @returns {PositionSummaryFrame}
		 */
		static get YEARLY() {
			return yearly;
		}

		/**
		 * A summary for a quarter.
		 *
		 * @public
		 * @returns {PositionSummaryFrame}
		 */
		static get QUARTERLY() {
			return quarterly;
		}

		/**
		 * A summary for a calendar month.
		 *
		 * @public
		 * @returns {PositionSummaryFrame}
		 */
		static get MONTHLY() {
			return monthly;
		}

		/**
		 * A summary the current year (to date).
		 *
		 * @public
		 * @returns {PositionSummaryFrame}
		 */
		static get YTD() {
			return ytd;
		}

		toString() {
			return '[PositionSummaryFrame]';
		}
	}

	const yearly = new PositionSummaryFrame('YEARLY', 'year', getYearlyRanges, getYearlyStartDate, getYearlyRangeDescription);
	const quarterly = new PositionSummaryFrame('QUARTER', 'quarter', getQuarterlyRanges, getQuarterlyStartDate, getQuarterlyRangeDescription);
	const monthly = new PositionSummaryFrame('MONTH', 'month', getMonthlyRanges, getMonthlyStartDate, getMonthlyRangeDescription);
	const ytd = new PositionSummaryFrame('YTD', 'year-to-date', getYearToDateRanges, getYearToDateStartDate, getYearToDateRangeDescription);

	/**
	 * The start and and date for a {@link PositionSummaryFrame}
	 *
	 * @typedef PositionSummaryRange
	 * @type {Object}
	 * @property {Day} start
	 * @property {Day} end
	 */

	function getRange(start, end) {
		return {
			start: start,
			end: end
		};
	}

	function getYearlyRanges(transactions) {
		const ranges = [ ];

		if (transactions.length !== 0) {
			const first = array.first(transactions);
			const last = array.last(transactions);

			const firstDate = first.date;
			const lastDate = last.date;

			let lastYear;

			if (last.snapshot.open.getIsZero()) {
				lastYear = last.date.year + 1;
			} else {
				lastYear = Day.getToday().year;
			}

			for (let end = new Day(firstDate.year, 12, 31); end.year < lastYear; end = end.addYears(1)) {
				ranges.push(getRange(end.subtractYears(1), end));
			}
		}

		return ranges;
	}

	function getQuarterlyRanges(transactions) {
		return [ ];
	}

	function getMonthlyRanges(transactions) {
		return [ ];
	}

	function getYearToDateRanges(transactions) {
		const ranges = [ ];

		if (transactions.length !== 0) {
			const first = array.first(transactions);
			const last = array.last(transactions);

			const currentYear = Day.getToday().year;

			if (!last.snapshot.open.getIsZero() || last.date.year === currentYear) {
				let end = new Day(Day.getToday().year, 12, 31);
				let start = end.subtractYears(1);

				ranges.push(getRange(start, end));
			}
		}

		return ranges;
	}

	function getYearlyStartDate(periods) {
		const today = Day.getToday();

		return Day.getToday()
			.subtractMonths(today.month - 1)
			.subtractDays(today.day)
			.subtractYears(periods);
	}

	function getQuarterlyStartDate(periods) {
		return null;
	}

	function getMonthlyStartDate(periods) {
		return null;
	}

	function getYearToDateStartDate(periods) {
		return null;
	}

	function getYearlyRangeDescription(start, end) {
		return end.year.toString();
	}

	function getQuarterlyRangeDescription(start, end) {
		return '';
	}

	function getMonthlyRangeDescription(start, end) {
		return '';
	}

	function getYearToDateRangeDescription(start, end) {
		return `${end.year.toString()} YTD`;
	}

	function getFilteredTransactions(transactions) {
		return transactions.reduce((filtered, transaction) => {
			if (!transaction.snapshot.open.getIsZero() || transaction.type.closing) {
				filtered.push(transaction);
			}

			return filtered;
		}, [ ]);
	}

	return PositionSummaryFrame;
})();

},{"@barchart/common-js/lang/Day":13,"@barchart/common-js/lang/Decimal":14,"@barchart/common-js/lang/Enum":16,"@barchart/common-js/lang/array":18,"@barchart/common-js/lang/assert":19,"@barchart/common-js/lang/is":21}],3:[function(require,module,exports){
const assert = require('@barchart/common-js/lang/assert'),
	Enum = require('@barchart/common-js/lang/Enum');

module.exports = (() => {
	'use strict';

	/**
	 * An enumeration item that describes a type of transaction.
	 *
	 * @public
	 * @extends {Enum}
	 * @param {String} code
	 * @param {String} description
	 * @param {String} display
	 * @param {Boolean} purchase
	 * @param {Boolean} sale
	 * @param {Boolean} income
	 * @param {Boolean} opening
	 * @param {Boolean} closing
	 */
	class TransactionType extends Enum {
		constructor(code, description, display, purchase, sale, income, opening, closing) {
			super(code, description);

			assert.argumentIsRequired(display, 'display', String);
			assert.argumentIsRequired(purchase, 'purchase', Boolean);
			assert.argumentIsRequired(sale, 'sale', Boolean);
			assert.argumentIsRequired(income, 'income', Boolean);
			assert.argumentIsRequired(opening, 'opening', Boolean);
			assert.argumentIsRequired(closing, 'closing', Boolean);

			this._display = display;
			this._purchase = purchase;
			this._sale = sale;
			this._income = income;
			this._opening = opening;
			this._closing = closing;
		}

		/**
		 * A human-readable description of the transaction type.
		 *
		 * @public
		 * @returns {String}
		 */
		get display() {
			return this._display;
		}

		/**
		 * Indicates if the transaction was a trade.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get trade() {
			return this._purchase || this._sale;
		}

		/**
		 * Indicates if the trade was a purchase.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get purchase() {
			return this._purchase;
		}

		/**
		 * Indicates if the trade was a sale.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get sale() {
			return this._sale;
		}

		/**
		 * Indicates if the transaction was an income payment.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get income() {
			return this._income;
		}

		/**
		 * Indicates if the transactions opens the position (i.e. increases its
		 * magnitude).
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get opening() {
			return this._opening;
		}

		/**
		 * Indicates if the transactions closes the position (i.e. decreases its
		 * magnitude).
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get closing() {
			return this._closing;
		}

		/**
		 * A purchase.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get BUY() {
			return buy;
		}

		/**
		 * A sale.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get SELL() {
			return sell;
		}

		/**
		 * A purchase (in a short position).
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get BUY_SHORT() {
			return buyShort;
		}

		/**
		 * A short sale.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get SELL_SHORT() {
			return sellShort;
		}

		/**
		 * A cash dividend.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get DIVIDEND() {
			return dividend;
		}

		/**
		 * A cash dividend, reinvested.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get DIVIDEND_REINVEST() {
			return dividendReinvest;
		}

		/**
		 * A stock dividend.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get DIVIDEND_STOCK() {
			return dividendStock;
		}

		/**
		 * A mutual fund distribution in cash.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get DISTRIBUTION_CASH() {
			return distributionCash;
		}

		/**
		 * A mutual fund distribution in units.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get DISTRIBUTION_FUND() {
			return distributionFund;
		}

		/**
		 * A split.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get SPLIT() {
			return split;
		}

		/**
		 * A fee.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get FEE() {
			return fee;
		}

		/**
		 * A mutual fund fee, which is paid in units.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get FEE_UNITS() {
			return feeUnits;
		}

		/**
		 * A deposit.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get DEPOSIT() {
			return deposit;
		}

		/**
		 * A withdrawal.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get WITHDRAWAL() {
			return withdrawal;
		}

		/**
		 * A system-generated withdrawal, arising from another transaction.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get DEBIT() {
			return debit;
		}

		/**
		 * A system-generated deposit, arising from another transaction.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get CREDIT() {
			return credit;
		}

		/**
		 * A valuation event.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get VALUATION() {
			return valuation;
		}

		/**
		 * Other Income.
		 *
		 * @public
		 * @static
		 * @returns {TransactionType}
		 */
		static get INCOME() {
			return income;
		}

		toString() {
			return '[TransactionType]';
		}
	}

	const buy = new TransactionType('B', 'Buy', 'Buy', true, false, false, true,  false);
	const sell = new TransactionType('S', 'Sell', 'Sell', false, true, false, false, true);
	const buyShort = new TransactionType('BS', 'Buy To Cover', 'Buy To Cover', true, false, false, false, true);
	const sellShort = new TransactionType('SS', 'Sell Short', 'Sell Short', false, true, false, true, false);
	const dividend = new TransactionType('DV', 'Dividend', 'Dividend', false, false, true, false, false);
	const dividendReinvest = new TransactionType('DX', 'Dividend (Reinvested)', 'Dividend Reinvest', false, false, false, true, false);
	const dividendStock = new TransactionType('DS', 'Dividend (Stock)', 'Dividend Stock', false, false, false, true, false);
	const split = new TransactionType('SP', 'Split', 'Split', false, false, false, true, false);
	const fee = new TransactionType('F', 'Fee', 'Fee', false, false, false, true, false);
	const feeUnits = new TransactionType('FU', 'Fee Units', 'Fee', false, false, false, false, false);

	const distributionCash = new TransactionType('DC', 'Distribution (Cash)', 'Cash Distribution', false, false, true, false, false);
	const distributionFund = new TransactionType('DF', 'Distribution (Units)', 'Unit Distribution', false, false, false, true, false);

	const deposit = new TransactionType('D', 'Deposit', 'Deposit', false, false, false, true, false);
	const withdrawal = new TransactionType('W', 'Withdrawal', 'Withdrawal', false, false, false, false, true);
	const debit = new TransactionType('DR', 'Debit', 'Debit', false, false, false, false, true);
	const credit = new TransactionType('CR', 'Credit', 'Credit', false, false, false, true, false);

	const valuation = new TransactionType('V', 'Valuation', 'Valuation', false, false, false, false, false);
	const income = new TransactionType('I', 'Income', 'Income', false, false, true, false, false);

	return TransactionType;
})();

},{"@barchart/common-js/lang/Enum":16,"@barchart/common-js/lang/assert":19}],4:[function(require,module,exports){
const array = require('@barchart/common-js/lang/array'),
	assert = require('@barchart/common-js/lang/assert'),
	ComparatorBuilder = require('@barchart/common-js/collections/sorting/ComparatorBuilder'),
	comparators = require('@barchart/common-js/collections/sorting/comparators'),
	Currency = require('@barchart/common-js/lang/Currency'),
	Decimal = require('@barchart/common-js/lang/Decimal'),
	is = require('@barchart/common-js/lang/is'),
	Rate = require('@barchart/common-js/lang/Rate'),
	Tree = require('@barchart/common-js/collections/Tree');

const PositionSummaryFrame = require('./../data/PositionSummaryFrame');

const PositionTreeDefinition = require('./definitions/PositionTreeDefinition');

const PositionGroup = require('./PositionGroup'),
	PositionItem = require('./PositionItem');

module.exports = (() => {
	'use strict';

	const DEFAULT_CURRENCY = Currency.CAD;

	/**
	 * A container for positions which groups the positions into one or more
	 * trees for aggregation and display purposes. For example, perhaps a positions
	 * grouped first by asset class then by position is desired.
	 *
	 * Furthermore, the container performs aggregation (driven primarily by price
	 * changes) for each level of grouping in the internal tree(s).
	 *
	 * @public
	 * @param {Array.<PositionTreeDefinition>} definitions
	 * @param {Array.<Object>} portfolios
	 * @param {Array.<Object>} positions
	 * @param {Array.<Object>} summaries
	 */
	class PositionContainer {
		constructor(definitions, portfolios, positions, summaries) {
			assert.argumentIsArray(definitions, 'definitions', PositionTreeDefinition, 'PositionTreeDefinition');
			assert.argumentIsArray(portfolios, 'portfolios');
			assert.argumentIsArray(positions, 'positions');
			assert.argumentIsArray(summaries, 'summaries');

			const previousSummaryFrame = PositionSummaryFrame.YEARLY;
			const previousSummaryRanges = previousSummaryFrame.getRecentRanges(0);

			const currentSummaryFrame = PositionSummaryFrame.YTD;
			const currentSummaryRange = array.last(currentSummaryFrame.getRecentRanges(0));

			this._portfolios = portfolios.reduce((map, portfolio) => {
				map[portfolio.portfolio] = portfolio;

				return map;
			}, { });

			this._summariesCurrent = summaries.reduce((map, summary) => {
				if (summary.frame === currentSummaryFrame && currentSummaryRange.start.getIsEqual(summary.start.date) && currentSummaryRange.end.getIsEqual(summary.end.date)) {
					const key = summary.position;

					map[key] = summary;
				}

				return map;
			}, { });
			
			this._summariesPrevious = summaries.reduce((map, summary) => {
				if (summary.frame === previousSummaryFrame) {
					const key = summary.position;

					if (!map.hasOwnProperty(key)) {
						map[key] = getSummaryArray(previousSummaryRanges);
					}

					const index = previousSummaryRanges.findIndex(r => r.start.getIsEqual(summary.start.date) && r.end.getIsEqual(summary.end.date));

					if (!(index < 0)) {
						map[key][index] = summary;
					}
				}

				return map;
			}, { });

			this._items = positions.reduce((items, position) => {
				const portfolio = this._portfolios[position.portfolio];

				if (position) {
					const currentSummary = this._summariesCurrent[position.position] || null;
					const previousSummaries = this._summariesPrevious[position.position] || getSummaryArray(previousSummaryRanges);

					items.push(new PositionItem(portfolio, position, currentSummary, previousSummaries));
				}

				return items;
			}, [ ]);

			this._symbols = this._items.reduce((map, item) => {
				const symbol = extractSymbolForBarchart(item.position);

				if (symbol) {
					if (!map.hasOwnProperty(symbol)) {
						map[symbol] = [ ];
					}

					map[symbol].push(item);
				}

				return map;
			}, { });

			this._currencies = this._items.reduce((map, item) => {
				const position = item.position;

				if (position.instrument && position.instrument.currency) {
					const currency = position.instrument.currency;
					const code = currency.code;

					if (!map.hasOwnProperty(code)) {
						map[code] = [ ];
					}

					map[code].push(item);
				}

				return map;
			}, { });

			this._forexSymbols = Object.keys(this._currencies).reduce((symbols, code) => {
				if (code !== DEFAULT_CURRENCY.code) {
					symbols.push(`^${DEFAULT_CURRENCY.code}${code}`);
				}

				return symbols;
			}, [ ]);

			this._forexQuotes = this._forexSymbols.map((symbol) => {
				return Rate.fromPair(Decimal.ONE, symbol);
			});
			
			this._trees = definitions.reduce((map, treeDefinition) => {
				const tree = new Tree();

				const createGroups = (currentTree, items, levelDefinitions) => {
					if (levelDefinitions.length === 0) {
						return;
					}

					const parent = currentTree.getValue() || null;

					const levelDefinition = levelDefinitions[0];

					const populatedObjects = array.groupBy(items, levelDefinition.keySelector);
					const populatedGroups = Object.keys(populatedObjects).reduce((list, key) => {
						const items = populatedObjects[key];
						const first = items[0];

						list.push(new PositionGroup(this, parent, items, levelDefinition.currencySelector(first), key, levelDefinition.descriptionSelector(first), levelDefinition.single && items.length === 1));

						return list;
					}, [ ]);

					const missingGroups = array.difference(levelDefinition.requiredGroups.map(group => group.key), populatedGroups.map(group => group.key))
						.map((key) => {
							return levelDefinition.requiredGroups.find(g => g.key === key);
						});

					const empty = missingGroups.map((group) => {
						return new PositionGroup(this, parent, [ ], group.currency, group.key, group.description);
					});

					const compositeGroups = populatedGroups.concat(empty);

					let builder;

					if (levelDefinition.requiredGroups.length !== 0) {
						const ordering = levelDefinition.requiredGroups.reduce((map, group, index) => {
							map[group.description] = index;

							return map;
						}, { });

						const getIndex = (description) => {
							if (ordering.hasOwnProperty(description)) {
								return ordering[description];
							} else {
								return Number.MAX_VALUE;
							}
						};

						builder = ComparatorBuilder.startWith((a, b) => {
							return comparators.compareNumbers(getIndex(a.description), getIndex(b.description));
						}).thenBy((a, b) => {
							return comparators.compareStrings(a.description, b.description);
						});
					} else {
						builder = ComparatorBuilder.startWith((a, b) => {
							return comparators.compareStrings(a.description, b.description);
						});
					}

					compositeGroups.sort(builder.toComparator());

					compositeGroups.forEach((group) => {
						const childTree = currentTree.addChild(group);

						group.registerMarketPercentChangeHandler(() => {
							currentTree.walk((childGroup) => childGroup.refreshMarketPercent());
						});

						createGroups(childTree, group.items, array.dropLeft(levelDefinitions));
					});
				};

				createGroups(tree, this._items, treeDefinition.definitions);
				
				map[treeDefinition.name] = tree;

				return map;
			}, { });
		}

		get defaultCurrency() {
			return this._defaultCurrency;
		}
		
		getPositionSymbols(display) {
			const symbols = this._items.reduce((symbols, item) => {
				const position = item.position;

				let symbol;

				if (display) {
					symbol = extractSymbolForDisplay(position);
				} else {
					symbol = extractSymbolForBarchart(position);
				}

				if (symbol !== null) {
					symbols.push(symbol);
				}

				return symbols;
			}, [ ]);

			return array.unique(symbols);
		}

		setPositionQuote(symbol, quote) {
			assert.argumentIsRequired(symbol, 'symbol', String);
			assert.argumentIsRequired(quote, 'quote', Object);

			if (this._symbols.hasOwnProperty(symbol)) {
				this._symbols[symbol].forEach(item => item.setQuote(quote));
			}
		}

		getForexSymbols() {
			return this._forexSymbols;
		}

		getForexQuotes() {
			return this._forexQuotes;
		}

		setForexQuote(symbol, quote) {
			assert.argumentIsRequired(symbol, 'symbol', String);
			assert.argumentIsRequired(quote, 'quote', Object);

			const rate = Rate.fromPair(quote.lastPrice, symbol);

			const index = this._forexQuotes.findIndex(existing => existing.formatPair() === rate.formatPair());

			if (index < 0) {
				this._forexQuotes.push(rate);
			} else {
				this._forexQuotes[index] = rate;
			}

			Object.keys(this._trees).forEach(key => this._trees[key].walk(group => group.setForexRate(rate), true, false));
		}

		setPositionFundamentals(symbol, data) {
			return;
		}

		setNewsArticleExists(symbol, exists) {
			assert.argumentIsRequired(symbol, 'symbol', String);
			assert.argumentIsRequired(exists, 'exists', Boolean);

			if (this._symbols.hasOwnProperty(symbol)) {
				this._symbols[symbol].forEach(item => item.setNewsArticleExists(exists));
			}
		}

		getGroup(name, keys) {
			assert.argumentIsRequired(name, 'name', String);
			assert.argumentIsArray(keys, 'keys', Number);

			return findNode(this._trees[name], keys).getValue();
		}

		getGroups(name, keys) {
			assert.argumentIsRequired(name, 'name', String);
			assert.argumentIsArray(keys, 'keys', Number);

			return findNode(this._trees[name], keys).getChildren().map(node => node.getValue());
		}

		startTransaction(name, executor) {
			assert.argumentIsRequired(name, 'name', String);
			assert.argumentIsRequired(executor, 'executor', Function);

			assert.argumentIsRequired(executor, 'executor', Function);

			this._trees[name].walk(group => group.setSuspended(true), false, false);

			executor(this);

			this._trees[name].walk(group => group.setSuspended(false), false, false);
		}

		toString() {
			return '[PositionContainer]';
		}
	}

	function findNode(tree, keys) {
		return keys.reduce((tree, key) => tree.findChild(group => group.key === key), tree);
	}

	function getSummaryArray(ranges) {
		return ranges.map(range => null);
	}

	function extractSymbolForBarchart(position) {
		if (position.instrument && position.instrument.symbol && position.instrument.symbol.barchart) {
			return position.instrument.symbol.barchart;
		} else {
			return null;
		}
	}

	function extractSymbolForDisplay(position) {
		if (position.instrument && position.instrument.symbol && position.instrument.symbol.display) {
			return position.instrument.symbol.display;
		} else {
			return null;
		}
	}


	return PositionContainer;
})();

},{"./../data/PositionSummaryFrame":2,"./PositionGroup":5,"./PositionItem":6,"./definitions/PositionTreeDefinition":8,"@barchart/common-js/collections/Tree":9,"@barchart/common-js/collections/sorting/ComparatorBuilder":10,"@barchart/common-js/collections/sorting/comparators":11,"@barchart/common-js/lang/Currency":12,"@barchart/common-js/lang/Decimal":14,"@barchart/common-js/lang/Rate":17,"@barchart/common-js/lang/array":18,"@barchart/common-js/lang/assert":19,"@barchart/common-js/lang/is":21}],5:[function(require,module,exports){
const assert = require('@barchart/common-js/lang/assert'),
	Currency = require('@barchart/common-js/lang/Currency'),
	Decimal = require('@barchart/common-js/lang/Decimal'),
	Event = require('@barchart/common-js/messaging/Event'),
	formatter = require('@barchart/common-js/lang/formatter'),
	is = require('@barchart/common-js/lang/is'),
	Rate = require('@barchart/common-js/lang/Rate');

module.exports = (() => {
	'use strict';

	/**
	 * @public
	 */
	class PositionGroup {
		constructor(container, parent, items, currency, key, description, single) {
			this._container = container;
			this._parent = parent || null;

			this._items = items;
			this._currency = currency || Currency.CAD;
			this._bypassCurrencyTranslation = false;

			this._key = key;
			this._description = description;

			this._single = is.boolean(single) && single;

			this._excluded = false;
			this._suspended = false;

			this._marketPercentChangeEvent = new Event(this);

			this._dataFormat = { };
			this._dataActual = { };

			this._dataFormat.key = this._key;
			this._dataFormat.description = this._description;
			this._dataFormat.newsExists = false;
			this._dataFormat.quantity = null;
			this._dataFormat.basisPrice = null;

			this._dataActual.key = this._key;
			this._dataActual.description = this._description;
			this._dataActual.newsExists = false;
			this._dataActual.quantity = null;
			this._dataActual.basisPrice = null;

			if (this._single) {
				const item = items[0];

				this._dataFormat.portfolio = item.portfolio.portfolio;
				this._dataFormat.position = item.position.position;
				this._dataFormat.instrument = item.position.instrument;
			} else {
				this._dataFormat.portfolio = null;
				this._dataFormat.position = null;
				this._dataFormat.instrument = null;
			}

			this._dataFormat.quoteLast = null;
			this._dataFormat.quoteOpen = null;
			this._dataFormat.quoteHigh = null;
			this._dataFormat.quoteLow = null;
			this._dataFormat.quoteChange = null;
			this._dataFormat.quoteChangePercent = null;
			this._dataFormat.quoteTime = null;
			this._dataFormat.quoteVolume = null;

			this._dataActual.currentPrice = null;
			this._dataActual.previousPrice = null;
			this._dataActual.basis = null;
			this._dataActual.realized = null;
			this._dataActual.income = null;
			this._dataActual.market = null;
			this._dataActual.marketPercent = null;
			this._dataActual.unrealized = null;
			this._dataActual.unrealizedToday = null;
			this._dataActual.total = null;
			this._dataActual.summaryTotalCurrent = null;
			this._dataActual.summaryTotalPrevious = null;

			this._dataFormat.currentPrice = null;
			this._dataFormat.previousPrice = null;
			this._dataFormat.basis = null;
			this._dataFormat.realized = null;
			this._dataFormat.income = null;
			this._dataFormat.market = null;
			this._dataFormat.marketPercent = null;
			this._dataFormat.marketDirection = null;
			this._dataFormat.unrealized = null;
			this._dataFormat.unrealizedPercent = null;
			this._dataFormat.unrealizedNegative = false;
			this._dataFormat.unrealizedToday = null;
			this._dataFormat.unrealizedTodayNegative = false;
			this._dataFormat.total = null;
			this._dataFormat.totalNegative = false;
			this._dataFormat.summaryTotalCurrent = null;
			this._dataActual.summaryTotalCurrentNegative = false;
			this._dataFormat.summaryTotalPrevious = null;
			this._dataFormat.summaryTotalPreviousNegative = false;

			this._items.forEach((item) => {
				item.registerQuoteChangeHandler((quote, sender) => {
					if (this._single) {
						const precision = sender.position.instrument.currency.precision;

						this._dataActual.currentPrice = quote.lastPrice;
						this._dataFormat.currentPrice = formatNumber(this._dataActual.currentPrice, precision);

						this._dataFormat.quoteLast = formatNumber(quote.previousPrice, precision);
						this._dataFormat.quoteOpen = formatNumber(quote.openPrice, precision);
						this._dataFormat.quoteHigh = formatNumber(quote.highPrice, precision);
						this._dataFormat.quoteLow = formatNumber(quote.lowPrice, precision);
						this._dataFormat.quoteChange = formatNumber(quote.priceChange, precision);
						this._dataFormat.quoteChangePercent = formatPercent(new Decimal(quote.percentChange || 0), 2);
						this._dataFormat.quoteTime = quote.timeDisplay;
						this._dataFormat.quoteVolume = formatNumber(quote.volume, 0);
					} else {
						this._dataActual.currentPrice = null;
						this._dataFormat.currentPrice = null;
					}

					calculatePriceData(this, this._container.getForexQuotes(), sender, false);
				});

				if (this._single) {
					item.registerNewsExistsChangeHandler((exists, sender) => {
						this._dataFormat.newsExists = exists;
						this._dataFormat.newsExists = exists;
					});
				}
			});

			this.refresh();
		}

		get key() {
			return this._key;
		}

		get description() {
			return this._description;
		}

		get currency() {
			return this._currency;
		}

		get items() {
			return this._items;
		}

		get data() {
			return this._dataFormat;
		}

		get actual() {
			return this._dataActual;
		}

		get single() {
			return this._single;
		}

		get suspended() {
			return this._suspended;
		}

		get excluded() {
			return this._excluded;
		}

		setForexRate(rate) {
			if (!this._bypassCurrencyTranslation) {
				this.refresh();
			}
		}

		setExcluded(value) {
			assert.argumentIsRequired(value, 'value', Boolean);

			if (this._excluded !== value) {
				this._container.startTransaction(() => {
					this._items.forEach((item) => {
						item.setExcluded(value);
					});
				});
			}
		}

		setSuspended(value) {
			assert.argumentIsRequired(value, 'value', Boolean);

			if (this._suspended !== value) {
				if (this._suspended = value) {
					this.refresh();
				}
			}
		}

		refresh() {
			const rates = this._container.getForexQuotes();

			calculateStaticData(this, rates);
			calculatePriceData(this, rates, null, true);
		}

		refreshMarketPercent() {
			calculateMarketPercent(this, this._container.getForexQuotes(), true);
		}

		registerMarketPercentChangeHandler(handler) {
			this._marketPercentChangeEvent.register(handler);
		}

		toString() {
			return '[PositionGroup]';
		}
	}

	function formatNumber(number, precision) {
		if (is.number(number)) {
			return formatter.numberToString(number, precision, ',', false);
		} else {
			return '—';
		}
	}

	function formatDecimal(decimal, precision) {
		if (decimal !== null) {
			return formatNumber(decimal.toFloat(), precision);
		} else {
			return '—';
		}
	}

	function formatPercent(decimal, precision) {
		if (decimal !== null) {
			return formatDecimal(decimal.multiply(100), precision) + '%';
		} else {
			return '—';
		}
	}

	function formatCurrency(decimal, currency) {
		return formatDecimal(decimal, currency.precision);
	}

	function calculateStaticData(group, rates) {
		if (group.suspended) {
			return;
		}

		const actual = group._dataActual;
		const format = group._dataFormat;

		const currency = group.currency;
		
		const items = group._items;

		group._bypassCurrencyTranslation = items.every(item => item.currency === currency);

		const translate = (item, value) => {
			let translated;

			if (item.currency !== currency) {
				translated = Rate.convert(value, item.currency, currency, ...rates);
			} else {
				translated = value;
			}

			return translated;
		};

		let updates = items.reduce((updates, item) => {
			updates.basis = updates.basis.add(translate(item, item.data.basis));
			updates.realized = updates.realized.add(translate(item, item.data.realized));
			updates.unrealized = updates.unrealized.add(translate(item, item.data.unrealized));
			updates.income = updates.income.add(translate(item, item.data.income));
			updates.summaryTotalCurrent = updates.summaryTotalCurrent.add(translate(item, item.data.summaryTotalCurrent));
			updates.summaryTotalPrevious = updates.summaryTotalPrevious.add(translate(item, item.data.summaryTotalPrevious));

			return updates;
		}, {
			basis: Decimal.ZERO,
			realized: Decimal.ZERO,
			unrealized: Decimal.ZERO,
			income: Decimal.ZERO,
			summaryTotalCurrent: Decimal.ZERO,
			summaryTotalPrevious: Decimal.ZERO
		});

		actual.basis = updates.basis;
		actual.realized = updates.realized;
		actual.unrealized = updates.unrealized;
		actual.income = updates.income;
		actual.summaryTotalCurrent = updates.summaryTotalCurrent;
		actual.summaryTotalPrevious = updates.summaryTotalPrevious;

		format.basis = formatCurrency(actual.basis, currency);
		format.realized = formatCurrency(actual.basis, currency);
		format.unrealized = formatCurrency(actual.unrealized, currency);
		format.income = formatCurrency(actual.income, currency);
		format.summaryTotalCurrent = formatCurrency(updates.summaryTotalCurrent, currency);
		format.summaryTotalPrevious = formatCurrency(updates.summaryTotalPrevious, currency);
		format.summaryTotalPreviousNegative = updates.summaryTotalPrevious.getIsNegative();

		calculateUnrealizedPercent(group);

		if (group.single) {
			const item = group._items[0];

			actual.quantity = item.position.snapshot.open;
			actual.basisPrice = item.data.basisPrice;

			format.quantity = formatDecimal(actual.quantity, 2);
			format.basisPrice = formatCurrency(actual.basisPrice, currency);
		}
	}

	function calculatePriceData(group, rates, item, forceRefresh) {
		if (group.suspended) {
			return;
		}

		const parent = group._parent;

		const actual = group._dataActual;
		const format = group._dataFormat;

		const currency = group.currency;

		const translate = (item, value) => {
			let translated;

			if (item.currency !== currency) {
				translated = Rate.convert(value, item.currency, currency, ...rates);
			} else {
				translated = value;
			}

			return translated;
		};

		const refresh = (is.boolean(forceRefresh) && forceRefresh) || (actual.market === null || actual.unrealizedToday === null || actual.total === null);

		let updates;

		if (refresh) {
			const items = group._items;

			updates = items.reduce((updates, item) => {
				updates.market = updates.market.add(translate(item, item.data.market));
				updates.unrealized = updates.unrealized.add(translate(item, item.data.unrealized));
				updates.unrealizedToday = updates.unrealizedToday.add(translate(item, item.data.unrealizedToday));
				updates.summaryTotalCurrent = updates.summaryTotalCurrent.add(translate(item, item.data.summaryTotalCurrent));

				return updates;
			}, {
				market: Decimal.ZERO,
				marketDirection: unchanged,
				unrealized: Decimal.ZERO,
				unrealizedToday: Decimal.ZERO,
				summaryTotalCurrent: Decimal.ZERO

			});
		} else {
			updates = {
				market: actual.market.add(translate(item, item.data.marketChange)),
				marketDirection: { up: item.data.marketChange.getIsPositive(), down: item.data.marketChange.getIsNegative() },
				unrealized: actual.unrealized.add(translate(item, item.data.unrealizedChange)),
				unrealizedToday: actual.unrealizedToday.add(translate(item, item.data.unrealizedTodayChange)),
				summaryTotalCurrent: actual.summaryTotalCurrent.add(translate(item, item.data.summaryTotalCurrentChange))
			};
		}
		
		if (parent !== null) {
			const parentData = parent._dataActual;

			if (parentData.market !== null && !parentData.market.getIsZero()) {
				updates.marketPercent = updates.market.divide(parentData.market);
			} else {
				updates.marketPercent = null;
			}
		} else {
			updates.marketPercent = null;
		}

		actual.market = updates.market;
		actual.unrealized = updates.unrealized;
		actual.unrealizedToday = updates.unrealizedToday;
		actual.summaryTotalCurrent = updates.summaryTotalCurrent;
		actual.total = updates.unrealizedToday.add(actual.realized).add(actual.income);
		
		format.market = formatCurrency(actual.market, currency);
		
		if (updates.marketDirection.up || updates.marketDirection.down) {
			format.marketDirection = unchanged;
			setTimeout(() => format.marketDirection = updates.marketDirection, 0);
		}

		format.unrealized = formatCurrency(actual.unrealized, currency);
		format.unrealizedNegative = actual.unrealized.getIsNegative();

		format.unrealizedToday = formatCurrency(actual.unrealizedToday, currency);
		format.unrealizedTodayNegative = actual.unrealizedToday.getIsNegative();

		format.summaryTotalCurrent = formatCurrency(actual.summaryTotalCurrent, currency);
		format.summaryTotalCurrentNegative = actual.summaryTotalCurrent.getIsNegative();

		format.total = formatCurrency(actual.total, currency);
		format.totalNegative = actual.total.getIsNegative();
		
		calculateMarketPercent(group, rates, false);
		calculateUnrealizedPercent(group);
	}

	function calculateMarketPercent(group, rates, silent) {
		if (group.suspended) {
			return;
		}

		const parent = group._parent;

		const actual = group._dataActual;
		const format = group._dataFormat;
		
		let marketPercent;
		
		if (parent !== null) {
			const parentData = parent._dataActual;

			if (parentData.market !== null && !parentData.market.getIsZero()) {
				let numerator;

				if (group.currency !== parent.currency) {
					numerator = Rate.convert(actual.market, group.currency, parent.currency, ...rates);
				} else {
					numerator = actual.market;
				}

				marketPercent = numerator.divide(parentData.market);
			} else {
				marketPercent = null;
			}
		} else {
			marketPercent = null;
		}

		actual.marketPercent = marketPercent;
		
		format.marketPercent = formatPercent(actual.marketPercent, 2);
		
		if (!silent) {
			group._marketPercentChangeEvent.fire(group);
		}
	}

	function calculateUnrealizedPercent(group) {
		const actual = group._dataActual;
		const format = group._dataFormat;

		if (actual.basis.getIsZero()) {
			actual.unrealizedPercent = null;
			format.unrealizedPercent = '—';
		} else {
			actual.unrealizedPercent = actual.unrealized.divide(actual.basis);
			format.unrealizedPercent = formatPercent(actual.unrealizedPercent, 2);
		}
	}

	const unchanged = { up: false, down: false };

	return PositionGroup;
})();

},{"@barchart/common-js/lang/Currency":12,"@barchart/common-js/lang/Decimal":14,"@barchart/common-js/lang/Rate":17,"@barchart/common-js/lang/assert":19,"@barchart/common-js/lang/formatter":20,"@barchart/common-js/lang/is":21,"@barchart/common-js/messaging/Event":23}],6:[function(require,module,exports){
const array = require('@barchart/common-js/lang/array'),
	assert = require('@barchart/common-js/lang/assert'),
	Currency = require('@barchart/common-js/lang/Currency'),
	Decimal = require('@barchart/common-js/lang/Decimal'),
	Event = require('@barchart/common-js/messaging/Event'),
	is = require('@barchart/common-js/lang/is');

const InstrumentType = require('./../data/InstrumentType');

module.exports = (() => {
	'use strict';

	/**
	 * @public
	 */
	class PositionItem {
		constructor(portfolio, position, currentSummary, previousSummaries) {
			this._portfolio = portfolio;
			this._position = position;
			this._currency = position.instrument.currency || Currency.CAD;

			this._currentSummary = currentSummary || null;
			this._previousSummaries = previousSummaries || [ ];

			this._data = { };

			this._data.basis = null;

			this._currentQuote = null;
			this._previousQuote = null;

			this._data.currentPrice = null;
			this._data.previousPrice = null;

			this._data.market = null;
			this._data.marketChange = null;

			this._data.unrealizedToday = null;
			this._data.unrealizedTodayChange = null;

			this._data.unrealized = null;
			this._data.unrealizedChange = null;
			
			this._data.summaryTotalCurrent = null;
			this._data.summaryTotalCurrentChange = null;

			this._data.summaryTotalPrevious = null;

			this._data.realized = null;
			this._data.income = null;
			this._data.basisPrice = null;

			this._data.newsExists = false;

			this._excluded = false;

			calculateStaticData(this);
			calculatePriceData(this, null);

			this._quoteChangedEvent = new Event(this);
			this._excludedChangeEvent = new Event(this);
			this._newsExistsChangedEvent = new Event(this);
		}

		get portfolio() {
			return this._portfolio;
		}

		get position() {
			return this._position;
		}

		get currency() {
			return this._currency;
		}

		get currentSummary() {
			return this._currentSummary;
		}
		
		get previousSummaries() {
			return this._previousSummaries;
		}

		get data() {
			return this._data;
		}

		get quote() {
			return this._currentQuote;
		}

		get excluded() {
			return this._excluded;
		}

		setQuote(quote) {
			assert.argumentIsRequired(quote, 'quote', Object);

			if (this._previousQuote === null || this._previousQuote.lastPrice !== quote.lastPrice) {
				calculatePriceData(this, quote.lastPrice);

				this._previousQuote = this._currentQuote;
				this._currentQuote = quote;

				this._quoteChangedEvent.fire(this._currentQuote);
			}
		}

		setExcluded(value) {
			assert.argumentIsRequired(value, 'value', Boolean);

			if (this._excluded !== value) {
				this._excludedChangeEvent.fire(this._excluded = value);
			}
		}

		setNewsArticleExists(value) {
			assert.argumentIsRequired(value, 'value', Boolean);

			if (this._data.newsExists !== value) {
				this._newsExistsChangedEvent.fire(this._data.newsExists = value);
			}
		}

		registerQuoteChangeHandler(handler) {
			this._quoteChangedEvent.register(handler);
		}

		registerExcludedChangeHandler(handler) {
			this._excludedChangeEvent.register(handler);
		}

		registerNewsExistsChangeHandler(handler) {
			this._newsExistsChangedEvent.register(handler);
		}

		toString() {
			return '[PositionItem]';
		}
	}

	function calculateStaticData(item) {
		const position = item.position;
		const snapshot = item.position.snapshot;
		const previousSummaries = item.previousSummaries;

		const data = item._data;

		data.previousPrice = position.previous || null;

		let basis;

		if (snapshot.basis) {
			basis = snapshot.basis.opposite();
		} else {
			basis = Decimal.ZERO;
		}

		data.basis = basis;

		data.realized = snapshot.gain;
		data.unrealized = Decimal.ZERO;

		data.income = snapshot.income;

		data.summaryTotalCurrent = calculateSummaryTotal(item.currentSummary);
		data.summaryTotalPrevious = calculateSummaryTotal(array.last(previousSummaries));

		if (snapshot.open.getIsZero()) {
			data.basisPrice = Decimal.ZERO;
		} else {
			data.basisPrice = basis.divide(snapshot.open);
		}
	}

	function calculatePriceData(item, price) {
		const position = item.position;
		const snapshot = item.position.snapshot;

		const data = item._data;

		let market;

		if (position.instrument.type === InstrumentType.OTHER) {
			market = snapshot.value;
		} else if (position.instrument.type === InstrumentType.CASH) {
			market = snapshot.open;
		} else {
			if (price) {
				market = snapshot.open.multiply(price);
			} else {
				market = snapshot.value;
			}
		}

		let marketChange;

		if (data.market === null) {
			marketChange = market;
		} else {
			marketChange = market.subtract(data.market);
		}

		data.market = market;
		data.marketChange = marketChange;

		let unrealizedToday;
		let unrealizedTodayChange;

		if (data.previousPrice && price) {
			unrealizedToday = market.subtract(snapshot.open.multiply(data.previousPrice));

			if (data.unrealizedToday !== null) {
				unrealizedTodayChange = unrealizedToday.subtract(data.unrealizedToday);
			} else {
				unrealizedTodayChange = unrealizedToday;
			}
		} else {
			unrealizedToday = Decimal.ZERO;
			unrealizedTodayChange = Decimal.ZERO;
		}

		data.unrealizedToday = unrealizedToday;
		data.unrealizedTodayChange = unrealizedTodayChange;

		const summary = item.currentSummary;

		if (summary && price) {
			const period = summary.period;

			let unrealized = summary.end.open.multiply(price).add(summary.end.basis);
			let unrealizedChange;

			if (data.unrealizedToday !== null) {
				unrealizedChange = unrealized.subtract(data.unrealized);
			} else {
				unrealizedChange = Decimal.ZERO;
			}

			let summaryTotalCurrent = period.realized.add(period.income).add(unrealized);
			let summaryTotalCurrentChange;

			if (data.summaryTotalCurrent !== null) {
				summaryTotalCurrentChange = summaryTotalCurrent.subtract(data.summaryTotalCurrent);
			}  else {
				summaryTotalCurrentChange = Decimal.ZERO;
			}

			data.summaryTotalCurrent = summaryTotalCurrent;
			data.summaryTotalCurrentChange = summaryTotalCurrentChange;

			data.unrealized = unrealized;
			data.unrealizedChange = unrealizedChange;
		} else {
			data.summaryTotalCurrentChange = Decimal.ZERO;

			data.unrealized = Decimal.ZERO;
			data.unrealizedChange = Decimal.ZERO;
		}
	}
	
	function calculateSummaryTotal(summary) {
		let returnRef;
		
		if (summary) {
			const period = summary.period;

			returnRef = period.realized.add(period.income).add(period.unrealized);
		} else {
			returnRef = Decimal.ZERO;
		}
		
		return returnRef;
	}

	return PositionItem;
})();

},{"./../data/InstrumentType":1,"@barchart/common-js/lang/Currency":12,"@barchart/common-js/lang/Decimal":14,"@barchart/common-js/lang/array":18,"@barchart/common-js/lang/assert":19,"@barchart/common-js/lang/is":21,"@barchart/common-js/messaging/Event":23}],7:[function(require,module,exports){
const assert = require('@barchart/common-js/lang/assert'),
	is = require('@barchart/common-js/lang/is');

module.exports = (() => {
	'use strict';

	/**
	 * Defines a grouping level within a tree of positions. A level could represent a
	 * group of multiple positions (e.g. all equities or all positions for a portfolio).
	 * Alternately, a level could also represent a single position.
	 *
	 * @public
	 * @param {String} name
	 * @param {PositionLevelDefinition~keySelector} keySelector
	 * @param {PositionLevelDefinition~descriptionSelector} descriptionSelector
	 * @param {PositionLevelDefinition~currencySelector} currencySelector
	 * @param {Array.<PositionLevelDefinition~RequiredGroup>=} requiredGroups
	 * @param {Boolean=} single
	 */
	class PositionLevelDefinition {
		constructor(name, keySelector, descriptionSelector, currencySelector, requiredGroups, single) {
			assert.argumentIsRequired(name, 'name', String);
			assert.argumentIsRequired(keySelector, 'keySelector', Function);
			assert.argumentIsRequired(descriptionSelector, 'descriptionSelector', Function);
			assert.argumentIsRequired(currencySelector, 'currencySelector', Function);

			if (requiredGroups) {
				assert.argumentIsArray(requiredGroups, 'requiredGroups', String);
			}

			assert.argumentIsOptional(single, 'single', Boolean);

			this._name = name;

			this._keySelector = keySelector;
			this._descriptionSelector = descriptionSelector;
			this._currencySelector = currencySelector;

			this._requiredGroups = requiredGroups || [ ];
			this._single = is.boolean(single) && single;
		}

		/**
		 * The name of the grouping level.
		 *
		 * @public
		 * @returns {String}
		 */
		get name() {
			return this._name;
		}

		/**
		 * A function, when given a {@link PositionItem} returns a string that is used
		 * to group {@link PositionItem} instances into different groups.
		 *
		 * @public
		 * @returns {PositionLevelDefinition~keySelector}
		 */
		get keySelector() {
			return this._keySelector;
		}

		/**
		 * A function, when given a {@link PositionItem} returns a string used to describe the
		 * group.
		 *
		 * @public
		 * @returns {PositionLevelDefinition~descriptionSelector}
		 */
		get descriptionSelector() {
			return this._descriptionSelector;
		}

		/**
		 * A function, when given a {@link PositionItem} returns the {@link Currency} used to
		 * display values for the group.
		 *
		 * @public
		 * @returns {PositionLevelDefinition~currencySelector}
		 */
		get currencySelector() {
			return this._currencySelector;
		}

		/**
		 * Indicates the required groups (i.e. descriptions). The allows for the creation of empty
		 * groups.
		 *
		 * @public
		 * @returns {Array<String>}
		 */
		get requiredGroups() {
			return this._requiredGroups;
		}

		/**
		 * Indicates if the grouping level is meant to only contain a single item.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get single() {
			return this._single;
		}

		toString() {
			return '[PositionLevelDefinition]';
		}
	}

	/**
	 * A callback used to determine the eligibility for membership of a {@link PositionItem}
	 * within a group.
	 *
	 * @public
	 * @callback PositionLevelDefinition~keySelector
	 * @param {PositionItem} session
	 * @returns {String}
	 */

	/**
	 * A callback used to determine the human-readable name of a group. This function should
	 * return the same value for any {@link PositionItem} in the group.
	 *
	 * @public
	 * @callback PositionLevelDefinition~descriptionSelector
	 * @param {PositionItem} session
	 * @returns {String}
	 */

	/**
	 * A callback used to determine the display {@link Currency} for the group. This function should
	 * return the same value for any {@link PositionItem} in the group.
	 *
	 * @public
	 * @callback PositionLevelDefinition~currencySelector
	 * @param {PositionItem} session
	 * @returns {Currency}
	 */

	/**
	 * The data required to construct a group.
	 *
	 * @public
	 * @typedef PositionLevelDefinition~RequiredGroup
	 * @type {Object}
	 * @property {String} key
	 * @property {String} description
	 * @property {Currency} currency
	 */

	return PositionLevelDefinition;
})();

},{"@barchart/common-js/lang/assert":19,"@barchart/common-js/lang/is":21}],8:[function(require,module,exports){
const assert = require('@barchart/common-js/lang/assert');

const PositionLevelDefinition = require('./PositionLevelDefinition');

module.exports = (() => {
	'use strict';

	/**
	 * Defines the structure for a tree of positions.
	 *
	 * @public
	 * @param {String} name
	 * @param {Array.<PositionLevelDefinition>} definitions
	 */
	class PositionTreeDefinitions {
		constructor(name, definitions) {
			assert.argumentIsRequired(name, 'name', String);
			assert.argumentIsArray(definitions, 'definitions', PositionLevelDefinition, 'PositionLevelDefinition');

			this._name = name;
			this._definitions = definitions;
		}

		/**
		 * The name of the tree.
		 *
		 * @returns {String}
		 */
		get name() {
			return this._name;
		}

		/**
		 * An ordered list of {@link PositionLevelDefinitions} that describes the
		 * levels of the tree. The first item represents the top-most level of the
		 * tree (i.e. the children of the root node) and the last item represents the
		 * bottom-most level of the tree (i.e. leaf nodes).
		 *
		 * @public
		 * @returns {Array.<PositionTreeDefinition>}
		 */
		get definitions() {
			return this._definitions;
		}

		toString() {
			return '[PositionTreeDefinitions]';
		}
	}

	return PositionTreeDefinitions;
})();

},{"./PositionLevelDefinition":7,"@barchart/common-js/lang/assert":19}],9:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var is = require('./../lang/is');

module.exports = function () {
	'use strict';

	/**
  * A tree data structure. Each instance represents a node, holding
  * an item, a reference to the parent node, and a reference to
  * children nodes. Children are stored in insertion order.
  *
  * @public
  * @param {*} value - The value of the node.
  * @param {Tree} parent - The parent node. If not supplied, this will be the root node.
  */

	var Tree = function () {
		function Tree(value, parent) {
			_classCallCheck(this, Tree);

			this._value = value;

			this._parent = parent || null;
			this._children = [];
		}

		/**
   * Returns the parent node. If this is the root node, a null value is returned.
   *
   * @public
   * @returns {Tree|null}
   */


		_createClass(Tree, [{
			key: 'getParent',
			value: function getParent() {
				return this._parent;
			}

			/**
    * Returns the collection of children nodes.
    *
    * @public
    * @returns {Array<Tree>}
    */

		}, {
			key: 'getChildren',
			value: function getChildren() {
				return this._children;
			}

			/**
    * Returns the value associated with the current node.
    *
    * @public
    * @returns {*}
    */

		}, {
			key: 'getValue',
			value: function getValue() {
				return this._value;
			}

			/**
    * Returns true if this node has no children; otherwise false.
    *
    * @public
    * @returns {boolean}
    */

		}, {
			key: 'getIsLeaf',
			value: function getIsLeaf() {
				return this._children.length === 0;
			}

			/**
    * Returns true if this node has no parent; otherwise false.
    *
    * @public
    * @returns {boolean}
    */

		}, {
			key: 'getIsRoot',
			value: function getIsRoot() {
				return this._parent === null;
			}

			/**
    * Adds a child node to the current node and returns a reference
    * to the child node.
    *
    * @public
    * @param {*} value - The value of the child.
    * @returns {Tree}
    */

		}, {
			key: 'addChild',
			value: function addChild(value) {
				var returnRef = new Tree(value, this);

				this._children.push(returnRef);

				return returnRef;
			}

			/**
    * Removes a child node.
    *
    * @public
    * @param {Tree} node - The child to remove.
    */

		}, {
			key: 'removeChild',
			value: function removeChild(node) {
				for (var i = this._children.length - 1; !(i < 0); i--) {
					var child = this._children[i];

					if (child === node) {
						this._children.splice(i, 1);

						child._parent = null;
						child._children = [];

						break;
					}
				}
			}

			/**
    * Searches the children nodes for the first child node that matches the
    * predicate.
    *
    * @public
    * @param {Tree~nodePredicate} predicate - A predicate that tests each child node. The predicate takes two arguments -- the node's value, and the node itself.
    * @returns {Tree|null}
    */

		}, {
			key: 'findChild',
			value: function findChild(predicate) {
				var returnRef = null;

				for (var i = 0; i < this._children.length; i++) {
					var child = this._children[i];

					if (predicate(child.getValue(), child)) {
						returnRef = child;

						break;
					}
				}

				return returnRef;
			}

			/**
    * Searches the tree recursively, starting with the current node.
    *
    * @public
    * @param {Tree~nodePredicate} predicate - A predicate that tests each child node. The predicate takes two arguments -- the node's value, and the node itself.
    * @param {boolean=} childrenFirst - True, if the tree should be searched depth first.
    * @param {boolean=} includeCurrentNode - True, if the current node should be checked against the predicate.
    * @returns {Tree|null}
    */

		}, {
			key: 'search',
			value: function search(predicate, childrenFirst, includeCurrentNode) {
				var returnRef = null;

				if (returnRef === null && childrenFirst && includeCurrentNode && predicate(this.getValue(), this)) {
					returnRef = this;
				}

				for (var i = 0; i < this._children.length; i++) {
					var child = this._children[i];

					returnRef = child.search(predicate, childrenFirst, true);

					if (returnRef !== null) {
						break;
					}
				}

				if (returnRef === null && !childrenFirst && includeCurrentNode && predicate(this.getValue(), this)) {
					returnRef = this;
				}

				return returnRef;
			}

			/**
    * Walks the children of the current node, running an action on each node.
    *
    * @public
    * @param {Tree~nodeAction} walkAction - A action to apply to each node. The action takes two arguments -- the node's value, and the node itself.
    * @param {boolean=} childrenFirst - True if the tree should be walked depth first.
    * @param {boolean=} includeCurrentNode - True if the current node should be applied to the action.
    */

		}, {
			key: 'walk',
			value: function walk(walkAction, childrenFirst, includeCurrentNode) {
				var predicate = function predicate(value, node) {
					walkAction(value, node);

					return false;
				};

				this.search(predicate, childrenFirst, includeCurrentNode);
			}

			/**
    * Climbs the parents of the current node -- current node up to the root node, running an action on each node.
    *
    * @public
    * @param {Tree~nodeAction} climbAction - A action to apply to each node. The action takes two arguments -- the node's value, and the node itself.
    * @param {boolean=} includeCurrentNode - True if the current node should be applied to the action.
    */

		}, {
			key: 'climb',
			value: function climb(climbAction, includeCurrentNode) {
				if (includeCurrentNode) {
					climbAction(this.getValue(), this);
				}

				if (this._parent !== null) {
					this._parent.climb(climbAction, true);
				}
			}

			/**
    * Creates a representation of the tree using JavaScript objects and arrays.
    *
    * @public
    * @param {Function=} valueConverter - An optional function for converting the value of each node.
    * @param {Boolean=} valueConverter - If true, empty children arrays will be excluded from output.
    * @returns {Object}
    */

		}, {
			key: 'toJSObj',
			value: function toJSObj(valueConverter, omitEmptyChildren) {
				var valueConverterToUse = void 0;

				if (is.fn(valueConverter)) {
					valueConverterToUse = valueConverter;
				} else {
					valueConverterToUse = function valueConverterToUse(x) {
						return x;
					};
				}

				var converted = {
					value: valueConverterToUse(this._value)
				};

				if (!(is.boolean(omitEmptyChildren) && omitEmptyChildren && this._children.length === 0)) {
					converted.children = this._children.map(function (child) {
						return child.toJSObj(valueConverter, omitEmptyChildren);
					});
				}

				return converted;
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[Tree]';
			}
		}]);

		return Tree;
	}();

	/**
  * A predicate that is used to check a node (i.e. {@link Tree}).
  *
  * @callback Tree~nodePredicate
  * @param {*} item - The candidate node's item
  * @param {Tree} node - The candidate node.
  * @returns {Boolean}
  */

	/**
  * An action that is run on a node (i.e. {@link Tree}).
  *
  * @callback Tree~nodeAction
  * @param {*} item - The candidate node's item
  * @param {Tree} node - The candidate node.
  */

	return Tree;
}();

},{"./../lang/is":21}],10:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assert = require('./../../lang/assert'),
    comparators = require('./comparators');

module.exports = function () {
	'use strict';

	/**
  * A builder for compound comparator functions (e.g. sort by last name,
  * then by first name, then by social security number) that uses a fluent
  * interface.
  *
  * @public
  * @param {Function} comparator - The initial comparator.
  * @param {Boolean=} invert - Indicates if the comparator should sort in descending order.
  */

	var ComparatorBuilder = function () {
		function ComparatorBuilder(comparator, invert, previous) {
			_classCallCheck(this, ComparatorBuilder);

			assert.argumentIsRequired(comparator, 'comparator', Function);
			assert.argumentIsOptional(invert, 'invert', Boolean);

			this._comparator = comparator;
			this._invert = invert || false;
			this._previous = previous || null;
		}

		/**
   * Adds a new comparator to the list of comparators to use.
   *
   * @public
   * @param {Function} comparator - The next comparator function.
   * @param {Boolean=} invert - Indicates if the comparator should sort in descending order.
   * @returns {ComparatorBuilder}
   */


		_createClass(ComparatorBuilder, [{
			key: 'thenBy',
			value: function thenBy(comparator, invert) {
				assert.argumentIsRequired(comparator, 'comparator', Function);
				assert.argumentIsOptional(invert, 'invert', Boolean);

				return new ComparatorBuilder(comparator, invert, this);
			}

			/**
    * Flips the order of the comparator (e.g. ascending to descending).
    *
    * @public
    * @returns {ComparatorBuilder}
    */

		}, {
			key: 'invert',
			value: function invert() {
				var previous = void 0;

				if (this._previous) {
					previous = this._previous.invert();
				} else {
					previous = null;
				}

				return new ComparatorBuilder(this._comparator, !this._invert, previous);
			}

			/**
    * Returns the comparator function.
    *
    * @public
    * @returns {Function}
    */

		}, {
			key: 'toComparator',
			value: function toComparator() {
				var _this = this;

				var previousComparator = void 0;

				if (this._previous) {
					previousComparator = this._previous.toComparator();
				} else {
					previousComparator = comparators.empty;
				}

				return function (a, b) {
					var result = previousComparator(a, b);

					if (result === 0) {
						var sortA = void 0;
						var sortB = void 0;

						if (_this._invert) {
							sortA = b;
							sortB = a;
						} else {
							sortA = a;
							sortB = b;
						}

						result = _this._comparator(sortA, sortB);
					}

					return result;
				};
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[ComparatorBuilder]';
			}

			/**
    * Creates a {@link ComparatorBuilder}, given an initial comparator function.
    *
    * @public
    * @param {Function} comparator - The initial comparator.
    * @param {Boolean=} invert - Indicates if the comparator should sort in descending order.
    * @returns {ComparatorBuilder}
    */

		}], [{
			key: 'startWith',
			value: function startWith(comparator, invert) {
				return new ComparatorBuilder(comparator, invert);
			}
		}]);

		return ComparatorBuilder;
	}();

	return ComparatorBuilder;
}();

},{"./../../lang/assert":19,"./comparators":11}],11:[function(require,module,exports){
'use strict';

var assert = require('./../../lang/assert');

module.exports = function () {
	'use strict';

	/**
  * Functions that can be used as comparators.
  *
  * @public
  * @module collections/sorting/comparators
  */

	return {
		/**
   * Compares two dates (in ascending order).
   *
   * @static
   * @param {Date} a
   * @param {Date} b
   * @returns {Number}
   */
		compareDates: function compareDates(a, b) {
			assert.argumentIsRequired(a, 'a', Date);
			assert.argumentIsRequired(b, 'b', Date);

			return a - b;
		},

		/**
   * Compares two numbers (in ascending order).
   *
   * @static
   * @param {Number} a
   * @param {Number} b
   * @returns {Number}
   */
		compareNumbers: function compareNumbers(a, b) {
			assert.argumentIsRequired(a, 'a', Number);
			assert.argumentIsRequired(b, 'b', Number);

			return a - b;
		},

		/**
   * Compares two strings (in ascending order), using {@link String#localeCompare}.
   *
   * @static
   * @param {Number} a
   * @param {Number} b
   * @returns {Number}
   */
		compareStrings: function compareStrings(a, b) {
			assert.argumentIsRequired(a, 'a', String);
			assert.argumentIsRequired(b, 'b', String);

			return a.localeCompare(b);
		},

		/**
   * Compares two objects, always returning zero.
   *
   * @static
   * @param {*} a
   * @param {*} b
   * @returns {Number}
   */
		empty: function empty(a, b) {
			return 0;
		}
	};
}();

},{"./../../lang/assert":19}],12:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('./assert'),
    Enum = require('./Enum'),
    is = require('./is');

module.exports = function () {
	'use strict';

	/**
  * An enumeration for currency types.
  *
  * @public
  * @param {String} code - Currency code (e.g. "USD")
  * @param {String} description - The description (e.g. "US Dollar")
  * @param {Number} precision - The number of decimal places possible for by a real world transaction.
  * @extends {Enum}
  */

	var Currency = function (_Enum) {
		_inherits(Currency, _Enum);

		function Currency(code, description, precision, alternateDescription) {
			_classCallCheck(this, Currency);

			var _this = _possibleConstructorReturn(this, (Currency.__proto__ || Object.getPrototypeOf(Currency)).call(this, code, description));

			assert.argumentIsRequired(precision, 'precision', Number);
			assert.argumentIsValid(precision, 'precision', is.integer, 'is an integer');

			assert.argumentIsOptional(alternateDescription, 'alternateDescription', String);

			_this._precision = precision;

			_this._alternateDescription = alternateDescription || description;
			return _this;
		}

		/**
   * The maximum number of decimal places supported by a real world transaction.
   *
   * @public
   * @returns {Number}
   */


		_createClass(Currency, [{
			key: 'toString',
			value: function toString() {
				return '[Currency (code=' + this.code + ')]';
			}
		}, {
			key: 'precision',
			get: function get() {
				return this._precision;
			}

			/**
    * An alternate human-readable description.
    *
    * @public
    * @returns {String}
    */

		}, {
			key: 'alternateDescription',
			get: function get() {
				return this._alternateDescription;
			}

			/**
    * Given a code, returns the enumeration item.
    *
    * @public
    * @param {String} code
    * @returns {Currency|null}
    */

		}], [{
			key: 'parse',
			value: function parse(code) {
				return Enum.fromCode(Currency, code);
			}

			/**
    * The Canadian Dollar.
    *
    * @public
    * @returns {Currency}
    */

		}, {
			key: 'CAD',
			get: function get() {
				return cad;
			}

			/**
    * The Euro.
    *
    * @public
    * @returns {Currency}
    */

		}, {
			key: 'EUR',
			get: function get() {
				return eur;
			}

			/**
    * The US Dollar.
    *
    * @public
    * @returns {Currency}
    */

		}, {
			key: 'USD',
			get: function get() {
				return usd;
			}
		}]);

		return Currency;
	}(Enum);

	var cad = new Currency('CAD', 'Canadian Dollar', 2, 'CAD$');
	var eur = new Currency('EUR', 'Euro', 2, 'EUR');
	var usd = new Currency('USD', 'US Dollar', 2, 'US$');

	return Currency;
}();

},{"./Enum":16,"./assert":19,"./is":21}],13:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assert = require('./assert'),
    ComparatorBuilder = require('./../collections/sorting/ComparatorBuilder'),
    comparators = require('./../collections/sorting/comparators'),
    is = require('./is');

module.exports = function () {
	'use strict';

	/**
  * A data structure that represents a day (year, month, and day)
  * without consideration for time or timezone.
  *
  * @public
  * @param {Number} year
  * @param {Number} month
  * @param {Number} day
  */

	var Day = function () {
		function Day(year, month, day) {
			_classCallCheck(this, Day);

			if (!Day.validate(year, month, day)) {
				throw new Error('Unable to instantiate Day, input is invalid [' + year + '], [' + month + '], [' + day + ']');
			}

			this._year = year;
			this._month = month;
			this._day = day;
		}

		/**
   * Calculates a new {@link Day} in the future (or past).
   *
   * @public
   * @param {Number} days - The number of days to add (negative numbers can be used for subtraction).
   * @param {Boolean=} inverse - If true, the sign of the "days" value will be flipped.
   * @returns {Day}
   */


		_createClass(Day, [{
			key: 'addDays',
			value: function addDays(days, inverse) {
				assert.argumentIsRequired(days, 'days', Number);
				assert.argumentIsOptional(inverse, inverse, Boolean);
				assert.argumentIsValid(days, 'days', is.large, 'is an integer');

				var totalDaysToShift = void 0;

				if (is.boolean(inverse) && inverse) {
					totalDaysToShift = days * -1;
				} else {
					totalDaysToShift = days;
				}

				var positive = is.positive(totalDaysToShift);

				var shiftedDay = this._day;
				var shiftedMonth = this._month;
				var shiftedYear = this._year;

				while (totalDaysToShift !== 0) {
					var monthDaysAvailable = void 0;
					var monthDaysToShift = void 0;

					if (positive) {
						monthDaysAvailable = Day.getDaysInMonth(shiftedYear, shiftedMonth) - shiftedDay;
						monthDaysToShift = Math.min(totalDaysToShift, monthDaysAvailable);
					} else {
						monthDaysAvailable = 1 - shiftedDay;
						monthDaysToShift = Math.max(totalDaysToShift, monthDaysAvailable);
					}

					totalDaysToShift = totalDaysToShift - monthDaysToShift;

					if (totalDaysToShift === 0) {
						shiftedDay = shiftedDay + monthDaysToShift;
					} else if (positive) {
						shiftedMonth++;

						if (shiftedMonth > 12) {
							shiftedYear++;
							shiftedMonth = 1;
						}

						shiftedDay = 0;
					} else {
						shiftedMonth--;

						if (shiftedMonth < 1) {
							shiftedYear--;
							shiftedMonth = 12;
						}

						shiftedDay = Day.getDaysInMonth(shiftedYear, shiftedMonth) + 1;
					}
				}

				return new Day(shiftedYear, shiftedMonth, shiftedDay);
			}

			/**
    * Calculates a new {@link Day} in the past (or future).
    *
    * @public
    * @param {Number} days - The number of days to subtract (negative numbers can be used for addition).
    * @returns {Day}
    */

		}, {
			key: 'subtractDays',
			value: function subtractDays(days) {
				return this.addDays(days, true);
			}

			/**
    * Calculates a new {@link Day} in the future (or past). If the new date is at the end of
    * the month and the new month has fewer days than the current month, days will be subtracted
    * as necessary (e.g. adding one month to March 31 will return April 30).
    *
    * @public
    * @param {Number} months - The number of months to add (negative numbers can be used for subtraction).
    * @param {Boolean=} inverse - If true, the sign of the "days" value will be flipped.
    * @returns {Day}
    */

		}, {
			key: 'addMonths',
			value: function addMonths(months, inverse) {
				assert.argumentIsRequired(months, 'months', Number);
				assert.argumentIsOptional(inverse, inverse, Boolean);
				assert.argumentIsValid(months, 'months', is.large, 'is an integer');

				var totalMonthsToShift = void 0;

				if (is.boolean(inverse) && inverse) {
					totalMonthsToShift = months * -1;
				} else {
					totalMonthsToShift = months;
				}

				var monthsToShift = totalMonthsToShift % 12;
				var yearsToShift = (totalMonthsToShift - monthsToShift) / 12;

				var shiftedYear = this.year + yearsToShift;
				var shiftedMonth = this.month + monthsToShift;
				var shiftedDay = this.day;

				if (shiftedMonth > 12) {
					shiftedYear = shiftedYear + 1;
					shiftedMonth = shiftedMonth - 12;
				}

				if (shiftedMonth < 1) {
					shiftedYear = shiftedYear - 1;
					shiftedMonth = shiftedMonth + 12;
				}

				while (!Day.validate(shiftedYear, shiftedMonth, shiftedDay)) {
					shiftedDay = shiftedDay - 1;
				}

				return new Day(shiftedYear, shiftedMonth, shiftedDay);
			}

			/**
    * Calculates a new {@link Day} in the past (or future).
    *
    * @public
    * @param {Number} months - The number of months to subtract (negative numbers can be used for addition).
    * @returns {Day}
    */

		}, {
			key: 'subtractMonths',
			value: function subtractMonths(months) {
				return this.addMonths(months, true);
			}

			/**
    * Calculates a new {@link Day} in the future (or past). If the new date is at the end of
    * the month and the new month has fewer days than the current month, days will be subtracted
    * as necessary (e.g. adding one year to February 29 will return February 28).
    *
    * @public
    * @param {Number} years - The number of years to add (negative numbers can be used for subtraction).
    * @param {Boolean=} inverse - If true, the sign of the "days" value will be flipped.
    * @returns {Day}
    */

		}, {
			key: 'addYears',
			value: function addYears(years, inverse) {
				assert.argumentIsRequired(years, 'years', Number);
				assert.argumentIsOptional(inverse, inverse, Boolean);
				assert.argumentIsValid(years, 'years', is.large, 'is an integer');

				var yearsToShift = void 0;

				if (is.boolean(inverse) && inverse) {
					yearsToShift = years * -1;
				} else {
					yearsToShift = years;
				}

				var shiftedYear = this.year + yearsToShift;
				var shiftedMonth = this.month;
				var shiftedDay = this.day;

				while (!Day.validate(shiftedYear, shiftedMonth, shiftedDay)) {
					shiftedDay = shiftedDay - 1;
				}

				return new Day(shiftedYear, shiftedMonth, shiftedDay);
			}

			/**
    * Calculates a new {@link Day} in the past (or future).
    *
    * @public
    * @param {Number} years - The number of years to subtract (negative numbers can be used for addition).
    * @returns {Day}
    */

		}, {
			key: 'subtractYears',
			value: function subtractYears(years) {
				return this.addYears(years, true);
			}

			/**
    * Indicates if another {@link Day} occurs before the current instance.
    *
    * @public
    * @param {Day} other
    * @returns {boolean}
    */

		}, {
			key: 'getIsBefore',
			value: function getIsBefore(other) {
				return Day.compareDays(this, other) < 0;
			}

			/**
    * Indicates if another {@link Day} occurs after the current instance.
    *
    * @public
    * @param {Day} other
    * @returns {boolean}
    */

		}, {
			key: 'getIsAfter',
			value: function getIsAfter(other) {
				return Day.compareDays(this, other) > 0;
			}

			/**
    * Indicates the current day falls between two other days, inclusive
    * of the range boundaries.
    *
    * @public
    * @param {Day=} first
    * @param {Day=} last
    * @param {boolean=} exclusive
    * @returns {boolean}
    */

		}, {
			key: 'getIsContained',
			value: function getIsContained(first, last) {
				assert.argumentIsOptional(first, 'first', Day, 'Day');
				assert.argumentIsOptional(last, 'last', Day, 'Day');

				var notAfter = void 0;
				var notBefore = void 0;

				if (first && last && first.getIsAfter(last)) {
					notBefore = false;
					notAfter = false;
				} else {
					notAfter = !(last instanceof Day) || !this.getIsAfter(last);
					notBefore = !(first instanceof Day) || !this.getIsBefore(first);
				}

				return notAfter && notBefore;
			}

			/**
    * Indicates if another {@link Day} occurs after the current instance.
    *
    * @public
    * @param {Day} other
    * @returns {boolean}
    */

		}, {
			key: 'getIsEqual',
			value: function getIsEqual(other) {
				return Day.compareDays(this, other) === 0;
			}

			/**
    * The year.
    *
    * @public
    * @returns {Number}
    */

		}, {
			key: 'format',


			/**
    * Outputs the date as the formatted string: {year}-{month}-{day}.
    *
    * @public
    * @returns {String}
    */
			value: function format() {
				return this._year + '-' + leftPad(this._month) + '-' + leftPad(this._day);
			}

			/**
    * Returns the JSON representation.
    *
    * @public
    * @returns {String}
    */

		}, {
			key: 'toJSON',
			value: function toJSON() {
				return this.format();
			}

			/**
    * Converts a string (which matches the output of {@link Day#format} into
    * a {@link Day} instance.
    *
    * @public
    * @static
    * @param {String} value
    * @returns {Day}
    */

		}, {
			key: 'toString',
			value: function toString() {
				return '[Day]';
			}
		}, {
			key: 'year',
			get: function get() {
				return this._year;
			}

			/**
    * The month of the year (January is one, December is twelve).
    *
    * @public
    * @returns {Number}
    */

		}, {
			key: 'month',
			get: function get() {
				return this._month;
			}

			/**
    * The day of the month.
    *
    * @public
    * @returns {Number}
    */

		}, {
			key: 'day',
			get: function get() {
				return this._day;
			}
		}], [{
			key: 'parse',
			value: function parse(value) {
				assert.argumentIsRequired(value, 'value', String);

				var match = value.match(dayRegex);

				if (match === null) {
					throw new Error('Unable to parse value as Day [ ' + value + ' ]');
				}

				return new Day(parseInt(match[1]), parseInt(match[2]), parseInt(match[3]));
			}

			/**
    * Creates a {@link Day} from the year, month, and day properties (in local time)
    * of the {@link Date} argument.
    *
    * @public
    * @static
    * @param {Date} date
    * @returns {Day}
    */

		}, {
			key: 'fromDate',
			value: function fromDate(date) {
				assert.argumentIsRequired(date, 'date', Date);

				return new Day(date.getFullYear(), date.getMonth() + 1, date.getDate());
			}

			/**
    * Creates a {@link Day} from the year, month, and day properties (in UTC)
    * of the {@link Date} argument.
    *
    * @public
    * @static
    * @param {Date} date
    * @returns {Day}
    */

		}, {
			key: 'fromDateUtc',
			value: function fromDateUtc(date) {
				assert.argumentIsRequired(date, 'date', Date);

				return new Day(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
			}

			/**
    * Returns a {@link Day} instance using today's local date.
    *
    * @static
    * @public
    * @return {Day}
    */

		}, {
			key: 'getToday',
			value: function getToday() {
				return Day.fromDate(new Date());
			}

			/**
    * Returns true if the year, month, and day combination is valid; otherwise false.
    *
    * @public
    * @static
    * @param {Number} year
    * @param {Number} month
    * @param {Number} day
    * @returns {Boolean}
    */

		}, {
			key: 'validate',
			value: function validate(year, month, day) {
				return is.integer(year) && is.integer(month) && is.integer(day) && !(month < 1) && !(month > 12) && !(day < 1) && !(day > Day.getDaysInMonth(year, month));
			}

			/**
    * Returns the number of days in a given month.
    *
    * @public
    * @static
    * @param {number} year - The year number (e.g. 2017)
    * @param {number} month - The month number (e.g. 2 is February)
    */

		}, {
			key: 'getDaysInMonth',
			value: function getDaysInMonth(year, month) {
				switch (month) {
					case 1:
					case 3:
					case 5:
					case 7:
					case 8:
					case 10:
					case 12:
						{
							return 31;
						}
					case 4:
					case 6:
					case 9:
					case 11:
						{
							return 30;
						}
					case 2:
						{
							if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
								return 29;
							} else {
								return 28;
							}
						}
				}
			}

			/**
    * A comparator function for {@link Day} instances.
    *
    * @public
    * @static
    * @param {Day} a
    * @param {Day} b
    * @returns {Number}
    */

		}, {
			key: 'compareDays',
			value: function compareDays(a, b) {
				assert.argumentIsRequired(a, 'a', Day, 'Day');
				assert.argumentIsRequired(b, 'b', Day, 'Day');

				return comparator(a, b);
			}
		}]);

		return Day;
	}();

	var dayRegex = /^([0-9]{4}).?([0-9]{2}).?([0-9]{2})$/;

	function leftPad(value) {
		return value < 10 ? '0' + value : '' + value;
	}

	var comparator = ComparatorBuilder.startWith(function (a, b) {
		return comparators.compareNumbers(a.year, b.year);
	}).thenBy(function (a, b) {
		return comparators.compareNumbers(a.month, b.month);
	}).thenBy(function (a, b) {
		return comparators.compareNumbers(a.day, b.day);
	}).toComparator();

	return Day;
}();

},{"./../collections/sorting/ComparatorBuilder":10,"./../collections/sorting/comparators":11,"./assert":19,"./is":21}],14:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assert = require('./assert'),
    Enum = require('./Enum'),
    is = require('./is');

var Big = require('big.js');

module.exports = function () {
	'use strict';

	/**
  * An immutable object that allows for arbitrary-precision calculations.
  *
  * @public
  * @param {Decimal|Number|String} value - The value.
  */

	var Decimal = function () {
		function Decimal(value) {
			_classCallCheck(this, Decimal);

			this._big = getBig(value);
		}

		/**
   * Returns a new {@link Decimal} instance that is the sum of the
   * current instance's value and the value supplied.
   *
   * @public
   * @param {Decimal|Number|String} other - The value to add.
   * @returns {Decimal}
   */


		_createClass(Decimal, [{
			key: 'add',
			value: function add(other) {
				return new Decimal(this._big.plus(getBig(other)));
			}

			/**
    * Returns a new {@link Decimal} instance with a value that results
    * from the subtraction of the value supplied from the current instance's
    * value.
    *
    * @public
    * @param {Decimal|Number|String} other - The value to subtract.
    * @returns {Decimal}
    */

		}, {
			key: 'subtract',
			value: function subtract(other) {
				return new Decimal(this._big.minus(getBig(other)));
			}

			/**
    * Returns a new {@link Decimal} instance that is the product of the
    * current instance's value and the value supplied.
    *
    * @public
    * @param {Decimal|Number|String} other - The value to add.
    * @returns {Decimal}
    */

		}, {
			key: 'multiply',
			value: function multiply(other) {
				return new Decimal(this._big.times(getBig(other)));
			}

			/**
    * Returns a new {@link Decimal} instance with a value that results
    * from the division of the current instance's value by the value
    * supplied.
    *
    * @public
    * @param {Decimal|Number|String} other - The value to subtract.
    * @returns {Decimal}
    */

		}, {
			key: 'divide',
			value: function divide(other) {
				return new Decimal(this._big.div(getBig(other)));
			}

			/**
    * Returns a new {@link Decimal} with a value resulting from a rounding
    * operation on the current value.
    *
    * @public
    * @param {Number} places - The number of decimal places to retain.
    * @param {RoundingMode=} mode - The strategy to use for rounding.
    * @returns {Decimal}
    */

		}, {
			key: 'round',
			value: function round(places, mode) {
				assert.argumentIsRequired(places, 'places', Number);
				assert.argumentIsOptional(mode, 'mode', RoundingMode, 'RoundingMode');

				var modeToUse = mode || RoundingMode.NORMAL;

				return new Decimal(this._big.round(places, modeToUse.value));
			}

			/**
    * Returns a new {@link Decimal} instance having the absolute value of
    * the current instance's value.
    *
    * @public
    * @returns {Decimal}
    */

		}, {
			key: 'absolute',
			value: function absolute() {
				return new Decimal(this._big.abs());
			}

			/**
    * Returns a new {@link Decimal} instance the opposite sign as the
    * current instance's value.
    *
    * @public
    * @returns {Decimal}
    */

		}, {
			key: 'opposite',
			value: function opposite() {
				return this.multiply(-1);
			}

			/**
    * Returns a Boolean value, indicating if the current instance's value is
    * equal to zero (or approximately equal to zero).
    *
    * @public
    * @param {Boolean=} approximate
    * @returns {Boolean}
    */

		}, {
			key: 'getIsZero',
			value: function getIsZero(approximate) {
				assert.argumentIsOptional(approximate, 'approximate', Boolean);

				return this._big.eq(zero) || is.boolean(approximate) && approximate && this.round(20, RoundingMode.NORMAL).getIsZero();
			}

			/**
    * Returns true if the current instance is positive; otherwise false.
    *
    * @public
    * @returns {Boolean}
    */

		}, {
			key: 'getIsPositive',
			value: function getIsPositive() {
				return this._big.gt(zero);
			}

			/**
    * Returns true if the current instance is negative; otherwise false.
    *
    * @public
    * @returns {Boolean}
    */

		}, {
			key: 'getIsNegative',
			value: function getIsNegative() {
				return this._big.lt(zero);
			}

			/**
    * Returns true if the current instance is greater than the value.
    *
    * @public
    * @param {Decimal|Number|String} other - The value to compare.
    * @returns {Boolean}
    */

		}, {
			key: 'getIsGreaterThan',
			value: function getIsGreaterThan(other) {
				return this._big.gt(getBig(other));
			}

			/**
    * Returns true if the current instance is less than the value.
    *
    * @public
    * @param {Decimal|Number|String} other - The value to compare.
    * @returns {Boolean}
    */

		}, {
			key: 'getIsLessThan',
			value: function getIsLessThan(other) {
				return this._big.lt(getBig(other));
			}

			/**
    * Returns true if the current instance is equal to the value.
    *
    * @public
    * @param {Decimal|Number|String} other - The value to compare.
    * @returns {Boolean}
    */

		}, {
			key: 'getIsEqual',
			value: function getIsEqual(other) {
				return this._big.eq(getBig(other));
			}

			/**
    * Emits a floating point value that approximates the value of the current
    * instance.
    *
    * @public
    * @param {Number=} places
    * @returns {Number}
    */

		}, {
			key: 'toFloat',
			value: function toFloat(places) {
				assert.argumentIsOptional(places, 'places', Number);

				// Accepting places might be a mistake here; perhaps
				// the consumer should be forced to use the round
				// function.

				return parseFloat(this._big.toFixed(places || 16));
			}

			/**
    * Returns a string-based representation of the instance's value.
    *
    * @public
    * @returns {String}
    */

		}, {
			key: 'toFixed',
			value: function toFixed() {
				return this._big.toFixed();
			}

			/**
    * Returns the JSON representation.
    *
    * @public
    * @returns {String}
    */

		}, {
			key: 'toJSON',
			value: function toJSON() {
				return this.toFixed();
			}

			/**
    * Parses the value emitted by {@link Decimal#toJSON}.
    *
    * @public
    * @param {String} value
    * @returns {Decimal}
    */

		}, {
			key: 'toString',
			value: function toString() {
				return '[Decimal]';
			}
		}], [{
			key: 'parse',
			value: function parse(value) {
				return new Decimal(value);
			}

			/**
    * Returns an instance with the value of zero.
    *
    * @public
    * @returns {Decimal}
    */

		}, {
			key: 'getIsZero',


			/**
    * Runs {@link Decimal#getIsZero} and returns the result.
    *
    * @public
    * @param {Decimal} instance
    * @return {Boolean}
    */
			value: function getIsZero(instance) {
				assert.argumentIsRequired(instance, 'instance', Decimal, 'Decimal');

				return instance.getIsZero();
			}

			/**
    * Runs {@link Decimal#getIsZero} and returns the inverse.
    *
    * @public
    * @param {Decimal} instance
    * @return {Boolean}
    */

		}, {
			key: 'getIsNotZero',
			value: function getIsNotZero(instance) {
				assert.argumentIsRequired(instance, 'instance', Decimal, 'Decimal');

				return !instance.getIsZero();
			}

			/**
    * Runs {@link Decimal#getIsPositive} and returns the result.
    *
    * @public
    * @param {Decimal} instance
    * @return {Boolean}
    */

		}, {
			key: 'getIsPositive',
			value: function getIsPositive(instance) {
				assert.argumentIsRequired(instance, 'instance', Decimal, 'Decimal');

				return instance.getIsPositive();
			}

			/**
    * Checks an instance to see if its negative or zero.
    *
    * @public
    * @param {Decimal} instance
    * @return {Boolean}
    */

		}, {
			key: 'getIsNotPositive',
			value: function getIsNotPositive(instance) {
				assert.argumentIsRequired(instance, 'instance', Decimal, 'Decimal');

				return instance.getIsNegative() || instance.getIsZero();
			}

			/**
    * Runs {@link Decimal#getIsNegative} and returns the result.
    *
    * @public
    * @param {Decimal} instance
    * @return {Boolean}
    */

		}, {
			key: 'getIsNegative',
			value: function getIsNegative(instance) {
				assert.argumentIsRequired(instance, 'instance', Decimal, 'Decimal');

				return instance.getIsNegative();
			}

			/**
    * Checks an instance to see if its positive or zero.
    *
    * @public
    * @param {Decimal} instance
    * @return {Boolean}
    */

		}, {
			key: 'getIsNotNegative',
			value: function getIsNotNegative(instance) {
				assert.argumentIsRequired(instance, 'instance', Decimal, 'Decimal');

				return instance.getIsPositive() || instance.getIsZero();
			}

			/**
    * A comparator function for {@link Decimal} instances.
    *
    * @public
    * @param {Decimal} a
    * @param {Decimal} b
    * @returns {Number}
    */

		}, {
			key: 'compareDecimals',
			value: function compareDecimals(a, b) {
				assert.argumentIsRequired(a, 'a', Decimal, 'Decimal');
				assert.argumentIsRequired(b, 'b', Decimal, 'Decimal');

				if (a._big.gt(b._big)) {
					return 1;
				} else if (a._big.lt(b._big)) {
					return -1;
				} else {
					return 0;
				}
			}
		}, {
			key: 'ZERO',
			get: function get() {
				return decimalZero;
			}

			/**
    * Returns an instance with the value of one.
    *
    * @public
    * @returns {Decimal}
    */

		}, {
			key: 'ONE',
			get: function get() {
				return decimalOne;
			}

			/**
    * Returns an instance with the value of one.
    *
    * @public
    * @returns {Decimal}
    */

		}, {
			key: 'NEGATIVE_ONE',
			get: function get() {
				return decimalNegativeOne;
			}

			/**
    * Return the {@link RoundingMode} enumeration.
    *
    * @public
    * @returns {RoundingMode}
    */

		}, {
			key: 'ROUNDING_MODE',
			get: function get() {
				return RoundingMode;
			}
		}]);

		return Decimal;
	}();

	var zero = new Big(0);
	var positiveOne = new Big(1);
	var negativeOne = new Big(-1);

	var decimalZero = new Decimal(zero);
	var decimalOne = new Decimal(positiveOne);
	var decimalNegativeOne = new Decimal(negativeOne);

	function getBig(value) {
		if (value instanceof Big) {
			return value;
		} else if (value instanceof Decimal) {
			return value._big;
		} else {
			return new Big(value);
		}
	}

	/**
  * An enumeration of strategies for rouding a {@link Decimal} instance.
  *
  * @public
  * @inner
  * @extends {Enum}
  */

	var RoundingMode = function (_Enum) {
		_inherits(RoundingMode, _Enum);

		function RoundingMode(value, description) {
			_classCallCheck(this, RoundingMode);

			var _this = _possibleConstructorReturn(this, (RoundingMode.__proto__ || Object.getPrototypeOf(RoundingMode)).call(this, value.toString(), description));

			_this._value = value;
			return _this;
		}

		/**
   * The code used by the Big.js library.
   *
   * @ignore
   * @returns {Number}
   */


		_createClass(RoundingMode, [{
			key: 'toString',
			value: function toString() {
				return '[RoundingMode]';
			}
		}, {
			key: 'value',
			get: function get() {
				return this._value;
			}

			/**
    * Rounds away from zero.
    *
    * @public
    * @returns {RoundingMode}
    */

		}], [{
			key: 'UP',
			get: function get() {
				return up;
			}

			/**
    * Rounds towards zero.
    *
    * @public
    * @returns {RoundingMode}
    */

		}, {
			key: 'DOWN',
			get: function get() {
				return down;
			}

			/**
    * Rounds towards nearest neighbor. If equidistant, rounds away from zero.
    *
    * @public
    * @returns {RoundingMode}
    */

		}, {
			key: 'NORMAL',
			get: function get() {
				return normal;
			}
		}]);

		return RoundingMode;
	}(Enum);

	var up = new RoundingMode(3, 'up');
	var down = new RoundingMode(0, 'down');
	var normal = new RoundingMode(1, 'normal');

	return Decimal;
}();

},{"./Enum":16,"./assert":19,"./is":21,"big.js":24}],15:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assert = require('./assert');

module.exports = function () {
	'use strict';

	/**
  * An object that has an end-of-life process.
  *
  * @public
  * @interface
  */

	var Disposable = function () {
		function Disposable() {
			_classCallCheck(this, Disposable);

			this._disposed = false;
		}

		/**
   * Invokes end-of-life logic. Once this function has been
   * invoked, further interaction with the object is not
   * recommended.
   *
   * @public
   */


		_createClass(Disposable, [{
			key: 'dispose',
			value: function dispose() {
				if (this._disposed) {
					return;
				}

				this._disposed = true;

				this._onDispose();
			}

			/**
    * @protected
    * @abstract
    * @ignore
    */

		}, {
			key: '_onDispose',
			value: function _onDispose() {
				return;
			}

			/**
    * Returns true if the {@link Disposable#dispose} function has been invoked.
    *
    * @public
    * @returns {boolean}
    */

		}, {
			key: 'getIsDisposed',
			value: function getIsDisposed() {
				return this._disposed || false;
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[Disposable]';
			}

			/**
    * Creates and returns a {@link Disposable} object with end-of-life logic
    * delegated to a function.
    *
    * @public
    * @param disposeAction {Function}
    * @returns {Disposable}
    */

		}], [{
			key: 'fromAction',
			value: function fromAction(disposeAction) {
				assert.argumentIsRequired(disposeAction, 'disposeAction', Function);

				return new DisposableAction(disposeAction);
			}

			/**
    * Creates and returns a {@link Disposable} object whose end-of-life
    * logic does nothing.
    *
    * @public
    * @returns {Disposable}
    */

		}, {
			key: 'getEmpty',
			value: function getEmpty() {
				return Disposable.fromAction(function () {
					return;
				});
			}
		}]);

		return Disposable;
	}();

	var DisposableAction = function (_Disposable) {
		_inherits(DisposableAction, _Disposable);

		function DisposableAction(disposeAction) {
			_classCallCheck(this, DisposableAction);

			var _this = _possibleConstructorReturn(this, (DisposableAction.__proto__ || Object.getPrototypeOf(DisposableAction)).call(this, disposeAction));

			_this._disposeAction = disposeAction;
			return _this;
		}

		_createClass(DisposableAction, [{
			key: '_onDispose',
			value: function _onDispose() {
				this._disposeAction();
				this._disposeAction = null;
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[DisposableAction]';
			}
		}]);

		return DisposableAction;
	}(Disposable);

	return Disposable;
}();

},{"./assert":19}],16:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assert = require('./assert');

module.exports = function () {
	'use strict';

	var types = new Map();

	/**
  * An enumeration. Must be inherited. Do not instantiate directly.
  * Also, this class uses the ES6 Map, therefore a polyfill must
  * be supplied.
  *
  * @public
  * @interface
  * @param {String} code - The unique code of the enumeration item.
  * @param {String} description - A description of the enumeration item.
  */

	var Enum = function () {
		function Enum(code, description) {
			_classCallCheck(this, Enum);

			assert.argumentIsRequired(code, 'code', String);
			assert.argumentIsRequired(description, 'description', String);

			this._code = code;
			this._description = description;

			var c = this.constructor;

			if (!types.has(c)) {
				types.set(c, []);
			}

			var existing = Enum.fromCode(c, code);

			if (existing === null) {
				types.get(c).push(this);
			}
		}

		/**
   * The unique code.
   *
   * @returns {String}
   */


		_createClass(Enum, [{
			key: 'equals',


			/**
    * Returns true if the provided {@link Enum} argument is equal
    * to the instance.
    *
    * @param {Enum} other
    * @returns {boolean}
    */
			value: function equals(other) {
				return other === this || other instanceof Enum && other.constructor === this.constructor && other.code === this.code;
			}

			/**
    * Returns the JSON representation.
    *
    * @public
    * @returns {String}
    */

		}, {
			key: 'toJSON',
			value: function toJSON() {
				return this.code;
			}

			/**
    * Looks up a enumeration item; given the enumeration type and the enumeration
    * item's value. If no matching item can be found, a null value is returned.
    *
    * @param {Function} type - The enumeration type.
    * @param {String} code - The enumeration item's code.
    * @returns {*|null}
    */

		}, {
			key: 'toString',
			value: function toString() {
				return '[Enum]';
			}
		}, {
			key: 'code',
			get: function get() {
				return this._code;
			}

			/**
    * The description.
    *
    * @returns {String}
    */

		}, {
			key: 'description',
			get: function get() {
				return this._description;
			}
		}], [{
			key: 'fromCode',
			value: function fromCode(type, code) {
				return Enum.getItems(type).find(function (x) {
					return x.code === code;
				}) || null;
			}

			/**
    * Returns all of the enumeration's items (given an enumeration type).
    *
    * @param {Function} type - The enumeration to list.
    * @returns {Array}
    */

		}, {
			key: 'getItems',
			value: function getItems(type) {
				return types.get(type) || [];
			}
		}]);

		return Enum;
	}();

	return Enum;
}();

},{"./assert":19}],17:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assert = require('./assert'),
    memoize = require('./memoize');

var Currency = require('./Currency'),
    Decimal = require('./Decimal');

module.exports = function () {
	'use strict';

	/**
  * A component that represents an exchange rate, composed of a {@link Decimal}
  * value and two currencies -- a quote (i.e. the numerator) currency and a
  * base (i.e. denominator) currency.
  *
  * @public
  * @param {Number|String|Decimal} value - The rate
  * @param {Currency} numerator - The quote currency
  * @param {Currency} denominator - The base currency
  */

	var Rate = function () {
		function Rate(value, numerator, denominator) {
			_classCallCheck(this, Rate);

			assert.argumentIsRequired(numerator, 'numerator', Currency, 'Currency');
			assert.argumentIsRequired(denominator, 'denominator', Currency, 'Currency');

			if (numerator === denominator) {
				throw new Error('A rate cannot use two identical currencies.');
			}

			var decimal = getDecimal(value);

			if (!decimal.getIsPositive()) {
				throw new Error('Rate value must be positive.');
			}

			this._decimal = decimal;
			this._numerator = numerator;
			this._denominator = denominator;
		}

		/**
   * The rate.
   *
   * @public
   * @returns {Decimal}
   */


		_createClass(Rate, [{
			key: 'invert',


			/**
    * Returns the equivalent rate with the numerator and denominator (i.e. the qoute and base)
    * currencies.
    *
    * @public
    * @returns {Rate}
    */
			value: function invert() {
				return new Rate(Decimal.ONE.divide(this._decimal), this._denominator, this._numerator);
			}

			/**
    * Formats the currency pair as a string (e.g. "EURUSD" or "^EURUSD").
    *
    * @public
    * @param {Boolean=} useCarat - If true, a carat is used as a prefix to the resulting string.
    * @returns {string}
    */

		}, {
			key: 'formatPair',
			value: function formatPair(useCarat) {
				assert.argumentIsOptional(useCarat, 'useCarat', Boolean);

				return '' + (useCarat ? '^' : '') + this._numerator + this._denominator;
			}

			/**
    * Creates a {@link Rate} instance, when given a value
    *
    * @public
    * @param {Number|String|Decimal} value - The rate.
    * @param {String} symbol - A string that can be parsed as a currency pair.
    * @returns {Rate}
    */

		}, {
			key: 'toString',
			value: function toString() {
				return '[Rate]';
			}
		}, {
			key: 'decimal',
			get: function get() {
				return this._decimal;
			}

			/**
    * The numerator (i.e. quote) currency. In other words,
    * this is EUR of the EURUSD pair.
    *
    * @public
    * @returns {Currency}
    */

		}, {
			key: 'numerator',
			get: function get() {
				return this._numerator;
			}

			/**
    * The quote (i.e. numerator) currency. In other words,
    * this is EUR of the EURUSD pair.
    *
    * @public
    * @returns {Currency}
    */

		}, {
			key: 'quote',
			get: function get() {
				return this._numerator;
			}

			/**
    * The denominator (i.e. base) currency. In other words,
    * this is USD of the EURUSD pair.
    *
    * @public
    * @returns {Currency}
    */

		}, {
			key: 'denominator',
			get: function get() {
				return this._denominator;
			}

			/**
    * The base (i.e. denominator) currency. In other words,
    * this is USD of the EURUSD pair.
    *
    * @public
    * @returns {Currency}
    */

		}, {
			key: 'base',
			get: function get() {
				return this._denominator;
			}
		}], [{
			key: 'fromPair',
			value: function fromPair(value, symbol) {
				assert.argumentIsRequired(symbol, 'symbol', String);

				var pair = parsePair(symbol);

				return new Rate(value, Currency.parse(pair.numerator), Currency.parse(pair.denominator));
			}

			/**
    * Given a {@link Decimal} value in a known currency, output
    * a {@link Decimal} converted to an alternate currency.
    *
    * @public
    * @param {Decimal} amount - The amount to convert.
    * @param {Currency} currency - The currency of the amount.
    * @param {Currency} desiredCurrency - The currency to convert to.
    * @param {...Rate} rates - A list of exchange rates to be used for the conversion.
    * @returns {Decimal}
    */

		}, {
			key: 'convert',
			value: function convert(amount, currency, desiredCurrency) {
				assert.argumentIsRequired(amount, 'amount', Decimal, 'Decimal');
				assert.argumentIsRequired(currency, 'currency', Currency, 'Currency');
				assert.argumentIsRequired(desiredCurrency, 'desiredCurrency', Currency, 'Currency');
				//assert.argumentIsArray(rates, 'rates', Rate, 'Rate');

				var converted = void 0;

				if (currency === desiredCurrency) {
					converted = amount;
				} else {
					var numerator = desiredCurrency;
					var denominator = currency;

					for (var _len = arguments.length, rates = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
						rates[_key - 3] = arguments[_key];
					}

					var rate = rates.find(function (r) {
						return r.numerator === numerator && r.denominator === denominator || r.numerator === denominator && r.denominator === numerator;
					});

					if (rate) {
						if (rate.numerator === denominator) {
							rate = rate.invert();
						}
					}

					if (!rate) {
						throw new Error('Unable to perform conversion, given the rates provided.');
					}

					converted = amount.multiply(rate.decimal);
				}

				return converted;
			}
		}]);

		return Rate;
	}();

	var pairExpression = /^\^?([A-Z]{3})([A-Z]{3})$/;

	function getDecimal(value) {
		if (value instanceof Decimal) {
			return value;
		} else {
			return new Decimal(value);
		}
	}

	var parsePair = memoize.simple(function (symbol) {
		var match = symbol.match(pairExpression);

		if (match === null) {
			throw new Error('The "pair" argument cannot be parsed.');
		}

		return {
			numerator: match[2],
			denominator: match[1]
		};
	});

	return Rate;
}();

},{"./Currency":12,"./Decimal":14,"./assert":19,"./memoize":22}],18:[function(require,module,exports){
'use strict';

var assert = require('./assert'),
    is = require('./is');

module.exports = function () {
	'use strict';

	/**
  * Utilities for working with arrays.
  *
  * @public
  * @module lang/array
  */

	return {
		/**
   * Returns the unique items from an array, where the unique
   * key is determined via a strict equality check.
   *
   * @static
   * @param {Array} a
   * @returns {Array}
   */
		unique: function unique(a) {
			assert.argumentIsArray(a, 'a');

			return a.filter(function (item, index, array) {
				return array.indexOf(item) === index;
			});
		},


		/**
   * Returns the unique items from an array, where the unique
   * key is determined by a delegate.
   *
   * @static
   * @param {Array} a
   * @param {Function} keySelector - The function, when applied to an item yields a unique key.
   * @returns {Array}
   */
		uniqueBy: function uniqueBy(a, keySelector) {
			assert.argumentIsArray(a, 'a');

			return a.filter(function (item, index, array) {
				var key = keySelector(item);

				return array.findIndex(function (candidate) {
					return key === keySelector(candidate);
				}) === index;
			});
		},


		/**
   * Splits array into groups and returns an object (where the properties have
   * arrays). Unlike the indexBy function, there can be many items
   * which share the same key.
   *
   * @static
   * @param {Array} a
   * @param {Function} keySelector - The function, when applied to an item yields a key.
   * @returns {Object}
   */
		groupBy: function groupBy(a, keySelector) {
			assert.argumentIsArray(a, 'a');
			assert.argumentIsRequired(keySelector, 'keySelector', Function);

			return a.reduce(function (groups, item) {
				var key = keySelector(item);

				if (!groups.hasOwnProperty(key)) {
					groups[key] = [];
				}

				groups[key].push(item);

				return groups;
			}, {});
		},


		/**
   * Splits array into groups and returns an array of arrays where the items of each
   * nested array share a common key.
   *
   * @static
   * @param {Array} a
   * @param {Function} keySelector - The function, when applied to an item yields a key.
   * @returns {Array}
   */
		batchBy: function batchBy(a, keySelector) {
			assert.argumentIsArray(a, 'a');
			assert.argumentIsRequired(keySelector, 'keySelector', Function);

			var currentKey = null;
			var currentBatch = null;

			return a.reduce(function (batches, item) {
				var key = keySelector(item);

				if (currentBatch === null || currentKey !== key) {
					currentKey = key;

					currentBatch = [];
					batches.push(currentBatch);
				}

				currentBatch.push(item);

				return batches;
			}, []);
		},


		/**
   * Splits array into groups and returns an object (where the properties are items from the
   * original array). Unlike the groupBy, Only one item can have a given key
   * value.
   *
   * @static
   * @param {Array} a
   * @param {Function} keySelector - The function, when applied to an item yields a unique key.
   * @returns {Object}
   */
		indexBy: function indexBy(a, keySelector) {
			assert.argumentIsArray(a, 'a');
			assert.argumentIsRequired(keySelector, 'keySelector', Function);

			return a.reduce(function (map, item) {
				var key = keySelector(item);

				if (map.hasOwnProperty(key)) {
					throw new Error('Unable to index array. A duplicate key exists.');
				}

				map[key] = item;

				return map;
			}, {});
		},


		/**
   * Returns a new array containing all but the first item.
   *
   * @static
   * @param {Array} a
   * @returns {Array}
   */
		dropLeft: function dropLeft(a) {
			assert.argumentIsArray(a, 'a');

			var returnRef = Array.from(a);

			if (returnRef.length !== 0) {
				returnRef.shift();
			}

			return returnRef;
		},


		/**
   * Returns a new array containing all but the last item.
   *
   * @static
   * @param {Array} a
   * @returns {Array}
   */
		dropRight: function dropRight(a) {
			assert.argumentIsArray(a, 'a');

			var returnRef = Array.from(a);

			if (returnRef.length !== 0) {
				returnRef.pop();
			}

			return returnRef;
		},


		/**
   * Returns the first item from an array, or an undefined value, if the
   * array is empty.
   *
   * @static
   * @param {Array} a
   * @returns {*|undefined}
   */
		first: function first(a) {
			assert.argumentIsArray(a, 'a');

			var returnRef = void 0;

			if (a.length !== 0) {
				returnRef = a[0];
			} else {
				returnRef = undefined;
			}

			return returnRef;
		},


		/**
   * Returns the last item from an array, or an undefined value, if the
   * array is empty.
   *
   * @static
   * @param {Array} a
   * @returns {*|undefined}
   */
		last: function last(a) {
			assert.argumentIsArray(a, 'a');

			var returnRef = void 0;

			if (a.length !== 0) {
				returnRef = a[a.length - 1];
			} else {
				returnRef = undefined;
			}

			return returnRef;
		},


		/**
   * Returns a copy of an array, replacing any item that is itself an array
   * with the item's items.
   *
   * @static
   * @param {Array} a
   * @param {Boolean=} recursive - If true, all nested arrays will be flattened.
   * @returns {Array}
   */
		flatten: function flatten(a, recursive) {
			assert.argumentIsArray(a, 'a');
			assert.argumentIsOptional(recursive, 'recursive', Boolean);

			var empty = [];

			var flat = empty.concat.apply(empty, a);

			if (recursive && flat.some(function (x) {
				return is.array(x);
			})) {
				flat = this.flatten(flat, true);
			}

			return flat;
		},


		/**
   * Breaks an array into smaller arrays, returning an array of arrays.
   *
   * @static
   * @param {Array} a
   * @param {Number} size - The maximum number of items per partition.
   * @param {Array<Array>}
   */
		partition: function partition(a, size) {
			assert.argumentIsArray(a, 'a');
			assert.argumentIsOptional(size, 'size', Number);

			var copy = a.slice(0);
			var partitions = [];

			while (copy.length !== 0) {
				partitions.push(copy.splice(0, size));
			}

			return partitions;
		},


		/**
   * Set difference operation (using strict equality).
   *
   * @static
   * @param {Array} a
   * @param {Array} b
   * @returns {Array}
   */
		difference: function difference(a, b) {
			assert.argumentIsArray(a, 'a');
			assert.argumentIsArray(b, 'b');

			var returnRef = [];

			a.forEach(function (candidate) {
				var exclude = b.some(function (comparison) {
					return candidate === comparison;
				});

				if (!exclude) {
					returnRef.push(candidate);
				}
			});

			return returnRef;
		},


		/**
   * Set symmetric difference operation (using strict equality). In
   * other words, this is the union of the differences between the
   * sets.
   *
   * @static
   * @param {Array} a
   * @param {Array} b
   * @returns {Array}
   */
		differenceSymmetric: function differenceSymmetric(a, b) {
			return this.union(this.difference(a, b), this.difference(b, a));
		},


		/**
   * Set union operation (using strict equality).
   *
   * @static
   * @param {Array} a
   * @param {Array} b
   * @returns {Array}
   */
		union: function union(a, b) {
			assert.argumentIsArray(a, 'a');
			assert.argumentIsArray(b, 'b');

			var returnRef = a.slice();

			b.forEach(function (candidate) {
				var exclude = returnRef.some(function (comparison) {
					return candidate === comparison;
				});

				if (!exclude) {
					returnRef.push(candidate);
				}
			});

			return returnRef;
		},


		/**
   * Set intersection operation (using strict equality).
   *
   * @static
   * @param {Array} a
   * @param {Array} b
   * @returns {Array}
   */
		intersection: function intersection(a, b) {
			assert.argumentIsArray(a, 'a');
			assert.argumentIsArray(b, 'b');

			var returnRef = [];

			a.forEach(function (candidate) {
				var include = b.some(function (comparison) {
					return candidate === comparison;
				});

				if (include) {
					returnRef.push(candidate);
				}
			});

			return returnRef;
		}
	};
}();

},{"./assert":19,"./is":21}],19:[function(require,module,exports){
'use strict';

var is = require('./is');

module.exports = function () {
	'use strict';

	function checkArgumentType(variable, variableName, type, typeDescription, index) {
		if (type === String) {
			if (!is.string(variable)) {
				throwInvalidTypeError(variableName, 'string', index);
			}
		} else if (type === Number) {
			if (!is.number(variable)) {
				throwInvalidTypeError(variableName, 'number', index);
			}
		} else if (type === Function) {
			if (!is.fn(variable)) {
				throwInvalidTypeError(variableName, 'function', index);
			}
		} else if (type === Boolean) {
			if (!is.boolean(variable)) {
				throwInvalidTypeError(variableName, 'boolean', index);
			}
		} else if (type === Date) {
			if (!is.date(variable)) {
				throwInvalidTypeError(variableName, 'date', index);
			}
		} else if (type === Array) {
			if (!is.array(variable)) {
				throwInvalidTypeError(variableName, 'array', index);
			}
		} else if (!(variable instanceof (type || Object))) {
			throwInvalidTypeError(variableName, typeDescription, index);
		}
	}

	function throwInvalidTypeError(variableName, typeDescription, index) {
		var message = void 0;

		if (typeof index === 'number') {
			message = 'The argument [ ' + (variableName || 'unspecified') + ' ], at index [ ' + index.toString() + ' ] must be a [ ' + (typeDescription || 'unknown') + ' ]';
		} else {
			message = 'The argument [ ' + (variableName || 'unspecified') + ' ] must be a [ ' + (typeDescription || 'Object') + ' ]';
		}

		throw new Error(message);
	}

	function throwCustomValidationError(variableName, predicateDescription) {
		throw new Error('The argument [ ' + (variableName || 'unspecified') + ' ] failed a validation check [ ' + (predicateDescription || 'No description available') + ' ]');
	}

	/**
  * Utilities checking arguments.
  *
  * @public
  * @module lang/assert
  */
	return {
		/**
   * Throws an error if an argument doesn't conform to the desired specification (as
   * determined by a type check).
   *
   * @static
   * @param {*} variable - The value to check.
   * @param {String} variableName - The name of the value (used for formatting an error message).
   * @param {*} type - The expected type of the argument.
   * @param {String=} typeDescription - The description of the expected type (used for formatting an error message).
   */
		argumentIsRequired: function argumentIsRequired(variable, variableName, type, typeDescription) {
			checkArgumentType(variable, variableName, type, typeDescription);
		},


		/**
   * A relaxed version of the "argumentIsRequired" function that will not throw if
   * the value is undefined or null.
   *
   * @static
   * @param {*} variable - The value to check.
   * @param {String} variableName - The name of the value (used for formatting an error message).
   * @param {*} type - The expected type of the argument.
   * @param {String=} typeDescription - The description of the expected type (used for formatting an error message).
   */
		argumentIsOptional: function argumentIsOptional(variable, variableName, type, typeDescription, predicate, predicateDescription) {
			if (variable === null || variable === undefined) {
				return;
			}

			checkArgumentType(variable, variableName, type, typeDescription);

			if (is.fn(predicate) && !predicate(variable)) {
				throwCustomValidationError(variableName, predicateDescription);
			}
		},
		argumentIsArray: function argumentIsArray(variable, variableName, itemConstraint, itemConstraintDescription) {
			this.argumentIsRequired(variable, variableName, Array);

			if (itemConstraint) {
				var itemValidator = void 0;

				if (typeof itemConstraint === 'function' && itemConstraint !== Function) {
					itemValidator = function itemValidator(value, index) {
						return value instanceof itemConstraint || itemConstraint(value, variableName + '[' + index + ']');
					};
				} else {
					itemValidator = function itemValidator(value, index) {
						return checkArgumentType(value, variableName, itemConstraint, itemConstraintDescription, index);
					};
				}

				variable.forEach(function (v, i) {
					itemValidator(v, i);
				});
			}
		},


		/**
   * Throws an error if an argument doesn't conform to the desired specification
   * (as determined by a predicate).
   *
   * @static
   * @param {*} variable - The value to check.
   * @param {String} variableName - The name of the value (used for formatting an error message).
   * @param {Function=} predicate - A function used to validate the item (beyond type checking).
   * @param {String=} predicateDescription - A description of the assertion made by the predicate (e.g. "is an integer") that is used for formatting an error message.
   */
		argumentIsValid: function argumentIsValid(variable, variableName, predicate, predicateDescription) {
			if (!predicate(variable)) {
				throwCustomValidationError(variableName, predicateDescription);
			}
		},
		areEqual: function areEqual(a, b, descriptionA, descriptionB) {
			if (a !== b) {
				throw new Error('The objects must be equal [' + (descriptionA || a.toString()) + '] and [' + (descriptionB || b.toString()) + ']');
			}
		},
		areNotEqual: function areNotEqual(a, b, descriptionA, descriptionB) {
			if (a === b) {
				throw new Error('The objects cannot be equal [' + (descriptionA || a.toString()) + '] and [' + (descriptionB || b.toString()) + ']');
			}
		}
	};
}();

},{"./is":21}],20:[function(require,module,exports){
'use strict';

module.exports = function () {
	'use strict';

	return {
		/**
   * Formats a number into a string for display purposes.
   */
		numberToString: function numberToString(value, digits, thousandsSeparator, useParenthesis) {
			if (value === '' || value === undefined || value === null || isNaN(value)) {
				return '';
			}

			var applyParenthesis = value < 0 && useParenthesis === true;

			if (applyParenthesis) {
				value = 0 - value;
			}

			var returnRef = value.toFixed(digits);

			if (thousandsSeparator && !(value > -1000 && value < 1000)) {
				var length = returnRef.length;
				var negative = value < 0;

				var found = digits === 0;
				var counter = 0;

				var buffer = [];

				for (var i = length - 1; !(i < 0); i--) {
					if (counter === 3 && !(negative && i === 0)) {
						buffer.unshift(thousandsSeparator);

						counter = 0;
					}

					var character = returnRef.charAt(i);

					buffer.unshift(character);

					if (found) {
						counter = counter + 1;
					} else if (character === '.') {
						found = true;
					}
				}

				if (applyParenthesis) {
					buffer.unshift('(');
					buffer.push(')');
				}

				returnRef = buffer.join('');
			} else if (applyParenthesis) {
				returnRef = '(' + returnRef + ')';
			}

			return returnRef;
		}
	};
}();

},{}],21:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function () {
	'use strict';

	/**
  * Utilities for interrogating variables (e.g. checking data types).
  *
  * @public
  * @module lang/is
  */

	return {
		/**
   * Returns true, if the argument is a number. NaN will return false.
   *
   * @static
   * @public
   * @param {*} candidate {*}
   * @returns {boolean}
   */
		number: function number(candidate) {
			return typeof candidate === 'number' && !isNaN(candidate);
		},


		/**
   * Returns true, if the argument is NaN.
   *
   * @static
   * @public
   * @param {*} candidate
   * @returns {boolean}
   */
		nan: function nan(candidate) {
			return typeof candidate === 'number' && isNaN(candidate);
		},


		/**
   * Returns true, if the argument is a valid 32-bit integer.
   *
   * @static
   * @public
   * @param {*} candidate
   * @returns {boolean}
   */
		integer: function integer(candidate) {
			return typeof candidate === 'number' && !isNaN(candidate) && (candidate | 0) === candidate;
		},


		/**
   * Returns true, if the argument is a valid integer (which can exceed 32 bits); however,
   * the check can fail above the value of Number.MAX_SAFE_INTEGER.
   *
   * @static
   * @public
   * @param {*) candidate
   * @returns {boolean}
   */
		large: function large(candidate) {
			return typeof candidate === 'number' && !isNaN(candidate) && isFinite(candidate) && Math.floor(candidate) === candidate;
		},


		/**
   * Returns true, if the argument is a number that is positive.
   *
   * @static
   * @public
   * @param {*} candidate
   * @returns {boolean}
   */
		positive: function positive(candidate) {
			return this.number(candidate) && candidate > 0;
		},


		/**
   * Returns true, if the argument is a number that is negative.
   *
   * @static
   * @public
   * @param {*} candidate
   * @returns {*|boolean}
   */
		negative: function negative(candidate) {
			return this.number(candidate) && candidate < 0;
		},


		/**
   * Returns true, if the argument is a string.
   *
   * @static
   * @public
   * @param {*} candidate
   * @returns {boolean}
   */
		string: function string(candidate) {
			return typeof candidate === 'string';
		},


		/**
   * Returns true, if the argument is a JavaScript Date instance.
   *
   * @static
   * @public
   * @param {*} candidate
   * @returns {boolean}
   */
		date: function date(candidate) {
			return candidate instanceof Date;
		},


		/**
   * Returns true, if the argument is a function.
   *
   * @static
   * @public
   * @param {*} candidate
   * @returns {boolean}
   */
		fn: function fn(candidate) {
			return typeof candidate === 'function';
		},


		/**
   * Returns true, if the argument is an array.
   *
   * @static
   * @public
   * @param {*} candidate
   * @returns {boolean}
   */
		array: function array(candidate) {
			return Array.isArray(candidate);
		},


		/**
   * Returns true, if the argument is a Boolean value.
   *
   * @static
   * @public
   * @param {*} candidate
   * @returns {boolean}
   */
		boolean: function boolean(candidate) {
			return typeof candidate === 'boolean';
		},


		/**
   * Returns true, if the argument is an object.
   *
   * @static
   * @public
   * @param {*} candidate
   * @returns {boolean}
   */
		object: function object(candidate) {
			return (typeof candidate === 'undefined' ? 'undefined' : _typeof(candidate)) === 'object' && candidate !== null;
		},


		/**
   * Returns true, if the argument is a null value.
   *
   * @static
   * @public
   * @param {*} candidate
   * @returns {boolean}
   */
		null: function _null(candidate) {
			return candidate === null;
		},


		/**
   * Returns true, if the argument is an undefined value.
   *
   * @static
   * @public
   * @param {*} candidate
   * @returns {boolean}
   */
		undefined: function (_undefined) {
			function undefined(_x) {
				return _undefined.apply(this, arguments);
			}

			undefined.toString = function () {
				return _undefined.toString();
			};

			return undefined;
		}(function (candidate) {
			return candidate === undefined;
		}),


		/**
   * Given two classes, determines if the "child" class extends
   * the "parent" class (without instantiation).
   *
   * @param {Function} parent
   * @param {Function} child
   * @returns {Boolean}
   */
		extension: function extension(parent, child) {
			return this.fn(parent) && this.fn(child) && child.prototype instanceof parent;
		}
	};
}();

},{}],22:[function(require,module,exports){
'use strict';

var assert = require('./assert'),
    is = require('./is');

module.exports = function () {
	'use strict';

	/**
  * Utilities for caching results of function invocations (a.k.a. memoization).
  *
  * @public
  * @module lang/memoize
  */

	return {
		/**
   * Memoizes a function that accepts a single argument only. Furthermore,
   * the parameter's toString function must return a unique value.
   *
   * @static
   * @public
   * @param {Function} fn - The function to memoize. This function should accept one parameters whose "toString" function outputs a unique value.
   */
		simple: function simple(fn) {
			var cache = {};

			return function (x) {
				if (cache.hasOwnProperty(x)) {
					return cache[x];
				} else {
					return cache[x] = fn(x);
				}
			};
		},


		/**
   * Wraps a function. The resulting function will call the wrapped function
   * once and cache the result. If a specific duration is supplied, the
   * cache will be dropped after the duration expires and the wrapped
   * function will be invoked again.
   *
   * @public
   * @param {Function} fn
   * @param {Number} duration
   * @returns {Function}
   */
		cache: function cache(fn, duration) {
			assert.argumentIsRequired(fn, 'fn', Function);
			assert.argumentIsOptional(duration, 'duration', Number);

			var durationToUse = duration || 0;

			var executionTime = null;
			var cacheResult = null;

			return function () {
				var currentTime = new Date().getTime();

				if (executionTime === null || durationToUse > 0 && currentTime > executionTime + durationToUse) {
					executionTime = currentTime;

					cacheResult = fn();
				}

				return cacheResult;
			};
		}
	};
}();

},{"./assert":19,"./is":21}],23:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assert = require('./../lang/assert'),
    Disposable = require('./../lang/Disposable');

module.exports = function () {
	'use strict';

	/**
  * An implementation of the observer pattern.
  *
  * @param {*} sender - The object which owns the event.
  * @extends {Disposable}
  */

	var Event = function (_Disposable) {
		_inherits(Event, _Disposable);

		function Event(sender) {
			_classCallCheck(this, Event);

			var _this = _possibleConstructorReturn(this, (Event.__proto__ || Object.getPrototypeOf(Event)).call(this));

			_this._sender = sender || null;

			_this._observers = [];
			return _this;
		}

		/**
   * Registers an event handler which will receive a notification when
   * {@link Event#fire} is called.
   *
   * @public
   * @param {Function} handler - The function which will be called each time the event fires. The first argument will be the event data. The second argument will be the event owner (i.e. sender).
   * @returns {Disposable}
   */


		_createClass(Event, [{
			key: 'register',
			value: function register(handler) {
				var _this2 = this;

				assert.argumentIsRequired(handler, 'handler', Function);

				addRegistration.call(this, handler);

				return Disposable.fromAction(function () {
					if (_this2.getIsDisposed()) {
						return;
					}

					removeRegistration.call(_this2, handler);
				});
			}

			/**
    * Removes registration for an event handler. That is, the handler will
    * no longer be called if the event fires.
    *
    * @public
    * @param {Function} handler
    */

		}, {
			key: 'unregister',
			value: function unregister(handler) {
				assert.argumentIsRequired(handler, 'handler', Function);

				removeRegistration.call(this, handler);
			}

			/**
    * Removes all handlers from the event.
    *
    * @public
    */

		}, {
			key: 'clear',
			value: function clear() {
				this._observers = [];
			}

			/**
    * Triggers the event, calling all previously registered handlers.
    *
    * @public
    * @param {*) data - The data to pass each handler.
    */

		}, {
			key: 'fire',
			value: function fire(data) {
				var observers = this._observers;

				for (var i = 0; i < observers.length; i++) {
					var observer = observers[i];

					observer(data, this._sender);
				}
			}

			/**
    * Returns true, if no handlers are currently registered.
    *
    * @returns {boolean}
    */

		}, {
			key: 'getIsEmpty',
			value: function getIsEmpty() {
				return this._observers.length === 0;
			}
		}, {
			key: '_onDispose',
			value: function _onDispose() {
				this._observers = null;
			}
		}, {
			key: 'toString',
			value: function toString() {
				return '[Event]';
			}
		}]);

		return Event;
	}(Disposable);

	function addRegistration(handler) {
		var copiedObservers = this._observers.slice();

		copiedObservers.push(handler);

		this._observers = copiedObservers;
	}

	function removeRegistration(handler) {
		var indicesToRemove = [];

		for (var i = 0; i < this._observers.length; i++) {
			var candidate = this._observers[i];

			if (candidate === handler) {
				indicesToRemove.push(i);
			}
		}

		if (indicesToRemove.length > 0) {
			var copiedObservers = this._observers.slice();

			for (var j = indicesToRemove.length - 1; !(j < 0); j--) {
				copiedObservers.splice(indicesToRemove[j], 1);
			}

			this._observers = copiedObservers;
		}
	}

	return Event;
}();

},{"./../lang/Disposable":15,"./../lang/assert":19}],24:[function(require,module,exports){
/*
 *  big.js v5.0.3
 *  A small, fast, easy-to-use library for arbitrary-precision decimal arithmetic.
 *  Copyright (c) 2017 Michael Mclaughlin <M8ch88l@gmail.com>
 *  https://github.com/MikeMcl/big.js/LICENCE
 */
;(function (GLOBAL) {
  'use strict';
  var Big,


/************************************** EDITABLE DEFAULTS *****************************************/


    // The default values below must be integers within the stated ranges.

    /*
     * The maximum number of decimal places (DP) of the results of operations involving division:
     * div and sqrt, and pow with negative exponents.
     */
    DP = 20,          // 0 to MAX_DP

    /*
     * The rounding mode (RM) used when rounding to the above decimal places.
     *
     *  0  Towards zero (i.e. truncate, no rounding).       (ROUND_DOWN)
     *  1  To nearest neighbour. If equidistant, round up.  (ROUND_HALF_UP)
     *  2  To nearest neighbour. If equidistant, to even.   (ROUND_HALF_EVEN)
     *  3  Away from zero.                                  (ROUND_UP)
     */
    RM = 1,             // 0, 1, 2 or 3

    // The maximum value of DP and Big.DP.
    MAX_DP = 1E6,       // 0 to 1000000

    // The maximum magnitude of the exponent argument to the pow method.
    MAX_POWER = 1E6,    // 1 to 1000000

    /*
     * The negative exponent (NE) at and beneath which toString returns exponential notation.
     * (JavaScript numbers: -7)
     * -1000000 is the minimum recommended exponent value of a Big.
     */
    NE = -7,            // 0 to -1000000

    /*
     * The positive exponent (PE) at and above which toString returns exponential notation.
     * (JavaScript numbers: 21)
     * 1000000 is the maximum recommended exponent value of a Big.
     * (This limit is not enforced or checked.)
     */
    PE = 21,            // 0 to 1000000


/**************************************************************************************************/


    // Error messages.
    NAME = '[big.js] ',
    INVALID = NAME + 'Invalid ',
    INVALID_DP = INVALID + 'decimal places',
    INVALID_RM = INVALID + 'rounding mode',
    DIV_BY_ZERO = NAME + 'Division by zero',

    // The shared prototype object.
    P = {},
    UNDEFINED = void 0,
    NUMERIC = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;


  /*
   * Create and return a Big constructor.
   *
   */
  function _Big_() {

    /*
     * The Big constructor and exported function.
     * Create and return a new instance of a Big number object.
     *
     * n {number|string|Big} A numeric value.
     */
    function Big(n) {
      var x = this;

      // Enable constructor usage without new.
      if (!(x instanceof Big)) return n === UNDEFINED ? _Big_() : new Big(n);

      // Duplicate.
      if (n instanceof Big) {
        x.s = n.s;
        x.e = n.e;
        x.c = n.c.slice();
      } else {
        parse(x, n);
      }

      /*
       * Retain a reference to this Big constructor, and shadow Big.prototype.constructor which
       * points to Object.
       */
      x.constructor = Big;
    }

    Big.prototype = P;
    Big.DP = DP;
    Big.RM = RM;
    Big.NE = NE;
    Big.PE = PE;
    Big.version = '5.0.2';

    return Big;
  }


  /*
   * Parse the number or string value passed to a Big constructor.
   *
   * x {Big} A Big number instance.
   * n {number|string} A numeric value.
   */
  function parse(x, n) {
    var e, i, nl;

    // Minus zero?
    if (n === 0 && 1 / n < 0) n = '-0';
    else if (!NUMERIC.test(n += '')) throw Error(INVALID + 'number');

    // Determine sign.
    x.s = n.charAt(0) == '-' ? (n = n.slice(1), -1) : 1;

    // Decimal point?
    if ((e = n.indexOf('.')) > -1) n = n.replace('.', '');

    // Exponential form?
    if ((i = n.search(/e/i)) > 0) {

      // Determine exponent.
      if (e < 0) e = i;
      e += +n.slice(i + 1);
      n = n.substring(0, i);
    } else if (e < 0) {

      // Integer.
      e = n.length;
    }

    nl = n.length;

    // Determine leading zeros.
    for (i = 0; i < nl && n.charAt(i) == '0';) ++i;

    if (i == nl) {

      // Zero.
      x.c = [x.e = 0];
    } else {

      // Determine trailing zeros.
      for (; nl > 0 && n.charAt(--nl) == '0';);
      x.e = e - i - 1;
      x.c = [];

      // Convert string to array of digits without leading/trailing zeros.
      for (e = 0; i <= nl;) x.c[e++] = +n.charAt(i++);
    }

    return x;
  }


  /*
   * Round Big x to a maximum of dp decimal places using rounding mode rm.
   * Called by stringify, P.div, P.round and P.sqrt.
   *
   * x {Big} The Big to round.
   * dp {number} Integer, 0 to MAX_DP inclusive.
   * rm {number} 0, 1, 2 or 3 (DOWN, HALF_UP, HALF_EVEN, UP)
   * [more] {boolean} Whether the result of division was truncated.
   */
  function round(x, dp, rm, more) {
    var xc = x.c,
      i = x.e + dp + 1;

    if (i < xc.length) {
      if (rm === 1) {

        // xc[i] is the digit after the digit that may be rounded up.
        more = xc[i] >= 5;
      } else if (rm === 2) {
        more = xc[i] > 5 || xc[i] == 5 &&
          (more || i < 0 || xc[i + 1] !== UNDEFINED || xc[i - 1] & 1);
      } else if (rm === 3) {
        more = more || xc[i] !== UNDEFINED || i < 0;
      } else {
        more = false;
        if (rm !== 0) throw Error(INVALID_RM);
      }

      if (i < 1) {
        xc.length = 1;

        if (more) {

          // 1, 0.1, 0.01, 0.001, 0.0001 etc.
          x.e = -dp;
          xc[0] = 1;
        } else {

          // Zero.
          xc[0] = x.e = 0;
        }
      } else {

        // Remove any digits after the required decimal places.
        xc.length = i--;

        // Round up?
        if (more) {

          // Rounding up may mean the previous digit has to be rounded up.
          for (; ++xc[i] > 9;) {
            xc[i] = 0;
            if (!i--) {
              ++x.e;
              xc.unshift(1);
            }
          }
        }

        // Remove trailing zeros.
        for (i = xc.length; !xc[--i];) xc.pop();
      }
    } else if (rm < 0 || rm > 3 || rm !== ~~rm) {
      throw Error(INVALID_RM);
    }

    return x;
  }


  /*
   * Return a string representing the value of Big x in normal or exponential notation.
   * Handles P.toExponential, P.toFixed, P.toJSON, P.toPrecision, P.toString and P.valueOf.
   *
   * x {Big}
   * id? {number} Caller id.
   *         1 toExponential
   *         2 toFixed
   *         3 toPrecision
   *         4 valueOf
   * n? {number|undefined} Caller's argument.
   * k? {number|undefined}
   */
  function stringify(x, id, n, k) {
    var e, s,
      Big = x.constructor,
      z = !x.c[0];

    if (n !== UNDEFINED) {
      if (n !== ~~n || n < (id == 3) || n > MAX_DP) {
        throw Error(id == 3 ? INVALID + 'precision' : INVALID_DP);
      }

      x = new Big(x);

      // The index of the digit that may be rounded up.
      n = k - x.e;

      // Round?
      if (x.c.length > ++k) round(x, n, Big.RM);

      // toFixed: recalculate k as x.e may have changed if value rounded up.
      if (id == 2) k = x.e + n + 1;

      // Append zeros?
      for (; x.c.length < k;) x.c.push(0);
    }

    e = x.e;
    s = x.c.join('');
    n = s.length;

    // Exponential notation?
    if (id != 2 && (id == 1 || id == 3 && k <= e || e <= Big.NE || e >= Big.PE)) {
      s = s.charAt(0) + (n > 1 ? '.' + s.slice(1) : '') + (e < 0 ? 'e' : 'e+') + e;

    // Normal notation.
    } else if (e < 0) {
      for (; ++e;) s = '0' + s;
      s = '0.' + s;
    } else if (e > 0) {
      if (++e > n) for (e -= n; e--;) s += '0';
      else if (e < n) s = s.slice(0, e) + '.' + s.slice(e);
    } else if (n > 1) {
      s = s.charAt(0) + '.' + s.slice(1);
    }

    return x.s < 0 && (!z || id == 4) ? '-' + s : s;
  }


  // Prototype/instance methods


  /*
   * Return a new Big whose value is the absolute value of this Big.
   */
  P.abs = function () {
    var x = new this.constructor(this);
    x.s = 1;
    return x;
  };


  /*
   * Return 1 if the value of this Big is greater than the value of Big y,
   *       -1 if the value of this Big is less than the value of Big y, or
   *        0 if they have the same value.
  */
  P.cmp = function (y) {
    var isneg,
      x = this,
      xc = x.c,
      yc = (y = new x.constructor(y)).c,
      i = x.s,
      j = y.s,
      k = x.e,
      l = y.e;

    // Either zero?
    if (!xc[0] || !yc[0]) return !xc[0] ? !yc[0] ? 0 : -j : i;

    // Signs differ?
    if (i != j) return i;

    isneg = i < 0;

    // Compare exponents.
    if (k != l) return k > l ^ isneg ? 1 : -1;

    j = (k = xc.length) < (l = yc.length) ? k : l;

    // Compare digit by digit.
    for (i = -1; ++i < j;) {
      if (xc[i] != yc[i]) return xc[i] > yc[i] ^ isneg ? 1 : -1;
    }

    // Compare lengths.
    return k == l ? 0 : k > l ^ isneg ? 1 : -1;
  };


  /*
   * Return a new Big whose value is the value of this Big divided by the value of Big y, rounded,
   * if necessary, to a maximum of Big.DP decimal places using rounding mode Big.RM.
   */
  P.div = function (y) {
    var x = this,
      Big = x.constructor,
      a = x.c,                  // dividend
      b = (y = new Big(y)).c,   // divisor
      k = x.s == y.s ? 1 : -1,
      dp = Big.DP;

    if (dp !== ~~dp || dp < 0 || dp > MAX_DP) throw Error(INVALID_DP);

    // Divisor is zero?
    if (!b[0]) throw Error(DIV_BY_ZERO);

    // Dividend is 0? Return +-0.
    if (!a[0]) return new Big(k * 0);

    var bl, bt, n, cmp, ri,
      bz = b.slice(),
      ai = bl = b.length,
      al = a.length,
      r = a.slice(0, bl),   // remainder
      rl = r.length,
      q = y,                // quotient
      qc = q.c = [],
      qi = 0,
      d = dp + (q.e = x.e - y.e) + 1;    // number of digits of the result

    q.s = k;
    k = d < 0 ? 0 : d;

    // Create version of divisor with leading zero.
    bz.unshift(0);

    // Add zeros to make remainder as long as divisor.
    for (; rl++ < bl;) r.push(0);

    do {

      // n is how many times the divisor goes into current remainder.
      for (n = 0; n < 10; n++) {

        // Compare divisor and remainder.
        if (bl != (rl = r.length)) {
          cmp = bl > rl ? 1 : -1;
        } else {
          for (ri = -1, cmp = 0; ++ri < bl;) {
            if (b[ri] != r[ri]) {
              cmp = b[ri] > r[ri] ? 1 : -1;
              break;
            }
          }
        }

        // If divisor < remainder, subtract divisor from remainder.
        if (cmp < 0) {

          // Remainder can't be more than 1 digit longer than divisor.
          // Equalise lengths using divisor with extra leading zero?
          for (bt = rl == bl ? b : bz; rl;) {
            if (r[--rl] < bt[rl]) {
              ri = rl;
              for (; ri && !r[--ri];) r[ri] = 9;
              --r[ri];
              r[rl] += 10;
            }
            r[rl] -= bt[rl];
          }

          for (; !r[0];) r.shift();
        } else {
          break;
        }
      }

      // Add the digit n to the result array.
      qc[qi++] = cmp ? n : ++n;

      // Update the remainder.
      if (r[0] && cmp) r[rl] = a[ai] || 0;
      else r = [a[ai]];

    } while ((ai++ < al || r[0] !== UNDEFINED) && k--);

    // Leading zero? Do not remove if result is simply zero (qi == 1).
    if (!qc[0] && qi != 1) {

      // There can't be more than one zero.
      qc.shift();
      q.e--;
    }

    // Round?
    if (qi > d) round(q, dp, Big.RM, r[0] !== UNDEFINED);

    return q;
  };


  /*
   * Return true if the value of this Big is equal to the value of Big y, otherwise return false.
   */
  P.eq = function (y) {
    return !this.cmp(y);
  };


  /*
   * Return true if the value of this Big is greater than the value of Big y, otherwise return
   * false.
   */
  P.gt = function (y) {
    return this.cmp(y) > 0;
  };


  /*
   * Return true if the value of this Big is greater than or equal to the value of Big y, otherwise
   * return false.
   */
  P.gte = function (y) {
    return this.cmp(y) > -1;
  };


  /*
   * Return true if the value of this Big is less than the value of Big y, otherwise return false.
   */
  P.lt = function (y) {
    return this.cmp(y) < 0;
  };


  /*
   * Return true if the value of this Big is less than or equal to the value of Big y, otherwise
   * return false.
   */
  P.lte = function (y) {
    return this.cmp(y) < 1;
  };


  /*
   * Return a new Big whose value is the value of this Big minus the value of Big y.
   */
  P.minus = P.sub = function (y) {
    var i, j, t, xlty,
      x = this,
      Big = x.constructor,
      a = x.s,
      b = (y = new Big(y)).s;

    // Signs differ?
    if (a != b) {
      y.s = -b;
      return x.plus(y);
    }

    var xc = x.c.slice(),
      xe = x.e,
      yc = y.c,
      ye = y.e;

    // Either zero?
    if (!xc[0] || !yc[0]) {

      // y is non-zero? x is non-zero? Or both are zero.
      return yc[0] ? (y.s = -b, y) : new Big(xc[0] ? x : 0);
    }

    // Determine which is the bigger number. Prepend zeros to equalise exponents.
    if (a = xe - ye) {

      if (xlty = a < 0) {
        a = -a;
        t = xc;
      } else {
        ye = xe;
        t = yc;
      }

      t.reverse();
      for (b = a; b--;) t.push(0);
      t.reverse();
    } else {

      // Exponents equal. Check digit by digit.
      j = ((xlty = xc.length < yc.length) ? xc : yc).length;

      for (a = b = 0; b < j; b++) {
        if (xc[b] != yc[b]) {
          xlty = xc[b] < yc[b];
          break;
        }
      }
    }

    // x < y? Point xc to the array of the bigger number.
    if (xlty) {
      t = xc;
      xc = yc;
      yc = t;
      y.s = -y.s;
    }

    /*
     * Append zeros to xc if shorter. No need to add zeros to yc if shorter as subtraction only
     * needs to start at yc.length.
     */
    if ((b = (j = yc.length) - (i = xc.length)) > 0) for (; b--;) xc[i++] = 0;

    // Subtract yc from xc.
    for (b = i; j > a;) {
      if (xc[--j] < yc[j]) {
        for (i = j; i && !xc[--i];) xc[i] = 9;
        --xc[i];
        xc[j] += 10;
      }

      xc[j] -= yc[j];
    }

    // Remove trailing zeros.
    for (; xc[--b] === 0;) xc.pop();

    // Remove leading zeros and adjust exponent accordingly.
    for (; xc[0] === 0;) {
      xc.shift();
      --ye;
    }

    if (!xc[0]) {

      // n - n = +0
      y.s = 1;

      // Result must be zero.
      xc = [ye = 0];
    }

    y.c = xc;
    y.e = ye;

    return y;
  };


  /*
   * Return a new Big whose value is the value of this Big modulo the value of Big y.
   */
  P.mod = function (y) {
    var ygtx,
      x = this,
      Big = x.constructor,
      a = x.s,
      b = (y = new Big(y)).s;

    if (!y.c[0]) throw Error(DIV_BY_ZERO);

    x.s = y.s = 1;
    ygtx = y.cmp(x) == 1;
    x.s = a;
    y.s = b;

    if (ygtx) return new Big(x);

    a = Big.DP;
    b = Big.RM;
    Big.DP = Big.RM = 0;
    x = x.div(y);
    Big.DP = a;
    Big.RM = b;

    return this.minus(x.times(y));
  };


  /*
   * Return a new Big whose value is the value of this Big plus the value of Big y.
   */
  P.plus = P.add = function (y) {
    var t,
      x = this,
      Big = x.constructor,
      a = x.s,
      b = (y = new Big(y)).s;

    // Signs differ?
    if (a != b) {
      y.s = -b;
      return x.minus(y);
    }

    var xe = x.e,
      xc = x.c,
      ye = y.e,
      yc = y.c;

    // Either zero? y is non-zero? x is non-zero? Or both are zero.
    if (!xc[0] || !yc[0]) return yc[0] ? y : new Big(xc[0] ? x : a * 0);

    xc = xc.slice();

    // Prepend zeros to equalise exponents.
    // Note: Faster to use reverse then do unshifts.
    if (a = xe - ye) {
      if (a > 0) {
        ye = xe;
        t = yc;
      } else {
        a = -a;
        t = xc;
      }

      t.reverse();
      for (; a--;) t.push(0);
      t.reverse();
    }

    // Point xc to the longer array.
    if (xc.length - yc.length < 0) {
      t = yc;
      yc = xc;
      xc = t;
    }

    a = yc.length;

    // Only start adding at yc.length - 1 as the further digits of xc can be left as they are.
    for (b = 0; a; xc[a] %= 10) b = (xc[--a] = xc[a] + yc[a] + b) / 10 | 0;

    // No need to check for zero, as +x + +y != 0 && -x + -y != 0

    if (b) {
      xc.unshift(b);
      ++ye;
    }

    // Remove trailing zeros.
    for (a = xc.length; xc[--a] === 0;) xc.pop();

    y.c = xc;
    y.e = ye;

    return y;
  };


  /*
   * Return a Big whose value is the value of this Big raised to the power n.
   * If n is negative, round to a maximum of Big.DP decimal places using rounding
   * mode Big.RM.
   *
   * n {number} Integer, -MAX_POWER to MAX_POWER inclusive.
   */
  P.pow = function (n) {
    var x = this,
      one = new x.constructor(1),
      y = one,
      isneg = n < 0;

    if (n !== ~~n || n < -MAX_POWER || n > MAX_POWER) throw Error(INVALID + 'exponent');
    if (isneg) n = -n;

    for (;;) {
      if (n & 1) y = y.times(x);
      n >>= 1;
      if (!n) break;
      x = x.times(x);
    }

    return isneg ? one.div(y) : y;
  };


  /*
   * Return a new Big whose value is the value of this Big rounded to a maximum of dp decimal
   * places using rounding mode rm.
   * If dp is not specified, round to 0 decimal places.
   * If rm is not specified, use Big.RM.
   *
   * dp? {number} Integer, 0 to MAX_DP inclusive.
   * rm? 0, 1, 2 or 3 (ROUND_DOWN, ROUND_HALF_UP, ROUND_HALF_EVEN, ROUND_UP)
   */
  P.round = function (dp, rm) {
    var Big = this.constructor;
    if (dp === UNDEFINED) dp = 0;
    else if (dp !== ~~dp || dp < 0 || dp > MAX_DP) throw Error(INVALID_DP);
    return round(new Big(this), dp, rm === UNDEFINED ? Big.RM : rm);
  };


  /*
   * Return a new Big whose value is the square root of the value of this Big, rounded, if
   * necessary, to a maximum of Big.DP decimal places using rounding mode Big.RM.
   */
  P.sqrt = function () {
    var r, c, t,
      x = this,
      Big = x.constructor,
      s = x.s,
      e = x.e,
      half = new Big(0.5);

    // Zero?
    if (!x.c[0]) return new Big(x);

    // Negative?
    if (s < 0) throw Error(NAME + 'No square root');

    // Estimate.
    s = Math.sqrt(x.toString());

    // Math.sqrt underflow/overflow?
    // Re-estimate: pass x to Math.sqrt as integer, then adjust the result exponent.
    if (s === 0 || s === 1 / 0) {
      c = x.c.join('');
      if (!(c.length + e & 1)) c += '0';
      r = new Big(Math.sqrt(c).toString());
      r.e = ((e + 1) / 2 | 0) - (e < 0 || e & 1);
    } else {
      r = new Big(s.toString());
    }

    e = r.e + (Big.DP += 4);

    // Newton-Raphson iteration.
    do {
      t = r;
      r = half.times(t.plus(x.div(t)));
    } while (t.c.slice(0, e).join('') !== r.c.slice(0, e).join(''));

    return round(r, Big.DP -= 4, Big.RM);
  };


  /*
   * Return a new Big whose value is the value of this Big times the value of Big y.
   */
  P.times = P.mul = function (y) {
    var c,
      x = this,
      Big = x.constructor,
      xc = x.c,
      yc = (y = new Big(y)).c,
      a = xc.length,
      b = yc.length,
      i = x.e,
      j = y.e;

    // Determine sign of result.
    y.s = x.s == y.s ? 1 : -1;

    // Return signed 0 if either 0.
    if (!xc[0] || !yc[0]) return new Big(y.s * 0);

    // Initialise exponent of result as x.e + y.e.
    y.e = i + j;

    // If array xc has fewer digits than yc, swap xc and yc, and lengths.
    if (a < b) {
      c = xc;
      xc = yc;
      yc = c;
      j = a;
      a = b;
      b = j;
    }

    // Initialise coefficient array of result with zeros.
    for (c = new Array(j = a + b); j--;) c[j] = 0;

    // Multiply.

    // i is initially xc.length.
    for (i = b; i--;) {
      b = 0;

      // a is yc.length.
      for (j = a + i; j > i;) {

        // Current sum of products at this digit position, plus carry.
        b = c[j] + yc[i] * xc[j - i - 1] + b;
        c[j--] = b % 10;

        // carry
        b = b / 10 | 0;
      }

      c[j] = (c[j] + b) % 10;
    }

    // Increment result exponent if there is a final carry, otherwise remove leading zero.
    if (b) ++y.e;
    else c.shift();

    // Remove trailing zeros.
    for (i = c.length; !c[--i];) c.pop();
    y.c = c;

    return y;
  };


  /*
   * Return a string representing the value of this Big in exponential notation to dp fixed decimal
   * places and rounded using Big.RM.
   *
   * dp? {number} Integer, 0 to MAX_DP inclusive.
   */
  P.toExponential = function (dp) {
    return stringify(this, 1, dp, dp);
  };


  /*
   * Return a string representing the value of this Big in normal notation to dp fixed decimal
   * places and rounded using Big.RM.
   *
   * dp? {number} Integer, 0 to MAX_DP inclusive.
   *
   * (-0).toFixed(0) is '0', but (-0.1).toFixed(0) is '-0'.
   * (-0).toFixed(1) is '0.0', but (-0.01).toFixed(1) is '-0.0'.
   */
  P.toFixed = function (dp) {
    return stringify(this, 2, dp, this.e + dp);
  };


  /*
   * Return a string representing the value of this Big rounded to sd significant digits using
   * Big.RM. Use exponential notation if sd is less than the number of digits necessary to represent
   * the integer part of the value in normal notation.
   *
   * sd {number} Integer, 1 to MAX_DP inclusive.
   */
  P.toPrecision = function (sd) {
    return stringify(this, 3, sd, sd - 1);
  };


  /*
   * Return a string representing the value of this Big.
   * Return exponential notation if this Big has a positive exponent equal to or greater than
   * Big.PE, or a negative exponent equal to or less than Big.NE.
   * Omit the sign for negative zero.
   */
  P.toString = function () {
    return stringify(this);
  };


  /*
   * Return a string representing the value of this Big.
   * Return exponential notation if this Big has a positive exponent equal to or greater than
   * Big.PE, or a negative exponent equal to or less than Big.NE.
   * Include the sign for negative zero.
   */
  P.valueOf = P.toJSON = function () {
    return stringify(this, 4);
  };


  // Export


  Big = _Big_();

  Big['default'] = Big.Big = Big;

  //AMD.
  if (typeof define === 'function' && define.amd) {
    define(function () { return Big; });

  // Node and other CommonJS-like environments that support module.exports.
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = Big;

  //Browser.
  } else {
    GLOBAL.Big = Big;
  }
})(this);

},{}],25:[function(require,module,exports){
const Day = require('@barchart/common-js/lang/Day'),
	Decimal = require('@barchart/common-js/lang/Decimal');

const PositionSummaryFrame = require('./../../../lib/data/PositionSummaryFrame'),
	TransactionType = require('./../../../lib/data/TransactionType');

describe('After the PositionSummaryFrame enumeration is initialized', () => {
	'use strict';

	describe('and yearly position summary ranges are processed for a transaction set that does not close', () => {
		let ranges;

		beforeEach(() => {
			const transactions = [
				{
					date: new Day(2015, 10, 20),
					snapshot: {
						open: new Decimal(1)
					},
					type: TransactionType.BUY
				},
				{
					date: new Day(2016, 11, 21),
					snapshot: {
						open: new Decimal(1)
					},
					type: TransactionType.BUY
				}
			];

			ranges = PositionSummaryFrame.YEARLY.getRanges(transactions);
		});

		it('should have three ranges (assuming the current year is 2018)', () => {
			expect(ranges.length).toEqual(3);
		});

		it('the first range should be from 12-31-2014 to 12-31-2015', () => {
			expect(ranges[0].start.format()).toEqual('2014-12-31');
			expect(ranges[0].end.format()).toEqual('2015-12-31');
		});

		it('the second range should be from 12-31-2015 to 12-31-2016', () => {
			expect(ranges[1].start.format()).toEqual('2015-12-31');
			expect(ranges[1].end.format()).toEqual('2016-12-31');
		});

		it('the third range should be from 12-31-2016 to 12-31-2017', () => {
			expect(ranges[2].start.format()).toEqual('2016-12-31');
			expect(ranges[2].end.format()).toEqual('2017-12-31');
		});
	});

	describe('and yearly position summary ranges are processed for a transaction set closes the same year', () => {
		let ranges;

		beforeEach(() => {
			const transactions = [
				{
					date: new Day(2015, 10, 20),
					snapshot: {
						open: new Decimal(1)
					},
					type: TransactionType.BUY
				},
				{
					date: new Day(2015, 11, 21),
					snapshot: {
						open: new Decimal(0)
					},
					type: TransactionType.SELL
				}
			];

			ranges = PositionSummaryFrame.YEARLY.getRanges(transactions);
		});

		it('should have one range', () => {
			expect(ranges.length).toEqual(1);
		});

		it('the first range should be from 12-31-2014 to 12-31-2015', () => {
			expect(ranges[0].start.format()).toEqual('2014-12-31');
			expect(ranges[0].end.format()).toEqual('2015-12-31');
		});
	});

	describe('and yearly position summary ranges are processed for a transaction set closes the next year', () => {
		let ranges;

		beforeEach(() => {
			const transactions = [
				{
					date: new Day(2015, 10, 20),
					snapshot: {
						open: new Decimal(1)
					},
					type: TransactionType.BUY
				},
				{
					date: new Day(2016, 11, 21),
					snapshot: {
						open: new Decimal(0)
					},
					type: TransactionType.SELL
				}
			];

			ranges = PositionSummaryFrame.YEARLY.getRanges(transactions);
		});

		it('should have two ranges', () => {
			expect(ranges.length).toEqual(2);
		});

		it('the first range should be from 12-31-2014 to 12-31-2015', () => {
			expect(ranges[0].start.format()).toEqual('2014-12-31');
			expect(ranges[0].end.format()).toEqual('2015-12-31');
		});

		it('the second range should be from 12-31-2015 to 12-31-2016', () => {
			expect(ranges[1].start.format()).toEqual('2015-12-31');
			expect(ranges[1].end.format()).toEqual('2016-12-31');
		});
	});

	describe('and yearly position summary ranges are processed for a transaction set closes in the current next year -- assuming its 2018', () => {
		let ranges;

		beforeEach(() => {
			const transactions = [
				{
					date: new Day(2015, 10, 20),
					snapshot: {
						open: new Decimal(1)
					},
					type: TransactionType.BUY
				},
				{
					date: new Day(2017, 11, 21),
					snapshot: {
						open: new Decimal(0)
					},
					type: TransactionType.SELL
				}
			];

			ranges = PositionSummaryFrame.YEARLY.getRanges(transactions);
		});

		it('should have two ranges', () => {
			expect(ranges.length).toEqual(3);
		});

		it('the first range should be from 12-31-2014 to 12-31-2015', () => {
			expect(ranges[0].start.format()).toEqual('2014-12-31');
			expect(ranges[0].end.format()).toEqual('2015-12-31');
		});

		it('the second range should be from 12-31-2015 to 12-31-2016', () => {
			expect(ranges[1].start.format()).toEqual('2015-12-31');
			expect(ranges[1].end.format()).toEqual('2016-12-31');
		});

		it('the third range should be from 12-31-2015 to 12-31-2016', () => {
			expect(ranges[2].start.format()).toEqual('2016-12-31');
			expect(ranges[2].end.format()).toEqual('2017-12-31');
		});
	});

	describe('and yearly position summary ranges are processed for a transaction set closed in 2016, but has after-the-face superfluous valuations in 2017 and 2018', () => {
		let ranges;

		beforeEach(() => {
			const transactions = [
				{
					date: new Day(2015, 10, 20),
					snapshot: {
						open: new Decimal(1)
					},
					type: TransactionType.BUY
				},
				{
					date: new Day(2016, 11, 21),
					snapshot: {
						open: new Decimal(0)
					},
					type: TransactionType.SELL
				},
				{
					date: new Day(2017, 11, 21),
					snapshot: {
						open: new Decimal(0)
					},
					type: TransactionType.VALUATION
				},
				{
					date: new Day(2017, 11, 21),
					snapshot: {
						open: new Decimal(0)
					},
					type: TransactionType.VALUATION
				}
			];

			ranges = PositionSummaryFrame.YEARLY.getRanges(transactions);
		});

		it('should have two ranges', () => {
			expect(ranges.length).toEqual(2);
		});

		it('the first range should be from 12-31-2014 to 12-31-2015', () => {
			expect(ranges[0].start.format()).toEqual('2014-12-31');
			expect(ranges[0].end.format()).toEqual('2015-12-31');
		});

		it('the second range should be from 12-31-2015 to 12-31-2016', () => {
			expect(ranges[1].start.format()).toEqual('2015-12-31');
			expect(ranges[1].end.format()).toEqual('2016-12-31');
		});
	});

	describe('and a year-to-date position summary ranges are processed for a transaction set that closed last year', () => {
		let ranges;

		beforeEach(() => {
			const transactions = [
				{
					date: new Day(2017, 1, 1),
					snapshot: {
						open: new Decimal(1)
					},
					type: TransactionType.BUY
				},
				{
					date: new Day(2017, 1, 2),
					snapshot: {
						open: new Decimal(0)
					},
					type: TransactionType.SELL
				}
			];

			ranges = PositionSummaryFrame.YTD.getRanges(transactions);
		});

		it('should have no ranges', () => {
			expect(ranges.length).toEqual(0);
		});
	});

	describe('and a year-to-date position summary ranges are processed for a transaction set that opened this year and has not yet closed', () => {
		let ranges;

		beforeEach(() => {
			const transactions = [
				{
					date: new Day(2018, 1, 1),
					snapshot: {
						open: new Decimal(100)
					},
					type: TransactionType.BUY
				}
			];

			ranges = PositionSummaryFrame.YTD.getRanges(transactions);
		});

		it('should have one range', () => {
			expect(ranges.length).toEqual(1);
		});

		it('the first range should be from 12-31-2017 to 12-31-2015', () => {
			expect(ranges[0].start.format()).toEqual('2017-12-31');
			expect(ranges[0].end.format()).toEqual('2018-12-31');
		});
	});

	describe('and a year-to-date position summary ranges are processed for a transaction set that opened and closed this year', () => {
		let ranges;

		beforeEach(() => {
			const transactions = [
				{
					date: new Day(2018, 1, 1),
					snapshot: {
						open: new Decimal(1)
					},
					type: TransactionType.BUY
				},
				{
					date: new Day(2018, 1, 2),
					snapshot: {
						open: new Decimal(0)
					},
					type: TransactionType.SELL
				}
			];

			ranges = PositionSummaryFrame.YTD.getRanges(transactions);
		});

		it('should have one range', () => {
			expect(ranges.length).toEqual(1);
		});

		it('the first range should be from 12-31-2017 to 12-31-2015', () => {
			expect(ranges[0].start.format()).toEqual('2017-12-31');
			expect(ranges[0].end.format()).toEqual('2018-12-31');
		});
	});

	describe('and getting the start date for yearly frames', () => {
		describe('for one year ago', function() {
			let start;

			beforeEach(() => {
				start = PositionSummaryFrame.YEARLY.getStartDate(1);
			});

			it('should be in December', () => {
				expect(start.month).toEqual(12);
			});

			it('should be on the 31st', () => {
				expect(start.day).toEqual(31);
			});

			it('should be two years ago', () => {
				expect(start.year).toEqual(Day.getToday().year - 2);
			});
		});

		describe('for two years ago', function() {
			let start;

			beforeEach(() => {
				start = PositionSummaryFrame.YEARLY.getStartDate(2);
			});

			it('should be in December', () => {
				expect(start.month).toEqual(12);
			});

			it('should be on the 31st', () => {
				expect(start.day).toEqual(31);
			});

			it('should be two years ago', () => {
				expect(start.year).toEqual(Day.getToday().year - 3);
			});
		});
	});
});

},{"./../../../lib/data/PositionSummaryFrame":2,"./../../../lib/data/TransactionType":3,"@barchart/common-js/lang/Day":13,"@barchart/common-js/lang/Decimal":14}],26:[function(require,module,exports){
const Currency = require('@barchart/common-js/lang/Currency'),
	Decimal = require('@barchart/common-js/lang/Decimal');

const InstrumentType = require('./../../../lib/data/InstrumentType');

const PositionContainer = require('./../../../lib/processing/PositionContainer'),
	PositionLevelDefinition = require('./../../../lib/processing/definitions/PositionLevelDefinition'),
	PositionTreeDefinition = require('./../../../lib/processing/definitions/PositionTreeDefinition');

describe('When a position container data is gathered', () => {
	'use strict';

	let positionCounter = 0;

	function getPosition(portfolio, symbol, currency) {
		return {
			portfolio: portfolio,
			position: (positionCounter++).toString(),
			instrument: {
				symbol: {
					barchart: symbol
				},
				currency: currency || Currency.USD,
				type: InstrumentType.EQUITY
			},
			snapshot: {
				basis: new Decimal(123),
				value: new Decimal(456),
				open: new Decimal(1),
				income: new Decimal(0),
				gain: new Decimal(0)
			}
		};
	}

	describe('for two portfolios, each with the same position, and the second portfolio with an addition position', () => {
		let portfolios;
		let positions;
		let summaries;

		beforeEach(() => {
			portfolios = [
				{
					portfolio: 'My First Portfolio',
					name: 'a'
				}, {
					portfolio: 'My Second Portfolio',
					name: 'b'
				}
			];

			positions = [
				getPosition('My First Portfolio', 'AAPL'),
				getPosition('My Second Portfolio', 'AAPL'),
				getPosition('My Second Portfolio', 'TSLA')
			];

			summaries = [ ];
		});

		describe('and a container is created grouping by total, portfolio, and instrument', () => {
			let name;
			let definitions;
			let container;

			beforeEach(() => {
				definitions = [
					new PositionTreeDefinition(name = 'the only tree', [
						new PositionLevelDefinition('Total', x => 'totals', x => 'Total', x => Currency.CAD),
						new PositionLevelDefinition('Portfolio', x => x.portfolio.portfolio, x => x.portfolio.name, x => Currency.CAD),
						new PositionLevelDefinition('Position', x => x.position.position, x => x.position.instrument.symbol.barchart, x =>  x.position.instrument.currency)
					])
				];

				try {
					container = new PositionContainer(definitions, portfolios, positions, summaries);
				} catch (e) {
					console.log(e);
				}
			});

			it('the "Total" group should have two children groups', () => {
				expect(container.getGroups(name, [ 'totals' ]).length).toEqual(2);
			});

			it('the "Total" group should have three items', () => {
				expect(container.getGroup(name, [ 'totals' ]).items.length).toEqual(3);
			});

			it('The "a" portfolio group should have one child group', () => {
				expect(container.getGroups(name, [ 'totals', 'My First Portfolio' ]).length).toEqual(1);
			});

			it('the "a" portfolio group should have one item', () => {
				expect(container.getGroup(name, [ 'totals', 'My First Portfolio' ]).items.length).toEqual(1);
			});

			it('The "b" portfolio group should have two child groups', () => {
				expect(container.getGroups(name, [ 'totals', 'My Second Portfolio' ]).length).toEqual(2);
			});

			it('the "b" portfolio group should have two items', () => {
				expect(container.getGroup(name, [ 'totals', 'My Second Portfolio' ]).items.length).toEqual(2);
			});
		});
	});
});

},{"./../../../lib/data/InstrumentType":1,"./../../../lib/processing/PositionContainer":4,"./../../../lib/processing/definitions/PositionLevelDefinition":7,"./../../../lib/processing/definitions/PositionTreeDefinition":8,"@barchart/common-js/lang/Currency":12,"@barchart/common-js/lang/Decimal":14}]},{},[25,26]);
