const Day = require('@barchart/common-js/lang/Day');

const TransactionType = require('./../../../lib/data/TransactionType'),
	TransactionValidator = require('./../../../lib/data/TransactionValidator');

describe('When validating transaction order', () => {
	'use strict';

	const build = (sequence, day, type) => {
		return { sequence: sequence, date: Day.parse(day), type: (type || TransactionType.BUY ) };
	};

	it('An array of zero transactions should be valid', () => {
		expect(TransactionValidator.validateOrder([])).toEqual(true);
	});

	it('An array of transactions with ordered sequences, on the same day should be valid', () => {
		expect(TransactionValidator.validateOrder([ build(1, '2018-04-30'), build(2, '2018-04-30'), build(3, '2018-04-30') ])).toEqual(true);
	});

	it('An array of transactions with ordered sequences, on the same day should be valid, where a dividend occurs last, should be valid', () => {
		expect(TransactionValidator.validateOrder([ build(1, '2018-04-30'), build(2, '2018-04-30', TransactionType.DIVIDEND) ])).toEqual(true);
	});

	it('An array of transactions with ordered sequences, on the same day should be valid, where a dividend occurs first, in strict mode, should not be valid', () => {
		expect(TransactionValidator.validateOrder([ build(1, '2018-04-30', TransactionType.DIVIDEND), build(2, '2018-04-30') ], true)).toEqual(false);
	});

	it('An array of transactions with ordered sequences, on the same day should be valid, where a dividend occurs first, in non-strict mode, should be valid', () => {
		expect(TransactionValidator.validateOrder([ build(1, '2018-04-30', TransactionType.DIVIDEND), build(2, '2018-04-30') ], false)).toEqual(true);
	});

	it('An array of transactions with ordered sequences, on the sequential days should be valid', () => {
		expect(TransactionValidator.validateOrder([ build(1, '2018-04-30'), build(2, '2018-05-01'), build(3, '2018-05-02', TransactionType.DIVIDEND) ])).toEqual(true);
	});

	it('An array of transactions with ordered sequences (starting after one), on the same day should not be valid', () => {
		expect(TransactionValidator.validateOrder([ build(3, '2018-04-30'), build(4, '2018-04-30'), build(5, '2018-04-30') ])).toEqual(false);
	});

	it('An array of transactions with duplicate sequences, on the same day should not be valid', () => {
		expect(TransactionValidator.validateOrder([ build(1, '2018-04-30'), build(1, '2018-04-30') ])).toEqual(false);
	});

	it('An array of transactions with with a gap in sequences, on the same day should not be valid', () => {
		expect(TransactionValidator.validateOrder([ build(1, '2018-04-30'), build(3, '2018-04-30') ])).toEqual(false);
	});

	it('An array of transactions with with a reversed sequences, on the same subsequent days should not be valid', () => {
		expect(TransactionValidator.validateOrder([ build(2, '2018-04-30'), build(1, '2018-05-01') ])).toEqual(false);
	});

	it('An array of transactions with ordered sequences, on the reversed days should not be valid', () => {
		expect(TransactionValidator.validateOrder([ build(1, '2018-05-02'), build(2, '2018-05-01'), build(3, '2018-04-30') ])).toEqual(false);
	});
});

describe('When validating transaction references', () => {
	'use strict';

	const build = (root, sequence) => {
		return { reference: { root: root, sequence: sequence } };
	};

	it('An array of zero transactions should be valid', () => {
		expect(TransactionValidator.validateReferences([])).toEqual(true);
	});

	it('An array with no references should be valid', () => {
		expect(TransactionValidator.validateReferences([ { }, { } ])).toEqual(true);
	});

	it('An array with distinct references should be valid', () => {
		expect(TransactionValidator.validateReferences([ build('a', 1), build('a', 2), build('b', 1) ])).toEqual(true);
	});

	it('An array with non-distinct references should be not valid', () => {
		expect(TransactionValidator.validateReferences([ build('a', 1), build('a', 2), build('b', 1), build('a', 2) ])).toEqual(false);
	});
});

describe('When requesting all the user-initiated transaction types', () => {
	'use strict';

	let userInitiated;

	beforeEach(() => {
		userInitiated = TransactionValidator.getUserInitiatedTransactionTypes();
	});

	it('Only nine types should be returned', () => {
		expect(userInitiated.length).toEqual(9);
	});
});