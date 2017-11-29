var symbolParser = require('../../lib/symbolParser');

describe('When parsing a symbol for instrument type', function() {
	describe('and the symbol is IBM', function() {
		var instrumentType;

		beforeEach(function() {
			instrumentType = symbolParser.parseInstrumentType('IBM');
		});

		it('the result should be null', function() {
			expect(instrumentType).toBe(null);
		});
	});

	describe('and the symbol is ESZ6', function() {
		var instrumentType;

		beforeEach(function() {
			instrumentType = symbolParser.parseInstrumentType('ESZ6');
		});

		it('the result should not be null', function() {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "ESZ6"', function() {
			expect(instrumentType.symbol).toEqual('ESZ6');
		});

		it('the "type" should be "future"', function() {
			expect(instrumentType.type).toEqual('future');
		});

		it('the "dynamic" property should be false', function() {
			expect(instrumentType.dynamic).toEqual(false);
		});

		it('the "root" should be "ES"', function() {
			expect(instrumentType.root).toEqual('ES');
		});

		it('the "month" should be "Z"', function() {
			expect(instrumentType.month).toEqual('Z');
		});

		it('the "year" should be 2016', function() {
			expect(instrumentType.year).toEqual(2016);
		});
	});

	describe('and the symbol is ESZ16', function() {
		var instrumentType;

		beforeEach(function() {
			instrumentType = symbolParser.parseInstrumentType('ESZ16');
		});

		it('the result should not be null', function() {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "ESZ16"', function() {
			expect(instrumentType.symbol).toEqual('ESZ16');
		});

		it('the "type" should be "future"', function() {
			expect(instrumentType.type).toEqual('future');
		});

		it('the "dynamic" property should be false', function() {
			expect(instrumentType.dynamic).toEqual(false);
		});

		it('the "root" should be "ES"', function() {
			expect(instrumentType.root).toEqual('ES');
		});

		it('the "month" should be "Z"', function() {
			expect(instrumentType.month).toEqual('Z');
		});

		it('the "year" should be 2016', function() {
			expect(instrumentType.year).toEqual(2016);
		});
	});

	describe('and the symbol is ESZ2016', function() {
		var instrumentType;

		beforeEach(function() {
			instrumentType = symbolParser.parseInstrumentType('ESZ2016');
		});

		it('the result should not be null', function() {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "ES2016Z6"', function() {
			expect(instrumentType.symbol).toEqual('ESZ2016');
		});

		it('the "type" should be "future"', function() {
			expect(instrumentType.type).toEqual('future');
		});

		it('the "dynamic" property should be false', function() {
			expect(instrumentType.dynamic).toEqual(false);
		});

		it('the "root" should be "ES"', function() {
			expect(instrumentType.root).toEqual('ES');
		});

		it('the "month" should be "Z"', function() {
			expect(instrumentType.month).toEqual('Z');
		});

		it('the "year" should be 2016', function() {
			expect(instrumentType.year).toEqual(2016);
		});
	});

	describe('and the symbol is ES*0', function() {
		var instrumentType;

		beforeEach(function() {
			instrumentType = symbolParser.parseInstrumentType('ES*0');
		});

		it('the result should not be null', function() {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "ES*0"', function() {
			expect(instrumentType.symbol).toEqual('ES*0');
		});

		it('the "type" should be "future"', function() {
			expect(instrumentType.type).toEqual('future');
		});

		it('the "dynamic" property should be true', function() {
			expect(instrumentType.dynamic).toEqual(true);
		});

		it('the "root" should be "ES"', function() {
			expect(instrumentType.root).toEqual('ES');
		});

		it('the "dynamicCode" property should be "0"', function() {
			expect(instrumentType.dynamicCode).toEqual('0');
		});
	});

	describe('and the symbol is ES*1', function() {
		var instrumentType;

		beforeEach(function() {
			instrumentType = symbolParser.parseInstrumentType('ES*1');
		});

		it('the result should not be null', function() {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "ES*1"', function() {
			expect(instrumentType.symbol).toEqual('ES*1');
		});

		it('the "type" should be "future"', function() {
			expect(instrumentType.type).toEqual('future');
		});

		it('the "dynamic" property should be true', function() {
			expect(instrumentType.dynamic).toEqual(true);
		});

		it('the "root" should be "ES"', function() {
			expect(instrumentType.root).toEqual('ES');
		});

		it('the "dynamicCode" property should be "1"', function() {
			expect(instrumentType.dynamicCode).toEqual('1');
		});
	});

	describe('and the symbol is ^EURUSD', function() {
		var instrumentType;

		beforeEach(function() {
			instrumentType = symbolParser.parseInstrumentType('^EURUSD');
		});

		it('the result should not be null', function() {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "^EURUSD"', function() {
			expect(instrumentType.symbol).toEqual('^EURUSD');
		});

		it('the "type" should be "forex"', function() {
			expect(instrumentType.type).toEqual('forex');
		});
	});

	describe('and the symbol is $DOWI', function() {
		var instrumentType;

		beforeEach(function() {
			instrumentType = symbolParser.parseInstrumentType('$DOWI');
		});

		it('the result should not be null', function() {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "$DOWI"', function() {
			expect(instrumentType.symbol).toEqual('$DOWI');
		});

		it('the "type" should be "index"', function() {
			expect(instrumentType.type).toEqual('index');
		});
	});

	describe('and the symbol is -001A', function() {
		var instrumentType;

		beforeEach(function() {
			instrumentType = symbolParser.parseInstrumentType('-001A');
		});

		it('the result should not be null', function() {
			expect(instrumentType).not.toBe(null);
		});

		it('the "symbol" should be "-001A"', function() {
			expect(instrumentType.symbol).toEqual('-001A');
		});

		it('the "type" should be "index"', function() {
			expect(instrumentType.type).toEqual('sector');
		});
	});
});

