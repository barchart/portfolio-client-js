## PortfolioGateway :id=portfoliogateway
> The <strong>central component of the SDK</strong>. It is responsible for connecting to Barchart's
> Portfolio Service. It can be used to query, edit, and delete portfolios.

**Kind**: global class  
**Extends**: <code>Disposable</code>  
**Access**: public  

* [PortfolioGateway](#PortfolioGateway) ⇐ <code>Disposable</code>
    * _instance_
        * [.environment](#PortfolioGatewayenvironment) ⇒ <code>String</code>
        * [.connect(jwtProvider)](#PortfolioGatewayconnect) ⇒ [<code>Promise.&lt;PortfolioGateway&gt;</code>](#PortfolioGateway)
        * [.createPortfolio(portfolio)](#PortfolioGatewaycreatePortfolio) ⇒ [<code>Promise.&lt;Schema.Portfolio&gt;</code>](/content/sdk/lib-data?id=schemaportfolio)
        * [.updatePortfolio(portfolio)](#PortfolioGatewayupdatePortfolio) ⇒ [<code>Promise.&lt;Schema.Portfolio&gt;</code>](/content/sdk/lib-data?id=schemaportfolio)
        * [.deletePortfolio(portfolio)](#PortfolioGatewaydeletePortfolio) ⇒ <code>Promise</code>
        * [.readPortfolios([portfolio])](#PortfolioGatewayreadPortfolios) ⇒ [<code>Promise.&lt;Array.&lt;Schema.Portfolio&gt;&gt;</code>](/content/sdk/lib-data?id=schemaportfolio)
        * [.updatePosition(position)](#PortfolioGatewayupdatePosition) ⇒ [<code>Promise.&lt;Schema.Position&gt;</code>](/content/sdk/lib-data?id=schemaposition)
        * [.deletePosition(portfolio, position)](#PortfolioGatewaydeletePosition) ⇒ [<code>Promise.&lt;Array.&lt;Schema.Position&gt;&gt;</code>](/content/sdk/lib-data?id=schemaposition)
        * [.readPositions([portfolio], [position], [includePreviousPrice])](#PortfolioGatewayreadPositions) ⇒ [<code>Promise.&lt;Array.&lt;Schema.Position&gt;&gt;</code>](/content/sdk/lib-data?id=schemaposition)
        * [.createTransaction(transaction)](#PortfolioGatewaycreateTransaction) ⇒ [<code>Promise.&lt;Schema.TransactionMutateResult&gt;</code>](/content/sdk/lib-data?id=schematransactionmutateresult)
        * [.editTransaction(transaction)](#PortfolioGatewayeditTransaction) ⇒ [<code>Promise.&lt;Schema.TransactionMutateResult&gt;</code>](/content/sdk/lib-data?id=schematransactionmutateresult)
        * [.deleteTransaction(portfolio, position, sequence, [force], [echoStart], [echoEnd])](#PortfolioGatewaydeleteTransaction) ⇒ [<code>Promise.&lt;Schema.TransactionMutateResult&gt;</code>](/content/sdk/lib-data?id=schematransactionmutateresult)
        * [.readTransactions(portfolio, [position], [sequence])](#PortfolioGatewayreadTransactions) ⇒ [<code>Promise.&lt;Array.&lt;Schema.Transaction&gt;&gt;</code>](/content/sdk/lib-data?id=schematransaction)
        * [.readValuations(portfolio, [position])](#PortfolioGatewayreadValuations) ⇒ [<code>Promise.&lt;Schema.ValuationContainer&gt;</code>](/content/sdk/lib-data?id=schemavaluationcontainer)
        * [.checkValuations(portfolio)](#PortfolioGatewaycheckValuations) ⇒ <code>Promise.&lt;Schema.ValuationsAvailabilityResult&gt;</code>
        * [.readVersion()](#PortfolioGatewayreadVersion) ⇒ <code>Promise.&lt;Object&gt;</code>
    * _static_
        * [.forTest(jwtProvider, [product])](#PortfolioGatewayforTest) ⇒ [<code>Promise.&lt;PortfolioGateway&gt;</code>](#PortfolioGateway)
        * [.forDemo(jwtProvider, [product])](#PortfolioGatewayforDemo) ⇒ [<code>Promise.&lt;PortfolioGateway&gt;</code>](#PortfolioGateway)
        * [.forProduction(jwtProvider, [product])](#PortfolioGatewayforProduction) ⇒ [<code>Promise.&lt;PortfolioGateway&gt;</code>](#PortfolioGateway)
    * _constructor_
        * [new PortfolioGateway(protocol, host, port, environment, [product])](#new_PortfolioGateway_new)


* * *

### portfolioGateway.environment :id=portfoliogatewayenvironment
> Returns a description of the environment (e.g. development or production).

**Kind**: instance property of [<code>PortfolioGateway</code>](#PortfolioGateway)  
**Returns**: <code>String</code>  
**Access**: public  

* * *

### portfolioGateway.connect(jwtProvider) :id=portfoliogatewayconnect
> Attempts to establish a connection to the backend. This function should be invoked
> immediately following instantiation. Once the resulting promise resolves, a
> connection has been established and other instance methods can be used.

**Kind**: instance method of [<code>PortfolioGateway</code>](#PortfolioGateway)  
**Returns**: [<code>Promise.&lt;PortfolioGateway&gt;</code>](#PortfolioGateway)  
**Access**: public  

| Param | Type |
| --- | --- |
| jwtProvider | [<code>JwtProvider</code>](/content/sdk/lib-security?id=jwtprovider) | 


* * *

### portfolioGateway.createPortfolio(portfolio) :id=portfoliogatewaycreateportfolio
> Creates a new portfolio for the current user.

**Kind**: instance method of [<code>PortfolioGateway</code>](#PortfolioGateway)  
**Returns**: [<code>Promise.&lt;Schema.Portfolio&gt;</code>](/content/sdk/lib-data?id=schemaportfolio)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| portfolio | [<code>Schema.PortfolioCreate</code>](/content/sdk/lib-data?id=schemaportfoliocreate) | <p>Data regarding the portfolio to create.</p> |


* * *

### portfolioGateway.updatePortfolio(portfolio) :id=portfoliogatewayupdateportfolio
> Updates a portfolio.

**Kind**: instance method of [<code>PortfolioGateway</code>](#PortfolioGateway)  
**Returns**: [<code>Promise.&lt;Schema.Portfolio&gt;</code>](/content/sdk/lib-data?id=schemaportfolio)  
**Access**: public  

| Param | Type |
| --- | --- |
| portfolio | [<code>Schema.PortfolioUpdate</code>](/content/sdk/lib-data?id=schemaportfolioupdate) | 


* * *

### portfolioGateway.deletePortfolio(portfolio) :id=portfoliogatewaydeleteportfolio
> Deletes a portfolio. All data associated with the portfolio will also be
> deleted (e.g. positions, transactions, etc).

**Kind**: instance method of [<code>PortfolioGateway</code>](#PortfolioGateway)  
**Returns**: <code>Promise</code>  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| portfolio | <code>String</code> | <p>The identifier of the portfolio to delete.</p> |


* * *

### portfolioGateway.readPortfolios([portfolio]) :id=portfoliogatewayreadportfolios
> Reads all portfolios (or a single portfolio) for the current user.

**Kind**: instance method of [<code>PortfolioGateway</code>](#PortfolioGateway)  
**Returns**: [<code>Promise.&lt;Array.&lt;Schema.Portfolio&gt;&gt;</code>](/content/sdk/lib-data?id=schemaportfolio)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| [portfolio] | <code>String</code> | <p>A portfolio identifier. If omitted, all portfolios for the current user will be returned.</p> |


* * *

### portfolioGateway.updatePosition(position) :id=portfoliogatewayupdateposition
> Updates a position.

**Kind**: instance method of [<code>PortfolioGateway</code>](#PortfolioGateway)  
**Returns**: [<code>Promise.&lt;Schema.Position&gt;</code>](/content/sdk/lib-data?id=schemaposition)  
**Access**: public  

| Param | Type |
| --- | --- |
| position | [<code>Schema.PositionUpdate</code>](/content/sdk/lib-data?id=schemapositionupdate) | 


* * *

### portfolioGateway.deletePosition(portfolio, position) :id=portfoliogatewaydeleteposition
> Deletes a position (and all associated data, including transactions and summaries).
> An array of deleted  positions is returned (in some rare cases, deleting one position
> may cause other positions to be be deleted — for example, a position which was spun-off).

**Kind**: instance method of [<code>PortfolioGateway</code>](#PortfolioGateway)  
**Returns**: [<code>Promise.&lt;Array.&lt;Schema.Position&gt;&gt;</code>](/content/sdk/lib-data?id=schemaposition)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| portfolio | <code>String</code> | <p>The identifier of the portfolio which contains the position to delete.</p> |
| position | <code>String</code> | <p>The identifier of the position to delete.</p> |


* * *

### portfolioGateway.readPositions([portfolio], [position], [includePreviousPrice]) :id=portfoliogatewayreadpositions
> Retrieves all positions for a user, a user's portfolio, or a single position.

**Kind**: instance method of [<code>PortfolioGateway</code>](#PortfolioGateway)  
**Returns**: [<code>Promise.&lt;Array.&lt;Schema.Position&gt;&gt;</code>](/content/sdk/lib-data?id=schemaposition)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| [portfolio] | <code>String</code> | <p>The identifier of the portfolio containing the desired positions. If omitted, all positions for the current user, regardless of portfolio, will be returned.</p> |
| [position] | <code>String</code> | <p>The identifier of the specific position to read. If included, the &quot;portfolio&quot; parameter must be specified.</p> |
| [includePreviousPrice] | <code>Boolean</code> |  |


* * *

### portfolioGateway.createTransaction(transaction) :id=portfoliogatewaycreatetransaction
> Creates a new transaction.

**Kind**: instance method of [<code>PortfolioGateway</code>](#PortfolioGateway)  
**Returns**: [<code>Promise.&lt;Schema.TransactionMutateResult&gt;</code>](/content/sdk/lib-data?id=schematransactionmutateresult)  
**Access**: public  

| Param | Type |
| --- | --- |
| transaction | [<code>Schema.TransactionCreate</code>](/content/sdk/lib-data?id=schematransactioncreate) | 


* * *

### portfolioGateway.editTransaction(transaction) :id=portfoliogatewayedittransaction
> Edits a transaction (e.g. change the date, price, quantity, etc).

**Kind**: instance method of [<code>PortfolioGateway</code>](#PortfolioGateway)  
**Returns**: [<code>Promise.&lt;Schema.TransactionMutateResult&gt;</code>](/content/sdk/lib-data?id=schematransactionmutateresult)  
**Access**: public  

| Param | Type |
| --- | --- |
| transaction | [<code>Schema.Transaction</code>](/content/sdk/lib-data?id=schematransaction) | 


* * *

### portfolioGateway.deleteTransaction(portfolio, position, sequence, [force], [echoStart], [echoEnd]) :id=portfoliogatewaydeletetransaction
> Deletes a transaction.

**Kind**: instance method of [<code>PortfolioGateway</code>](#PortfolioGateway)  
**Returns**: [<code>Promise.&lt;Schema.TransactionMutateResult&gt;</code>](/content/sdk/lib-data?id=schematransactionmutateresult)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| portfolio | <code>String</code> | <p>The identifier of the portfolio which contains the targeted position.</p> |
| position | <code>String</code> | <p>The identifier of the targeted position.</p> |
| sequence | <code>Number</code> | <p>The sequence number of the transaction to delete.</p> |
| [force] | <code>Boolean</code> |  |
| [echoStart] | <code>Day</code> |  |
| [echoEnd] | <code>Day</code> |  |


* * *

### portfolioGateway.readTransactions(portfolio, [position], [sequence]) :id=portfoliogatewayreadtransactions
> Retrieves transactions for a portfolio, or a single position.

**Kind**: instance method of [<code>PortfolioGateway</code>](#PortfolioGateway)  
**Returns**: [<code>Promise.&lt;Array.&lt;Schema.Transaction&gt;&gt;</code>](/content/sdk/lib-data?id=schematransaction)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| portfolio | <code>String</code> | <p>The identifier of the portfolio containing the desired transactions.</p> |
| [position] | <code>String</code> | <p>The identifier for the position to read transactions for. If included, the resulting transactions will be limited to the specified position. Otherwise, transactions for all positions in the portfolio, will be returned.</p> |
| [sequence] | <code>Number</code> | <p>The sequence number of the specific transaction to read. If included, both the &quot;portfolio&quot; and &quot;position&quot; parameters must be specified.</p> |


* * *

### portfolioGateway.readValuations(portfolio, [position]) :id=portfoliogatewayreadvaluations
> Retrieves end-of-day valuations for the entire portfolio (or a single position).

**Kind**: instance method of [<code>PortfolioGateway</code>](#PortfolioGateway)  
**Returns**: [<code>Promise.&lt;Schema.ValuationContainer&gt;</code>](/content/sdk/lib-data?id=schemavaluationcontainer)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| portfolio | <code>String</code> | <p>The identifier of the portfolio.</p> |
| [position] | <code>String</code> | <p>The identifier of the position. If omitted, that valuation history will be returned for the entire portfolio (i.e. sum of valuations for all positions contained in the portfolio).</p> |


* * *

### portfolioGateway.checkValuations(portfolio) :id=portfoliogatewaycheckvaluations
> Retrieves the status of end-of-day valuations for all positions contained
> within a portfolio.

**Kind**: instance method of [<code>PortfolioGateway</code>](#PortfolioGateway)  
**Returns**: <code>Promise.&lt;Schema.ValuationsAvailabilityResult&gt;</code>  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| portfolio | <code>String</code> | <p>The identifier of the portfolio.</p> |


* * *

### portfolioGateway.readVersion() :id=portfoliogatewayreadversion
> Returns current version of the Portfolio Service.

**Kind**: instance method of [<code>PortfolioGateway</code>](#PortfolioGateway)  
**Returns**: <code>Promise.&lt;Object&gt;</code>  
**Access**: public  

* * *

### PortfolioGateway.forTest(jwtProvider, [product]) :id=portfoliogatewayfortest
> Creates and starts a new [PortfolioGateway](/content/sdk/lib-gateway?id=portfoliogateway) for use in the public test environment.

**Kind**: static method of [<code>PortfolioGateway</code>](#PortfolioGateway)  
**Returns**: [<code>Promise.&lt;PortfolioGateway&gt;</code>](#PortfolioGateway)  
**Access**: public  

| Param | Type |
| --- | --- |
| jwtProvider | [<code>JwtProvider</code>](/content/sdk/lib-security?id=jwtprovider) | 
| [product] | <code>String</code> | 


* * *

### PortfolioGateway.forDemo(jwtProvider, [product]) :id=portfoliogatewayfordemo
> Creates and starts a new [PortfolioGateway](/content/sdk/lib-gateway?id=portfoliogateway) for use in the public demo environment.

**Kind**: static method of [<code>PortfolioGateway</code>](#PortfolioGateway)  
**Returns**: [<code>Promise.&lt;PortfolioGateway&gt;</code>](#PortfolioGateway)  
**Access**: public  

| Param | Type |
| --- | --- |
| jwtProvider | [<code>JwtProvider</code>](/content/sdk/lib-security?id=jwtprovider) | 
| [product] | <code>String</code> | 


* * *

### PortfolioGateway.forProduction(jwtProvider, [product]) :id=portfoliogatewayforproduction
> Creates and starts a new [PortfolioGateway](/content/sdk/lib-gateway?id=portfoliogateway) for use in the public production environment.

**Kind**: static method of [<code>PortfolioGateway</code>](#PortfolioGateway)  
**Returns**: [<code>Promise.&lt;PortfolioGateway&gt;</code>](#PortfolioGateway)  
**Access**: public  

| Param | Type |
| --- | --- |
| jwtProvider | [<code>JwtProvider</code>](/content/sdk/lib-security?id=jwtprovider) | 
| [product] | <code>String</code> | 


* * *

### new PortfolioGateway(protocol, host, port, environment, [product]) :id=new_portfoliogateway_new
**Kind**: constructor of [<code>PortfolioGateway</code>](#PortfolioGateway)  

| Param | Type | Description |
| --- | --- | --- |
| protocol | <code>String</code> | <p>The protocol of the of the Portfolio web service (either http or https).</p> |
| host | <code>String</code> | <p>The hostname of the Portfolio web service.</p> |
| port | <code>Number</code> | <p>The TCP port number of the Portfolio web service.</p> |
| environment | <code>String</code> | <p>A description of the environment we're connecting to.</p> |
| [product] | <code>String</code> | <p>A code for the product which is using the gateway.</p> |


* * *

