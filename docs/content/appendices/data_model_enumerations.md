## Currency

The [```@barchart/common-js/lang/Currency```](https://github.com/barchart/common-js/blob/master/lang/Currency.js) enumeration defines well-known currencies. Here are some usages:

* The default currency for a portfolio (used for reporting and translation purposes).
* The currency an instrument trades in.
* The currency a cash position is denominated in.

At present, only three currencies are defined:

| Enumeration Item (SDK) | String Code (API) | Description          |
|------------------------|-------------------|----------------------|
| ```Currency.USD```     | ```"USD"```       | The US Dollar.       |
| ```Currency.CAD```     | ```"CAD"```       | The Canadian Dollar. |
| ```Currency.EUR```     | ```"EUR"```       | The Euro.            |

> Support for additional currencies could be added by Barchart.

## InstrumentType

The [```@barchart/portfolio-api-common/lib/data/InstrumentType```](https://github.com/barchart/portfolio-api-common/blob/master/lib/data/InstrumentType.js) enumeration defines supported asset classes. Each position references a single instrument and each instrument is classified using one of the following types:

| Enumeration Item (SDK)      | String Code (API) | Description                          | Has Dividends | Exchange Traded |
|-----------------------------|-------------------|--------------------------------------|---------------|-----------------|
| ```InstrumentType.CASH```   | ```"CASH"```      | Fiat currency.                       | N             | Y               |
| ```InstrumentType.EQUITY``` | ```"EQUITY"```    | Ownership stake in a company  .      | Y             | Y               |
| ```InstrumentType.FUND```   | ```"FUND"```      | Basket of investments.               | Y             | Y               |
| ```InstrumentType.OTHER```  | ```"OTHER"```     | User-defined (e.g. a baseball card). | N             | N               |

> Support for additional asset classes could be added by Barchart. However, calculations for (un)realized gains and losses may need to be enhanced (e.g. futures, options). 

## PositionDirection

Broadly speaking, the [```@barchart/portfolio-api-common/lib/data/PositionDirection```](https://github.com/barchart/portfolio-api-common/blob/master/lib/data/PositionDirection.js) enumeration defines whether the investor would benefit as the price of the instrument increases or decreases. Each [```PositionSnapshot```](/content/sdk/lib-data?id=schemapositionsnapshot) indicates the current direction of the position.

| Enumeration Item (SDK)        | String Code (API) | Investor Benefits   | Position Quantity |
|-------------------------------|-------------------|---------------------|-------------------|
| ```PositionDirection.LONG```  | ```"LONG"```      | As price increases. | Positive          |
| ```PositionDirection.SHORT``` | ```"SHORT"```     | As price decreases. | Negative          |
| ```PositionDirection.EVEN```  | ```"EVEN"```      | Neutral.            | Zero              |

## PositionSummaryFrame

## TransactionType

## Timezones
