const Day = require('@barchart/common-js/lang/Day'),
	Decimal = require('@barchart/common-js/lang/Decimal');

const InstrumentType = require('./../../../lib/data/InstrumentType'),
	PositionDirection = require('./../../../lib/data/PositionDirection'),
	PositionSummaryFrame = require('./../../../lib/data/PositionSummaryFrame');

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

	it('should calculate holding-period and current-period return data', () => {
		const today = new Day(2026, 7, 16);
		const openingDate = today.subtractDays(365);
		const createCurrentPeriodSummary = (frame) => {
			const summary = positionTestFactory.createSummaries(position, frame, 1)[0];

			summary.start.value = new Decimal(100);
			summary.end.value = new Decimal(100);
			summary.end.basis = new Decimal(-100);

			return summary;
		};

		position.opening = { date: openingDate };
		position.snapshot.basis = new Decimal(-100);
		position.snapshot.buys = new Decimal(-100);
		position.snapshot.open = new Decimal(1);
		position.snapshot.value = new Decimal(100);

		currentSummary.start.value = new Decimal(100);
		currentSummary.end.value = new Decimal(100);
		currentSummary.end.basis = new Decimal(-100);
		currentSummary.end.open = new Decimal(1);

		item = new PositionItem(portfolio, position, currentSummary, previousSummaries, false, today, {
			weekToDate: createCurrentPeriodSummary(PositionSummaryFrame.WTD),
			monthToDate: createCurrentPeriodSummary(PositionSummaryFrame.MTD)
		});

		item.setQuote({
			lastDay: today,
			lastPrice: 110,
			previousPrice: 100,
			symbol: 'AAPL'
		});

		expect({
			annualizedReturnPercent: Number(item.data.annualizedReturnPercent.toFloat().toFixed(10)),
			daysHeld: item.data.daysHeld,
			monthToDatePercent: item.data.monthToDatePercent.toFloat(),
			todaysGainLossPercent: item.data.todaysGainLossPercent.toFloat(),
			weekToDatePercent: item.data.weekToDatePercent.toFloat(),
			weeksHeld: item.data.weeksHeld
		}).toEqual({
			annualizedReturnPercent: 0.1,
			daysHeld: 365,
			monthToDatePercent: 0.1,
			todaysGainLossPercent: 0.1,
			weekToDatePercent: 0.1,
			weeksHeld: 52
		});
	});

	it('should leave holding-period data unavailable without a reliable opening date', () => {
		expect({
			annualizedReturnPercent: item.data.annualizedReturnPercent,
			daysHeld: item.data.daysHeld,
			monthToDatePercent: item.data.monthToDatePercent,
			weekToDatePercent: item.data.weekToDatePercent,
			weeksHeld: item.data.weeksHeld
		}).toEqual({
			annualizedReturnPercent: null,
			daysHeld: null,
			monthToDatePercent: null,
			weekToDatePercent: null,
			weeksHeld: null
		});
	});

	it('should calculate a closed position holding period through its closing date', () => {
		const today = new Day(2026, 7, 16);

		position.opening = { date: today.subtractDays(100) };
		position.closing = { date: today.subtractDays(40) };
		position.snapshot.open = Decimal.ZERO;
		currentSummary.end.open = Decimal.ZERO;

		item = new PositionItem(portfolio, position, currentSummary, previousSummaries, false, today);

		expect({
			daysHeld: item.data.daysHeld,
			weeksHeld: item.data.weeksHeld
		}).toEqual({
			daysHeld: 60,
			weeksHeld: 8
		});
	});

	it('should leave a closed position holding period unavailable without a reliable closing date', () => {
		const today = new Day(2026, 7, 16);

		position.opening = { date: today.subtractDays(100) };
		position.snapshot.open = Decimal.ZERO;
		currentSummary.end.open = Decimal.ZERO;

		item = new PositionItem(portfolio, position, currentSummary, previousSummaries, false, today);

		expect({
			daysHeld: item.data.daysHeld,
			weeksHeld: item.data.weeksHeld
		}).toEqual({
			daysHeld: null,
			weeksHeld: null
		});
	});

	it('should use the absolute previous value for short-position today returns', () => {
		const today = new Day(2026, 7, 16);

		position.snapshot.initial = PositionDirection.SHORT;
		position.snapshot.open = new Decimal(-1);
		currentSummary.end.open = new Decimal(-1);

		item = new PositionItem(portfolio, position, currentSummary, previousSummaries, false, today);
		item.setQuote({
			lastDay: today,
			lastPrice: 90,
			previousPrice: 100,
			symbol: 'AAPL'
		});

		expect(item.data.todaysGainLossPercent.toFloat()).toEqual(0.1);
	});

	it('should safely return zero for a closed position without a previous-value denominator', () => {
		const today = new Day(2026, 7, 16);

		position.snapshot.open = Decimal.ZERO;
		position.latest = { date: today, gain: new Decimal(10) };
		currentSummary.end.open = Decimal.ZERO;

		item = new PositionItem(portfolio, position, currentSummary, previousSummaries, false, today);
		item.setQuote({
			lastDay: today,
			lastPrice: 110,
			previousPrice: 100,
			symbol: 'AAPL'
		});

		expect(item.data.todaysGainLossPercent.toFloat()).toEqual(0);
	});

	it('should not annualize CASH positions', () => {
		const today = new Day(2026, 7, 16);

		position.opening = { date: today.subtractDays(365) };
		position.instrument.type = InstrumentType.CASH;

		item = new PositionItem(portfolio, position, currentSummary, previousSummaries, false, today);

		expect({
			annualizedReturnPercent: item.data.annualizedReturnPercent,
			daysHeld: item.data.daysHeld
		}).toEqual({
			annualizedReturnPercent: null,
			daysHeld: 365
		});
	});

	it('should not annualize positions held for less than one year', () => {
		const today = new Day(2026, 7, 16);

		position.opening = { date: today.subtractDays(3) };
		position.snapshot.basis = new Decimal(-1);
		position.snapshot.buys = new Decimal(-1);
		position.snapshot.value = new Decimal(1);
		currentSummary.end.basis = new Decimal(-1);
		currentSummary.end.open = Decimal.ONE;
		currentSummary.end.value = Decimal.ONE;

		item = new PositionItem(portfolio, position, currentSummary, previousSummaries, false, today);
		item.setQuote({ lastDay: today, lastPrice: 48.04, symbol: 'AAPL' });

		expect({
			annualizedReturnPercent: item.data.annualizedReturnPercent,
			daysHeld: item.data.daysHeld,
			totalPercent: Number(item.data.totalPercent.toFloat().toFixed(10))
		}).toEqual({
			annualizedReturnPercent: null,
			daysHeld: 3,
			totalPercent: 47.04
		});
	});

	it('should not annualize a return with a zero since-inception divisor', () => {
		const today = new Day(2026, 7, 16);

		position.opening = { date: today.subtractDays(365) };
		position.snapshot.buys = Decimal.ZERO;

		item = new PositionItem(portfolio, position, currentSummary, previousSummaries, false, today);

		expect(item.data.annualizedReturnPercent).toEqual(null);
	});
});
