const Decimal = require('@barchart/common-js/lang/Decimal');

const InstrumentType = require('./../../../lib/data/InstrumentType'),
	ValuationCalculator = require('./../../../lib/calculators/ValuationCalculator');

describe('When calculating the value of a cash', () => {
	'use strict';

	let instrument;

	beforeEach(() => {
		instrument = { type: InstrumentType.CASH };
	});

	it('$100 should equal $100 (using numbers)', () => {
		expect(ValuationCalculator.calculate(instrument, 0, 100).toFloat()).toEqual(100);
	});

	it('$100 should equal $100 (using decimals)', () => {
		expect(ValuationCalculator.calculate(instrument, 0, new Decimal(100)).toFloat()).toEqual(100);
	});

	it('$100 valued at an undefined price should return null', () => {
		expect(ValuationCalculator.calculate(instrument, undefined, 100)).toBe(null);
	});

	it('$100 shares at a null price should return null', () => {
		expect(ValuationCalculator.calculate(instrument, null, 100)).toBe(null);
	});
});

describe('When calculating the value of an equity', () => {
	'use strict';

	let instrument;

	beforeEach(() => {
		instrument = { type: InstrumentType.EQUITY };
	});

	it('100 shares (long) @ $17.50 should equal $1,750 (using numbers)', () => {
		expect(ValuationCalculator.calculate(instrument, 17.5, 100).toFloat()).toEqual(1750);
	});

	it('100 shares (long) @ $17.50 should equal $1,750 (using decimals)', () => {
		expect(ValuationCalculator.calculate(instrument, new Decimal(17.5), new Decimal(100)).toFloat()).toEqual(1750);
	});

	it('100 shares (long) @ $0 should equal $0 (using decimals)', () => {
		expect(ValuationCalculator.calculate(instrument, new Decimal(0), new Decimal(100)).toFloat()).toEqual(0);
	});

	it('50 shares (short) @ $17.50 should equal ($875) (using numbers)', () => {
		expect(ValuationCalculator.calculate(instrument, 17.5, -50).toFloat()).toEqual(-875);
	});

	it('50 shares (short) @ $17.50 should equal ($875) (using decimals)', () => {
		expect(ValuationCalculator.calculate(instrument, new Decimal(17.5), new Decimal(-50)).toFloat()).toEqual(-875);
	});

	it('50 shares (short) @ $0 should equal 0 (using decimals)', () => {
		expect(ValuationCalculator.calculate(instrument, new Decimal(0), new Decimal(-50)).toFloat()).toEqual(0);
	});

	it('100 shares (long) valued at an undefined price should return null', () => {
		expect(ValuationCalculator.calculate(instrument, undefined, 100)).toBe(null);
	});

	it('100 shares (long) valued at a null price should return null', () => {
		expect(ValuationCalculator.calculate(instrument, null, 100)).toBe(null);
	});
});

describe('When calculating the value of an equity option (with a multiplier of 100)', () => {
	'use strict';

	let instrument;

	beforeEach(() => {
		instrument = { type: InstrumentType.EQUITY_OPTION, option: { multiplier: 100 } };
	});

	it('2 contracts (long) @ $1.75 should equal $350 (using numbers)', () => {
		expect(ValuationCalculator.calculate(instrument, 1.75, 2).toFloat()).toEqual(350);
	});

	it('2 contracts (long) @ $1.75 should equal $350 (using decimals)', () => {
		expect(ValuationCalculator.calculate(instrument, new Decimal(1.75), new Decimal(2)).toFloat()).toEqual(350);
	});

	it('2 contracts (long) @ $0 should equal $0 (using decimals)', () => {
		expect(ValuationCalculator.calculate(instrument, new Decimal(0), new Decimal(2)).toFloat()).toEqual(0);
	});

	it('2 contracts (short) @ $1.75 should equal ($350) (using numbers)', () => {
		expect(ValuationCalculator.calculate(instrument, 1.75, -2).toFloat()).toEqual(-350);
	});

	it('2 contracts (short) @ $1.75 should equal ($350) (using decimals)', () => {
		expect(ValuationCalculator.calculate(instrument, new Decimal(1.75), new Decimal(-2)).toFloat()).toEqual(-350);
	});

	it('2 contracts (short) @ $0 should equal $0 (using decimals)', () => {
		expect(ValuationCalculator.calculate(instrument, new Decimal(0), new Decimal(-2)).toFloat()).toEqual(0);
	});

	it('2 contracts (long) valued at an undefined price should return null', () => {
		expect(ValuationCalculator.calculate(instrument, undefined, 2)).toBe(null);
	});

	it('2 contracts (long) valued at a null price should return null', () => {
		expect(ValuationCalculator.calculate(instrument, null, 2)).toBe(null);
	});
});

describe('When calculating the value of a fund', () => {
	'use strict';

	let instrument;

	beforeEach(() => {
		instrument = { type: InstrumentType.FUND };
	});

	it('100 units @ $17.50 should equal $1,750 (using numbers)', () => {
		expect(ValuationCalculator.calculate(instrument, 17.5, 100).toFloat()).toEqual(1750);
	});

	it('100 units @ $17.50 should equal $1,750 (using decimals)', () => {
		expect(ValuationCalculator.calculate(instrument, new Decimal(17.5), new Decimal(100)).toFloat()).toEqual(1750);
	});

	it('100 units @ $0 should equal $0 (using decimals)', () => {
		expect(ValuationCalculator.calculate(instrument, new Decimal(0), new Decimal(100)).toFloat()).toEqual(0);
	});

	it('100 units valued at an undefined price should return null', () => {
		expect(ValuationCalculator.calculate(instrument, undefined, 100)).toBe(null);
	});

	it('100 units valued at a null price should return null', () => {
		expect(ValuationCalculator.calculate(instrument, null, 100)).toBe(null);
	});
});

