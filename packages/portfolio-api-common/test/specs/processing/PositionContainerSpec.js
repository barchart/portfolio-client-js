const Currency = require('@barchart/common-js/lang/Currency'),
	Decimal = require('@barchart/common-js/lang/Decimal');

const PositionContainer = require('./../../../lib/processing/PositionContainer'),
	PositionGroupDefinition = require('./../../../lib/processing/PositionGroupDefinition');

describe('When a position container data is gathered', () => {
	'use strict';

	let positionCounter = 0;

	function getPosition(portfolio, symbol, currency) {
		return {
			portfolio: portfolio,
			position: (positionCounter++).toString(),
			instrument: {
				symbol: {
					barchart: symbol,
					currency: currency || Currency.USD
				}
			},
			snapshot: {
				basis: new Decimal(123)
			}
		}
	}

	describe('for two portfolios, each with the same position, and the second portfolio with an additonal position', () => {
		let portfolios;
		let positions;
		let summaries;

		beforeEach(() => {
			portfolios = [
				{
					portfolio: 'a',
					name: 'a'
				}, {
					portfolio: 'b',
					name: 'b'
				}
			];

			positions = [
				getPosition('a', 'AAPL'),
				getPosition('b', 'AAPL'),
				getPosition('b', 'TSLA')
			];

			summaries = [ ];
		});

		describe('and a container is created grouping by total, portfolio, and instrument', () => {
			let definitions;
			let container;

			beforeEach(() => {
				definitions = [
					new PositionGroupDefinition('Total', x => true, x => 'Total'),
					new PositionGroupDefinition('Portfolio', x => x.portfolio.portfolio, x => x.portfolio.name),
					new PositionGroupDefinition('Position', x => x.position.position, x => x.position.instrument.symbol.barchart)
				];

				try {
					container = new PositionContainer(portfolios, positions, summaries, definitions);
				} catch (e) {
					console.log(e);
				}
			});

			it('the "Total" group should have two children groups', () => {
				expect(container.getGroups([ 'Total' ]).length).toEqual(2);
			});

			it('the "Total" group should have three items', () => {
				expect(container.getGroup([ 'Total' ]).items.length).toEqual(3);
			});

			it('The "a" portfolio group should have one child group', () => {
				expect(container.getGroups([ 'Total', 'a' ]).length).toEqual(1);
			});

			it('the "a" portfolio group should have one item', () => {
				expect(container.getGroup([ 'Total', 'a' ]).items.length).toEqual(1);
			});

			it('The "b" portfolio group should have two child groups', () => {
				expect(container.getGroups([ 'Total', 'b' ]).length).toEqual(2);
			});

			it('the "b" portfolio group should have two items', () => {
				expect(container.getGroup([ 'Total', 'b' ]).items.length).toEqual(2);
			});
		});
	});
});
