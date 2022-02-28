A portfolio is a container for positions, with a single owner.

## Portfolio Data Structures

If you are using the **SDK**, familiarize yourself with the following schemas:

* [Portfolio](/content/sdk/lib-data?id=schemaportfolio) - A portfolio.
* [PortfolioCreate](/content/sdk/lib-data?id=schemaportfoliocreate) - A subset of properties from the ```Portfolio``` schema, excluding properties managed remotely by the Portfolio Service.
* [PortfolioUpdate](/content/sdk/lib-data?id=schemaportfolioupdate) - A subset of properties from the ```Portfolio``` schema which permit changes (e.g. the identifier of a portfolio cannot be changed).

Comparable components, if you choose to interact with the REST API directly, are defined in the OpenAPI document:

* [portfolio](/content/api/components?id=schemasportfolio) - A portfolio.
* [portfolio-create](/content/api/components?id=schemasportfolio-create) - A subset of properties from the ```portolio``` component, excluding properties managed remotely by the Portfolio Service.
* [portfolio-update](/content/api/components?id=schemasportfolio-update) - A subset of properties from the ```portfoio``` schema which permit changes (e.g. the identifier of a portfolio cannot be changed).

## Portfolio Operations

The following portfolio-related operations are available:

* **Create a new Portfolio**
    * SDK > Invoke the [PortfolioGateway.createPortfolio]() function 
    * API > Send an HTTP POST request to the [/portfolios]() endpoint
* **Update an existing Portfolio**
    * SDK > Invoke the [PortfolioGateway.updatePortfolio]() function
    * API > Send an HTTP PUT request to the [/portfolios/{portfolio}]() endpoint
* **Delete an existing Portfolio**
	* SDK > Invoke the [PortfolioGateway.deletePortfolio]() function
	* API > Send an HTTP DELETE request to the [/portfolios/{portfolio}]() endpoint
* **Query Existing Portfolios**
    * SDK > Invoke the [PortfolioGateway.readPortfolios]() function
    * API > Send an HTTP GET request to the [/portfolios/{portfolio}]() endpoint

## Creating a Portfolio

#### Using the SDK

#### Using the API

## Updating a Portfolio

#### Using the SDK

#### Using the API

## Deleting a Portfolio

#### Using the SDK

#### Using the API

## Portfolio Queries

#### Using the SDK

#### Using the API

## Portfolio Value-Over-Time