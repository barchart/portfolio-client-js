const Day = require('@barchart/common-js/lang/Day'),
	Decimal = require('@barchart/common-js/lang/Decimal');

const PositionSummaryFrame = require('./../../../lib/data/PositionSummaryFrame'),
	TransactionType = require('./../../../lib/data/TransactionType');

describe('After the PositionSummaryFrame enumeration is initialized', () => {
	'use strict';

	function formatRange(range) {
		return {
			end: range.end.format(),
			start: range.start.format()
		};
	}

	describe('and yearly position summary ranges are processed for a transaction set that does not close', () => {
		let ranges;

		beforeEach(() => {
			let getFullYear = Date.prototype.getFullYear;

			Date.prototype.getFullYear = () => { return 2021; };

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

			Date.prototype.getFullYear = getFullYear;
		});

		it('should have six ranges (assuming the current year is 2021)', () => {
			expect(ranges.length).toEqual(6);
		});

		it('the first range should be from 12-31-2014 to 12-31-2015', () => {
			expect(formatRange(ranges[0])).toEqual({ end: '2015-12-31', start: '2014-12-31' });
		});

		it('the second range should be from 12-31-2015 to 12-31-2016', () => {
			expect(formatRange(ranges[1])).toEqual({ end: '2016-12-31', start: '2015-12-31' });
		});

		it('the third range should be from 12-31-2016 to 12-31-2017', () => {
			expect(formatRange(ranges[2])).toEqual({ end: '2017-12-31', start: '2016-12-31' });
		});

		it('the fourth range should be from 12-31-2017 to 12-31-2018', () => {
			expect(formatRange(ranges[3])).toEqual({ end: '2018-12-31', start: '2017-12-31' });
		});

		it('the fifth range should be from 12-31-2018 to 12-31-2019', () => {
			expect(formatRange(ranges[4])).toEqual({ end: '2019-12-31', start: '2018-12-31' });
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
			expect(formatRange(ranges[0])).toEqual({ end: '2015-12-31', start: '2014-12-31' });
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
			expect(formatRange(ranges[0])).toEqual({ end: '2015-12-31', start: '2014-12-31' });
		});

		it('the second range should be from 12-31-2015 to 12-31-2016', () => {
			expect(formatRange(ranges[1])).toEqual({ end: '2016-12-31', start: '2015-12-31' });
		});
	});

	describe('and yearly position summary ranges are processed for a transaction set that opens in 2015 and closes in 2017', () => {
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

		it('should have three ranges', () => {
			expect(ranges.length).toEqual(3);
		});

		it('the first range should be from 12-31-2014 to 12-31-2015', () => {
			expect(formatRange(ranges[0])).toEqual({ end: '2015-12-31', start: '2014-12-31' });
		});

		it('the second range should be from 12-31-2015 to 12-31-2016', () => {
			expect(formatRange(ranges[1])).toEqual({ end: '2016-12-31', start: '2015-12-31' });
		});

		it('the third range should be from 12-31-2015 to 12-31-2016', () => {
			expect(formatRange(ranges[2])).toEqual({ end: '2017-12-31', start: '2016-12-31' });
		});
	});

	describe('and yearly position summary ranges are processed for a transaction set that opens in 2015 and closes in 2016, but has after-the-fact superfluous valuations in 2017 and 2018', () => {
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
			expect(formatRange(ranges[0])).toEqual({ end: '2015-12-31', start: '2014-12-31' });
		});

		it('the second range should be from 12-31-2015 to 12-31-2016', () => {
			expect(formatRange(ranges[1])).toEqual({ end: '2016-12-31', start: '2015-12-31' });
		});
	});

	describe('and yearly position summary ranges are processed for a transaction set that opens in the current year', () => {
		let ranges;

		beforeEach(() => {
			const transactions = [
				{
					date: Day.getToday(),
					snapshot: {
						open: new Decimal(1)
					},
					type: TransactionType.BUY
				}
			];

			ranges = PositionSummaryFrame.YEARLY.getRanges(transactions);
		});

		it('should have zero ranges', () => {
			expect(ranges.length).toEqual(0);
		});
	});

	describe('and monthly position summary ranges are processed for a transaction set that does not close', () => {
		let ranges;

		beforeEach(() => {
			const transactions = [
				{
					date: new Day(2018, 12, 20),
					snapshot: {
						open: new Decimal(1)
					},
					type: TransactionType.BUY
				},
				{
					date: new Day(2019, 2, 21),
					snapshot: {
						open: new Decimal(1)
					},
					type: TransactionType.BUY
				}
			];

			ranges = PositionSummaryFrame.MONTHLY.getRanges(transactions);
		});

		it('should have at least two ranges', () => {
			expect(ranges.length > 1).toEqual(true);
		});

		it('the first range should be from 11-30-2018 to 12-31-2018', () => {
			expect(formatRange(ranges[0])).toEqual({ end: '2018-12-31', start: '2018-11-30' });
		});

		it('the last range should be for the previous month', () => {
			const today = Day.getToday();

			expect(formatRange(ranges[ranges.length - 1])).toEqual({
				end: today.subtractMonths(1).getEndOfMonth().format(),
				start: today.subtractMonths(2).getEndOfMonth().format()
			});
		});
	});

	describe('and monthly position summary ranges are processed for a transaction set closes the same month', () => {
		let ranges;

		beforeEach(() => {
			const transactions = [
				{
					date: new Day(2018, 12, 1),
					snapshot: {
						open: new Decimal(1)
					},
					type: TransactionType.BUY
				},
				{
					date: new Day(2018, 12, 31),
					snapshot: {
						open: new Decimal(0)
					},
					type: TransactionType.SELL
				}
			];

			ranges = PositionSummaryFrame.MONTHLY.getRanges(transactions);
		});

		it('should have one range', () => {
			expect(ranges.length).toEqual(1);
		});

		it('the first range should be from 11-30-2018 to 12-31-2018', () => {
			expect(formatRange(ranges[0])).toEqual({ end: '2018-12-31', start: '2018-11-30' });
		});
	});

	describe('and monthly position summary ranges are processed for a transaction set closes the next month', () => {
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
					date: new Day(2015, 11, 20),
					snapshot: {
						open: new Decimal(0)
					},
					type: TransactionType.SELL
				}
			];

			ranges = PositionSummaryFrame.MONTHLY.getRanges(transactions);
		});

		it('should have two ranges', () => {
			expect(ranges.length).toEqual(2);
		});

		it('the first range should be from 09-30-2015 to 10-31-2015', () => {
			expect(formatRange(ranges[0])).toEqual({ end: '2015-10-31', start: '2015-09-30' });
		});

		it('the second range should be from 10-31-2015 to 11-30-2015', () => {
			expect(formatRange(ranges[1])).toEqual({ end: '2015-11-30', start: '2015-10-31' });
		});
	});

	describe('and monthly position summary ranges are processed for a transaction set that opens in the current month', () => {
		let ranges;

		beforeEach(() => {
			const transactions = [
				{
					date: Day.getToday(),
					snapshot: {
						open: new Decimal(1)
					},
					type: TransactionType.BUY
				}
			];

			ranges = PositionSummaryFrame.MONTHLY.getRanges(transactions);
		});

		it('should have zero ranges', () => {
			expect(ranges.length).toEqual(0);
		});
	});

	describe('and a year-to-date position summary ranges are processed for a transaction set that closed in 2017', () => {
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

	describe('and a year-to-date position summary ranges are processed for a transaction set that opened last year and has not yet closed (assuming its 2021)', () => {
		let ranges;

		beforeEach(() => {
			let getFullYear = Date.prototype.getFullYear;

			Date.prototype.getFullYear = () => { return 2021; };

			const transactions = [
				{
					date: new Day(2019, 1, 1),
					snapshot: {
						open: new Decimal(100)
					},
					type: TransactionType.BUY
				}
			];

			ranges = PositionSummaryFrame.YTD.getRanges(transactions);

			Date.prototype.getFullYear = getFullYear;
		});

		it('should have one range', () => {
			expect(ranges.length).toEqual(1);
		});

		it('the first range should be from 12-31-2020 to 12-31-2021', () => {
			expect(formatRange(ranges[0])).toEqual({ end: '2021-12-31', start: '2020-12-31' });
		});
	});

	describe('and a year-to-date position summary ranges are processed for a transaction set that that opened and closed in 2020', () => {
		let ranges;

		beforeEach(() => {
			let getFullYear = Date.prototype.getFullYear;

			Date.prototype.getFullYear = () => { return 2021; };

			const transactions = [
				{
					date: new Day(2021, 1, 1),
					snapshot: {
						open: new Decimal(1)
					},
					type: TransactionType.BUY
				},
				{
					date: new Day(2021, 1, 2),
					snapshot: {
						open: new Decimal(0)
					},
					type: TransactionType.SELL
				}
			];

			ranges = PositionSummaryFrame.YTD.getRanges(transactions);

			Date.prototype.getFullYear = getFullYear;
		});

		it('should have one range', () => {
			expect(ranges.length).toEqual(1);
		});

		it('the first range should be from 12-31-2020 to 12-31-2021', () => {
			expect(formatRange(ranges[0])).toEqual({ end: '2021-12-31', start: '2020-12-31' });
		});
	});

	describe('and getting the start date for yearly frames', () => {
		describe('for one year ago', () => {
			let start;
			let today;

			beforeEach(() => {
				start = PositionSummaryFrame.YEARLY.getStartDate(1);
				today = new Date();
			});

			it('should be in December', () => {
				expect(start.month).toEqual(12);
			});

			it('should be on the 31st', () => {
				expect(start.day).toEqual(31);
			});

			it('should be two years ago', () => {
				expect(start.year).toEqual(today.getFullYear() - 2);
			});
		});

		describe('for two years ago', () => {
			let start;
			let today;

			beforeEach(() => {
				start = PositionSummaryFrame.YEARLY.getStartDate(2);
				today = new Date();
			});

			it('should be in December', () => {
				expect(start.month).toEqual(12);
			});

			it('should be on the 31st', () => {
				expect(start.day).toEqual(31);
			});

			it('should be three years ago', () => {
				expect(start.year).toEqual(today.getFullYear() - 3);
			});
		});
	});

	describe('and recent ranges are calculated', () => {
		let todayYear;
		let todayMonth;
		let todayDay;

		beforeEach(() => {
			const today = new Date();

			todayYear = today.getFullYear();
			todayMonth = today.getMonth() + 1;
			todayDay = today.getDate();
		});

		describe('the most recent YTD frame', () => {
			let ranges;

			beforeEach(() => {
				ranges = PositionSummaryFrame.YTD.getRecentRanges(0);
			});

			it('should contain one range', () => {
				expect(ranges.length).toEqual(1);
			});

			it('the range should begin at the end of last year', () => {
				expect(ranges[0].start.format()).toEqual(`${todayYear - 1}-12-31`);
			});

			it('the range should end at the end of this year', () => {
				expect(ranges[0].end.format()).toEqual(`${todayYear}-12-31`);
			});
		});

		describe('the three most recent YEARLY frames', () => {
			let ranges;

			beforeEach(() => {
				ranges = PositionSummaryFrame.YEARLY.getRecentRanges(2);
			});

			it('should contain three range', () => {
				expect(ranges.length).toEqual(3);
			});

			it('the first range should begin at the end of this year (minus three years)', () => {
				expect(ranges[0].start.format()).toEqual(`${todayYear - 4}-12-31`);
			});

			it('the first range should end at the end of this year (minus two years)', () => {
				expect(ranges[0].end.format()).toEqual(`${todayYear - 3}-12-31`);
			});

			it('the second range should begin at the end of this year (minus two years)', () => {
				expect(ranges[1].start.format()).toEqual(`${todayYear - 3}-12-31`);
			});

			it('the second range should end at the end of this year (minus one years)', () => {
				expect(ranges[1].end.format()).toEqual(`${todayYear - 2}-12-31`);
			});

			it('the third range should begin at the end of the year before last', () => {
				expect(ranges[2].start.format()).toEqual(`${todayYear - 2}-12-31`);
			});

			it('the third range should end at the end of last year', () => {
				expect(ranges[2].end.format()).toEqual(`${todayYear - 1}-12-31`);
			});
		});
	});

	describe('and current to-date frame boundaries are calculated', () => {
		const thursday = new Day(2026, 7, 16);
		const createClosedTransactions = (closingDate) => [
			{
				date: closingDate.subtractDays(1),
				snapshot: { open: Decimal.ONE },
				type: TransactionType.BUY
			},
			{
				date: closingDate,
				snapshot: { open: Decimal.ZERO },
				type: TransactionType.SELL
			}
		];

		it('the WTD frame should use the prior Sunday as its opening boundary', () => {
			const start = PositionSummaryFrame.WTD.getStartDate(0, thursday);

			expect(start.format()).toEqual('2026-07-12');
		});

		it('the WTD frame should keep Sunday in the week that just ended', () => {
			const start = PositionSummaryFrame.WTD.getStartDate(0, new Day(2026, 7, 19));

			expect(start.format()).toEqual('2026-07-12');
		});

		it('the WTD range should cover Monday through Sunday', () => {
			const today = Day.getToday();
			const ranges = PositionSummaryFrame.WTD.getRangesFromDate(today);
			const start = PositionSummaryFrame.WTD.getStartDate(0, today);

			expect(formatRange(ranges[0])).toEqual({ end: start.addDays(7).format(), start: start.format() });
		});

		it('the WTD frame should exclude a position closed on its opening boundary', () => {
			const start = PositionSummaryFrame.WTD.getStartDate(0);
			const ranges = PositionSummaryFrame.WTD.getRanges(createClosedTransactions(start));

			expect(ranges.length).toEqual(0);
		});

		it('the MTD frame should use the prior month end as its opening boundary', () => {
			const start = PositionSummaryFrame.MTD.getStartDate(0, thursday);

			expect(start.format()).toEqual('2026-06-30');
		});

		it('the MTD range should end at the current month end', () => {
			const today = Day.getToday();
			const ranges = PositionSummaryFrame.MTD.getRangesFromDate(today);
			const start = PositionSummaryFrame.MTD.getStartDate(0, today);

			expect(formatRange(ranges[0])).toEqual({ end: today.getEndOfMonth().format(), start: start.format() });
		});

		it('the MTD frame should exclude a position closed on its opening boundary', () => {
			const start = PositionSummaryFrame.MTD.getStartDate(0);
			const ranges = PositionSummaryFrame.MTD.getRanges(createClosedTransactions(start));

			expect(ranges.length).toEqual(0);
		});

		it('should parse the new frame codes', () => {
			expect({
				mtd: PositionSummaryFrame.parse('MTD'),
				wtd: PositionSummaryFrame.parse('WTD')
			}).toEqual({
				mtd: PositionSummaryFrame.MTD,
				wtd: PositionSummaryFrame.WTD
			});
		});
	});

	describe('and prior ranges are calculated', () => {
		describe('for YEARLY ranges', () => {
			describe('from 2017-10-10, including one previous ranges', () => {
				let ranges;

				beforeEach(() => {
					ranges = PositionSummaryFrame.YEARLY.getPriorRanges(new Day(2015, 4, 20), 1);
				});

				it('should return two ranges', () => {
					expect(ranges.length).toEqual(2);
				});

				it('the first range should begin on 2013-12-31', () => {
					expect(ranges[0].start.getIsEqual(new Day(2013, 12, 31))).toEqual(true);
				});

				it('the first range should end on 2014-12-31', () => {
					expect(ranges[0].end.getIsEqual(new Day(2014, 12, 31))).toEqual(true);
				});

				it('the second range should begin on 2014-12-31', () => {
					expect(ranges[1].start.getIsEqual(new Day(2014, 12, 31))).toEqual(true);
				});

				it('the second range should end on 2015-12-31', () => {
					expect(ranges[1].end.getIsEqual(new Day(2015, 12, 31))).toEqual(true);
				});
			});
		});
	});
});