describe('When checking to see if a symbol is a future', function() {
	it('the symbol "ESZ6" should return true', function() {
		expect(symbolParser.getIsFuture('ESZ6')).toEqual(true);
	});

	it('the symbol "ESZ16" should return true', function() {
		expect(symbolParser.getIsFuture('ESZ16')).toEqual(true);
	});

	it('the symbol "ESZ2016" should return true', function() {
		expect(symbolParser.getIsFuture('ESZ2016')).toEqual(true);
	});

	it('the symbol "ESZ016" should return false', function() {
		expect(symbolParser.getIsFuture('ESZ016')).toEqual(false);
	});

	it('the symbol "O!H7" should return true', function() {
		expect(symbolParser.getIsFuture('O!H7')).toEqual(true);
	});

	it('the symbol "O!H17" should return true', function() {
		expect(symbolParser.getIsFuture('O!H17')).toEqual(true);
	});

	it('the symbol "O!H2017" should return true', function() {
		expect(symbolParser.getIsFuture('O!H2017')).toEqual(true);
	});

	it('the symbol "IBM" should return false', function() {
		expect(symbolParser.getIsFuture('IBM')).toEqual(false);
	});

	it('the symbol "^EURUSD" should return false', function() {
		expect(symbolParser.getIsFuture('^EURUSD')).toEqual(false);
	});

	it('the symbol "-001A" should return false', function() {
		expect(symbolParser.getIsFuture('-001A')).toEqual(false);
	});

	it('the symbol "$DOWI" should return false', function() {
		expect(symbolParser.getIsFuture('$DOWI')).toEqual(false);
	});

	it('the symbol "_S_SP_ZCH7_ZCK7" should return false', function() {
		expect(symbolParser.getIsFuture('_S_SP_ZCH7_ZCK7')).toEqual(false);
	});
});

describe('When checking to see if a symbol is a "concrete" future', function() {
	it('the symbol "ESZ6" should return true', function() {
		expect(symbolParser.getIsConcrete('ESZ6')).toEqual(true);
	});

	it('the symbol "ESZ16" should return true', function() {
		expect(symbolParser.getIsConcrete('ESZ16')).toEqual(true);
	});

	it('the symbol "ESZ2016" should return true', function() {
		expect(symbolParser.getIsConcrete('ESZ2016')).toEqual(true);
	});

	it('the symbol "ES*0" should return false', function() {
		expect(symbolParser.getIsConcrete('ES*0')).toEqual(false);
	});

	it('the symbol "ES*1" should return false', function() {
		expect(symbolParser.getIsConcrete('ES*1')).toEqual(false);
	});
});

