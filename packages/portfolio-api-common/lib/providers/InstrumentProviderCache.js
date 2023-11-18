const assert = require('@barchart/common-js/lang/assert'),
	TimeMap = require('@barchart/common-js/collections/specialized/TimeMap');

const InstrumentProvider = require('./InstrumentProvider');

module.exports = (() => {
	'use strict';

	const MAXIMUM_CACHE_AGE_IN_MILLISECONDS = 15 * 60 * 1000;

	/**
	 * A caching layer on top of the {@link InstrumentProvider}.
	 *
	 * @public
	 * @param {InstrumentProvider} provider
	 * @param {Number} cacheDuration - The maximum number of milliseconds to cache an instrument.
	 */
	class InstrumentProviderCache {
		constructor(provider, cacheDuration) {
			assert.argumentIsRequired(provider, 'provider', InstrumentProvider, 'InstrumentProvider');

			this._provider = provider;
			this._cache = new TimeMap(cacheDuration || MAXIMUM_CACHE_AGE_IN_MILLISECONDS);
		}

		/**
		 * Returns a promise for instrument metadata from an internal cache. If the instrument
		 * does not exist in the cache, or the data has expired, then a new request for the
		 * instrument is made using the {@link InstrumentProvider}.
		 *
		 * @public
		 * @async
		 * @param {String} symbol
		 * @returns {Promise<Object>}
		 */
		async getInstrument(symbol) {
			return Promise.resolve()
				.then(() => {
					assert.argumentIsRequired(symbol, 'symbol', String);

					let promise = this._cache.get(symbol);

					if (promise !== null) {
						return promise;
					}

					promise = this._provider.getInstrument(symbol)
						.then((profile) => {
							if (profile) {
								this._cache.put(symbol, promise);

								return profile;
							}
						});

					return promise;
				});
		}

		toString() {
			return '[InstrumentProviderCache]';
		}
	}

	return InstrumentProviderCache;
})();