module.exports = (() => {
	'use strict';

	const exchangeRegex = /^(.*)\\.([A-Z]{1,4})$/i,
		jerqFutureConversionRegex = /(.{1,3})([A-Z]{1})([0-9]{3}|[0-9]{1})?([0-9]{1})$/i,
		concreteFutureRegex = /^(.{1,3})([A-Z]{1})([0-9]{4}|[0-9]{1,2})$/i,
		referenceFutureRegex = /^(.{1,3})(\*{1})([0-9]{1})$/i,
		futureSpreadRegex = /^_S_/i,
		forexRegex = /^\^([A-Z]{3})([A-Z]{3})$/i,
		sectorRegex = /^\-(.*)$/i,
		indexRegex = /^\$(.*)$/i,
		batsRegex = /^(.*)\.BZ$/i,
		usePercentRegex = /(\.RT)$/;

	function getIsType (symbol, type) {
		const instrumentType = symbolParser.parseInstrumentType(symbol);

		return instrumentType !== null && instrumentType.type === type;
	}

	const symbolParser = {
		parseInstrumentType: (symbol) => {
			if (typeof symbol !== 'string') {
				return null;
			}

			const exchangeMatch = symbol.match(exchangeRegex);

			if (exchangeMatch !== null) {
				symbol = exchangeMatch[1];
			}

			if (futureSpreadRegex.test(symbol)) {
				return {
					symbol: symbol,
					type: 'future_spread'
				};
			}

			const staticFutureMatch = symbol.match(concreteFutureRegex);

			if (staticFutureMatch !== null) {
				const currentDate = new Date();
				const currentYear = currentDate.getFullYear();
				const yearString = staticFutureMatch[3];

				let year = parseInt(yearString);

				if (year < 10) {
					year = Math.floor(currentYear / 10) * 10 + year;
				} else if (year < 100) {
					year = Math.floor(currentYear / 100) * 100 + year;

					if (year < currentYear) {
						const alternateYear = year + 100;

						if (currentYear - year > alternateYear - currentYear) {
							year = alternateYear;
						}
					}
				}

				return {
					symbol: symbol,
					type: 'future',
					root: staticFutureMatch[1],
					dynamic: false,
					month: staticFutureMatch[2],
					year: year
				};
			}

			const dynamicFutureMatch = symbol.match(referenceFutureRegex);

			if (dynamicFutureMatch !== null) {
				return {
					symbol: symbol,
					type: 'future',
					root: dynamicFutureMatch[1],
					dynamic: true,
					dynamicCode: dynamicFutureMatch[3]
				};
			}

			const forexMatch = symbol.match(forexRegex);

			if (forexMatch !== null) {
				return {
					symbol: symbol,
					type: 'forex'
				};
			}

			const indexMatch = symbol.match(indexRegex);

			if (indexMatch !== null) {
				return {
					symbol: symbol,
					type: 'index'
				};
			}

			const sectorMatch = symbol.match(sectorRegex);

			if (sectorMatch !== null) {
				return {
					symbol: symbol,
					type: 'sector'
				};
			}

			return null;
		},

		getIsConcrete: (symbol) => {
			return !symbolParser.getIsReference(symbol);
		},

		getIsReference: (symbol) => {
			return referenceFutureRegex.test(symbol);
		},

		getIsFuture: (symbol) => {
			return getIsType(symbol, 'future');
		},

		getIsFutureSpread: (symbol) => {
			return getIsType(symbol, 'future_spread');
		},

		getIsForex: (symbol) => {
			return getIsType(symbol, 'forex');
		},

		getIsSector: (symbol) => {
			return getIsType(symbol, 'sector');
		},

		getIsIndex: (symbol) => {
			return getIsType(symbol, 'index');
		},

		getIsBats: (symbol) => {
			return batsRegex.test(symbol);
		},

		getProducerSymbol: (symbol) => {
			if (typeof symbol === 'string') {
				return symbol.replace(jerqFutureConversionRegex, '$1$2$4');
			} else {
				return null;
			}
		},

		displayUsingPercent: (symbol) => {
			return usePercentRegex.test(symbol);
		}
	};

	return symbolParser;
})();