describe('When calculating the value of a future (with a minimum tick of 0.25 tick, and each tick valued at $12.50 each)', () => {
	'use strict';

	let instrument;

	beforeEach(() => {
		instrument = { type: InstrumentType.FUTURE, future: { tick: 0.25, value: 12.50 } };
	});

	it('3 contracts (long) @ $461.75 should equal $69,262.50 (using numbers)', () => {
		expect(ValuationCalculator.calculate(instrument, 461.75, 3).toFloat()).toEqual(69262.5);
	});

	it('3 contracts (long) @ $461.75 should equal $69,262.50 (using decimals)', () => {
		expect(ValuationCalculator.calculate(instrument, new Decimal(461.75), new Decimal(3)).toFloat()).toEqual(69262.5);
	});

	it('3 contracts (long) @ $0 should equal $0 (using decimals)', () => {
		expect(ValuationCalculator.calculate(instrument, new Decimal(0), new Decimal(3)).toFloat()).toEqual(0);
	});

	it('3 contracts (short) @ $461.75 should equal ($69,262.50) (using numbers)', () => {
		expect(ValuationCalculator.calculate(instrument, 461.75, -3).toFloat()).toEqual(-69262.5);
	});

	it('3 contracts (short) @ $461.75 should equal ($69,262.50) (using decimals)', () => {
		expect(ValuationCalculator.calculate(instrument, new Decimal(461.75), new Decimal(-3)).toFloat()).toEqual(-69262.5);
	});

	it('3 contracts (short) @ $0 should equal $0 (using decimals)', () => {
		expect(ValuationCalculator.calculate(instrument, new Decimal(0), new Decimal(-3)).toFloat()).toEqual(0);
	});

	it('3 contracts (long) valued at an undefined price should return null', () => {
		expect(ValuationCalculator.calculate(instrument, undefined, 3)).toBe(null);
	});

	it('3 contracts (long) valued at a null price should return null', () => {
		expect(ValuationCalculator.calculate(instrument, null, 3)).toBe(null);
	});
});

describe('When calculating the value of a futures option (with a minimum tick of 0.125 tick, and each tick valued at $6.5 each)', () => {
	'use strict';

	let instrument;

	beforeEach(() => {
		instrument = { type: InstrumentType.FUTURE_OPTION, option: { tick: 0.125, value: 6.5 } };
	});

	it('5 contracts (long) @ $20.75 should equal $5,395.00 (using numbers)', () => {
		expect(ValuationCalculator.calculate(instrument, 20.75, 5).toFloat()).toEqual(5395);
	});

	it('5 contracts (long) @ $20.75 should equal $5,395.00 (using decimals)', () => {
		expect(ValuationCalculator.calculate(instrument, new Decimal(20.75), new Decimal(5)).toFloat()).toEqual(5395);
	});

	it('5 contracts (long) @ $0 should equal $0 (using decimals)', () => {
		expect(ValuationCalculator.calculate(instrument, new Decimal(0), new Decimal(5)).toFloat()).toEqual(0);
	});

	it('5 contracts (short) @ $20.75 should equal ($5,395.00) (using numbers)', () => {
		expect(ValuationCalculator.calculate(instrument, 20.75, -5).toFloat()).toEqual(-5395);
	});

	it('5 contracts (short) @ $20.75 should equal ($5,395.00) (using decimals)', () => {
		expect(ValuationCalculator.calculate(instrument, new Decimal(20.75), new Decimal(-5)).toFloat()).toEqual(-5395);
	});

	it('5 contracts (short) @ $0 should equal $0 (using decimals)', () => {
		expect(ValuationCalculator.calculate(instrument, new Decimal(0), new Decimal(-5)).toFloat()).toEqual(0);
	});

	it('5 contracts (long) valued at an undefined price should return null', () => {
		expect(ValuationCalculator.calculate(instrument, undefined, 5)).toBe(null);
	});

	it('5 contracts (long) valued at a null price should return null', () => {
		expect(ValuationCalculator.calculate(instrument, null, 5)).toBe(null);
	});
});

describe('When calculating the value of an "other" item"', () => {
	'use strict';

	let instrument;

	beforeEach(() => {
		instrument = { type: InstrumentType.OTHER };
	});

	it('4 units @ $200,000 should equal $800,000 (using numbers)', () => {
		expect(ValuationCalculator.calculate(instrument, 200000, 4).toFloat()).toEqual(800000);
	});

	it('4 units @ $200,000 should equal $1,750 (using decimals)', () => {
		expect(ValuationCalculator.calculate(instrument, new Decimal(200000), new Decimal(4)).toFloat()).toEqual(800000);
	});

	it('4 units valued at an undefined price should return null', () => {
		expect(ValuationCalculator.calculate(instrument, undefined, 4)).toBe(null);
	});

	it('4 units valued at a null price should return null', () => {
		expect(ValuationCalculator.calculate(instrument, null, 4)).toBe(null);
	});
});