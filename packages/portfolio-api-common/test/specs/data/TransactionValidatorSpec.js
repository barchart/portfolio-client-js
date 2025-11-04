const Day = require('@barchart/common-js/lang/Day'),
	Decimal = require('@barchart/common-js/lang/Decimal');

const TransactionType = require('./../../../lib/data/TransactionType'),
	TransactionValidator = require('./../../../lib/data/TransactionValidator');

const InstrumentType = require('./../../../lib/data/InstrumentType');

describe('When validating transaction order', () => {
	'use strict';

	const build = (sequence, day, type) => {
		return { sequence: sequence, date: Day.parse(day), type: (type || TransactionType.BUY) };
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

	const build = (root, transaction) => {
		return { reference: { root: root, transaction: transaction } };
	};

	it('An array of zero transactions should be valid', () => {
		expect(TransactionValidator.validateReferences([])).toEqual(true);
	});

	it('An array with no references should be valid', () => {
		expect(TransactionValidator.validateReferences([ { }, { } ])).toEqual(true);
	});

	it('An array with distinct references should be valid', () => {
		expect(TransactionValidator.validateReferences([ build('a', 'x'), build('a', 'y'), build('b', 'y') ])).toEqual(true);
	});

	it('An array with non-distinct references should be not valid', () => {
		expect(TransactionValidator.validateReferences([ build('a', 'x'), build('a', 'y'), build('b', 'x'), build('a', 'y') ])).toEqual(false);
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

describe('When checking for a transaction that would switch position direction (without a position)', () => {
    'use strict';

    const instrumentType = InstrumentType.EQUITY;

    describe('Where the transaction list only contains BUY transactions', () => {
        let transactions;

        beforeEach(() => {
            transactions = [
                { type: TransactionType.BUY, quantity: new Decimal(1) },
                { type: TransactionType.BUY, quantity: new Decimal(2) },
                { type: TransactionType.BUY, quantity: new Decimal(3) }
            ];
        });

        it('No transaction should be identified which switches the position direction', () => {
            expect(TransactionValidator.getSwitchIndex(transactions, instrumentType)).toEqual(-1);
        });
    });

    describe('Where the transaction list only contains SELL transactions (with positive quantities)', () => {
        let transactions;

        beforeEach(() => {
            transactions = [
                { type: TransactionType.SELL, quantity: new Decimal(1) },
                { type: TransactionType.SELL, quantity: new Decimal(2) },
                { type: TransactionType.SELL, quantity: new Decimal(3) }
            ];
        });

        it('No transaction should be identified which switches the position direction', () => {
            expect(TransactionValidator.getSwitchIndex(transactions, instrumentType)).toEqual(-1);
        });
    });

    describe('Where the transaction list only contains SELL_SHORT transactions', () => {
        let transactions;

        beforeEach(() => {
            transactions = [
                { type: TransactionType.SELL_SHORT, quantity: new Decimal(1) },
                { type: TransactionType.SELL_SHORT, quantity: new Decimal(2) },
                { type: TransactionType.SELL_SHORT, quantity: new Decimal(3) }
            ];
        });

        it('No transaction should be identified which switches the position direction', () => {
            expect(TransactionValidator.getSwitchIndex(transactions, instrumentType)).toEqual(-1);
        });
    });

    describe('Where the transaction list buys 100 shares then sells 50 shares', () => {
        let transactions;

        beforeEach(() => {
            transactions = [
                { type: TransactionType.BUY, quantity: new Decimal(100) },
                { type: TransactionType.SELL, quantity: new Decimal(50) }
            ];
        });

        it('No transaction should be identified', () => {
            expect(TransactionValidator.getSwitchIndex(transactions, instrumentType)).toEqual(-1);
        });
    });

    describe('Where the transaction list sells 100 shares short then buys 50 shares to cover', () => {
        let transactions;

        beforeEach(() => {
            transactions = [
                { type: TransactionType.SELL_SHORT, quantity: new Decimal(100) },
                { type: TransactionType.BUY_SHORT, quantity: new Decimal(50) }
            ];
        });

        it('No transaction should be identified', () => {
            expect(TransactionValidator.getSwitchIndex(transactions, instrumentType)).toEqual(-1);
        });
    });

    describe('Where the transaction list sells 100 shares short then sells 50 shares short then buys 150 shares to cover', () => {
        let transactions;

        beforeEach(() => {
            transactions = [
                { type: TransactionType.SELL_SHORT, quantity: new Decimal(100) },
                { type: TransactionType.SELL_SHORT, quantity: new Decimal(50) },
                { type: TransactionType.BUY_SHORT, quantity: new Decimal(150) }
            ];
        });

        it('No transaction should be identified', () => {
            expect(TransactionValidator.getSwitchIndex(transactions, instrumentType)).toEqual(-1);
        });
    });

    describe('Where the transaction list buys 100 shares then sells 200 shares', () => {
        let transactions;

        beforeEach(() => {
            transactions = [
                { type: TransactionType.BUY, quantity: new Decimal(100) },
                { type: TransactionType.SELL, quantity: new Decimal(200) }
            ];
        });

        it('The second transaction should be identified as switching the direction', () => {
            expect(TransactionValidator.getSwitchIndex(transactions, instrumentType)).toEqual(1);
        });
    });

    describe('Where the transaction list sells 100 shares short then sells 50 shares short then buys 151 shares to cover', () => {
        let transactions;

        beforeEach(() => {
            transactions = [
                { type: TransactionType.SELL_SHORT, quantity: new Decimal(100) },
                { type: TransactionType.SELL_SHORT, quantity: new Decimal(50) },
                { type: TransactionType.BUY_SHORT, quantity: new Decimal(151) }
            ];
        });

        it('The third transaction should be identified as switching the direction', () => {
            expect(TransactionValidator.getSwitchIndex(transactions, instrumentType)).toEqual(2);
        });
    });
});

describe('When validating position violations', () => {
    'use strict';

    const instrumentType = InstrumentType.EQUITY;

    describe('With all BUY transactions', () => {
        let transactions;

        beforeEach(() => {
            transactions = [
                { type: TransactionType.BUY, quantity: new Decimal(1) },
                { type: TransactionType.BUY, quantity: new Decimal(2) }
            ];
        });

        it('Should return -1 (no violations)', () => {
            expect(TransactionValidator.getPositionViolationIndex(transactions, instrumentType)).toEqual(-1);
        });
    });

    describe('With all SELL transactions', () => {
        let transactions;

        beforeEach(() => {
            transactions = [
                { type: TransactionType.SELL, quantity: new Decimal(1) },
                { type: TransactionType.SELL, quantity: new Decimal(2) }
            ];
        });

        it('Should detect violation at index 0', () => {
            expect(TransactionValidator.getPositionViolationIndex(transactions, instrumentType)).toEqual(0);
        });
    });

    describe('With invalid transition BUY → SELL_SHORT', () => {
        let transactions;

        beforeEach(() => {
            transactions = [
                { type: TransactionType.BUY, quantity: new Decimal(10) },
                { type: TransactionType.SELL_SHORT, quantity: new Decimal(5) }
            ];
        });

        it('Should detect violation at index 1', () => {
            expect(TransactionValidator.getPositionViolationIndex(transactions, instrumentType)).toEqual(1);
        });
    });

    describe('With valid closing then switch LONG → SHORT', () => {
        let transactions;

        beforeEach(() => {
            transactions = [
                { type: TransactionType.BUY, quantity: new Decimal(10) },
                { type: TransactionType.SELL, quantity: new Decimal(10) },
                { type: TransactionType.SELL_SHORT, quantity: new Decimal(5) }
            ];
        });

        it('Should return -1 (no violations)', () => {
            expect(TransactionValidator.getPositionViolationIndex(transactions, instrumentType)).toEqual(-1);
        });
    });

    describe('With an open LONG position continuing correctly', () => {
        let transactions;
        let position;

        beforeEach(() => {
            position = {
                snapshot: {
                    open: new Decimal(100)
                }
            };
            transactions = [
                { type: TransactionType.BUY, quantity: new Decimal(20) },
                { type: TransactionType.SELL, quantity: new Decimal(50) }
            ];
        });

        it('Should return -1 (no violations)', () => {
            expect(TransactionValidator.getPositionViolationIndex(transactions, instrumentType, position)).toEqual(-1);
        });
    });

    describe('With an open SHORT position and invalid BUY', () => {
        let transactions;
        let position;

        beforeEach(() => {
            position = {
                snapshot: { open: new Decimal(-50) }
            };

            transactions = [
                { type: TransactionType.BUY, quantity: new Decimal(10) }
            ];
        });

        it('Should detect violation at index 0', () => {
            expect(TransactionValidator.getPositionViolationIndex(transactions, instrumentType, position)).toEqual(0);
        });
    });

    describe('Where the transaction list attempts to SELL too many shares', () => {
        let position;
        let transactions;

        beforeEach(() => {
            position = {
                snapshot: {
                    open: new Decimal(-5)
                }
            };

            transactions = [
                { type: TransactionType.BUY_SHORT, quantity: new Decimal(1) },
                { type: TransactionType.BUY_SHORT, quantity: new Decimal(1) },
                { type: TransactionType.BUY_SHORT, quantity: new Decimal(1) },
                { type: TransactionType.BUY_SHORT, quantity: new Decimal(1) },
                { type: TransactionType.BUY_SHORT, quantity: new Decimal(1) },
                { type: TransactionType.BUY_SHORT, quantity: new Decimal(1) },
                { type: TransactionType.BUY_SHORT, quantity: new Decimal(1) }
            ];
        });

        it('The sixth transaction should be identified as switching the direction', () => {
            expect(TransactionValidator.getPositionViolationIndex(transactions, instrumentType, position)).toEqual(5);
        });
    });

    describe('Where the transaction list attempts to SELL too many shares', () => {
        let position;
        let transactions;

        beforeEach(() => {
            position = {
                snapshot: {
                    open: new Decimal(5)
                }
            };

            transactions = [
                { type: TransactionType.SELL, quantity: new Decimal(1) },
                { type: TransactionType.SELL, quantity: new Decimal(1) },
                { type: TransactionType.SELL, quantity: new Decimal(1) },
                { type: TransactionType.SELL, quantity: new Decimal(1) },
                { type: TransactionType.SELL, quantity: new Decimal(1) },
                { type: TransactionType.SELL, quantity: new Decimal(1) },
                { type: TransactionType.SELL, quantity: new Decimal(1) }
            ];
        });

        it('The sixth transaction should be identified as switching the direction', () => {
            expect(TransactionValidator.getPositionViolationIndex(transactions, instrumentType, position)).toEqual(5);
        });
    });
});
