var convert = require('../../lib/convert');

describe('When converting a baseCode to a unitCode', function() {
	it('-1 should translate to "2"', function() {
		expect(convert.baseCodeToUnitCode(-1)).toEqual('2');
	});

	it('-2 should translate to "3"', function() {
		expect(convert.baseCodeToUnitCode(-2)).toEqual('3');
	});

	it('-3 should translate to "4"', function() {
		expect(convert.baseCodeToUnitCode(-3)).toEqual('4');
	});

	it('-4 should translate to "5"', function() {
		expect(convert.baseCodeToUnitCode(-4)).toEqual('5');
	});

	it('-5 should translate to "6"', function() {
		expect(convert.baseCodeToUnitCode(-5)).toEqual('6');
	});

	it('-6 should translate to "7"', function() {
		expect(convert.baseCodeToUnitCode(-6)).toEqual('7');
	});

	it('0 should translate to "8"', function() {
		expect(convert.baseCodeToUnitCode(0)).toEqual('8');
	});

	it('1 should translate to "9"', function() {
		expect(convert.baseCodeToUnitCode(1)).toEqual('9');
	});

	it('2 should translate to "A"', function() {
		expect(convert.baseCodeToUnitCode(2)).toEqual('A');
	});

	it('3 should translate to "B"', function() {
		expect(convert.baseCodeToUnitCode(3)).toEqual('B');
	});

	it('4 should translate to "C"', function() {
		expect(convert.baseCodeToUnitCode(4)).toEqual('C');
	});

	it('5 should translate to "D"', function() {
		expect(convert.baseCodeToUnitCode(5)).toEqual('D');
	});

	it('6 should translate to "E"', function() {
		expect(convert.baseCodeToUnitCode(6)).toEqual('E');
	});

	it('7 should translate to "F"', function() {
		expect(convert.baseCodeToUnitCode(7)).toEqual('F');
	});

	it('"-1" should translate to 0', function() {
		expect(convert.baseCodeToUnitCode("-1")).toEqual(0);
	});

	it('A null value should translate to 0', function() {
		expect(convert.baseCodeToUnitCode(null)).toEqual(0);
	});

	it('An undefined value should translate to 0', function() {
		expect(convert.baseCodeToUnitCode(undefined)).toEqual(0);
	});
});

describe('When converting a unitCode to a baseCode', function() {
	it('"2" should translate to -1', function() {
		expect(convert.unitCodeToBaseCode("2")).toEqual(-1);
	});

	it('"3" should translate to -2', function() {
		expect(convert.unitCodeToBaseCode("3")).toEqual(-2);
	});

	it('"4" should translate to -3', function() {
		expect(convert.unitCodeToBaseCode("4")).toEqual(-3);
	});

	it('"5" should translate to -4', function() {
		expect(convert.unitCodeToBaseCode("5")).toEqual(-4);
	});

	it('"6" should translate to -5', function() {
		expect(convert.unitCodeToBaseCode("6")).toEqual(-5);
	});

	it('"7" should translate to -6', function() {
		expect(convert.unitCodeToBaseCode("7")).toEqual(-6);
	});

	it('"8" should translate to 0', function() {
		expect(convert.unitCodeToBaseCode("8")).toEqual(0);
	});

	it('"9" should translate to 1', function() {
		expect(convert.unitCodeToBaseCode("9")).toEqual(1);
	});

	it('"A" should translate to 1', function() {
		expect(convert.unitCodeToBaseCode("A")).toEqual(2);
	});

	it('"B" should translate to 3', function() {
		expect(convert.unitCodeToBaseCode("B")).toEqual(3);
	});

	it('"C" should translate to 4', function() {
		expect(convert.unitCodeToBaseCode("C")).toEqual(4);
	});

	it('"D" should translate to 5', function() {
		expect(convert.unitCodeToBaseCode("D")).toEqual(5);
	});

	it('"E" should translate to 6', function() {
		expect(convert.unitCodeToBaseCode("E")).toEqual(6);
	});

	it('"F" should translate to 6', function() {
		expect(convert.unitCodeToBaseCode("F")).toEqual(7);
	});

	it('2 should translate to ', function() {
		expect(convert.unitCodeToBaseCode(2)).toEqual(0);
	});

	it('A null value should translate to 0', function() {
		expect(convert.unitCodeToBaseCode(null)).toEqual(0);
	});

	it('An undefined value should translate to 0', function() {
		expect(convert.unitCodeToBaseCode(undefined)).toEqual(0);
	});
});

