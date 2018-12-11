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

	describe('and yearly position summary ranges are processed for a transaction set closed in 2016, but has after-the-fact superfluous valuations in 2017 and 2018', () => {
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

	describe('and month position summary ranges are processed for a transaction set that does not close', () => {
		let ranges;

		beforeEach(() => {
			const transactions = [
				{
					date: new Day(2018, 10, 20),
					snapshot: {
						open: new Decimal(1)
					},
					type: TransactionType.BUY
				},
				{
					date: new Day(2018, 11, 21),
					snapshot: {
						open: new Decimal(1)
					},
					type: TransactionType.BUY
				}
			];

			ranges = PositionSummaryFrame.MONTHLY.getRanges(transactions);
		});

		it('should have three ranges (assuming the current year is 2018 and the current month is December)', () => {
			expect(ranges.length).toEqual(3);
		});

		it('the first range should be from 2018-09-30 to 2018-10-31', () => {
			expect(ranges[0].start.format()).toEqual('2018-09-30');
			expect(ranges[0].end.format()).toEqual('2018-10-31');
		});

		it('the second range should be from 2018-10-31 to 2018-11-30', () => {
		  expect(ranges[1].start.format()).toEqual('2018-10-31');
		  expect(ranges[1].end.format()).toEqual('2018-11-30');
		});

		it('the third range should be from 2018-10-31 to 2018-11-30', () => {
			expect(ranges[2].start.format()).toEqual('2018-11-30');
			expect(ranges[2].end.format()).toEqual('2018-12-31');
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




	////

	describe('and getting the start date for monthly frames', () => {
		describe('for one month ago', function () {
			let start;

			beforeEach(() => {
				start = PositionSummaryFrame.MONTHLY.getStartDate(1);
			});

			it('should be on the last day of month', () => {
				const today = Day.getToday();
				
				expect(start.day).toEqual(Day.getDaysInMonth(today.year, today.month - 2));
			});

			it('should be month ago', () => {
				expect(start.month).toEqual(Day.getToday().month - 2);
			});
		});
    
    describe('for three months ago', function () {
      let start;
      
      beforeEach(() => {
        start = PositionSummaryFrame.MONTHLY.getStartDate(3);
      });
      
      it('should be on the last day of month', () => {
        const today = Day.getToday();
        
        expect(start.day).toEqual(Day.getDaysInMonth(today.year, today.month - 4));
      });
      
      it('should be 3 month ago', () => {
        expect(start.month).toEqual(Day.getToday().month - 4);
      });
    });
	});

	////





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
