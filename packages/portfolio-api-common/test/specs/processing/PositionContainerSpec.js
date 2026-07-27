const Currency = require('@barchart/common-js/lang/Currency');

const InstrumentType = require('./../../../lib/data/InstrumentType'),
	PositionSummaryFrame = require('./../../../lib/data/PositionSummaryFrame');

const PositionContainer = require('./../../../lib/processing/PositionContainer'),
	PositionLevelDefinition = require('./../../../lib/processing/definitions/PositionLevelDefinition'),
	PositionLevelType = require('./../../../lib/processing/definitions/PositionLevelType'),
	PositionTreeDefinition = require('./../../../lib/processing/definitions/PositionTreeDefinition');

const positionTestFactory = require('../../utils/processing/PositionTestFactory');

describe('When a position container data is gathered', () => {
	'use strict';

	describe('for two portfolios, each with the same position, and the second portfolio with an addition position', () => {
		let portfolios;
		let positions;
		let summaries;

		beforeEach(() => {
			positionTestFactory.resetPositionCounter();

			portfolios = [
				positionTestFactory.createPortfolio('My First Portfolio', 'a'),
				positionTestFactory.createPortfolio('My Second Portfolio', 'b')
			];

			positions = [
				positionTestFactory.createPosition('My First Portfolio', 'AAPL'),
				positionTestFactory.createPosition('My Second Portfolio', 'AAPL'),
				positionTestFactory.createPosition('My Second Portfolio', 'TSLA')
			];

			summaries = positions.reduce((accumulator, position) => {
				accumulator = accumulator.concat(positionTestFactory.createSummaries(position, PositionSummaryFrame.YTD, 1));
				accumulator = accumulator.concat(positionTestFactory.createSummaries(position, PositionSummaryFrame.YEARLY, 3));
				accumulator = accumulator.concat(positionTestFactory.createSummaries(position, PositionSummaryFrame.WTD, 1));
				accumulator = accumulator.concat(positionTestFactory.createSummaries(position, PositionSummaryFrame.MTD, 1));

				return accumulator;
			}, [ ]);
		});

		describe('and a container is created grouping by total, portfolio, and instrument', () => {
			let name;
			let definitions;
			let container;

			beforeEach(() => {
				definitions = [
					new PositionTreeDefinition(name = 'the only tree', [
						new PositionLevelDefinition('Total', PositionLevelType.OTHER, x => 'totals', x => 'Total', x => Currency.CAD),
						new PositionLevelDefinition('Portfolio', PositionLevelType.PORTFOLIO, x => x.portfolio.portfolio, x => x.portfolio.name, x => Currency.CAD),
						new PositionLevelDefinition('Position', PositionLevelType.POSITION, x => x.position.position, x => x.position.instrument.symbol.barchart, x =>  x.position.instrument.currency)
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

			it('the "Total" group should expose binding data, not raw position items', () => {
				const group = container.getGroup(name, [ 'totals' ]);

				expect({
					description: group.formatted.description,
					items: group.items,
					positions: group.formatted.positions
				}).toEqual({
					description: 'Total',
					items: undefined,
					positions: [ ]
				});
			});

			it('The "a" portfolio group should have one child group', () => {
				expect(container.getGroups(name, [ 'totals', 'My First Portfolio' ]).length).toEqual(1);
			});

			it('the "a" position group should expose one formatted position', () => {
				const group = container.getGroup(name, [ 'totals', 'My First Portfolio', positions[0].position ]);

				expect(group.formatted.positions.map(position => position.position)).toEqual([ positions[0].position ]);
			});

			it('the position group should expose current WTD and MTD returns', () => {
				const group = container.getGroup(name, [ 'totals', 'My First Portfolio', positions[0].position ]);

				expect({
					monthToDatePercent: group.formatted.monthToDatePercent,
					weekToDatePercent: group.formatted.weekToDatePercent
				}).toEqual({
					monthToDatePercent: '0.00%',
					weekToDatePercent: '0.00%'
				});
			});

			it('The "b" portfolio group should have two child groups', () => {
				expect(container.getGroups(name, [ 'totals', 'My Second Portfolio' ]).length).toEqual(2);
			});

			it('the "b" portfolio group should expose two child bindings', () => {
				const groups = container.getGroups(name, [ 'totals', 'My Second Portfolio' ]);

				expect(groups.map(group => group.formatted.position)).toEqual([ positions[1].position, positions[2].position ]);
			});

			it('the formatted position group binding should update after a quote change', () => {
				const group = container.getGroup(name, [ 'totals', 'My First Portfolio', positions[0].position ]);

				container.setQuotes([ { lastPrice: 200, symbol: 'AAPL' } ], [ ]);

				expect(group.formatted.currentPrice).toEqual('200.00');
			});

			it('the formatted position group binding should update after a fundamental data change', () => {
				const group = container.getGroup(name, [ 'totals', 'My First Portfolio', positions[0].position ]);

				container.setPositionFundamentalData('AAPL', false, {
					raw: {
						percentChange1m: 0.01,
						percentChange1y: 0.02,
						percentChange3m: 0.03,
						percentChangeYtd: 0.04
					}
				});

				expect({
					fundamental: group.formatted.fundamental,
					percentChange1m: group.formatted.fundamental.raw.percentChange1m
				}).toEqual({
					fundamental: {
						raw: {
							percentChange1m: 0.01,
							percentChange1y: 0.02,
							percentChange3m: 0.03,
							percentChangeYtd: 0.04
						}
					},
					percentChange1m: 0.01
				});
			});
		});
	});
});

describe('When a position container uses currencies outside its default currency list', () => {
	'use strict';

	const treeName = 'positions';

	const createDefinitions = () => {
		return [
			new PositionTreeDefinition(treeName, [
				new PositionLevelDefinition('Total', PositionLevelType.OTHER, x => 'totals', x => 'Total', x => Currency.USD),
				new PositionLevelDefinition('Portfolio', PositionLevelType.PORTFOLIO, x => x.portfolio.portfolio, x => x.portfolio.name, x => Currency.USD),
				new PositionLevelDefinition('Position', PositionLevelType.POSITION, x => x.position.position, x => x.position.instrument.symbol.barchart, x => x.position.instrument.currency)
			])
		];
	};

	const createAssetDefinitions = () => {
		return [
			new PositionTreeDefinition(treeName, [
				new PositionLevelDefinition('Total', PositionLevelType.OTHER, x => 'totals', x => 'Total', x => Currency.USD),
				new PositionLevelDefinition('Portfolio', PositionLevelType.PORTFOLIO, x => x.portfolio.portfolio, x => x.portfolio.name, x => Currency.USD),
				new PositionLevelDefinition('Asset', PositionLevelType.OTHER, x => PositionLevelDefinition.getKeyForAssetClassGroup(x.position.instrument.type, x.position.instrument.currency), x => `${x.position.instrument.type.alternateDescription} (${x.position.instrument.currency.code})`, x => x.position.instrument.currency),
				new PositionLevelDefinition('Position', PositionLevelType.POSITION, x => x.position.position, x => x.position.instrument.symbol.barchart, x => x.position.instrument.currency)
			])
		];
	};

	beforeEach(() => {
		positionTestFactory.resetPositionCounter();
	});

	it('should register the forex symbol required by an initial ILS position', () => {
		const portfolio = positionTestFactory.createPortfolio('portfolio', 'Portfolio');
		const position = positionTestFactory.createPosition(portfolio.portfolio, 'ILS', Currency.ILS);
		const container = new PositionContainer(createDefinitions(), [ portfolio ], [ position ], [ ]);

		expect(container.getForexSymbols()).toContain('^USDILS');
	});

	it('should notify observers when an SGD position is added after construction', () => {
		const portfolio = positionTestFactory.createPortfolio('portfolio', 'Portfolio');
		const container = new PositionContainer(createDefinitions(), [ portfolio ], [ ], [ ]);
		const symbols = [ ];

		container.registerForexSymbolAddedHandler(symbol => symbols.push(symbol));
		container.updatePosition(positionTestFactory.createPosition(portfolio.portfolio, 'SGD', Currency.SGD), [ ]);

		expect(symbols).toEqual([ '^USDSGD' ]);
	});

	it('should expose a new ILS asset group through existing bindings when a position is added', () => {
		const portfolio = positionTestFactory.createPortfolio('portfolio', 'Portfolio');
		const initialPosition = positionTestFactory.createPosition(portfolio.portfolio, 'USD', Currency.USD);
		const container = new PositionContainer(createAssetDefinitions(), [ portfolio ], [ initialPosition ], [ ]);
		const assetGroups = container.getGroups(treeName, [ 'totals', portfolio.portfolio ]);

		container.updatePosition(positionTestFactory.createPosition(portfolio.portfolio, 'ILS', Currency.ILS), [ ]);

		expect(assetGroups.map(group => ({ key: group.data.key, description: group.data.description }))).toContain({
			key: PositionLevelDefinition.getKeyForAssetClassGroup(InstrumentType.EQUITY, Currency.ILS),
			description: 'Equities (ILS)'
		});
	});

	it('should notify observers only once for multiple positions using the same new currency', () => {
		const portfolio = positionTestFactory.createPortfolio('portfolio', 'Portfolio');
		const container = new PositionContainer(createDefinitions(), [ portfolio ], [ ], [ ]);
		const symbols = [ ];

		container.registerForexSymbolAddedHandler(symbol => symbols.push(symbol));
		container.updatePosition(positionTestFactory.createPosition(portfolio.portfolio, 'SGD-1', Currency.SGD), [ ]);
		container.updatePosition(positionTestFactory.createPosition(portfolio.portfolio, 'SGD-2', Currency.SGD), [ ]);

		expect(symbols.length).toEqual(1);
	});

	it('should preserve known exchange rates when a new currency is registered', () => {
		const firstPortfolio = positionTestFactory.createPortfolio('first', 'First');
		const secondPortfolio = positionTestFactory.createPortfolio('second', 'Second');
		const firstPosition = positionTestFactory.createPosition(firstPortfolio.portfolio, 'ILS', Currency.ILS);
		const container = new PositionContainer(createDefinitions(), [ firstPortfolio, secondPortfolio ], [ firstPosition ], [ ]);

		container.setQuotes([ ], [ { symbol: '^USDILS', lastPrice: 4 } ]);
		container.updatePosition(positionTestFactory.createPosition(secondPortfolio.portfolio, 'SGD', Currency.SGD), [ ]);
		container.setQuotes([ ], [ { symbol: '^USDILS', lastPrice: 4 } ]);

		const firstPortfolioGroup = container.getGroup(treeName, [ 'totals', firstPortfolio.portfolio ]);

		expect(firstPortfolioGroup.formatted.market).toEqual('114.00');
	});
});
