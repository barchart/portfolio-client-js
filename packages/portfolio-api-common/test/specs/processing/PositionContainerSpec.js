const Currency = require('@barchart/common-js/lang/Currency'),
	Decimal = require('@barchart/common-js/lang/Decimal');

const InstrumentType = require('./../../../lib/data/InstrumentType'),
	PositionSummaryFrame = require('./../../../lib/data/PositionSummaryFrame');

const PositionContainer = require('./../../../lib/processing/PositionContainer'),
	PositionBindingNode = require('./../../../lib/processing/PositionBindingNode'),
	PositionGroup = require('./../../../lib/processing/PositionGroup'),
	PositionGroupBinding = require('./../../../lib/processing/PositionGroupBinding'),
	PositionLevelDefinition = require('./../../../lib/processing/definitions/PositionLevelDefinition'),
	PositionLevelType = require('./../../../lib/processing/definitions/PositionLevelType'),
	PositionTreeDefinition = require('./../../../lib/processing/definitions/PositionTreeDefinition');

describe('When a position container data is gathered', () => {
	'use strict';

	let positionCounter = 0;

	function getPosition(portfolio, symbol, currency) {
		return {
			portfolio: portfolio,
			position: (positionCounter++).toString(),
			instrument: {
				name: symbol,
				symbol: {
					barchart: symbol,
					display: symbol
				},
				currency: currency || Currency.USD,
				type: InstrumentType.EQUITY
			},
			snapshot: {
				basis: new Decimal(123),
				value: new Decimal(456),
				open: new Decimal(1),
				income: new Decimal(0),
				gain: new Decimal(0),
				buys: new Decimal(50),
				sells: new Decimal(0)
			}
		};
	}

	function getSummaries(position, frame, count) {
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

			summaries = positions.reduce((accumulator, position) => {
				accumulator = accumulator.concat(getSummaries(position, PositionSummaryFrame.YTD, 1));
				accumulator = accumulator.concat(getSummaries(position, PositionSummaryFrame.YEARLY, 3));

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

			it('the raw container should expose raw position groups', () => {
				const group = container.getGroup(name, [ 'totals' ]);
				const groups = container.getGroups(name, [ 'totals' ]);

				expect(group instanceof PositionGroup).toEqual(true);
				expect(groups[0] instanceof PositionGroup).toEqual(true);
				expect(groups[0] instanceof PositionGroupBinding).toEqual(false);
			});

			it('the "Total" group should have three items', () => {
				expect(container.getGroup(name, [ 'totals' ]).items.length).toEqual(3);
			});

			it('the container should expose portfolio bindings', () => {
				expect(container.portfolios).toEqual(portfolios);
				expect(container.getPortfolios()).toBe(container.portfolios);
			});

			it('the container should expose position bindings separately from the raw tree', () => {
				const group = container.getGroup(name, [ 'totals' ]);
				const binding = group.binding;
				const tree = container.trees[name];
				const node = tree.getChildren()[0];
				const bindingTree = container.binding.trees[name];
				const bindingNode = bindingTree.children[0];

				expect(node.getValue()).toBe(group);
				expect(tree.binding).toBe(bindingTree);
				expect(tree.binding.value).toBeNull();
				expect(bindingTree instanceof PositionBindingNode).toEqual(true);
				expect(bindingNode.value).toBe(binding);
				expect(bindingTree.children.length).toEqual(1);
				expect(binding instanceof PositionGroupBinding).toEqual(true);
				expect(binding.formatted).toBe(group.data);
				expect(binding.data).toBe(group.data);
				expect(binding.formatted.description).toEqual('Total');
				expect(binding.children).toBeUndefined();
				expect(container.binding.getGroup(name, [ 'totals' ])).toBe(binding);
				expect(container.binding.getGroups(name, [ 'totals' ])[0] instanceof PositionGroupBinding).toEqual(true);
				expect(bindingNode.children.map(child => child.value)).toEqual(container.binding.getGroups(name, [ 'totals' ]));
			});

			it('the raw and binding trees should keep child indexes synchronized', () => {
				const tree = container.trees[name];
				const totalNode = tree.getChildren()[0];
				const portfolioNode = totalNode.getChildren()[0];

				expect(tree.getChildren().length).toEqual(tree.binding.children.length);
				expect(tree.getChildren()[0].binding).toBe(tree.binding.children[0]);
				expect(totalNode.getChildren().length).toEqual(totalNode.binding.children.length);
				expect(totalNode.getChildren()[0].binding).toBe(totalNode.binding.children[0]);
				expect(portfolioNode.getChildren().length).toEqual(portfolioNode.binding.children.length);
				expect(portfolioNode.getChildren()[0].binding).toBe(portfolioNode.binding.children[0]);
			});

			it('the binding objects should not contain raw model back references', () => {
				const tree = container.trees[name];
				const group = container.getGroup(name, [ 'totals' ]);
				const binding = container.binding.getGroup(name, [ 'totals' ]);
				const bindingNode = container.binding.trees[name].children[0];

				expect(Object.keys(container.binding)).toEqual([ 'portfolios', 'trees' ]);
				expect(Object.keys(bindingNode)).toEqual([ 'value', 'children' ]);
				expect(Object.keys(binding)).toEqual([ 'formatted' ]);
				expect(binding).toBe(group.binding);
				expect(bindingNode).toBe(tree.getChildren()[0].binding);
			});

			it('The "a" portfolio group should have one child group', () => {
				expect(container.getGroups(name, [ 'totals', 'My First Portfolio' ]).length).toEqual(1);
			});

			it('The formatted position group binding should update after a quote change', () => {
				const binding = container.binding.getGroups(name, [ 'totals', 'My First Portfolio' ])[0];

				container.setQuotes([ { lastPrice: 200, symbol: 'AAPL' } ], [ ]);

				expect(binding.formatted.currentPrice).toEqual('200.00');
			});

			it('The formatted position group binding should not expose raw instrument or fundamental data', () => {
				const binding = container.binding.getGroups(name, [ 'totals', 'My First Portfolio' ])[0];

				container.setPositionFundamentalData('AAPL', false, {
					raw: {
						percentChange1m: 0.01,
						percentChange1y: 0.02,
						percentChange3m: 0.03,
						percentChangeYtd: 0.04
					}
				});

				expect(binding.formatted.instrument).toEqual('AAPL');
				expect(binding.formatted.instrumentName).toEqual('AAPL');
				expect(binding.formatted.instrumentSymbolBarchart).toEqual('AAPL');
				expect(binding.formatted.instrumentCurrency).toEqual('USD');
				expect(binding.formatted.instrumentTypeCode).toEqual('EQUITY');
				expect(binding.formatted.fundamental).toBeNull();
				expect(binding.formatted.fundamentalPercentChange1m).toEqual('+1.00%');
			});

			it('The position group binding should be removed with its group', () => {
				const tree = container.trees[name];
				const parentGroup = container.getGroup(name, [ 'totals', 'My First Portfolio' ]);
				const group = container.getGroup(name, [ 'totals', 'My First Portfolio', positions[0].position ]);
				const totalNode = tree.getChildren()[0];
				const parentNode = totalNode.findChild(candidate => candidate === parentGroup);
				const node = parentNode.findChild(candidate => candidate === group);
				const parentBindingNode = container.binding.trees[name].children[0].children[0];

				container.removePosition(positions[0]);

				expect(container.trees[name]).toBe(tree);
				expect(parentNode.getChildren()).not.toContain(node);
				expect(parentBindingNode.children.map(child => child.value)).not.toContain(group.binding);
				expect(parentNode.getChildren().length).toEqual(parentNode.binding.children.length);
				expect(container.binding.getGroup(name, [ 'totals', 'My First Portfolio', positions[0].position ])).toBeNull();
			});

			it('The portfolio bindings should update without replacing the array', () => {
				const portfolioBindings = container.portfolios;
				const bindingPortfolioBindings = container.binding.portfolios;
				const portfolio = Object.assign({}, portfolios[0], { name: 'updated' });

				container.updatePortfolio(portfolio);

				expect(container.portfolios).toBe(portfolioBindings);
				expect(container.binding.portfolios).toBe(bindingPortfolioBindings);
				expect(container.binding.portfolios).toBe(container.portfolios);
				expect(container.portfolios[0]).toBe(portfolio);
			});

			it('The portfolio bindings should support observable additions and removals', () => {
				const portfolioBindings = container.portfolios;
				const bindingPortfolioBindings = container.binding.portfolios;
				const portfolio = { portfolio: 'My Third Portfolio', name: 'c' };

				container.addPortfolio(portfolio);

				expect(container.portfolios).toBe(portfolioBindings);
				expect(container.binding.portfolios).toBe(bindingPortfolioBindings);
				expect(container.binding.portfolios).toBe(container.portfolios);
				expect(container.portfolios).toContain(portfolio);

				container.removePortfolio(portfolio);

				expect(container.portfolios).toBe(portfolioBindings);
				expect(container.binding.portfolios).toBe(bindingPortfolioBindings);
				expect(container.portfolios).not.toContain(portfolio);
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

			describe('and an item is pulled for one of the positions', function() {
				let item;

				let todayYear;
				let todayMonth;
				let todayDay;

				beforeEach(() => {
					item = container.getGroup(name, [ 'totals', 'My First Portfolio' ]).items[0];

					const today = new Date();

					todayYear = today.getFullYear();
					todayMonth = today.getMonth() + 1;
					todayDay = today.getDate();
				});

				it('the current summary should be a YTD summary for this year', () => {
					expect(item.currentSummary).toBe(summaries.find(s => s.position === item.position.position && s.frame === PositionSummaryFrame.YTD && s.start.date.format() === `${(todayYear - 1)}-12-31` && s.end.date.format() === `${(todayYear - 0)}-12-31`));
				});

				it('should have two previous summaries', () => {
					expect(item.previousSummaries.length).toEqual(3);
				});

				it('the previous (x1) summary should be a YEARLY summary for three years ago', () => {
					expect(item.previousSummaries[0]).toBe(summaries.find(s => s.position === item.position.position && s.frame === PositionSummaryFrame.YEARLY && s.start.date.format() === `${(todayYear - 4)}-12-31` && s.end.date.format() === `${(todayYear - 3)}-12-31`));
				});

				it('the previous (x2) summary should be a YEARLY summary for the year before last', () => {
					expect(item.previousSummaries[1]).toBe(summaries.find(s => s.position === item.position.position && s.frame === PositionSummaryFrame.YEARLY && s.start.date.format() === `${(todayYear - 3)}-12-31` && s.end.date.format() === `${(todayYear - 2)}-12-31`));
				});

				it('the previous (x3) summary should be a YEARLY summary for last year', () => {
					expect(item.previousSummaries[2]).toBe(summaries.find(s => s.position === item.position.position && s.frame === PositionSummaryFrame.YEARLY && s.start.date.format() === `${(todayYear - 2)}-12-31` && s.end.date.format() === `${(todayYear - 1)}-12-31`));
				});
			});
		});
	});
});
