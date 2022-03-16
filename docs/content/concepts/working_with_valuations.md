**Daily valuations are automatically generated for each position.**  Additionally, these daily valuations are translated to a "default" currency and aggregated, providing a daily valuation for each portfolio. These valuations can be particularly useful when presented visually on a chart.

## Valuation Data Structures

| SDK Schema                                                              | API Component                                                                          | Purpose                                              |
|-------------------------------------------------------------------------|----------------------------------------------------------------------------------------|------------------------------------------------------|
| [ValuationContainer](/content/sdk/lib-data?id=schemavaluationcontainer) | [misc-valuation-container](/content/api/components?id=schemasmisc-valuation-container) | A list of daily valuations along with some metadata. |
| [Valuation](/content/sdk/lib-data?id=schemavaluation)                   | [misc-valuation](/content/api/components?id=schemasmisc-valuation)                     | A daily valuation (e.g. a date and an amount).       |

## Valuation Operations

#### Using the SDK

| Operation                                                                                     | SDK Function                                                                                  | SDK Input → Output                                                                                           |
|-----------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|
| [query position](/content/concepts/working_with_valuations?id=querying-position-valuations)   | [PortfolioGateway.readValuations](/content/sdk/lib-gateway?id=portfoliogatewayreadvaluations) | {portfolio & position identifiers} → [ValuationContainer](/content/sdk/lib-data?id=schemavaluationcontainer) |
| [query portfolio](/content/concepts/working_with_valuations?id=querying-portfolio-valuations) | [PortfolioGateway.readValuations](/content/sdk/lib-gateway?id=portfoliogatewayreadvaluations) | {portfolio identifier} → [ValuationContainer](/content/sdk/lib-data?id=schemavaluationcontainer)             |

#### Using the API

| Operation                                                                                     | API Endpoint                                                                                                                    | API Input → Output                                                                                                          |
|-----------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------|
| [query position](/content/concepts/working_with_valuations?id=querying-position-valuations)   | GET [/portfolios/{portfolio}/positions/{position}/values](/content/api/paths?id=get-portfoliosportfoliopositionspositionvalues) | {portfolio & position identifiers} → [misc-valuation-container](/content/api/components?id=schemasmisc-valuation-container) |
| [query portfolio](/content/concepts/working_with_valuations?id=querying-portfolio-valuations) | GET [/portfolios/{portfolio}/positions/{position}/values](/content/api/paths?id=get-portfoliosportfoliopositionspositionvalues) | {portfolio identifier} → [misc-valuation-container](/content/api/components?id=schemasmisc-valuation-container)             |
## Methodology

#### Position Valuation

Generally speaking, the valuation of a position is calculated by multiplying the position's `open` quantity by the last available quote price on the day in question. These valuations are always performed in the currency the position is denominated in.

#### Portfolio Valuation

Summing the valuations for all positions contained within a portfolio, yields the portfolio's valuation, with one important caveat — the portfolio's value must be presented in a common currency. So, each position will first be translated into portfolio's default currency, using the exchange rate applicable to the day of the valuation, before summation.

#### Valuation Updates

Each night, an automated job updates position and portfolio valuations, assuming the user has accessed his/her portfolio within the last seven days. Additionally, the following triggers cause valuations to be updated:

* When a new position is created.
* When the size of an existing position changes.
* When an existing position is deleted.
* When the portfolio's default currency is changed.
* When a portfolio is accessed after a period of inactivity, longer than seven days.

#### Valuation Availability

Depending on the circumstances, the _Portfolio Service_ may only need to calculate one day's worth of valuations (e.g. the nightly job). Or, it may need to calculate hundreds (or thousands) of day's worth of valuations (e.g. a backdated transaction is entered).

As a result, the valuation process can take a significant amount of time, depending on the number of days affected, the number of positions in a portfolio, and the number of unrelated valuations waiting to be processed. Consequently, valuation is performed asynchronously. For example, after executing a transaction to open a new position it may take a few moments before the valuations for the new position are available. Furthermore, it may take a few more moments before the portfolio valuations have been updated.

## Querying Position Valuations

To retrieve daily valuations for a single positions, we need the `portfolio` and `position` identifiers.

#### Using the SDK

Execute the [```PortfolioGateway.readValuations```](/content/sdk/lib-gateway?id=portfoliogatewayreadvaluations) function, as follows:

```javascript
const portfolio = '0004e3e3-b001-42b5-90f7-8bb06ea5b337';
const position = 'da570562-46cb-4dd5-88ff-c9c566f886ba';

portfolioGateway.readValuations(portfolio, position)
	.then((data) => {
		console.info(`Example: Valuation query for [ ${portfolio} ] [ ${position} ] completed, [ ${data.valuations.length} ] daily valuation(s) exist.`);
	});
```

The function returns a [ValuationContainer](/content/sdk/lib-data?id=schemavaluationcontainer) object.

#### Using the API

Issue a ```GET``` request to the [```/portfolios/{portfolio}/positions/{position}/values```](/content/api/paths?id=get-portfoliosportfoliopositionspositionvalues) endpoint.

```shell
curl 'https://portfolio-test.aws.barchart.com/v1/portfolios/0004e3e3-b001-42b5-90f7-8bb06ea5b337/positions/da570562-46cb-4dd5-88ff-c9c566f886ba/values' \
  -X 'GET' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJtZSIsImNvbnRleHRJZCI6ImJhcmNoYXJ0IiwiaWF0IjoxNjQ1NDY5MDIxfQ.l6kg72DiUmuDU0OkUA8sdnsrrgSR0XAiMiGvtB9wG08'
```

The data returned will match the [misc-valuation-container](/content/api/components?id=schemasmisc-valuation-container) component.

## Querying Portfolio Valuations

Requesting daily valuations for the entire portfolio is similar to requesting valuations for a single position.

> Valuations are given in the default currency of the portfolio. The values of individual positions are translated into the default currency, as necessary.

#### Using the SDK

Simply omit the `position` parameter, when calling the [```PortfolioGateway.readValuations```](/content/sdk/lib-gateway?id=portfoliogatewayreadvaluations) function, as follows:

```javascript
const portfolio = '0004e3e3-b001-42b5-90f7-8bb06ea5b337';

portfolioGateway.readValuations(portfolio)
	.then((data) => {
		console.info(`Example: Valuation query for [ ${portfolio} ] completed, [ ${data.valuations.length} ] daily valuation(s) exist.`);
	});
```

#### Using the API

Use an asterisk (```*```) as the ```position``` identifier when invoking the [```/portfolios/{portfolio}/positions/{position}/values```](/content/api/paths?id=get-portfoliosportfoliopositionspositionvalues) endpoint.

```shell
curl 'https://portfolio-test.aws.barchart.com/v1/portfolios/0004e3e3-b001-42b5-90f7-8bb06ea5b337/positions/*/values' \
  -X 'GET' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJtZSIsImNvbnRleHRJZCI6ImJhcmNoYXJ0IiwiaWF0IjoxNjQ1NDY5MDIxfQ.l6kg72DiUmuDU0OkUA8sdnsrrgSR0XAiMiGvtB9wG08'
```

## Querying Valuation Availability

Various actions can result in the need to recalculate valuations. For example, an existing transaction could be edited, increasing or decreasing the number of shares bought or sold. Recalculation is performed asynchronously to the action that precipitated the need to update valuations. Consequently, a check exists to determine if valuations are up-to-date.

#### Using the SDK

#### Using the API

