const Currency = require('@barchart/common-js/lang/Currency'),
	Decimal = require('@barchart/common-js/lang/Decimal');

const InstrumentType = require('../../../lib/data/InstrumentType'),
	PositionDirection = require('../../../lib/data/PositionDirection');

let positionCounter = 0;

function resetPositionCounter() {
	positionCounter = 0;
}

function createPortfolio(portfolio, name, overrides) {
	return Object.assign({
		portfolio: portfolio || 'My Portfolio',
		name: name || 'Portfolio'
	}, overrides || { });
}

function createPosition(portfolio, symbol, currency, overrides) {
	return Object.assign({
		portfolio: portfolio,
		position: (positionCounter++).toString(),
		instrument: {
			symbol: {
				barchart: symbol
			},
			currency: currency || Currency.USD,
			type: InstrumentType.EQUITY
		},
		snapshot: {
			basis: new Decimal(123),
			value: new Decimal(456),
			open: new Decimal(1),
			direction: PositionDirection.LONG,
			income: new Decimal(0),
			gain: new Decimal(0),
			buys: new Decimal(50),
			sells: new Decimal(0)
		}
	}, overrides || { });
}

function createSummaries(position, frame, count) {
	const ranges = frame.getRecentRanges(count - 1);

	return ranges.map((range) => {
		return {
			portfolio: position.portfolio,
			position: position.position,
			frame: frame,
			start: {
				date: range.start,
				open: position.snapshot.open,
				value: position.snapshot.value,
				basis: position.snapshot.basis
			},
			end: {
				date: range.end,
				open: position.snapshot.open,
				value: position.snapshot.value,
				basis: position.snapshot.basis
			},
			period: {
				buys: new Decimal(0),
				sells: new Decimal(0),
				income: new Decimal(0),
				realized: new Decimal(0),
				unrealized: new Decimal(0)
			}
		};
	});
}

module.exports = {
	createPortfolio,
	createPosition,
	createSummaries,
	resetPositionCounter
};
