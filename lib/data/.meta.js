const Currency = require('@barchart/common-js/lang/Currency'),
	Decimal = require('@barchart/common-js/lang/Decimal'),
	Timezones = require('@barchart/common-js/lang/Timezones');

const InstrumentType = require('@barchart/portfolio-api-common/lib/data/InstrumentType'),
	PositionDirection = require('@barchart/portfolio-api-common/lib/data/PositionDirection'),
	TransactionType = require('@barchart/portfolio-api-common/lib/data/TransactionType');

/**
 * A meta namespace containing structural contracts of anonymous objects.
 *
 * @namespace Schema
 */

/**
 * A portfolio.
 *
 * @typedef Portfolio
 * @type Object
 * @memberOf Schema
 * @property {String} portfolio - The portfolio identifier (assigned by the backend).
 * @property {String} user - The identifier for the portfolio's owner (assigned by the backend, based on the authorized user).
 * @property {String} name - The name of the portfolio.
 * @property {Timezones} timezone - The timezone of the portfolio.
 * @property {Schema.PortfolioDefaults} defaults - Default settings for the portfolio.
 */

/**
 * An object used to create a new portfolio.
 *
 * @typedef PortfolioCreate
 * @type Object
 * @memberOf Schema
 * @property {String} name - The name of the portfolio.
 * @property {Timezones} timezone - The timezone of the portfolio.
 * @property {Schema.PortfolioDefaults} defaults - Default settings for the portfolio.
 */

/**
 * An object used to update an existing portfolio.
 *
 * @typedef PortfolioUpdate
 * @type Object
 * @memberOf Schema
 * @property {String} portfolio - The identifier of the portfolio to update.
 * @property {String=} name - The updated name of the portfolio, if present.
 * @property {Timezones=} timezone - The updated timezone for the portfolio, if present.
 * @property {Schema.PortfolioDefaults=} defaults - The updated default settings for the portfolio, if present.
 */

/**
 * An object containing defining default behavior for positions added to the portfolio.
 *
 * @typedef PortfolioDefaults
 * @type Object
 * @memberOf Schema
 * @property {Boolean=} cash - Indicates if corresponding cash transactions should be created, when appropriate (e.g. also DEBIT cash when creating a BUY transaction for stock).
 * @property {Currency=} currency - The default currency for the portfolio, used to determine the basis for reporting.
 * @property {Boolean=} reinvest - Indicates if dividends should be automatically reinvested.
 */

/**
 * A position.
 *
 * @typedef Position
 * @type Object
 * @memberOf Schema
 * @property {String} user - The identifier for the position's owner.
 * @property {String} portfolio - The identifier of the portfolio which contains the position.
 * @property {Schema.PositionInstrument} instrument - The position's instrument.
 * @property {String} position - The unique identifier for the position.
 * @property {Number} transaction - The sequence number of the most recent transaction for the position.
 * @property {Boolean=} cash - Indicates if corresponding cash transactions should be created, when appropriate (e.g. also DEBIT cash when creating a BUY transaction for stock).
 * @property {Boolean} reinvest - Indicates if dividends should be automatically reinvested.
 * @property {Schema.PositionSnapshot} snapshot - Summary and performance information for the position, as of the last transaction.
 */

/**
 * An object used to update a position's settings (e.g. dividend re-investment settings). Other changes
 * to a position (e.g. the size of the position) are affected by executing transactions.
 *
 * @typedef PositionUpdate
 * @type Object
 * @memberOf Schema
 * @property {String} portfolio - The identifier of the portfolio containing the position to update.
 * @property {String} position - The identifier of the position to update.
 * @property {Boolean=} cash - If present, changes the setting for automatic creation of the cash transactions (based on investment transactions).
 * @property {Boolean=} reinvest - If present, changes whether future dividends are re-invested.
 */

/**
 * A position's instrument.
 *
 * @typedef PositionInstrument
 * @type Object
 * @memberOf Schema
 * @property {String} id - The instrument's unique identifier.
 * @property {String} name - The instrument's name (e.g. Apple Inc).
 * @property {InstrumentType} type - The instrument's type (e.g. EQUITY).
 * @property {Currency} currency - The currency used to trade (or value) the instrument (e.g. USD).
 * @property {Schema.Symbols} symbol - The symbol(s) used for the instrument.
 */

