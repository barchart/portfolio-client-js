const Day = require('@barchart/common-js/lang/Day'),
	Decimal = require('@barchart/common-js/lang/Decimal');

const TransactionType = require('./../../../lib/data/TransactionType');

const TransactionSchema = require('./../../../lib/serialization/TransactionSchema');

describe('When transactions are serialized', () => {
	'use strict';

	function normalizeTransaction(transaction) {
		return {
			cash: transaction.cash,
			date: transaction.date.format(),
			fee: transaction.fee.toString(),
			portfolio: transaction.portfolio,
			position: transaction.position,
			price: transaction.price.toString(),
			quantity: transaction.quantity.toString(),
			reinvest: transaction.reinvest,
			sequence: transaction.sequence,
			type: transaction.type
		};
	}

	describe('for an edit operation (user error #1)', () => {
		let transaction;
		let serialized;

		beforeEach(() => {
			transaction = { };

			transaction.portfolio = '063e00ea-8d1b-4faa-aedf-f43bdf23590e';
			transaction.position = 'c2eefcde-f8d0-438d-9414-28f307d7b544';
			transaction.sequence = 1;
			transaction.type = TransactionType.BUY;
			transaction.date = new Day(2018, 7, 9);
			transaction.price = new Decimal(15.92);
			transaction.quantity = new Decimal(100);
			transaction.fee = new Decimal(9.95);
			transaction.reinvest = 'default';
			transaction.cash = 'default';

			const formatted = TransactionSchema.BUY.schema.format(transaction);

			serialized = JSON.stringify(formatted);
		});

		it('the serialized data should be correct', () => {
			expect(typeof serialized === 'string').toEqual(true);
		});

		describe('and the data is deserialized', () => {
			let deserialized;

			beforeEach(() => {
				const reviver = TransactionSchema.BUY.schema.getReviver();

				deserialized = JSON.parse(serialized, reviver);
			});

			it('the deserialized data should be correct', () => {
				expect(normalizeTransaction(deserialized)).toEqual(normalizeTransaction(transaction));
			});
		});
	});
});
