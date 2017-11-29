var symbolFormatter = require('../../lib/symbolFormatter');

describe('When a lowercase string is formatted as a symbol', function() {
	var originalSymbol;
	var formattedSymbol;

	beforeEach(function() {
		formattedSymbol = symbolFormatter.format(originalSymbol = 'aapl');
	});

	it('The result should only contain uppercase letters', function() {
		expect(formattedSymbol).toEqual('AAPL');
	});
});

describe('When an uppercase string is formatted as a symbol', function() {
	var originalSymbol;
	var formattedSymbol;

	beforeEach(function() {
		formattedSymbol = symbolFormatter.format(originalSymbol = 'AAPL');
	});

	it('The result should only contain uppercase letters', function() {
		expect(formattedSymbol).toEqual('AAPL');
	});
});

describe('When a mixed case string is formatted as a symbol', function() {
	var originalSymbol;
	var formattedSymbol;

	beforeEach(function() {
		formattedSymbol = symbolFormatter.format(originalSymbol = 'aApL');
	});

	it('The result should only contain uppercase letters', function() {
		expect(formattedSymbol).toEqual('AAPL');
	});
});

describe('When a zero-length string is formatted as a symbol', function() {
	var originalSymbol;
	var formattedSymbol;

	beforeEach(function() {
		formattedSymbol = symbolFormatter.format(originalSymbol = '');
	});

	it('The result should be the original, zero-length string', function() {
		expect(formattedSymbol).toEqual(originalSymbol);
	});
});

describe('When a string with numbers is formatted as a symbol', function() {
	var originalSymbol;
	var formattedSymbol;

	beforeEach(function() {
		formattedSymbol = symbolFormatter.format(originalSymbol = 'esm16');
	});

	it('The result should only contain uppercase letters', function() {
		expect(formattedSymbol).toEqual('ESM16');
	});
});

describe('When a number is formatted as a symbol', function() {
	var originalSymbol;
	var formattedSymbol;

	beforeEach(function() {
		formattedSymbol = symbolFormatter.format(originalSymbol = 1);
	});

	it('The result should be a number', function() {
		expect(typeof formattedSymbol).toEqual('number');
	});

	it('The result should the original, unformatted string', function() {
		expect(formattedSymbol).toEqual(originalSymbol);
	});
});

describe('When an undefined value is formatted as a symbol', function() {
	var originalSymbol;
	var formattedSymbol;

	beforeEach(function() {
		formattedSymbol = symbolFormatter.format(originalSymbol = undefined);
	});

	it('The result should be a undefined', function() {
		expect(typeof formattedSymbol).toEqual('undefined');
	});
});

describe('When an null value is formatted', function() {
	var originalSymbol;
	var formattedSymbol;

	beforeEach(function() {
		formattedSymbol = symbolFormatter.format(originalSymbol = null);
	});

	it('The result should be null', function() {
		expect(formattedSymbol).toEqual(null);
	});
});