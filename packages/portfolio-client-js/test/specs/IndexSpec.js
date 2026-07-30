const PortfolioClient = require('../../lib');

describe('PortfolioClient', () => {
	it('exposes the package version', () => {
		expect(PortfolioClient.version).toEqual('14.0.0');
	});
});
