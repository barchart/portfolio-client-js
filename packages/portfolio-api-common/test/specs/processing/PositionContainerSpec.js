const Currency = require('@barchart/common-js/lang/Currency'),
	Decimal = require('@barchart/common-js/lang/Decimal');

const InstrumentType = require('./../../../lib/data/InstrumentType');

const PositionContainer = require('./../../../lib/processing/PositionContainer'),
	PositionLevelDefinition = require('./../../../lib/processing/definitions/PositionLevelDefinition'),
	PositionTreeDefinition = require('./../../../lib/processing/definitions/PositionTreeDefinition');

describe('When a position container data is gathered', () => {
	'use strict';

	let positionCounter = 0;

	function getPosition(portfolio, symbol, currency) {
		return {
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
				income: new Decimal(0),
				gain: new Decimal(0)
			}
		};
	}

	describe('for two portfolios, each with the same position, and the second portfolio with an addition position', () => {
		let portfolios;
		let positions;
		let summaries;

		beforeEach(() => {
			portfolios = [
				{
					portfolio: 'My First Portfolio',
					name: 'a'
				}, {
					portfolio: 'My Second Portfolio',
					name: 'b'
				}
			];

			positions = [
				getPosition('My First Portfolio', 'AAPL'),
				getPosition('My Second Portfolio', 'AAPL'),
				getPosition('My Second Portfolio', 'TSLA')
			];

			summaries = [ ];
		});

		describe('and a container is created grouping by total, portfolio, and instrument', () => {
			let name;
			let definitions;
			let container;

			beforeEach(() => {
				definitions = [
					new PositionTreeDefinition(name = 'the only tree', [
						new PositionLevelDefinition('Total', x => 'totals', x => 'Total', x => Currency.CAD),
						new PositionLevelDefinition('Portfolio', x => x.portfolio.portfolio, x => x.portfolio.name, x => Currency.CAD),
						new PositionLevelDefinition('Position', x => x.position.position, x => x.position.instrument.symbol.barchart, x =>  x.position.instrument.currency)
					])
				];

				try {
					container = new PositionContainer(definitions, portfolios, positions, summaries);
				} catch (e) {
					console.log(e);
				}
			});

			it('the "Total" group should have two children groups', () => {
				expect(container.getGroups(name, [ 'totals' ]).length).toEqual(2);
			});

			it('the "Total" group should have three items', () => {
				expect(container.getGroup(name, [ 'totals' ]).items.length).toEqual(3);
			});

			it('The "a" portfolio group should have one child group', () => {
				expect(container.getGroups(name, [ 'totals', 'My First Portfolio' ]).length).toEqual(1);
			});

			it('the "a" portfolio group should have one item', () => {
				expect(container.getGroup(name, [ 'totals', 'My First Portfolio' ]).items.length).toEqual(1);
			});

			it('The "b" portfolio group should have two child groups', () => {
				expect(container.getGroups(name, [ 'totals', 'My Second Portfolio' ]).length).toEqual(2);
			});

			it('the "b" portfolio group should have two items', () => {
				expect(container.getGroup(name, [ 'totals', 'My Second Portfolio' ]).items.length).toEqual(2);
			});
		});
	});
});
