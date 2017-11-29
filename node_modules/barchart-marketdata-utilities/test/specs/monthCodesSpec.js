var monthCodes = require('../../lib/monthCodes');

describe('When looking up a month name by code', function() {
	var map;

	beforeEach(function() {
		map = monthCodes.getCodeToNameMap();
	});

	it('"F" should map to "January"', function() {
		expect(map.F).toEqual("January");
	});

	it('"G" should map to "February"', function() {
		expect(map.G).toEqual("February");
	});

	it('"H" should map to "March"', function() {
		expect(map.H).toEqual("March");
	});

	it('"J" should map to "April"', function() {
		expect(map.J).toEqual("April");
	});

	it('"K" should map to "May"', function() {
		expect(map.K).toEqual("May");
	});

	it('"M" should map to "June"', function() {
		expect(map.M).toEqual("June");
	});

	it('"N" should map to "July"', function() {
		expect(map.N).toEqual("July");
	});

	it('"Q" should map to "August"', function() {
		expect(map.Q).toEqual("August");
	});

	it('"U" should map to "September"', function() {
		expect(map.U).toEqual("September");
	});

	it('"V" should map to "October"', function() {
		expect(map.V).toEqual("October");
	});

	it('"X" should map to "November"', function() {
		expect(map.X).toEqual("November");
	});

	it('"Z" should map to "December"', function() {
		expect(map.Z).toEqual("December");
	});
});

describe('When looking up a month number by code', function() {
	var map;

	beforeEach(function() {
		map = monthCodes.getCodeToNumberMap();
	});

	it('"F" should map to 1', function() {
		expect(map.F).toEqual(1);
	});

	it('"G" should map to 2', function() {
		expect(map.G).toEqual(2);
	});

	it('"H" should map to 3', function() {
		expect(map.H).toEqual(3);
	});

	it('"J" should map to 4', function() {
		expect(map.J).toEqual(4);
	});

	it('"K" should map to 5', function() {
		expect(map.K).toEqual(5);
	});

	it('"M" should map to 6', function() {
		expect(map.M).toEqual(6);
	});

	it('"N" should map to 7', function() {
		expect(map.N).toEqual(7);
	});

	it('"Q" should map to 8', function() {
		expect(map.Q).toEqual(8);
	});

	it('"U" should map to 9', function() {
		expect(map.U).toEqual(9);
	});

	it('"V" should map to 10', function() {
		expect(map.V).toEqual(10);
	});

	it('"X" should map to 11', function() {
		expect(map.X).toEqual(11);
	});

	it('"Z" should map to 12', function() {
		expect(map.Z).toEqual(12);
	});
});