describe('When checking to see if a symbol is a "reference" future', function() {
	it('the symbol "ESZ6" should return false', function() {
		expect(symbolParser.getIsReference('ESZ6')).toEqual(false);
	});

	it('the symbol "ESZ16" should return false', function() {
		expect(symbolParser.getIsReference('ESZ16')).toEqual(false);
	});

	it('the symbol "ESZ2016" should return false', function() {
		expect(symbolParser.getIsReference('ESZ2016')).toEqual(false);
	});

	it('the symbol "ES*0" should return true', function() {
		expect(symbolParser.getIsReference('ES*0')).toEqual(true);
	});

	it('the symbol "ES*1" should return true', function() {
		expect(symbolParser.getIsReference('ES*1')).toEqual(true);
	});
});

describe('When checking to see if a symbol is sector', function() {
	it('the symbol "ESZ6" should return false', function() {
		expect(symbolParser.getIsSector('ESZ6')).toEqual(false);
	});

	it('the symbol "ESZ16" should return false', function() {
		expect(symbolParser.getIsSector('ESZ16')).toEqual(false);
	});

	it('the symbol "ESZ2016" should return false', function() {
		expect(symbolParser.getIsSector('ESZ2016')).toEqual(false);
	});

	it('the symbol "ESZ016" should return false', function() {
		expect(symbolParser.getIsSector('ESZ016')).toEqual(false);
	});

	it('the symbol "O!H7" should return false', function() {
		expect(symbolParser.getIsSector('O!H7')).toEqual(false);
	});

	it('the symbol "O!H17" should return false', function() {
		expect(symbolParser.getIsSector('O!H17')).toEqual(false);
	});

	it('the symbol "O!H2017" should return false', function() {
		expect(symbolParser.getIsSector('O!H2017')).toEqual(false);
	});

	it('the symbol "IBM" should return false', function() {
		expect(symbolParser.getIsSector('IBM')).toEqual(false);
	});

	it('the symbol "^EURUSD" should return false', function() {
		expect(symbolParser.getIsSector('^EURUSD')).toEqual(false);
	});

	it('the symbol "-001A" should return true', function() {
		expect(symbolParser.getIsSector('-001A')).toEqual(true);
	});

	it('the symbol "$DOWI" should return false', function() {
		expect(symbolParser.getIsSector('$DOWI')).toEqual(false);
	});

	it('the symbol "_S_SP_ZCH7_ZCK7" should return false', function() {
		expect(symbolParser.getIsSector('_S_SP_ZCH7_ZCK7')).toEqual(false);
	});
});

describe('When checking to see if a symbol is forex', function() {
	it('the symbol "ESZ6" should return false', function() {
		expect(symbolParser.getIsForex('ESZ6')).toEqual(false);
	});

	it('the symbol "ESZ16" should return false', function() {
		expect(symbolParser.getIsForex('ESZ16')).toEqual(false);
	});

	it('the symbol "ESZ2016" should return false', function() {
		expect(symbolParser.getIsForex('ESZ2016')).toEqual(false);
	});

	it('the symbol "ESZ016" should return false', function() {
		expect(symbolParser.getIsForex('ESZ016')).toEqual(false);
	});

	it('the symbol "O!H7" should return false', function() {
		expect(symbolParser.getIsForex('O!H7')).toEqual(false);
	});

	it('the symbol "O!H17" should return false', function() {
		expect(symbolParser.getIsForex('O!H17')).toEqual(false);
	});

	it('the symbol "O!H2017" should return false', function() {
		expect(symbolParser.getIsForex('O!H2017')).toEqual(false);
	});

	it('the symbol "IBM" should return false', function() {
		expect(symbolParser.getIsForex('IBM')).toEqual(false);
	});

	it('the symbol "^EURUSD" should return true', function() {
		expect(symbolParser.getIsForex('^EURUSD')).toEqual(true);
	});

	it('the symbol "-001A" should return false', function() {
		expect(symbolParser.getIsForex('-001A')).toEqual(false);
	});

	it('the symbol "$DOWI" should return false', function() {
		expect(symbolParser.getIsForex('$DOWI')).toEqual(false);
	});

	it('the symbol "_S_SP_ZCH7_ZCK7" should return false', function() {
		expect(symbolParser.getIsForex('_S_SP_ZCH7_ZCK7')).toEqual(false);
	});
});

