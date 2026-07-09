const Currency = require('@barchart/common-js/lang/Currency'),
	CurrencyTranslator = require('@barchart/common-js/lang/CurrencyTranslator');
const Day = require('@barchart/common-js/lang/Day');

const FilterMode = require('./../../../lib/data/FilterMode'),
	PositionSummaryFrame = require('./../../../lib/data/PositionSummaryFrame');

const PositionGroup = require('./../../../lib/processing/PositionGroup'),
	PositionItem = require('./../../../lib/processing/PositionItem'),
	PositionLevelDefinition = require('./../../../lib/processing/definitions/PositionLevelDefinition'),
	PositionLevelType = require('./../../../lib/processing/definitions/PositionLevelType');

const positionTestFactory = require('../../utils/processing/PositionTestFactory');

describe('When a position group is used', () => {
	'use strict';

	function createItem(symbol, portfolioName) {
		const portfolio = positionTestFactory.createPortfolio(portfolioName || 'My Portfolio', portfolioName || 'Portfolio');
		const position = positionTestFactory.createPosition(portfolio.portfolio, symbol);
		const currentSummary = positionTestFactory.createSummaries(position, PositionSummaryFrame.YTD, 1)[0];
		const previousSummaries = positionTestFactory.createSummaries(position, PositionSummaryFrame.YEARLY, 3);

		return new PositionItem(portfolio, position, currentSummary, previousSummaries);
	}

	function createDefinition(type) {
		return new PositionLevelDefinition(
			type.description,
			type,
			item => item.position.position,
			item => item.position.instrument.symbol.barchart,
			item => item.position.instrument.currency
		);
	}

	function createGroup(type, items) {
		const firstItem = items[0] || null;
		const key = firstItem ? firstItem.position.position : 'group';
		const description = firstItem ? firstItem.position.instrument.symbol.barchart : 'Group';

		return new PositionGroup(createDefinition(type), items, Currency.USD, new CurrencyTranslator([ ]), key, description, false);
	}

	beforeEach(() => {
		positionTestFactory.resetPositionCounter();
	});

	it('should expose binding data for the formatted group payload', () => {
		const item = createItem('AAPL');
		const group = createGroup(PositionLevelType.POSITION, [ item ]);

		expect({
			data: group.binding.data,
			description: group.binding.description,
			formatted: group.binding.formatted,
			key: group.binding.key
		}).toEqual({
			data: group.data,
			description: group.description,
			formatted: group.data,
			key: group.key
		});
	});

	it('should execute group actions from the binding', () => {
		const item = createItem('AAPL');
		const group = createGroup(PositionLevelType.POSITION, [ item ]);
		const excludedChanges = [ ];

		group.registerGroupExcludedChangeHandler(value => excludedChanges.push(value));

		group.binding.setExcluded(true);
		group.binding.setFilterMode(FilterMode.CLOSED);

		expect({
			excluded: group.excluded,
			excludedChanges: excludedChanges,
			formattedExcluded: group.data.excluded,
			filterModeCode: group.data.filterModeCode
		}).toEqual({
			excluded: true,
			excludedChanges: [ true ],
			formattedExcluded: true,
			filterModeCode: FilterMode.CLOSED.code
		});
	});

	it('should expose formatted position data for a single-position group', () => {
		const item = createItem('AAPL');
		const group = createGroup(PositionLevelType.POSITION, [ item ]);

		expect({
			instruments: group.data.positions.map(position => position.instrument),
			positions: group.data.positions.map(position => position.position),
			single: group.single
		}).toEqual({
			instruments: [ item.position.instrument ],
			positions: [ item.position.position ],
			single: true
		});
	});

	it('should update quote fields when an item quote changes', () => {
		const item = createItem('AAPL');
		const group = createGroup(PositionLevelType.POSITION, [ item ]);

		item.setQuote({
			highPrice: 205,
			lastPrice: 200,
			lowPrice: 195,
			openPrice: 198,
			previousPrice: 190,
			priceChange: 10,
			symbol: 'AAPL'
		});

		expect({
			currentPrice: group.data.currentPrice,
			quoteChange: group.data.quoteChange,
			quoteHigh: group.data.quoteHigh,
			quoteLow: group.data.quoteLow,
			quoteOpen: group.data.quoteOpen
		}).toEqual({
			currentPrice: '200.00',
			quoteChange: '10.00',
			quoteHigh: '205.00',
			quoteLow: '195.00',
			quoteOpen: '198.00'
		});
	});

	it('should update today price fields for a homogeneous group when item quotes change', () => {
		const firstItem = createItem('AAPL', 'First Portfolio');
		const secondItem = createItem('AAPL', 'Second Portfolio');
		const group = createGroup(PositionLevelType.INSTRUMENT, [ firstItem, secondItem ]);
		const today = Day.getToday();
		const quote = {
			lastDay: today,
			lastPrice: 200,
			previousPrice: 190,
			symbol: 'AAPL'
		};
		const exchange = {
			code: 'NYSE',
			currentDay: today,
			currentOpened: true
		};

		firstItem.setExchangeStatus(exchange);
		secondItem.setExchangeStatus(exchange);

		firstItem.setQuote(quote);
		secondItem.setQuote(quote);

		expect({
			gainToday: group.data.gainToday,
			homogeneous: group.homogeneous,
			single: group.single,
			todayExchange: group.data.todayExchange,
			todayPrice: group.data.todayPrice,
			todayPricePrevious: group.data.todayPricePrevious,
			todayQuote: group.data.todayQuote,
			unrealizedToday: group.data.unrealizedToday
		}).toEqual({
			gainToday: '20.00',
			homogeneous: true,
			single: false,
			todayExchange: today.format(),
			todayPrice: '200.00',
			todayPricePrevious: '190.00',
			todayQuote: today.format(),
			unrealizedToday: '20.00'
		});
	});

	it('should format fundamental data for a single-position group', () => {
		const item = createItem('AAPL');
		const group = createGroup(PositionLevelType.POSITION, [ item ]);

		item.setPositionFundamentalData({
			raw: {
				percentChange1m: 0.01,
				percentChange1y: 0.02,
				percentChange3m: 0.03,
				percentChangeYtd: 0.04
			}
		});

		expect({
			fundamental: group.data.fundamental,
			percentChange1m: group.data.fundamental.raw.percentChange1m,
			percentChange1y: group.data.fundamental.raw.percentChange1y,
			percentChange3m: group.data.fundamental.raw.percentChange3m,
			percentChangeYtd: group.data.fundamental.raw.percentChangeYtd
		}).toEqual({
			fundamental: {
				raw: {
					percentChange1m: 0.01,
					percentChange1y: 0.02,
					percentChange3m: 0.03,
					percentChangeYtd: 0.04
				}
			},
			percentChange1m: 0.01,
			percentChange1y: 0.02,
			percentChange3m: 0.03,
			percentChangeYtd: 0.04
		});
	});

	it('should average fundamental data for multi-position groups', () => {
		const firstItem = createItem('AAPL', 'First Portfolio');
		const secondItem = createItem('MSFT', 'Second Portfolio');
		const group = createGroup(PositionLevelType.OTHER, [ firstItem, secondItem ]);

		firstItem.setPositionFundamentalData({
			raw: {
				percentChange1m: 0.01
			}
		});

		secondItem.setPositionFundamentalData({
			raw: {
				percentChange1m: 0.03
			}
		});

		expect({
			homogeneous: group.homogeneous,
			percentChange1m: group.data.fundamental.percentChange1m,
			single: group.single
		}).toEqual({
			homogeneous: false,
			percentChange1m: '+2.00%',
			single: false
		});
	});
});