describe('When converting a date instance to a day code', function() {
	it('"Jan 1, 2016" should translate to 1', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 1))).toEqual('1');
	});

	it('"Jan 2, 2016" should translate to 2', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 2))).toEqual('2');
	});

	it('"Jan 3, 2016" should translate to 3', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 3))).toEqual('3');
	});

	it('"Jan 4, 2016" should translate to 4', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 4))).toEqual('4');
	});

	it('"Jan 5, 2016" should translate to 5', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 5))).toEqual('5');
	});

	it('"Jan 6, 2016" should translate to 6', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 6))).toEqual('6');
	});

	it('"Jan 7, 2016" should translate to 7', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 7))).toEqual('7');
	});

	it('"Jan 8, 2016" should translate to 8', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 8))).toEqual('8');
	});

	it('"Jan 9, 2016" should translate to 9', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 9))).toEqual('9');
	});

	it('"Jan 10, 2016" should translate to 0', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 10))).toEqual('0');
	});

	it('"Jan 11, 2016" should translate to A', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 11))).toEqual('A');
	});

	it('"Jan 12, 2016" should translate to B', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 12))).toEqual('B');
	});

	it('"Jan 13, 2016" should translate to C', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 13))).toEqual('C');
	});

	it('"Jan 14, 2016" should translate to D', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 14))).toEqual('D');
	});

	it('"Jan 15, 2016" should translate to E', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 15))).toEqual('E');
	});

	it('"Jan 16, 2016" should translate to F', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 16))).toEqual('F');
	});

	it('"Jan 17, 2016" should translate to G', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 17))).toEqual('G');
	});

	it('"Jan 18, 2016" should translate to H', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 18))).toEqual('H');
	});

	it('"Jan 19, 2016" should translate to I', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 19))).toEqual('I');
	});

	it('"Jan 20, 2016" should translate to J', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 20))).toEqual('J');
	});

	it('"Jan 21, 2016" should translate to K', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 21))).toEqual('K');
	});

	it('"Jan 22, 2016" should translate to L', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 22))).toEqual('L');
	});

	it('"Jan 23, 2016" should translate to M', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 23))).toEqual('M');
	});

	it('"Jan 24, 2016" should translate to N', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 24))).toEqual('N');
	});

	it('"Jan 25, 2016" should translate to O', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 25))).toEqual('O');
	});

	it('"Jan 26, 2016" should translate to P', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 26))).toEqual('P');
	});

	it('"Jan 27, 2016" should translate to Q', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 27))).toEqual('Q');
	});

	it('"Jan 28, 2016" should translate to R', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 28))).toEqual('R');
	});

	it('"Jan 29, 2016" should translate to S', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 29))).toEqual('S');
	});

	it('"Jan 30, 2016" should translate to T', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 30))).toEqual('T');
	});

	it('"Jan 31, 2016" should translate to U', function() {
		expect(convert.dateToDayCode(new Date(2016, 0, 31))).toEqual('U');
	});
});

