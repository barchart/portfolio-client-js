const TransactionType = require('./../../../lib/data/TransactionType');

describe('When transaction types identify dividend income', () => {
	'use strict';

	it('cash dividends should be identified', () => {
		expect(TransactionType.DIVIDEND.dividend).toBe(true);
	});

	it('reinvested dividends should be identified', () => {
		expect(TransactionType.DIVIDEND_REINVEST.dividend).toBe(true);
	});

	it('cash distributions should be identified', () => {
		expect(TransactionType.DISTRIBUTION_CASH.dividend).toBe(true);
	});

	it('reinvested distributions should be identified', () => {
		expect(TransactionType.DISTRIBUTION_REINVEST.dividend).toBe(true);
	});

	it('stock dividends should not be identified as dividend income', () => {
		expect(TransactionType.DIVIDEND_STOCK.dividend).toBe(false);
	});

	it('unit distributions should not be identified as dividend income', () => {
		expect(TransactionType.DISTRIBUTION_FUND.dividend).toBe(false);
	});
});