/**
 * A summary of the status of a position on a given date.
 *
 * @typedef PositionSnapshot
 * @type Object
 * @memberOf Schema
 * @property {Day} date - The date of the snapshot.
 * @property {Decimal} open - The number of shares (units) open (value may be negative).
 * @property {PositionDirection} direction - Qualifies the number of open shares as LONG (i.e. positive), short (i.e. negative), or EVEN (i.e. zero).
 * @property {Decimal} buys - The sum of all purchases in the currency of the underlying instrument (value is never negative).
 * @property {Decimal} sells - The sum of all sales in the currency of the underlying instrument (value is never negative).
 * @property {Decimal} gain - The _realized_ gain on the position (value may be negative).
 * @property {Decimal} basis - The amount invested in the remaining position (value may be negative).
 * @property {Decimal} income - The sum of all income (e.g. dividends) earned on the position (value may be negative).
 * @property {Decimal} value - The current value of the position (value may be negative). Valuation is based on the last transaction price (not the current market price).
 */

/**
 * @typedef PositionSummary
 * @type Object
 * @memberOf Schema
 */

/**
 * A transaction.
 *
 * @typedef Transaction
 * @type Object
 * @memberOf Schema
 * @property {String} portfolio - The identifier of the portfolio which contains the transaction (a UUID).
 * @property {String} position - The identifier of the position which contains the transaction (a UUID).
 * @property {String} transaction - The identifier of the transaction (a UUID).
 * @property {String} sequence - The sequence number of the transaction (with respect to other transactions for the same position, starts with one).
 * @property {TransactionType} type - The type of transaction (e.g. BUY, SELL, SELL_SHORT, etc).
 * @property {Day} date - The day the transaction occurs. Time of day is not specified. Refer to the "sequence" property for ordering within the same day.
 * @property {String=} description - Autogenerated text describing the transaction (used for cash positions).
 * @property {Decimal} amount - The amount of currency affected by the transaction. In cases where currency was paid, the value is negative. In cases where currency was received, the value is positive.
 * @property {Decimal} quantity - The number of shares (or units) of the position's instrument affected by the transaction. The value will be positive when purchasing and negative when selling.
 * @property {Decimal=} fee - The number of shares or units of the position's instrument affected by the transaction. The value will be positive when purchasing and negative when selling.
 * @property {Schema.TransactionReference=} reference - A reference to another transaction — a transaction which caused this transaction to occur.
 * @property {Schema.PositionSnapshot} snapshot - A summary of the position size and performance, immediately after this transaction was executed.
 * @property {Schema.TransactionExtensionForTrade=} trade - Additional information, only present if transaction is a trade (type is B, S, SS, etc).
 * @property {Schema.TransactionExtensionForDividend=} dividend - Additional information, only present if transaction is a dividend (type is DV, DX, DF, DY, etc).
 * @property {Schema.TransactionExtensionForSplit=} split - Additional information, only present if transaction is a split (type is SP).
 */

/**
 * A reference to a related, automatically-generated transaction. For example, assume we execute
 * a transaction to BUY stock. If the stock position is configured to automatically create cash
 * transactions, then a DEBIT transaction to a cash position is also executed (to pay for the stock
 * purchase). In this case, the DEBIT transaction will reference the BUY transaction.
 *
 * @typedef TransactionReference
 * @type Object
 * @memberOf Schema
 * @property {String} position - The identifier of the referenced position.
 * @property {String} transaction - The identifier of the referenced transaction.
 */

/**
 * Information, extending a {@link Schema.Transaction}, where the transaction's type is a trade.
 *
 * @typedef TransactionExtensionForTrade
 * @type Object
 * @memberOf Schema
 * @property {Decimal} price - The unit price the transaction was executed at.
 */

/**
 * Information, extending a {@link Schema.Transaction}, where the transaction's type is a
 * dividend (or a distribution).
 *
 * @typedef TransactionExtensionForDividend
 * @type Object
 * @memberOf Schema
 * @property {Decimal} rate - The amount paid per unit.
 * @property {Day} effective - The day used to determine the quantity eligible to receive the dividend (i.e. the dividend ex-date).
 * @property {Decimal=} price - The market value of the underlying at the time the dividend was paid (used to calculate reinvestment quantities).
 * @property {Decimal} amount - The currency amount of the dividend (e.g the rate multiplied by the quantity eligible to receive the dividend).
 */

