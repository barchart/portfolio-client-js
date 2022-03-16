## Schema :id=schema
> A meta namespace containing structural contracts of anonymous objects.

**Kind**: global namespace  

* [Schema](#Schema) : <code>object</code>
    * _static_
        * [.Portfolio](#SchemaPortfolio) : <code>Object</code>
        * [.PortfolioCreate](#SchemaPortfolioCreate) : <code>Object</code>
        * [.PortfolioUpdate](#SchemaPortfolioUpdate) : <code>Object</code>
        * [.PortfolioDefaults](#SchemaPortfolioDefaults) : <code>Object</code>
        * [.Position](#SchemaPosition) : <code>Object</code>
        * [.PositionUpdate](#SchemaPositionUpdate) : <code>Object</code>
        * [.PositionInstrument](#SchemaPositionInstrument) : <code>Object</code>
        * [.PositionSnapshot](#SchemaPositionSnapshot) : <code>Object</code>
        * [.PositionSummary](#SchemaPositionSummary) : <code>Object</code>
        * [.Transaction](#SchemaTransaction) : <code>Object</code>
        * [.TransactionReference](#SchemaTransactionReference) : <code>Object</code>
        * [.TransactionExtensionForTrade](#SchemaTransactionExtensionForTrade) : <code>Object</code>
        * [.TransactionExtensionForDividend](#SchemaTransactionExtensionForDividend) : <code>Object</code>
        * [.TransactionExtensionForSplit](#SchemaTransactionExtensionForSplit) : <code>Object</code>
        * [.TransactionCreate](#SchemaTransactionCreate) : <code>Object</code>
        * [.TransactionCreateInstrument](#SchemaTransactionCreateInstrument) : <code>Object</code>
        * [.TransactionMutateResult](#SchemaTransactionMutateResult) : <code>Object</code>
        * [.Symbols](#SchemaSymbols) : <code>Object</code>
        * [.ValuationContainer](#SchemaValuationContainer) : <code>Object</code>
        * [.Valuation](#SchemaValuation) : <code>Object</code>


* * *

### Schema.Portfolio :id=schemaportfolio
> A portfolio.

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| portfolio | <code>String</code> | <p>The portfolio identifier (assigned by the backend).</p> |
| user | <code>String</code> | <p>The identifier for the portfolio's owner (assigned by the backend, based on the authorized user).</p> |
| name | <code>String</code> | <p>The name of the portfolio.</p> |
| timezone | <code>Timezones</code> | <p>The timezone of the portfolio.</p> |
| defaults | [<code>PortfolioDefaults</code>](#SchemaPortfolioDefaults) | <p>Default settings for the portfolio.</p> |


* * *

### Schema.PortfolioCreate :id=schemaportfoliocreate
> An object used to create a new portfolio.

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | <p>The name of the portfolio.</p> |
| timezone | <code>Timezones</code> | <p>The timezone of the portfolio.</p> |
| defaults | [<code>PortfolioDefaults</code>](#SchemaPortfolioDefaults) | <p>Default settings for the portfolio.</p> |


* * *

### Schema.PortfolioUpdate :id=schemaportfolioupdate
> An object used to update an existing portfolio.

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| portfolio | <code>String</code> | <p>The identifier of the portfolio to update.</p> |
| [name] | <code>String</code> | <p>The updated name of the portfolio, if present.</p> |
| [timezone] | <code>Timezones</code> | <p>The updated timezone for the portfolio, if present.</p> |
| [defaults] | [<code>PortfolioDefaults</code>](#SchemaPortfolioDefaults) | <p>The updated default settings for the portfolio, if present.</p> |


* * *

### Schema.PortfolioDefaults :id=schemaportfoliodefaults
> An object containing defining default behavior for positions added to the portfolio.

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [cash] | <code>Boolean</code> | <p>Indicates if corresponding cash transactions should be created, when appropriate (e.g. also DEBIT cash when creating a BUY transaction for stock).</p> |
| [currency] | <code>Currency</code> | <p>The default currency for the portfolio, used to determine the basis for reporting.</p> |
| [reinvest] | <code>Boolean</code> | <p>Indicates if dividends should be automatically reinvested.</p> |


* * *

### Schema.Position :id=schemaposition
> A position.

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| user | <code>String</code> | <p>The identifier for the position's owner.</p> |
| portfolio | <code>String</code> | <p>The identifier of the portfolio which contains the position.</p> |
| instrument | [<code>PositionInstrument</code>](#SchemaPositionInstrument) | <p>The position's instrument.</p> |
| position | <code>String</code> | <p>The unique identifier for the position.</p> |
| transaction | <code>Number</code> | <p>The sequence number of the most recent transaction for the position.</p> |
| [cash] | <code>Boolean</code> | <p>Indicates if corresponding cash transactions should be created, when appropriate (e.g. also DEBIT cash when creating a BUY transaction for stock).</p> |
| reinvest | <code>Boolean</code> | <p>Indicates if dividends should be automatically reinvested.</p> |
| snapshot | [<code>PositionSnapshot</code>](#SchemaPositionSnapshot) | <p>Summary and performance information for the position, as of the last transaction.</p> |


* * *

### Schema.PositionUpdate :id=schemapositionupdate
> An object used to update a position's settings (e.g. dividend re-investment settings). Other changes
> to a position (e.g. the size of the position) are affected by executing transactions.

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| portfolio | <code>String</code> | <p>The identifier of the portfolio containing the position to update.</p> |
| position | <code>String</code> | <p>The identifier of the position to update.</p> |
| [cash] | <code>Boolean</code> | <p>If present, changes the setting for automatic creation of the cash transactions (based on investment transactions).</p> |
| [reinvest] | <code>Boolean</code> | <p>If present, changes whether future dividends are re-invested.</p> |


* * *

### Schema.PositionInstrument :id=schemapositioninstrument
> A position's instrument.

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | <p>The instrument's unique identifier.</p> |
| name | <code>String</code> | <p>The instrument's name (e.g. Apple Inc).</p> |
| type | <code>InstrumentType</code> | <p>The instrument's type (e.g. EQUITY).</p> |
| currency | <code>Currency</code> | <p>The currency used to trade (or value) the instrument (e.g. USD).</p> |
| symbol | [<code>Symbols</code>](#SchemaSymbols) | <p>The symbol(s) used for the instrument.</p> |


* * *

### Schema.PositionSnapshot :id=schemapositionsnapshot
> A summary of the status of a position on a given date.

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| date | <code>Day</code> | <p>The date of the snapshot.</p> |
| open | <code>Decimal</code> | <p>The number of shares (units) open (value may be negative).</p> |
| direction | <code>PositionDirection</code> | <p>Qualifies the number of open shares as LONG (i.e. positive), short (i.e. negative), or EVEN (i.e. zero).</p> |
| buys | <code>Decimal</code> | <p>The sum of all purchases in the currency of the underlying instrument (value is never negative).</p> |
| sells | <code>Decimal</code> | <p>The sum of all sales in the currency of the underlying instrument (value is never negative).</p> |
| gain | <code>Decimal</code> | <p>The <em>realized</em> gain on the position (value may be negative).</p> |
| basis | <code>Decimal</code> | <p>The amount invested in the remaining position (value may be negative).</p> |
| income | <code>Decimal</code> | <p>The sum of all income (e.g. dividends) earned on the position (value may be negative).</p> |
| value | <code>Decimal</code> | <p>The current value of the position (value may be negative). Valuation is based on the last transaction price (not the current market price).</p> |


* * *

### Schema.PositionSummary :id=schemapositionsummary
**Kind**: static typedef of [<code>Schema</code>](#Schema)  

* * *

### Schema.Transaction :id=schematransaction
> A transaction.

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| portfolio | <code>String</code> | <p>The identifier of the portfolio which contains the transaction (a UUID).</p> |
| position | <code>String</code> | <p>The identifier of the position which contains the transaction (a UUID).</p> |
| transaction | <code>String</code> | <p>The identifier of the transaction (a UUID).</p> |
| sequence | <code>String</code> | <p>The sequence number of the transaction (with respect to other transactions for the same position, starts with one).</p> |
| type | <code>TransactionType</code> | <p>The type of transaction (e.g. BUY, SELL, SELL_SHORT, etc).</p> |
| date | <code>Day</code> | <p>The day the transaction occurs. Time of day is not specified. Refer to the &quot;sequence&quot; property for ordering within the same day.</p> |
| [description] | <code>String</code> | <p>Autogenerated text describing the transaction (used for cash positions).</p> |
| amount | <code>Decimal</code> | <p>The amount of currency affected by the transaction. In cases where currency was paid, the value is negative. In cases where currency was received, the value is positive.</p> |
| quantity | <code>Decimal</code> | <p>The number of shares (or units) of the position's instrument affected by the transaction. The value will be positive when purchasing and negative when selling.</p> |
| [fee] | <code>Decimal</code> | <p>The number of shares or units of the position's instrument affected by the transaction. The value will be positive when purchasing and negative when selling.</p> |
| [reference] | [<code>TransactionReference</code>](#SchemaTransactionReference) | <p>A reference to another transaction — a transaction which caused this transaction to occur.</p> |
| snapshot | [<code>PositionSnapshot</code>](#SchemaPositionSnapshot) | <p>A summary of the position size and performance, immediately after this transaction was executed.</p> |
| [trade] | [<code>TransactionExtensionForTrade</code>](#SchemaTransactionExtensionForTrade) | <p>Additional information, only present if transaction is a trade (type is B, S, SS, etc).</p> |
| [dividend] | [<code>TransactionExtensionForDividend</code>](#SchemaTransactionExtensionForDividend) | <p>Additional information, only present if transaction is a dividend (type is DV, DX, DF, DY, etc).</p> |
| [split] | [<code>TransactionExtensionForSplit</code>](#SchemaTransactionExtensionForSplit) | <p>Additional information, only present if transaction is a split (type is SP).</p> |


* * *

### Schema.TransactionReference :id=schematransactionreference
> A reference to a related, automatically-generated transaction. For example, assume we execute
> a transaction to BUY stock. If the stock position is configured to automatically create cash
> transactions, then a DEBIT transaction to a cash position is also executed (to pay for the stock
> purchase). In this case, the DEBIT transaction will reference the BUY transaction.

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| position | <code>String</code> | <p>The identifier of the referenced position.</p> |
| transaction | <code>String</code> | <p>The identifier of the referenced transaction.</p> |


* * *

### Schema.TransactionExtensionForTrade :id=schematransactionextensionfortrade
> Information, extending a [Transaction](#schematransaction), where the transaction's type is a trade.

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| price | <code>Decimal</code> | <p>The unit price the transaction was executed at.</p> |


* * *

### Schema.TransactionExtensionForDividend :id=schematransactionextensionfordividend
> Information, extending a [Transaction](#schematransaction), where the transaction's type is a
> dividend (or a distribution).

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| rate | <code>Decimal</code> | <p>The amount paid per unit.</p> |
| effective | <code>Day</code> | <p>The day used to determine the quantity eligible to receive the dividend (i.e. the dividend ex-date).</p> |
| [price] | <code>Decimal</code> | <p>The market value of the underlying at the time the dividend was paid (used to calculate reinvestment quantities).</p> |
| amount | <code>Decimal</code> | <p>The currency amount of the dividend (e.g the rate multiplied by the quantity eligible to receive the dividend).</p> |


* * *

### Schema.TransactionExtensionForSplit :id=schematransactionextensionforsplit
> Information, extending a [Transaction](#schematransaction), where the transaction's type is a split.

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| numerator | <code>Decimal</code> | <p>The numerator in the following fraction: [ shares owned after dividend ] / [ shares owned before dividend ].</p> |
| numerator | <code>Decimal</code> | <p>The denominator in the following fraction: [ shares owned after dividend ] / [ shares owned before dividend ].</p> |
| effective | <code>Day</code> | <p>The day used to determine the quantity eligible to be split (i.e. the split ex-date).</p> |


* * *

### Schema.TransactionCreate :id=schematransactioncreate
> Data required to create a new transaction. Essentially a subset of the <em>Transaction</em> schema (although,
> instrument metadata is added for transactions which open new positions).

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| portfolio | <code>String</code> | <p>The identifier of the portfolio which will contain the transaction (a UUID).</p> |
| position | <code>String</code> | <p>The identifier of the position to add the transaction to (use &quot;new&quot; for new positions).</p> |
| type | <code>TransactionType</code> | <p>The type of transaction (e.g. BUY, SELL, SELL_SHORT, etc).</p> |
| instrument | [<code>TransactionCreateInstrument</code>](#SchemaTransactionCreateInstrument) | <p>Information about the instrument (required when opening a new position, ignored otherwise).</p> |
| date | <code>Day</code> | <p>The day the transaction occurs.</p> |
| [price] | <code>Decimal</code> | <p>The unit price of the instrument at the time the transaction executes.</p> |
| quantity | <code>Decimal</code> | <p>The number of units affected by the transaction (can be an integer or decimal value).</p> |
| [fee] | <code>Decimal</code> | <p>A fee paid to execute the transaction (can be zero).</p> |


* * *

### Schema.TransactionCreateInstrument :id=schematransactioncreateinstrument
> Data required to identify the instrument for a new transaction.

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| symbol | [<code>Symbols</code>](#SchemaSymbols) | <p>The symbol(s) used to identify an instrument.</p> |


* * *

### Schema.TransactionMutateResult :id=schematransactionmutateresult
> The result of transaction create, update, or delete operation. This object lists the positions
> that were changed (as a result of the operation) and includes updated [PositionSummary](#schemapositionsummary)
> objects.

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| positions | <code>Object</code> |  |
| positions.saved | [<code>Array.&lt;Position&gt;</code>](#SchemaPosition) | <p>All positions which were created or updated.</p> |
| positions.deleted | [<code>Array.&lt;Position&gt;</code>](#SchemaPosition) | <p>All positions which were deleted.</p> |
| summaries | [<code>Array.&lt;PositionSummary&gt;</code>](#SchemaPositionSummary) | <p>All position summaries created or updated.</p> |
| replaced | <code>Boolean</code> | <p>If true, the position (and position summaries) need to be replaced.</p> |


* * *

### Schema.Symbols :id=schemasymbols
> The symbols (i.e. codes) used to identify an instrument (e.g. &quot;AAPL&quot; for Apple Inc).

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| barchart | <code>String</code> | <p>The symbol used by Barchart (required to lookup quotes and determine prices).</p> |
| display | <code>String</code> | <p>The symbol used for display purposes (often the same as the Barchart symbol).</p> |


* * *

### Schema.ValuationContainer :id=schemavaluationcontainer
> An ordered list of end-of-day valuations (for an individual position or an entire portfolio),
> along with metadata regarding the valuations (e.g. portfolio, position, currency).

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| user | <code>String</code> | <p>The identifier for the portfolio's owner.</p> |
| portfolio | <code>String</code> | <p>The identifier for the portfolio.</p> |
| position | <code>String</code> | <p>The identifier for the position being valued. If this value is an asterisk (<code>*</code>), then valuation refers to the entire portfolio.</p> |
| [currency] | <code>Currency</code> | <p>The currency of the valuations (absent when no valuations are returned).</p> |
| valuations | [<code>Array.&lt;Valuation&gt;</code>](#SchemaValuation) | <p>The end-of-day valuations.</p> |


* * *

### Schema.Valuation :id=schemavaluation
> The valuation of a position (or portfolio) on a given day.

**Kind**: static typedef of [<code>Schema</code>](#Schema)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| date | <code>Day</code> | <p>The date of the valuation.</p> |
| market | <code>Number</code> | <p>The market value of the position (or portfolio).</p> |


* * *

