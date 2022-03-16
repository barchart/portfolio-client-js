**A _portfolio_ is a container for positions.** Each portfolio is owned by a single user.

## Portfolio Data Structures

Here are the most common portfolio-related data structures used by the SDK/API:

| SDK Schema                                                        | API Component                                                          | Purpose                       | Attributes                                                             |
|-------------------------------------------------------------------|------------------------------------------------------------------------|-------------------------------|------------------------------------------------------------------------|
| [Portfolio](/content/sdk/lib-data?id=schemaportfolio)             | [portfolio](/content/api/components?id=schemasportfolio)               | Response data (e.g. queries). | All.                                                                   |
| [PortfolioCreate](/content/sdk/lib-data?id=schemaportfoliocreate) | [portfolio-create](/content/api/components?id=schemasportfolio-create) | Request to create portfolio.  | Some. Excludes attributes assigned remotely (e.g. unique identifiers). |
| [PortfolioUpdate](/content/sdk/lib-data?id=schemaportfolioupdate) | [portfolio-update](/content/api/components?id=schemasportfolio-update) | Request to update portfolio.  | Some. Requires unique identifier. Include only attributes to change.   |

## Portfolio Operations

The following portfolio-related operations are available:

| Operation                                                                   | SDK Function                                                                                    | SDK Input &rarr; Output                                                                                                        | API Endpoint                                                                       | API Input &rarr; Output                                                                                                                |
|-----------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| [create](/content/concepts/working_with_portfolios?id=creating-a-portfolio) | [PortfolioGateway.createPortfolio](/content/sdk/lib-gateway?id=portfoliogatewaycreateportfolio) | [PortfolioCreate](/content/sdk/lib-data?id=schemaportfoliocreate) &rarr; [Portfolio](/content/sdk/lib-data?id=schemaportfolio) | POST [/portfolios](/content/api/paths?id=post-portfolios)                          | [portfolio-create](/content/api/components?id=schemasportfolio-create) &rarr; [portfolio](/content/api/components?id=schemasportfolio) |
| [update](/content/concepts/working_with_portfolios?id=updating-a-portfolio) | [PortfolioGateway.updatePortfolio](/content/sdk/lib-gateway?id=portfoliogatewayupdateportfolio) | [PortfolioUpdate](/content/sdk/lib-data?id=schemaportfolioupdate) &rarr; [Portfolio](/content/sdk/lib-data?id=schemaportfolio) | PUT [/portfolios/{portfolio}](/content/api/paths?id=put-portfoliosportfolio)       | [portfolio-update](/content/api/components?id=schemasportfolio-update) &rarr; [portfolio](/content/api/components?id=schemasportfolio) |
| [delete](/content/concepts/working_with_portfolios?id=deleting-a-portfolio) | [PortfolioGateway.deletePortfolio](/content/sdk/lib-gateway?id=portfoliogatewaydeleteportfolio) | {portfolio identifier} &rarr; none                                                                                             | DELETE [/portfolios/{portfolio}](/content/api/paths?id=delete-portfoliosportfolio) | {portfolio identifier} &rarr; none                                                                                                     |
| [query](/content/concepts/working_with_portfolios?id=portfolio-queries)     | [PortfolioGateway.readPortfolios](/content/sdk/lib-gateway?id=portfoliogatewayreadportfolios)   | none &rarr; Array of [Portfolio](/content/sdk/lib-data?id=schemaportfolio)                                                     | GET [/portfolios/{portfolio}](/content/api/paths?id=get-portfoliosportfolio)       | none &rarr; Array of [portfolio](/content/api/components?id=schemasportfolio)                                                          |

## Creating a Portfolio

Creating a new portfolio is simple. The portfolio will be owned by the active user (as specified in your [JWT claims](/content/concepts/connecting_to_barchart?id=token-payload)) and there is no restriction on the number of portfolios the user can create.

#### Using the SDK

First, create a JavaScript object that conforms to the [```PortfolioCreate```](/content/sdk/lib-data?id=schemaportfoliocreate) schema.

```JavaScript
const Currency = require('@barchart/common-js/lang/Currency'),
	Timezones = require('@barchart/common-js/lang/Timezones');

const portfolioCreate = {
	name: 'My First Portfolio',
	timezone: Timezones.AMERICA_NEW_YORK,
	defaults: {
		cash: false,
		currency: Currency.USD,
		reinvest: false
	}
};
```

Assuming you've [built a PortfolioGateway instance](/content/concepts/connecting_to_barchart?id=using-the-sdk), pass the JavaScript object to the [PortfolioGateway.createPortfolio](/content/sdk/lib-gateway?id=portfoliogatewaycreateportfolio) function. 

