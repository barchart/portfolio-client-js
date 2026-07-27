const array = require('@barchart/common-js/lang/array'),
	CurrencyTranslator = require('@barchart/common-js/lang/CurrencyTranslator'),
	Decimal = require('@barchart/common-js/lang/Decimal'),
	Rate = require('@barchart/common-js/lang/Rate');

module.exports = (() => {
	'use strict';

	/**
	 * A currency translator which can register additional forex symbols while
	 * preserving previously configured rates.
	 *
	 * @public
	 * @param {String[]} symbols
	 * @param {Rate[]} rates
	 */
	class ExpandableCurrencyTranslator {
		constructor(symbols, rates) {
			this._symbols = array.unique(symbols);
			this._rates = new Map();

			rates.forEach((rate) => {
				this._rates.set(rate.getSymbol(), rate);
			});

			rebuildCurrencyTranslator.call(this);
		}

		/**
		 * Registers an additional forex symbol.
		 *
		 * @public
		 * @param {String} symbol
		 */
		addSymbol(symbol) {
			if (this._symbols.includes(symbol)) {
				return;
			}

			this._symbols.push(symbol);

			if (!this._rates.has(symbol)) {
				this._rates.set(symbol, Rate.fromPair(Decimal.ONE, symbol));
			}

			rebuildCurrencyTranslator.call(this);
		}

		/**
		 * Updates the translator with a new rate.
		 *
		 * @public
		 * @param {Rate} rate
		 */
		setRate(rate) {
			this._rates.set(rate.getSymbol(), rate);
			this._translator.setRate(rate);
		}

		/**
		 * Translates an amount from one currency to another.
		 *
		 * @public
		 * @param {Number|Decimal} amount
		 * @param {Currency} current
		 * @param {Currency} desired
		 * @returns {Number|Decimal}
		 */
		translate(amount, current, desired) {
			return this._translator.translate(amount, current, desired);
		}
	}

	function rebuildCurrencyTranslator() {
		this._translator = new CurrencyTranslator(this._symbols);
		this._translator.setRates([ ...this._rates.values() ]);
	}

	return ExpandableCurrencyTranslator;
})();
