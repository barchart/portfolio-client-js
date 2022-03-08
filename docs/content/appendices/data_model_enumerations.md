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

## InstrumentType

The [```@barchart/portfolio-api-common/lib/data/InstrumentType```](https://github.com/barchart/portfolio-api-common/blob/master/lib/data/InstrumentType.js) enumeration defines supported asset classes. Each position references a single instrument and each instrument is classified using one of the following types:

| Enumeration Item (SDK)      | String Code (API) | Description                        | Has Dividends | Exchange Traded |
|-----------------------------|-------------------|------------------------------------|---------------|-----------------|
| ```InstrumentType.CASH```   | ```"CASH"```      | Fiat currency.                     | N             | Y               |
| ```InstrumentType.EQUITY``` | ```"EQUITY"```    | Ownership stake in a company.      | Y             | Y               |
| ```InstrumentType.FUND```   | ```"FUND"```      | Basket of investments.             | Y             | Y               |
| ```InstrumentType.OTHER```  | ```"OTHER"```     | User-defined (e.g. baseball card). | N             | N               |

## PositionDirection

## PositionSummaryFrame

## TransactionType

## Timezones
