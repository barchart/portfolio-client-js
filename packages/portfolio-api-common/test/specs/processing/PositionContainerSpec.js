const Currency = require('@barchart/common-js/lang/Currency'),
	Decimal = require('@barchart/common-js/lang/Decimal');

const InstrumentType = require('./../../../lib/data/InstrumentType'),
	PositionSummaryFrame = require('./../../../lib/data/PositionSummaryFrame');

const PositionContainer = require('./../../../lib/processing/PositionContainer'),
	PositionLevelDefinition = require('./../../../lib/processing/definitions/PositionLevelDefinition'),
	PositionLevelType = require('./../../../lib/processing/definitions/PositionLevelType'),
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
				gain: new Decimal(0),
				buys: new Decimal(50),
				sells: new Decimal(0)
			}
		};
	}

	function getSummaries(position, frame, count) {
		const ranges = frame.getRecentRanges(count - 1);

		return ranges.map((range) => {
			return {
				portfolio: position.portfolio,
				position: position.position,
				frame: frame,
				start: {
					date: range.start,
					open: position.snapshot.open,
					value: position.snapshot.value,
					basis: position.snapshot.basis
				},
				end: {
					date: range.end,
					open: position.snapshot.open,
					value: position.snapshot.value,
					basis: position.snapshot.basis
				},
				period: {
					buys: new Decimal(0),
					sells: new Decimal(0),
					income: new Decimal(0),
					realized: new Decimal(0),
					unrealized: new Decimal(0)
				}
			};
		});
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

			summaries = positions.reduce((accumulator, position) => {
				accumulator = accumulator.concat(getSummaries(position, PositionSummaryFrame.YTD, 1));
				accumulator = accumulator.concat(getSummaries(position, PositionSummaryFrame.YEARLY, 3));

				return accumulator;
			}, [ ]);
		});

		describe('and a container is created grouping by total, portfolio, and instrument', () => {
			let name;
			let definitions;
			let container;

			beforeEach(() => {
				definitions = [
					new PositionTreeDefinition(name = 'the only tree', [
						new PositionLevelDefinition('Total', PositionLevelType.OTHER, x => 'totals', x => 'Total', x => Currency.CAD),
						new PositionLevelDefinition('Portfolio', PositionLevelType.PORTFOLIO, x => x.portfolio.portfolio, x => x.portfolio.name, x => Currency.CAD),
						new PositionLevelDefinition('Position', PositionLevelType.POSITION, x => x.position.position, x => x.position.instrument.symbol.barchart, x =>  x.position.instrument.currency)
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

			describe('and an item is pulled for one of the positions', function() {
				let item;

				let todayYear;
				let todayMonth;
				let todayDay;

				beforeEach(() => {
					item = container.getGroup(name, [ 'totals', 'My First Portfolio' ]).items[0];

					const today = new Date();

					todayYear = today.getFullYear();
					todayMonth = today.getMonth() + 1;
					todayDay = today.getDate();
				});

				it('the current summary should be a YTD summary for this year', () => {
					expect(item.currentSummary).toBe(summaries.find(s => s.position === item.position.position && s.frame === PositionSummaryFrame.YTD && s.start.date.format() === `${(todayYear - 1)}-12-31` && s.end.date.format() === `${(todayYear - 0)}-12-31`));
				});

				it('should have two previous summaries', () => {
					expect(item.previousSummaries.length).toEqual(3);
				});

				it('the previous (x1) summary should be a YEARLY summary for three years ago', () => {
					expect(item.previousSummaries[0]).toBe(summaries.find(s => s.position === item.position.position && s.frame === PositionSummaryFrame.YEARLY && s.start.date.format() === `${(todayYear - 4)}-12-31` && s.end.date.format() === `${(todayYear - 3)}-12-31`));
				});

				it('the previous (x2) summary should be a YEARLY summary for the year before last', () => {
					expect(item.previousSummaries[1]).toBe(summaries.find(s => s.position === item.position.position && s.frame === PositionSummaryFrame.YEARLY && s.start.date.format() === `${(todayYear - 3)}-12-31` && s.end.date.format() === `${(todayYear - 2)}-12-31`));
				});

				it('the previous (x3) summary should be a YEARLY summary for last year', () => {
					expect(item.previousSummaries[2]).toBe(summaries.find(s => s.position === item.position.position && s.frame === PositionSummaryFrame.YEARLY && s.start.date.format() === `${(todayYear - 2)}-12-31` && s.end.date.format() === `${(todayYear - 1)}-12-31`));
				});
			});
		});
	});
});