```javascript
portfolioGateway.createPortfolio(portfolioCreate)
	.then((portfolio) => {
		console.info(`Example: Successfully created portfolio with identifier [ ${portfolio.portfolio} ].`);
	});
```

Notice the resulting [```Portfolio```](/content/sdk/lib-data?id=schemaportfolio) object has unique identifier — a [```UUID```](https://en.wikipedia.org/wiki/Universally_unique_identifier) — assigned to the `portfolio` property. You'll need this later (e.g. when [querying positions](/content/concepts/working_with_positions?id=position-queries) or [executing transactions](/content/concepts/working_with_transactions?id=executing-a-transaction)).

#### Using the API

Construct a JSON object conforming to the [```portfolio-create```](/content/api/components?id=schemasportfolio-create) component.

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

> Refer to the [Data Model: Enumerations](/content/appendices/data_model_enumerations) appendix for the correct codes to use for the ```timezone``` and ```defaults.currency``` attributes.

Once you've constructed a suitable JSON object, ```POST``` it to the [```/portfolios```](/content/api/paths?id=post-portfolios) endpoint.

```shell
curl 'https://portfolio-test.aws.barchart.com/v1/portfolios' \
  -X 'POST' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJtZSIsImNvbnRleHRJZCI6ImJhcmNoYXJ0IiwiaWF0IjoxNjQ1NDY5MDIxfQ.l6kg72DiUmuDU0OkUA8sdnsrrgSR0XAiMiGvtB9wG08' \
  -H 'Content-Type: application/json;charset=UTF-8' \
  --data-binary '{"name":"My First Portfolio","timezone":"America/New_York","defaults":{"cash":false,"currency":"USD","reinvest":false}}'
```

## Updating a Portfolio

Once created, the following attributes can be updated:

* The `name` of the portfolio.
* The `timezone` of the portfolio.
* The `defaults` applied to new positions.

> This operation does _not_ affect existing positions contained within the portfolio. Positions can be modified by [executing transactions](/content/concepts/working_with_transactions?id=executing-a-transaction).

#### Using the SDK

First, create a JavaScript object that conforms to the [```PortfolioUpdate```](/content/sdk/lib-data?id=schemaportfolioupdate) schema, including the properties you wish to change. 

> Notice the ```PortfolioUpdate``` object is essentially the same as a ```PositionCreate``` object, with the addition of a ```postition``` identifier property. Also, since the ```PositionUpdate``` object contains a subset of the properties from a ```Portfolio``` object, you could substitute a complete ```Portfolio``` object, if desired.

Since each `portfolio` identifier is unique, in the following examples, we'll assume your portfolio identifier is ```0004e3e3-b001-42b5-90f7-8bb06ea5b337```.

```javascript
const portfolioupdate = {
	portfolio: '0004e3e3-b001-42b5-90f7-8bb06ea5b337',
	name: 'An Improved Portfolio Name',
	timezone: Timezones.Chicago,
	defaults: {
		cash: true,
		currency: Currency.CAD,
		reinvest: true
	}
};
```

Once you've constructed the JavaScript object, pass it to the [PortfolioGateway.updatePortfolio](/content/sdk/lib-gateway?id=portfoliogatewayupdateportfolio) function.

```javascript
portfolioGateway.updatePortfolio(portfolioCreate)
	.then((portfolio) => {
		console.info(`Example: Successfully updated portfolio [ ${portfolio.portfolio} ], new name is [ ${portfolio.name} ].`);
	});
```

#### Using the API

First, construct a JSON object matching the [```portfolio-update```](/content/api/components?id=schemasportfolio-update) component. Only properties you intend to change need to be included.

```json
{
  "portfolio": "0004e3e3-b001-42b5-90f7-8bb06ea5b337",
  "name": "An Improved Portfolio Name",
  "timezone": "America/Chicago",
  "defaults": {
	"cash": true,
	"currency": "CAD",
	"reinvest": true
  }
}
```

Then, issue a ```PUT``` request to the [```/portfolios/{portfolio}```](/content/api/paths?id=put-portfoliosportfolio) endpoint.

```shell
curl 'https://portfolio-test.aws.barchart.com/v1/portfolios/0004e3e3-b001-42b5-90f7-8bb06ea5b337' \
  -X 'PUT' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJtZSIsImNvbnRleHRJZCI6ImJhcmNoYXJ0IiwiaWF0IjoxNjQ1NDY5MDIxfQ.l6kg72DiUmuDU0OkUA8sdnsrrgSR0XAiMiGvtB9wG08' \
  -H 'Content-Type: application/json;charset=UTF-8' \
  --data-binary '{"portfolio":"0004e3e3-b001-42b5-90f7-8bb06ea5b337","name":"An Improved Portfolio Name","timezone":"America/Chicago","defaults":{"cash":true,"currency":"CAD","reinvest":true}}'
```

> Notice the portfolio identifier must be included in the URI path of the HTTP request (and in the request's body).

## Deleting a Portfolio

When a portfolio is deleted, all associated data is also deleted.

> This action will delete all positions contained in the portfolio, transaction records for those positions, daily position valuations, and periodic gain/loss summaries. This action cannot be undone.

Again, we'll assume your portfolio identifier is ```0004e3e3-b001-42b5-90f7-8bb06ea5b337```.

#### Using the SDK

Pass the ```portfolio``` identifier to the [```PortfolioGateway.deletePortfolio```](/content/sdk/lib-gateway?id=portfoliogatewaydeleteportfolio) function. 

```javascript
const portfolio = '0004e3e3-b001-42b5-90f7-8bb06ea5b337';

portfolioGateway.deletePortfolios(portfolio)
	.then((portfolio) => {
		console.info(`Example: Successfully deleted portfolio [ ${portfolio} ].`);
	});
```

#### Using the API

Issue a ```DELETE``` request to the [```/portfolios/{portfolio}```](/content/api/paths?id=delete-portfoliosportfolio) endpoint.

```shell
curl 'https://portfolio-test.aws.barchart.com/v1/portfolios/0004e3e3-b001-42b5-90f7-8bb06ea5b337' \
  -X 'DELETE' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJtZSIsImNvbnRleHRJZCI6ImJhcmNoYXJ0IiwiaWF0IjoxNjQ1NDY5MDIxfQ.l6kg72DiUmuDU0OkUA8sdnsrrgSR0XAiMiGvtB9wG08'
```

An empty HTTP 200 response indicates success.

## Portfolio Queries

There are two distinct ways to query the active user's portfolios:

* Query for all portfolios,
* Query for a single portfolio (given the portfolio's identifier)

#### Using the SDK

The [```PortfolioGateway.readPortfolios```](/content/sdk/lib-gateway?id=portfoliogatewayreadportfolios) function retrieves the active user's [Portfolio](/content/sdk/lib-data?id=schemaportfolio) objects:

```javascript
portfolioGateway.readPortfolios()
	.then((results) => {
		console.info(`Example: The active user has [ ${results.length} ] portfolio(s).`);
	});
```

Pass an optional string parameter to restrict the results to a single portfolio:

```javascript
const portfolio = '0004e3e3-b001-42b5-90f7-8bb06ea5b337';

portfolioGateway.readPortfolios(portfolio)
	.then((results) => {
		console.info(`Example: The user ${results.length === 1 ? 'does' : 'does not'} own a portfolio with identifier [ ${portfolio} ].`);
	});
```

#### Using the API

Issue a ```GET``` request to the [```/portfolios/{portfolio}```](/content/api/paths?id=get-portfoliosportfolio) endpoint.

Notice `portfolio` path parameter is required. To query for all portfolios, use an asterisk character (`*`). To query for a specific portfolio, use its identifier (a UUID). Here are two examples:

```shell
curl 'https://portfolio-test.aws.barchart.com/v1/portfolios/*' \
  -X 'GET' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJtZSIsImNvbnRleHRJZCI6ImJhcmNoYXJ0IiwiaWF0IjoxNjQ1NDY5MDIxfQ.l6kg72DiUmuDU0OkUA8sdnsrrgSR0XAiMiGvtB9wG08'
```

The response contain an array of [```portfolio```](/content/api/components?id=schemasportfolio) components.

```shell
curl 'https://portfolio-test.aws.barchart.com/v1/portfolios/0004e3e3-b001-42b5-90f7-8bb06ea5b337' \
  -X 'GET' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJtZSIsImNvbnRleHRJZCI6ImJhcmNoYXJ0IiwiaWF0IjoxNjQ1NDY5MDIxfQ.l6kg72DiUmuDU0OkUA8sdnsrrgSR0XAiMiGvtB9wG08'
```

In the event the specified portfolio doesn't exist, the response will be an empty array.

## Portfolio Value-Over-Time

The _Portfolio Service_ maintains a history of end-of-day valuations for the entire portfolio. Refer to the [Key Concepts: Working with Valuations](/content/concepts/working_with_valuations) section for more information.