describe('When checking to see if a symbol is a future spread', function() {
	it('the symbol "ESZ6" should return false', function() {
		expect(symbolParser.getIsFutureSpread('ESZ6')).toEqual(false);
	});

	it('the symbol "ESZ16" should return false', function() {
		expect(symbolParser.getIsFutureSpread('ESZ16')).toEqual(false);
	});

	it('the symbol "ESZ2016" should return false', function() {
		expect(symbolParser.getIsFutureSpread('ESZ2016')).toEqual(false);
	});

	it('the symbol "ESZ016" should return false', function() {
		expect(symbolParser.getIsFutureSpread('ESZ016')).toEqual(false);
	});

	it('the symbol "O!H7" should return false', function() {
		expect(symbolParser.getIsFutureSpread('O!H7')).toEqual(false);
	});

	it('the symbol "O!H17" should return false', function() {
		expect(symbolParser.getIsFutureSpread('O!H17')).toEqual(false);
	});

	it('the symbol "O!H2017" should return false', function() {
		expect(symbolParser.getIsFutureSpread('O!H2017')).toEqual(false);
	});

	it('the symbol "IBM" should return false', function() {
		expect(symbolParser.getIsFutureSpread('IBM')).toEqual(false);
	});

	it('the symbol "^EURUSD" should return false', function() {
		expect(symbolParser.getIsFutureSpread('^EURUSD')).toEqual(false);
	});

	it('the symbol "-001A" should return false', function() {
		expect(symbolParser.getIsFutureSpread('-001A')).toEqual(false);
	});

	it('the symbol "$DOWI" should return false', function() {
		expect(symbolParser.getIsFutureSpread('$DOWI')).toEqual(false);
	});

	it('the symbol "_S_SP_ZCH7_ZCK7" should return true', function() {
		expect(symbolParser.getIsFutureSpread('_S_SP_ZCH7_ZCK7')).toEqual(true);
	});
});

describe('When checking to see if a symbol is a BATS listing', function() {
	it('the symbol "IBM" should return false', function() {
		expect(symbolParser.getIsBats('IBM')).toEqual(false);
	});

	it('the symbol "IBM.BZ" should return true', function() {
		expect(symbolParser.getIsBats('IBM.BZ')).toEqual(true);
	});
});

describe('When checking the display format for the symbol "HPIUSA.RP"', function() {
	it('it should not be formatted as a percent', function() {
		expect(symbolParser.displayUsingPercent('HPIUSA.RP')).toEqual(false);
	});
});

describe('When checking the display format for the symbol "UERMNTUS.RT"', function() {
	it('it should be formatted as a percent', function() {
		expect(symbolParser.displayUsingPercent('UERMNTUS.RT')).toEqual(true);
	});
});

describe('When getting a producer symbol', function() {
	it('TSLA should map to TSLA', function() {
		expect(symbolParser.getProducerSymbol('TSLA')).toEqual('TSLA');
	});

	it('TSLA.BZ should map to TSLA.BZ', function() {
		expect(symbolParser.getProducerSymbol('TSLA.BZ')).toEqual('TSLA.BZ');
	});

	it('ESZ6 should map to ESZ6', function() {
		expect(symbolParser.getProducerSymbol('ESZ6')).toEqual('ESZ6');
	});

	it('ESZ16 should map to ESZ6', function() {
		expect(symbolParser.getProducerSymbol('ESZ16')).toEqual('ESZ6');
	});

	it('ESZ2016 should map to ESZ6', function() {
		expect(symbolParser.getProducerSymbol('ESZ16')).toEqual('ESZ6');
	});

	it('ES*0 should map to ES*0', function() {
		expect(symbolParser.getProducerSymbol('ES*0')).toEqual('ES*0');
	});

	it('$DOWI should map to $DOWI', function() {
		expect(symbolParser.getProducerSymbol('$DOWI')).toEqual('$DOWI');
	});

	it('^EURUSD should map to ^EURUSD', function() {
		expect(symbolParser.getProducerSymbol('^EURUSD')).toEqual('^EURUSD');
	});
});