/**
 * Information, extending a {@link Schema.Transaction}, where the transaction's type is a split.
 *
 * @typedef TransactionExtensionForSplit
 * @type Object
 * @memberOf Schema
 * @property {Decimal} numerator - The numerator in the following fraction: [ shares owned after dividend ] / [ shares owned before dividend ].
 * @property {Decimal} numerator - The denominator in the following fraction: [ shares owned after dividend ] / [ shares owned before dividend ].
 * @property {Day} effective - The day used to determine the quantity eligible to be split (i.e. the split ex-date).
 */

/**
 * Data required to create a new transaction. Essentially a subset of the _Transaction_ schema (although,
 * instrument metadata is added for transactions which open new positions).
 *
 * @typedef TransactionCreate
 * @type Object
 * @memberOf Schema
 * @property {String} portfolio - The identifier of the portfolio which will contain the transaction (a UUID).
 * @property {String} position - The identifier of the position to add the transaction to (use "new" for new positions).
 * @property {TransactionType} type - The type of transaction (e.g. BUY, SELL, SELL_SHORT, etc).
 * @property {Schema.TransactionCreateInstrument} instrument - Information about the instrument (required when opening a new position, ignored otherwise).
 * @property {Day} date - The day the transaction occurs.
 * @property {Decimal=} price - The unit price of the instrument at the time the transaction executes.
 * @property {Decimal} quantity - The number of units affected by the transaction (can be an integer or decimal value).
 * @property {Decimal=} fee - A fee paid to execute the transaction (can be zero).
 */

/**
 * Data required to identify the instrument for a new transaction.
 *
 * @typedef TransactionCreateInstrument
 * @type Object
 * @memberOf Schema
 * @property {Schema.Symbols} symbol - The symbol(s) used to identify an instrument.
 */

/**
 * The result of transaction create, update, or delete operation. This object lists the positions
 * that were changed (as a result of the operation) and includes updated {@link Schema.PositionSummary}
 * objects.
 *
 * @typedef TransactionMutateResult
 * @type Object
 * @memberOf Schema
 * @property {Object} positions
 * @property {Schema.Position[]} positions.saved - All positions which were created or updated.
 * @property {Schema.Position[]} positions.deleted - All positions which were deleted.
 * @property {Schema.PositionSummary[]} summaries - All position summaries created or updated.
 * @property {Boolean} replaced - If true, the position (and position summaries) need to be replaced.
 */

/**
 * The symbols (i.e. codes) used to identify an instrument (e.g. "AAPL" for Apple Inc).
 *
 * @typedef Symbols
 * @type Object
 * @memberOf Schema
 * @property {String} barchart - The symbol used by Barchart (required to lookup quotes and determine prices).
 * @property {String} display - The symbol used for display purposes (often the same as the Barchart symbol).
 */

/**
 * An ordered list of end-of-day valuations (for an individual position or an entire portfolio),
 * along with metadata regarding the valuations (e.g. portfolio, position, currency).
 *
 * @typedef ValuationContainer
 * @type Object
 * @memberOf Schema
 * @property {String} user - The identifier for the portfolio's owner.
 * @property {String} portfolio - The identifier for the portfolio.
 * @property {String} position - The identifier for the position being valued. If this value is an asterisk (```*```), then valuation refers to the entire portfolio.
 * @property {Currency=} currency - The currency of the valuations (absent when no valuations are returned).
 * @property {Array<Schema.Valuation>} valuations - The end-of-day valuations.
 */

/**
 * The valuation of a position (or portfolio) on a given day.
 *
 * @typedef Valuation
 * @type Object
 * @memberOf Schema
 * @property {Day} date - The date of the valuation.
 * @property {Number} market - The market value of the position (or portfolio).
 */

/**
 * The result of valuations availability.
 *
 * @ignore
 * @typedef ValuationsAvailabilityResult
 * @type {Object}
 * @memberOf Schema
 * @property {Boolean} available - If true, all position and portfolio valuations are up-to-date.
 * @property {String[]} positions - Array of position identifiers for which are currently being calculated. An empty result indicates all position valuations are up-to-date.
 */