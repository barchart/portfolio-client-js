**A position represents an investment in one instrument.**  A position is the result, in aggregate, of the execution of one or more transactions for the same instrument and a position is contained within a portfolio.

## Position Data Structures

Here are the most common position-related data structures used by the SDK/API:

| SDK Schema                                                      | API Component                                                        | Purpose                       | Attributes                                                             |
|-----------------------------------------------------------------|----------------------------------------------------------------------|-------------------------------|------------------------------------------------------------------------|
| [Portfolio](/content/sdk/lib-data?id=schemaposition)            | [portfolio](/content/api/components?id=schemasposition)              | Response data (e.g. queries). | All.                                                                   |
| [PositionUpdate](/content/sdk/lib-data?id=schemapositionupdate) | [position-update](/content/api/components?id=schemasposition-update) | Request to update position.   | Some. Excludes attributes assigned remotely (e.g. unique identifiers). |

## Position Operations

The following position-related operations are available:

| Operation                                                                 | SDK Function                                                                                  | SDK Input &rarr; Output                                                                                                   | API Endpoint                                                                                                             | API Input &rarr; Output                                                                                                            |
|---------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| [update](/content/concepts/working_with_positions?id=updating-a-position) | [PortfolioGateway.updatePosition](/content/sdk/lib-gateway?id=portfoliogatewayupdateposition) | [PostionUpdate](/content/sdk/lib-data?id=schemapositionupdate) &rarr; [Position](/content/sdk/lib-data?id=schemaposition) | PUT [/portfolios/{portfolio}/positions/{position}](/content/api/paths?id=put-portfoliosportfoliopositionsposition)       | [position-update](/content/api/components?id=schemasposition-update) &rarr; [position](/content/api/components?id=schemasposition) |
| [delete](/content/concepts/working_with_positions?id=deleting-a-position) | [PortfolioGateway.deletePosition](/content/sdk/lib-gateway?id=portfoliogatewaydeleteposition) | {position identifier} &rarr; Array of [Position](/content/sdk/lib-data?id=schemaposition)                                 | DELETE [/portfolios/{portfolio}/positions/{position}](/content/api/paths?id=delete-portfoliosportfoliopositionsposition) | {position identifier} &rarr; Array of [position](/content/api/components?id=schemasposition)                                       |
| [query](/concepts/working_with_positions?id=position-queries)             | [PortfolioGateway.readPositions](/content/sdk/lib-gateway?id=portfoliogatewayreadpositions)   | {multiple} &rarr; Array of [Position](/content/sdk/lib-data?id=schemaposition)                                            | GET [/portfolios/{portfolio}/positions/{position}](/api/paths?id=get-portfoliosportfoliopositionsposition)               | {multiple} &rarr; Array of [position](/content/api/components?id=schemasposition)                                                  |

## Creating a Position

Positions are not created directly. Instead, positions are automatically created when an _opening_ transaction is executed. See the [Key Concepts: Working with Transactions](/content/concepts/working_with_transactions) for more information.

## Updating a Position

By default, each new position inherits some basic behaviors from its containing portfolio.

#### Using the SDK

#### Using the API

## Deleting a Position

#### Using the SDK

#### Using the API

## Position Queries

#### Using the SDK

#### Using the API

## Position Summaries

## Position Value-Over-Time

The _Portfolio Service_ maintains end-of-day valuations for each individual position. Refer to the [Key Concepts: Working with Valuations]([for each individual position](/content/concepts/working_with_valuations) section for more information.
