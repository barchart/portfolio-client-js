const Decimal = require('@barchart/common-js/lang/Decimal');

const InstrumentType = require('./../../../lib/data/InstrumentType'),
	AveragePriceCalculator = require('./../../../lib/calculators/AveragePriceCalculator');

describe('When calculating the value of a cash', () => {
	'use strict';

	let instrument;

	beforeEach(() => {
		instrument = { type: InstrumentType.CASH };
	});

	it('A balance of $0 balance should have an average cost of $1', () => {
		expect(AveragePriceCalculator.calculate(instrument, 0, 0).toFloat()).toEqual(1);
	});

	it('A balance of $100 balance should have an average cost of $1', () => {
		expect(AveragePriceCalculator.calculate(instrument, 0, 100).toFloat()).toEqual(1);
	});

	it('A balance of ($100) balance should have an average cost of $1', () => {
		expect(AveragePriceCalculator.calculate(instrument, 0, -100).toFloat()).toEqual(1);
	});
});

describe('When calculating the value of an equity', () => {
	'use strict';

	let instrument;

	beforeEach(() => {
		instrument = { type: InstrumentType.EQUITY };
	});

	it('An even position should have no average cost', () => {
		expect(AveragePriceCalculator.calculate(instrument, 0, 0)).toEqual(null);
	});

	it('A long position of 100 shares with a basis of $(5,000) should have an average cost of $50', () => {
		expect(AveragePriceCalculator.calculate(instrument, -5000, 100).toFloat()).toEqual(50);
	});

	it('A short position of 100 shares with a basis of $5,000 should have an average cost of $50', () => {
		expect(AveragePriceCalculator.calculate(instrument, 5000, -100).toFloat()).toEqual(50);
	});
});

describe('When calculating the value of an equity option (with a multiplier of 100)', () => {
	let instrument;

	beforeEach(() => {
		instrument = { type: InstrumentType.EQUITY_OPTION, option: { multiplier: 100 } };
	});

	it('An even position should have no average cost', () => {
		expect(AveragePriceCalculator.calculate(instrument, 0, 0)).toEqual(null);
	});

	it('A long position of 2 contracts with a basis of $(800) should have an average cost of $4', () => {
		expect(AveragePriceCalculator.calculate(instrument, -800, 2).toFloat()).toEqual(4);
	});

	it('A short position of 2 contracts with a basis of $72,675 should have an average cost of $484.50', () => {
		expect(AveragePriceCalculator.calculate(instrument, 800, -2).toFloat()).toEqual(4);
	});
});

describe('When calculating the value of a fund', () => {
	'use strict';

	let instrument;

	beforeEach(() => {
		instrument = { type: InstrumentType.FUND };
	});

	it('An even position should have no average cost', () => {
		expect(AveragePriceCalculator.calculate(instrument, 0, 0)).toEqual(null);
	});

	it('A long position of 100 shares with a basis of $(5,000) should have an average cost of $50', () => {
		expect(AveragePriceCalculator.calculate(instrument, -5000, 100).toFloat()).toEqual(50);
	});
});

describe('When calculating the value of a future (with a minimum tick of 0.25 tick, and each tick valued at $12.50 each)', () => {
	let instrument;

	beforeEach(() => {
		instrument = { type: InstrumentType.FUTURE, future: { tick: 0.25, value: 12.50 } };
	});

	it('An even position should have no average cost', () => {
		expect(AveragePriceCalculator.calculate(instrument, 0, 0)).toEqual(null);
	});

	it('A long position of 3 contracts with a basis of $(72,675) should have an average cost of $484.50', () => {
		expect(AveragePriceCalculator.calculate(instrument, -72675, 3).toFloat()).toEqual(484.5);
	});

	it('A short position of 3 contracts with a basis of $72,675 should have an average cost of $484.50', () => {
		expect(AveragePriceCalculator.calculate(instrument, 72675, -3).toFloat()).toEqual(484.5);
	});
});

describe('When calculating the value of a futures option (with a minimum tick of 0.125 tick, and each tick valued at $6.25 each)', () => {
	let instrument;

	beforeEach(() => {
		instrument = { type: InstrumentType.FUTURE_OPTION, option: { tick: 0.125, value: 6.25 } };
	});

	it('An even position should have no average cost', () => {
		expect(AveragePriceCalculator.calculate(instrument, 0, 0)).toEqual(null);
	});

	it('A long position of 5 contracts with a basis of $(4,937.5) should have an average cost of $484.50', () => {
		expect(AveragePriceCalculator.calculate(instrument, -4937.5, 5).toFloat()).toEqual(19.75);
	});

	it('A short position of 5 contracts with a basis of $4,937.5 should have an average cost of $484.50', () => {
		expect(AveragePriceCalculator.calculate(instrument, 4937.5, -5).toFloat()).toEqual(19.75);
	});
});

describe('When calculating the value of an "other" item"', () => {
	let instrument;

	beforeEach(() => {
		instrument = { type: InstrumentType.OTHER };
	});

	it('An even position should have no average cost', () => {
		expect(AveragePriceCalculator.calculate(instrument, 0, 0)).toEqual(null);
	});

	it('A long position of 2 items with a basis of $(800,000) should have an average cost of $400,000', () => {
		expect(AveragePriceCalculator.calculate(instrument, -800000, 2).toFloat()).toEqual(400000);
	});
});