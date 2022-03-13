## Setup

As a consumer of the Barchart Portfolio Service, you have two options:

1. Connect and communicate with the backend _by embedding this SDK into your software_, or
2. Connect and communicate with the backend _by direct interaction with the REST API_.

**If you choose to use the SDK**, you can install it from NPM (Node Package Manager), as follows:

```shell
npm install @barchart/portfolio-client-js -S
```

**If you'd prefer to use the REST API directly**, please finish reviewing this page, then refer to the [API Reference](/content/api_reference) section.

## Environments

Two instances of the Barchart Portfolio Service are always running:

#### Test

The public _test_ environment should be used for integration and evaluation purposes. It can be accessed at ```portfolio-test.aws.barchart.com``` and has two significant limitations:

* data saved in the _test_ environment is automatically **purged within 48 hours**, and
* data saved in the _test_ environment can be **accessed by anyone**.

All example code contained in this documentation uses the _test_ environment. 

#### Production

The _production_ environment does not permit anonymous connections. **Contact Barchart at solutions@barchart.com or (866) 333-7587 for assistance configuring your account.**

## Authorization

[JSON Web Tokens](https://en.wikipedia.org/wiki/JSON_Web_Token) — called JWT — are used for authorization. Each request made to the backend must include a token. Generating these tokens is surprisingly easy — refer to the [Key Concepts: Securing the Connection](/content/concepts/securing_the_connection) section for details.

In the _test_ environment, token generation uses these parameters:

* Tokens are signed with the ```HMAC-SHA256``` (aka ```HS256```) algorithm
* Tokens are signed with the following secret: ```"public-knowledge-1234567890"```

The _test_ environment is intended for evaluation and testing purposes. Since the signing secret has been publicized (see above), there can be no expectation of privacy. Consequently, no sensitive information should be saved in the _test_ environment.

The _production_ environment is secure. You will generate a [public/private key pair](https://en.wikipedia.org/wiki/Public-key_cryptography) and provide the public key to Barchart. As long as you maintain control over your private key, your data will be protected.

Regardless of environment, the token payload must include two claims:

* ```userId``` is the unique identifier of the current user
* ```contextId``` is a unique identifier for your organization (use ```"barchart"``` in the _test_ environment).

## Connecting

#### Using the SDK

Before you can do anything meaningful with the SDK, you must obtain an instance of the [```PortfolioGateway```](/content/sdk/lib-gateway?id=portfoliogateway) class. Here is an example:

```js
const PortfolioGateway = require('@barchart/portfolio-client-js/lib/gateway/PortfolioGateway'),
	JwtProvider = require('@barchart/portfolio-client-js/lib/security/JwtProvider');

const myUserId = 'me';
const myContextId = 'barchart';

let portfolioGateway;

PortfolioGateway.forTest(JwtProvider.forTest(myUserId, myContextId))
	.then((pg) => {
		portfolioGateway = pg;
	});
```

> Try it out by executing the [```example1.js```](https://github.com/barchart/portfolio-client-js/blob/master/example/node/example1.js) script. See the [Examples: Sample Code](/content/appendices/sample_code) appendix for detailed instructions.

#### Using the API

If you choose to work directly with the REST interface, you won't need to perform an explicit "connect" action. Each HTTP request is independently authorized by the backend. You simply need to include a JWT in the _Authorization_ header of each request.

You can test your JWT using any of the REST API endpoints. Here is an example using the `/service` endpoint:

```shell
curl 'https://portfolio-test.aws.barchart.com/v1/service' \
  -X 'GET' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJtZSIsImNvbnRleHRJZCI6ImJhcmNoYXJ0IiwiaWF0IjoxNjQ1NDY5MDIxfQ.l6kg72DiUmuDU0OkUA8sdnsrrgSR0XAiMiGvtB9wG08'
```

## Data Structure Basics

Three important data structures are used to track investments:

* A **portfolio** is a container for investments, owned by a single user.
* A **position** represents a single investment (e.g. common stock in Apple computer).
* A **transaction** which represents a change to a position.

In the next few sections, we will:

1. Create a _new portfolio_.
2. Query for _portfolios_ owned by the active user.
3. Create a new _transaction_ to buy stock, thereby opening a new _position_.
4. Query for _positions_ owned by the active user.
5. Query the _transactions_ which compose a _position_.

## Creating a Portfolio

The first step in working with the Barchart Portfolio service is to create a new portfolio.

#### Using the SDK

Create a JavaScript object, which conforms to the [```PortfolioCreate```](/content/sdk/lib-data?id=schemaportfoliocreate) schema and pass it to the [```PortfolioGateway.createPortfolio```](/content/sdk/lib-gateway?id=portfoliogatewaycreateportfolio) function, as follows:

```js
const Currency = require('@barchart/common-js/lang/Currency'),
	Timezones = require('@barchart/common-js/lang/Timezones');

const data = {
	name: 'My First Portfolio', 
	timezone: Timezones.AMERICA_NEW_YORK,
	defaults: {
		cash: false,
		currency: Currency.USD,
		reinvest: false
	}
};

portfolioGateway.createPortfolio(data)
	.then((portfolio) => {
		console.info(`Example: Successfully created portfolio with identifier [ ${portfolio.portfolio} ].`);
	});
```

The result will be [```Portfolio```](/content/sdk/lib-data?id=schemaportfolio) object. Notice the ```portfolio``` and ```user``` identifiers have been assigned.

> Try it out by executing the [```example2.js```](https://github.com/barchart/portfolio-client-js/blob/master/example/node/example2.js) script.

#### Using the API

Construct a JSON object, matching the [```portfolio-create```](/content/api/components?id=schemasportfolio-create) component defined in the [API Reference](/content/api_reference) section.

```json
{
  "name": "My First Portfolio",
  "timezone": "America/New_York",
  "defaults": {
	"cash": false,
	"currency": "USD",
	"reinvest": false
  }
}
```

> The backend is sensitive to the ordering of attributes in JSON documents. More on this later.

Once you've constructed a JSON object, ```POST``` it to the [```/portfolios```](/content/api/paths?id=post-portfolios) endpoint. Here is a cURL example:

```shell
curl 'https://portfolio-test.aws.barchart.com/v1/portfolios' \
  -X 'POST' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJtZSIsImNvbnRleHRJZCI6ImJhcmNoYXJ0IiwiaWF0IjoxNjQ1NDY5MDIxfQ.l6kg72DiUmuDU0OkUA8sdnsrrgSR0XAiMiGvtB9wG08' \
  -H 'Content-Type: application/json;charset=UTF-8' \
  --data-binary '{"name":"My First Portfolio","timezone":"America/New_York","defaults":{"cash":false,"currency":"USD","reinvest":false}}'
```

## Executing a Transaction

Once you've created a portfolio, you're ready to execute a transaction.

First, you'll need a portfolio identifier — get your portfolio identifiers:

* by [creating a new portfolio](/content/quick_start?id=creating-a-portfolio) and reading the `portfolio` property from the result, or
* by [querying your portfolios](/content/quick_start?id=querying-portfolios) and reading the `portfolio` property from the resulting item(s)

In the following examples, we'll assume you want to open a _new_ position (instead of adding the transaction to an existing position). Also, for illustration purposes, we'll assume your portfolio identifier is `0004e3e3-b001-42b5-90f7-8bb06ea5b337`.

#### Using the SDK

Create a JavaScript object, which conforms to the [```TransactionCreate```](/content/sdk/lib-data?id=schematransactioncreate) schema and pass it to the [```PortfolioGateway.createTransaction```](/content/sdk/lib-gateway?id=portfoliogatewaycreatetransaction) function.

In the following transaction, we'll open a new position by buying 100 shares of Apple common stock on January 3, 2022 for $182.56 per share.

```javascript
const Day = require('@barchart/common-js/lang/Day'),
	Decimal = require('@barchart/common-js/lang/Decimal'),
	Currency = require('@barchart/common-js/lang/Currency');

const TransactionType = require('@barchart/portfolio-api-common/lib/data/TransactionType');

const data = {
	portfolio: '0004e3e3-b001-42b5-90f7-8bb06ea5b337',
	position: 'new',
	type: TransactionType.BUY,
	instrument: {
		symbol: {
			barchart: 'AAPL',
			display: 'AAPL'
		}
	},
	date: new Day(2022, 1, 3),
	price: new Decimal(182.56),
	quantity: new Decimal(100),
	fee: Decimal.ZERO
};

portfolioGateway.createTransaction(data)
	.then((result) => {
		console.info(`Example: Successfully created transaction.`);
	});
```

After the transaction has been processed, you'll receive a [```TransactionMutateResult```](/content/sdk/lib-data?id=schematransactionmutateresult) object. This object includes the positions that were affected. More on this later.

> Try it out by executing the [```example3.js```](https://github.com/barchart/portfolio-client-js/blob/master/example/node/example3.js) script.

#### Using the API

Construct a JSON object, matching the [```transaction-create```](/content/api/components?id=schemastransaction-create) component.

```json
{
  "portfolio": "0004e3e3-b001-42b5-90f7-8bb06ea5b337",
  "position": "new",
  "type": "B",
  "instrument": {
	"symbol": {
	  "barchart": "AAPL",
	  "display": "AAPL"
	}
  },
  "date": "2022-01-03",
  "price": "182.56",
  "quantity": "100",
  "fee": "0"
}
```

> The backend is sensitive to the ordering of attributes in JSON documents. More on this later.

Once you've constructed a JSON object, ```POST``` it to the [```/portfolios/{portfolio}/positions/{position}/transactions```](/content/api/paths?id=post-portfoliosportfoliopositionspositiontransactions) endpoint. Here is a cURL example:

```shell
curl 'https://portfolio-test.aws.barchart.com/v1/portfolios/0004e3e3-b001-42b5-90f7-8bb06ea5b337/positions/new/transactions' \
  -X 'POST' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJtZSIsImNvbnRleHRJZCI6ImJhcmNoYXJ0IiwiaWF0IjoxNjQ1NDY5MDIxfQ.l6kg72DiUmuDU0OkUA8sdnsrrgSR0XAiMiGvtB9wG08' \
  -H 'Content-Type: application/json;charset=UTF-8' \
  --data-binary '{"portfolio":"0004e3e3-b001-42b5-90f7-8bb06ea5b337","position":"new","type":"B","instrument":{"symbol":{"barchart":"AAPL","display":"AAPL"}},"date":"2022-01-03","price":"182.56","quantity":"100","fee":"0"}'
```

## Querying Portfolios

Once you've created a portfolio, it can be queried.

#### Using the SDK

Query all portfolios for the active user by invoking the [```PortfolioGateway.readPortfolios```](/content/sdk/lib-gateway?id=portfoliogatewayreadportfolios) function.

```javascript
portfolioGateway.readPortfolios()
	.then((portfolios) => {
		console.info(`Example: Successfully queried [ ${portfolios.length} ] portfolio(s) for the current user.`);
	});
```

> Try it out by executing the [```example4.js```](https://github.com/barchart/portfolio-client-js/blob/master/example/node/example4.js) script.

#### Using the API

To retrieve all portfolios for the active user, simply send a ```GET``` request to the [```/portfolios/{portfolio}```](/content/api/paths?id=get-portfoliosportfolio) endpoint — using an asterisk (```*```) to specify all portfolios.

```shell
curl 'https://portfolio-test.aws.barchart.com/v1/portfolios/*' \
  -X 'GET' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJtZSIsImNvbnRleHRJZCI6ImJhcmNoYXJ0IiwiaWF0IjoxNjQ1NDY5MDIxfQ.l6kg72DiUmuDU0OkUA8sdnsrrgSR0XAiMiGvtB9wG08'
```

## Querying Positions

Positions can be queried by (a) user or (b) user and portfolio. In the following examples, we'll query all positions for the active user.

#### Using the SDK

Execute the [```PortfolioGateway.readPositions```](/content/sdk/lib-gateway?id=portfoliogatewayreadpositions) function, which returns [```Position```](/content/sdk/lib-data?id=schemaposition) objects, as follows:

```javascript
portfolioGateway.readPositions()
	.then((positions) => {
		const portfolios = positions.reduce((a, p) => a.add(p.portfolio), new Set());
		
		console.info(`Example: The current user has [ ${positions.length} ] position(s) across [ ${portfolios.size} ] portfolio(s).`);
	});
```

> Try it out by executing the [```example5.js```](https://github.com/barchart/portfolio-client-js/blob/master/example/node/example5.js) script.

#### Using the API

To retrieve all [```position```](/content/api/components?id=schemasposition) components for the active user, send a ```GET``` request to the [```/portfolios/{portfolio}/positions/{position}```](/content/api/paths?id=get-portfoliosportfoliopositionsposition) endpoint — using asterisks (```*```) to specify all portfolios and all positions.

```shell
curl 'https://portfolio-test.aws.barchart.com/v1/portfolios/*/positions/*' \
  -X 'GET' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJtZSIsImNvbnRleHRJZCI6ImJhcmNoYXJ0IiwiaWF0IjoxNjQ1NDY5MDIxfQ.l6kg72DiUmuDU0OkUA8sdnsrrgSR0XAiMiGvtB9wG08'
```

## Querying Transactions

A position is composed of transactions. 

To query transactions, you'll need to know the unique identifier of a position and the unique identifier of the portfolio that contains the position. For illustration purposes, we'll assume:

* your portfolio identifier is `0004e3e3-b001-42b5-90f7-8bb06ea5b337` and
* your position identifier is `da570562-46cb-4dd5-88ff-c9c566f886ba`

However, you'll need to supply actual identifiers, which you can get by [querying your positions](/content/quick_start?id=querying-positions).

#### Using the SDK

The [```PortfolioGateway.readTransactions```](/content/sdk/lib-gateway?id=portfoliogatewayreadtransactions) function returns an array of [```Transaction```](/content/sdk/lib-data?id=schematransaction) objects.

```javascript
const query = { };

query.portfolio = '0004e3e3-b001-42b5-90f7-8bb06ea5b337';
query.position = 'da570562-46cb-4dd5-88ff-c9c566f886ba';

portfolioGateway.readTransactions(query)
	.then((transactions) => {
		console.info(`Example: Postition [ ${query.position} ] in portfolio [ ${query.portfolio} ] has [ ${transactions.length} ] transactions(s).`);
	});
```

> Try it out by executing the [```example6.js```](https://github.com/barchart/portfolio-client-js/blob/master/example/node/example6.js) script.

#### Using the API

To retrieve all [```transaction```](/content/api/components?id=schemastransaction) components for a position, send a ```GET``` request to the [```/portfolios/{portfolio}/positions/{position}/transactions/{seqeunce}```](/content/api/paths?id=get-portfoliosportfoliopositionspositiontransactionsseqeunce) endpoint.

```shell
curl 'https://portfolio-test.aws.barchart.com/v1/portfolios/0004e3e3-b001-42b5-90f7-8bb06ea5b337/positions/da570562-46cb-4dd5-88ff-c9c566f886b/transactions/*' \
  -X 'GET' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJtZSIsImNvbnRleHRJZCI6ImJhcmNoYXJ0IiwiaWF0IjoxNjQ1NDY5MDIxfQ.l6kg72DiUmuDU0OkUA8sdnsrrgSR0XAiMiGvtB9wG08'
```