describe('When converting a dayCode to number', function() {
	it('"1" should translate to 1', function() {
		expect(convert.dayCodeToNumber("1")).toEqual(1);
	});

	it('"2" should translate to 2', function() {
		expect(convert.dayCodeToNumber("2")).toEqual(2);
	});

	it('"3" should translate to 3', function() {
		expect(convert.dayCodeToNumber("3")).toEqual(3);
	});

	it('"4" should translate to 4', function() {
		expect(convert.dayCodeToNumber("4")).toEqual(4);
	});

	it('"5" should translate to 5', function() {
		expect(convert.dayCodeToNumber("5")).toEqual(5);
	});

	it('"6" should translate to 6', function() {
		expect(convert.dayCodeToNumber("6")).toEqual(6);
	});

	it('"7" should translate to 7', function() {
		expect(convert.dayCodeToNumber("7")).toEqual(7);
	});

	it('"8" should translate to 8', function() {
		expect(convert.dayCodeToNumber("8")).toEqual(8);
	});

	it('"9" should translate to 9', function() {
		expect(convert.dayCodeToNumber("9")).toEqual(9);
	});

	it('"0" should translate to 10', function() {
		expect(convert.dayCodeToNumber("0")).toEqual(10);
	});

	it('"A" should translate to 11', function() {
		expect(convert.dayCodeToNumber("A")).toEqual(11);
	});

	it('"a" should translate to 11', function() {
		expect(convert.dayCodeToNumber("a")).toEqual(11);
	});

	it('"B" should translate to 12', function() {
		expect(convert.dayCodeToNumber("B")).toEqual(12);
	});

	it('"b" should translate to 12', function() {
		expect(convert.dayCodeToNumber("b")).toEqual(12);
	});

	it('"C" should translate to 13', function() {
		expect(convert.dayCodeToNumber("C")).toEqual(13);
	});

	it('"c" should translate to 13', function() {
		expect(convert.dayCodeToNumber("c")).toEqual(13);
	});

	it('"D" should translate to 14', function() {
		expect(convert.dayCodeToNumber("D")).toEqual(14);
	});

	it('"d" should translate to 14', function() {
		expect(convert.dayCodeToNumber("d")).toEqual(14);
	});

	it('"E" should translate to 15', function() {
		expect(convert.dayCodeToNumber("E")).toEqual(15);
	});

	it('"e" should translate to 15', function() {
		expect(convert.dayCodeToNumber("e")).toEqual(15);
	});

	it('"F" should translate to 16', function() {
		expect(convert.dayCodeToNumber("F")).toEqual(16);
	});

	it('"f" should translate to 16', function() {
		expect(convert.dayCodeToNumber("f")).toEqual(16);
	});

	it('"G" should translate to 17', function() {
		expect(convert.dayCodeToNumber("G")).toEqual(17);
	});

	it('"g" should translate to 17', function() {
		expect(convert.dayCodeToNumber("g")).toEqual(17);
	});

	it('"H" should translate to 18', function() {
		expect(convert.dayCodeToNumber("H")).toEqual(18);
	});

	it('"h" should translate to 18', function() {
		expect(convert.dayCodeToNumber("h")).toEqual(18);
	});

	it('"I" should translate to 19', function() {
		expect(convert.dayCodeToNumber("I")).toEqual(19);
	});

	it('"i" should translate to 19', function() {
		expect(convert.dayCodeToNumber("i")).toEqual(19);
	});

	it('"J" should translate to 20', function() {
		expect(convert.dayCodeToNumber("J")).toEqual(20);
	});

	it('"j" should translate to 20', function() {
		expect(convert.dayCodeToNumber("j")).toEqual(20);
	});

	it('"K" should translate to 21', function() {
		expect(convert.dayCodeToNumber("K")).toEqual(21);
	});

	it('"k" should translate to 21', function() {
		expect(convert.dayCodeToNumber("k")).toEqual(21);
	});

	it('"L" should translate to 22', function() {
		expect(convert.dayCodeToNumber("L")).toEqual(22);
	});

	it('"l" should translate to 22', function() {
		expect(convert.dayCodeToNumber("l")).toEqual(22);
	});

	it('"M" should translate to 23', function() {
		expect(convert.dayCodeToNumber("M")).toEqual(23);
	});

	it('"m" should translate to 23', function() {
		expect(convert.dayCodeToNumber("m")).toEqual(23);
	});

	it('"N" should translate to 24', function() {
		expect(convert.dayCodeToNumber("N")).toEqual(24);
	});

	it('"n" should translate to 24', function() {
		expect(convert.dayCodeToNumber("n")).toEqual(24);
	});

	it('"O" should translate to 25', function() {
		expect(convert.dayCodeToNumber("O")).toEqual(25);
	});

	it('"o" should translate to 25', function() {
		expect(convert.dayCodeToNumber("o")).toEqual(25);
	});

	it('"P" should translate to 26', function() {
		expect(convert.dayCodeToNumber("P")).toEqual(26);
	});

	it('"p" should translate to 26', function() {
		expect(convert.dayCodeToNumber("p")).toEqual(26);
	});

	it('"Q" should translate to 27', function() {
		expect(convert.dayCodeToNumber("Q")).toEqual(27);
	});

	it('"q" should translate to 27', function() {
		expect(convert.dayCodeToNumber("q")).toEqual(27);
	});

	it('"R" should translate to 28', function() {
		expect(convert.dayCodeToNumber("R")).toEqual(28);
	});

	it('"r" should translate to 28', function() {
		expect(convert.dayCodeToNumber("r")).toEqual(28);
	});

	it('"S" should translate to 29', function() {
		expect(convert.dayCodeToNumber("S")).toEqual(29);
	});

	it('"s" should translate to 29', function() {
		expect(convert.dayCodeToNumber("s")).toEqual(29);
	});

	it('"T" should translate to 30', function() {
		expect(convert.dayCodeToNumber("T")).toEqual(30);
	});

	it('"t" should translate to 30', function() {
		expect(convert.dayCodeToNumber("t")).toEqual(30);
	});

	it('"U" should translate to 31', function() {
		expect(convert.dayCodeToNumber("U")).toEqual(31);
	});

	it('"u" should translate to 31', function() {
		expect(convert.dayCodeToNumber("u")).toEqual(31);
	});
});