const PositionSummaryFrame = require('./../../../lib/data/PositionSummaryFrame');

const PositionItem = require('./../../../lib/processing/PositionItem');

const positionTestFactory = require('../../utils/processing/PositionTestFactory');

describe('When a position item is used', () => {
	'use strict';

	let portfolio;
	let position;
	let currentSummary;
	let previousSummaries;
	let item;

	beforeEach(() => {
		positionTestFactory.resetPositionCounter();

		portfolio = positionTestFactory.createPortfolio('My Portfolio', 'Portfolio');
		position = positionTestFactory.createPosition(portfolio.portfolio, 'AAPL');
		currentSummary = positionTestFactory.createSummaries(position, PositionSummaryFrame.YTD, 1)[0];
		previousSummaries = positionTestFactory.createSummaries(position, PositionSummaryFrame.YEARLY, 3);

		item = new PositionItem(portfolio, position, currentSummary, previousSummaries);
	});

	it('should expose the portfolio, position, currency, and summaries supplied to the constructor', () => {
		expect({
			currency: item.currency,
			currentSummary: item.currentSummary,
			portfolio: item.portfolio,
			position: item.position,
			previousSummaries: item.previousSummaries
		}).toEqual({
			currency: position.instrument.currency,
			currentSummary: currentSummary,
			portfolio: portfolio,
			position: position,
			previousSummaries: previousSummaries
		});
	});

	it('should update quote state and notify quote observers', () => {
		const changes = [ ];
		const firstQuote = { lastPrice: 200, symbol: 'AAPL' };
		const duplicateQuote = { lastPrice: 200, symbol: 'AAPL' };
		const secondQuote = { lastPrice: 201, symbol: 'AAPL' };

		item.registerQuoteChangeHandler(quote => changes.push(quote));

		item.setQuote(firstQuote);
		item.setQuote(duplicateQuote);
		item.setQuote(secondQuote);

		expect({
			changes: changes,
			currentPrice: item.currentPrice,
			previousQuote: item.previousQuote,
			quote: item.quote
		}).toEqual({
			changes: [ firstQuote, secondQuote ],
			currentPrice: 201,
			previousQuote: firstQuote,
			quote: secondQuote
		});
	});

	it('should force a quote update when requested', () => {
		const changes = [ ];
		const firstQuote = { lastPrice: 200, symbol: 'AAPL' };
		const duplicateQuote = { lastPrice: 200, symbol: 'AAPL' };

		item.registerQuoteChangeHandler(quote => changes.push(quote));

		item.setQuote(firstQuote);
		item.setQuote(duplicateQuote, true);

		expect({
			changes: changes,
			previousQuote: item.previousQuote,
			quote: item.quote
		}).toEqual({
			changes: [ firstQuote, duplicateQuote ],
			previousQuote: firstQuote,
			quote: duplicateQuote
		});
	});

	it('should update observable status fields', () => {
		const newsChanges = [ ];
		const fundamentalChanges = [ ];
		const lockChanges = [ ];
		const calculatingChanges = [ ];
		const fundamental = {
			raw: {
				percentChange1m: 0.01
			}
		};

		item.registerNewsExistsChangeHandler(value => newsChanges.push(value));
		item.registerFundamentalDataChangeHandler(value => fundamentalChanges.push(value));
		item.registerLockChangeHandler(value => lockChanges.push(value));
		item.registerCalculatingChangeHandler(value => calculatingChanges.push(value));

		item.setNewsArticleExists(true);
		item.setPositionFundamentalData(fundamental);
		item.setPositionLock(Object.assign({ }, position, { system: { locked: true } }));
		item.setPositionCalculating(Object.assign({ }, position, { system: { calculate: { processors: 1 } } }));

		expect({
			calculating: item.data.calculating,
			calculatingChanges: calculatingChanges,
			fundamental: item.data.fundamental,
			fundamentalChanges: fundamentalChanges,
			locked: item.data.locked,
			lockChanges: lockChanges,
			newsChanges: newsChanges,
			newsExists: item.data.newsExists
		}).toEqual({
			calculating: true,
			calculatingChanges: [ true ],
			fundamental: fundamental,
			fundamentalChanges: [ fundamental ],
			locked: true,
			lockChanges: [ true ],
			newsChanges: [ true ],
			newsExists: true
		});
	});

	it('should reject portfolio updates which move the position to another portfolio', () => {
		expect(() => item.updatePortfolio(positionTestFactory.createPortfolio('Other Portfolio', 'Other'))).toThrow();
	});
});
