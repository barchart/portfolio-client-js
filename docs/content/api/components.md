# Components

## Responses

### Unauthorized :id=responsesunauthorized
> Authorization failure.

**Content Type**: <code>application/json</code>

**Response Type:** <code><code>Object</code></code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| message | <code>String</code> | false | false |  |

**Example**:

```json
{
  "message": "Unauthorized"
}
```

* * *

### SchemaError :id=responsesschemaerror
> Input invalid

**Content Type**: <code>application/json</code>

**Response Type:** <code><code>Array&lt;Object&gt;</code></code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| value | <code>Object</code> | false | false |  |
| value.code | <code>String</code> | false | false |  |
| value.message | <code>String</code> | false | false |  |
| children | <code>Array</code> | false | false |  |

**Example**:

```json
[
  {
    "value": {
      "code": "SCHEMA_VALIDATION_FAILURE",
      "message": "An attempt to read CREATE data failed (found \\\"timezone\\\" when expecting \\\"name\\\")."
    },
    "children": []
  }
]
```

* * *

### ServerError :id=responsesservererror
> Server error.

**Content Type**: <code>application/json</code>

**Response Type:** <code><code>Array&lt;Object&gt;</code></code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| value | <code>Object</code> | false | false |  |
| value.code | <code>String</code> | false | false |  |
| value.message | <code>String</code> | false | false |  |
| children | <code>Array</code> | false | false |  |

**Example**:

```json
[
  {
    "value": {
      "code": "REQUEST_GENERAL_FAILURE",
      "message": "An attempt to create a portfolio failed for unspecified reason(s)."
    },
    "children": []
  }
]
```

* * *

## Schemas

### portfolio :id=schemasportfolio
**Type**: <code>Object</code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| user | <code>String</code> | true | false | The identifier for the portfolio's owner. |
| portfolio | <code>String</code> | true | false | The portfolio identifier (assigned by the backend). |
| name | <code>String</code> | true | false | The name of the portfolio. |
| timezone | <code>String</code> | true | false | The timezone of the portfolio. Must conform to a tz database name. |
| defaults | [<code>portfolio-defaults</code>](#schemasportfolio-defaults) | true | false | Default settings for the portfolio. |


**Example**:

```json
{
  "user": "ad4b0bd3-b5e1-4f7d-96b1-54d22d99960d",
  "portfolio": "6ce12dec-bba9-4bf3-b865-8a4eab6e43a3",
  "name": "My First Portfolio",
  "timezone": "America/New_York",
  "defaults": {
    "cash": true,
    "currency": "USD",
    "reinvest": true
  }
}
```

* * *

### portfolio-create :id=schemasportfolio-create
**Type**: <code>Object</code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| name | <code>String</code> | true | false | The name of the portfolio. |
| timezone | <code>String</code> | true | false | The timezone of the portfolio. Must conform to a tz database name. |
| defaults | [<code>portfolio-defaults</code>](#schemasportfolio-defaults) | true | false | Default settings for the portfolio. |


**Example**:

```json
{
  "name": "My First Portfolio",
  "timezone": "America/New_York",
  "defaults": {
    "cash": true,
    "currency": "USD",
    "reinvest": true
  }
}
```

* * *

### portfolio-update :id=schemasportfolio-update
**Type**: <code>Object</code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| portfolio | <code>String</code> | true | false | The identifier of the portfolio to update. |
| name | <code>String</code> | false | false | The updated name of the portfolio, if present. |
| timezone | <code>String</code> | false | false | The updated timezone for the portfolio, if present. |
| defaults | [<code>portfolio-defaults</code>](#schemasportfolio-defaults) | false | false | The updated default settings for the portfolio, if present. |


**Example**:

```json
{
  "portfolio": "6ce12dec-bba9-4bf3-b865-8a4eab6e43a3",
  "name": "My Other Portfolio",
  "timezone": "America/Chicago",
  "defaults": {
    "cash": true,
    "currency": "USD",
    "reinvest": true
  }
}
```

* * *

### portfolio-defaults :id=schemasportfolio-defaults
**Type**: <code>Object</code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| cash | <code>Boolean</code> | true | false | Indicates if corresponding cash transactions should be automatically be created for investment transactions (e.g. a DEBIT transaction in a cash positions corresponding to a BUY transaction for a stock). |
| currency | [<code>enum-currency</code>](#schemasenum-currency) | true | false | The default currency for the portfolio, used to determine the basis for reporting. |
| reinvest | <code>Boolean</code> | true | false | Indicates if dividends should be automatically reinvested. |


**Example**:

```json
{
  "cash": true,
  "currency": "USD",
  "reinvest": true
}
```

* * *

### position :id=schemasposition
**Type**: <code>Object</code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| user | <code>String</code> | true | false | The identifier of the position's owner. |
| portfolio | <code>String</code> | true | false | The identifier of the portfolio which contains the position. |
| instrument | [<code>position-instrument</code>](#schemasposition-instrument) | true | false | The position's instrument. |
| position | <code>String</code> | true | false | The identifier for the position. |
| transaction | <code>String</code> | true | false | The sequence number of the most recent transaction for the position. |
| cash | <code>Boolean</code> | true | false | Indicates if corresponding cash transactions should be created, when appropriate (e.g. also DEBIT cash when creating a BUY transaction for stock). |
| reinvest | <code>Boolean</code> | true | false | Indicates if dividends should be automatically reinvested. |
| snapshot | [<code>position-snapshot</code>](#schemasposition-snapshot) | true | false | Summary and performance information for the position, as of the last transaction. |


**Example**:

```json
{
  "user": "ad4b0bd3-b5e1-4f7d-96b1-54d22d99960d",
  "portfolio": "6ce12dec-bba9-4bf3-b865-8a4eab6e43a3",
  "instrument": {
    "id": "c6471c5f-48d4-4979-8dd7-56c5ff1439c7",
    "name": "Apple Inc",
    "type": "EQUITY",
    "currency": "USD",
    "symbol": {
      "barhcart": "AAPL",
      "display": "AAPL"
    }
  },
  "position": "96af2dc6-2236-4a82-84c2-bff969389e00",
  "transaction": 42,
  "cash": true,
  "reinvest": true,
  "snapshot": {
    "date": "2022-01-13",
    "open": "100",
    "direction": "LONG",
    "buys": "-18256",
    "sells": "0",
    "gain": "0",
    "basis": "0",
    "income": "22",
    "value": "18256"
  }
}
```

* * *

### position-update :id=schemasposition-update
**Type**: <code>Object</code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| portfolio | <code>String</code> | true | false | The identifier of the portfolio containing the position to update. |
| position | <code>String</code> | true | false | The identifier of the position to update. |
| cash | <code>Boolean</code> | false | false | If present, changes the setting for automatic creation of the cash transactions (based on investment transactions). |
| reinvest | <code>Boolean</code> | false | false | If present, changes whether future dividends are re-invested. |


**Example**:

```json
{
  "portfolio": "6ce12dec-bba9-4bf3-b865-8a4eab6e43a3",
  "position": "96af2dc6-2236-4a82-84c2-bff969389e00",
  "cash": true,
  "reinvest": true
}
```

* * *

### position-instrument :id=schemasposition-instrument
**Type**: <code>Object</code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| id | <code>String</code> | true | false | The identifier for the instrument. |
| name | <code>String</code> | true | false | The name of the instrument. |
| type | [<code>enum-instrument-type</code>](#schemasenum-instrument-type) | true | false | The asset class of the instrument. |
| currency | [<code>enum-currency</code>](#schemasenum-currency) | true | false | The currency the instrument trades in. |
| symbol | [<code>misc-symbols</code>](#schemasmisc-symbols) | true | false | Symbols used to identify the instrument. |


**Example**:

```json
{
  "id": "c6471c5f-48d4-4979-8dd7-56c5ff1439c7",
  "name": "Apple Inc",
  "type": "EQUITY",
  "currency": "USD",
  "symbol": {
    "barhcart": "AAPL",
    "display": "AAPL"
  }
}
```

* * *

### position-snapshot :id=schemasposition-snapshot
**Type**: <code>Object</code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| date | <code>String</code> | true | false | The date of the snapshot (YYYY-MM-DD). |
| open | <code>String</code> | true | false | The number of shares (units) open (a decimal-formatted string, value may be negative). |
| direction | [<code>enum-position-direction</code>](#schemasenum-position-direction) | true | false | Qualifies the number of open shares as LONG (i.e. positive), short (i.e. negative), or EVEN (i.e. zero). |
| buys | <code>String</code> | true | false | The sum of all purchases in the currency of the underlying instrument (a decimal-formatted string, value is never negative). |
| sells | <code>String</code> | true | false | The sum of all sales in the currency of the underlying instrument (a decimal-formatted string, value is never negative). |
| gain | <code>String</code> | true | false | The realized gain on the position (a decimal-formatted string, value may be negative). |
| basis | <code>String</code> | true | false | The amount invested in the remaining position (a decimal-formatted string, value may be negative). |
| income | <code>String</code> | true | false | The sum of all income (e.g. dividends) earned on the position (a decimal-formatted string, value may be negative). |
| value | <code>String</code> | true | false | The current value of the position (a decimal-formatted string, value is never negative). Valuation is based on the last transaction price (not the current market price). |


**Example**:

```json
{
  "date": "2022-01-13",
  "open": "100",
  "direction": "LONG",
  "buys": "-18256",
  "sells": "0",
  "gain": "0",
  "basis": "0",
  "income": "22",
  "value": "18256"
}
```

* * *

### transaction :id=schemastransaction
**Type**: <code>Object</code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| portfolio | <code>String</code> | true | false | The identifier of the portfolio which contains the transaction. |
| position | <code>String</code> | true | false | The identifier of the position which contains the transaction. |
| transaction | <code>String</code> | true | false | The identifier of the transaction. |
| sequence | <code>Number</code> | true | false | The sequence number of the transaction (with respect to other transactions for the same position, starts with one). |
| type | [<code>enum-transaction-type</code>](#schemasenum-transaction-type) | true | false | The type of transaction. |
| date | <code>String</code> | true | false | The date of the transaction (YYYY-MM-DD). |
| description | <code>String</code> | false | false | Autogenerated text describing the transaction (used for cash positions). |
| amount | <code>String</code> | true | false | The total amount of money affected by the transaction (decimal-fomratted string). In cases where money was paid, the value is negative. In cases where money was received, the value is positive. |
| quantity | <code>String</code> | true | false | The number of shares (or units) of the position's instrument affected by the transaction (decimal-fomratted string). The value will be positive when purchasing and negative when selling. |
| fee | <code>String</code> | false | false | A fee paid to execute the transaction (decimal-fomratted string). |
| reference | [<code>transaction-reference</code>](#schemastransaction-reference) | false | false | A reference to another transaction — a transaction which caused this transaction to occur. |
| snapshot | [<code>position-snapshot</code>](#schemasposition-snapshot) | true | false | A summary of the position size and performance, immediately after this transaction was executed. |
| trade | [<code>transaction-extension-for-trade</code>](#schemastransaction-extension-for-trade) | false | false | Additional information, only present if transaction is a trade (type is B, S, SS, etc). |
| dividend | [<code>transaction-extension-for-dividend</code>](#schemastransaction-extension-for-dividend) | false | false | Additional information, only present if transaction is a dividend (type is DV, DX, DF, DY, etc). |
| split | [<code>transaction-extension-for-split</code>](#schemastransaction-extension-for-split) | false | false | Additional information, only present if transaction is a split (type is SP). |


**Example**:

```json
{
  "portfolio": "6ce12dec-bba9-4bf3-b865-8a4eab6e43a3",
  "position": "96af2dc6-2236-4a82-84c2-bff969389e00",
  "transaction": "b3bb28ee-a24c-4b8b-8b3b-8ad5b5b0b00a",
  "sequence": 1,
  "type": "B",
  "date": "2020-08-30",
  "description": "string",
  "amount": "-18256",
  "quantity": "100",
  "fee": "9.99",
  "reference": {
    "position": "96af2dc6-2236-4a82-84c2-bff969389e00",
    "transaction": "b3bb28ee-a24c-4b8b-8b3b-8ad5b5b0b00a"
  },
  "snapshot": {
    "date": "2022-01-13",
    "open": "100",
    "direction": "LONG",
    "buys": "-18256",
    "sells": "0",
    "gain": "0",
    "basis": "0",
    "income": "22",
    "value": "18256"
  },
  "trade": {
    "price": "182.56"
  },
  "dividend": {
    "rate": "0.125",
    "effective": "2020-08-30",
    "price": "499.23",
    "amount": "12.50"
  },
  "split": {
    "numerator": "4",
    "denominator": "1",
    "effective": "2020-08-30"
  }
}
```

* * *

### transaction-reference :id=schemastransaction-reference
**Type**: <code>Object</code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| position | <code>String</code> | true | false | The identifier of the referenced position. |
| transaction | <code>String</code> | true | false | The identifier of the referenced transaction. |


**Example**:

```json
{
  "position": "96af2dc6-2236-4a82-84c2-bff969389e00",
  "transaction": "b3bb28ee-a24c-4b8b-8b3b-8ad5b5b0b00a"
}
```

* * *

### transaction-extension-for-trade :id=schemastransaction-extension-for-trade
**Type**: <code>Object</code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| price | <code>String</code> | true | false | The unit price the transaction was executed at (decimal-fomratted string). |


**Example**:

```json
{
  "price": "182.56"
}
```

* * *

### transaction-extension-for-dividend :id=schemastransaction-extension-for-dividend
**Type**: <code>Object</code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| rate | <code>String</code> | true | false | The amount paid per unit (decimal-fomratted string). |
| effective | <code>String</code> | true | false | The day (YYYY-MM-DD) used to determine the quantity eligible to receive the dividend (i.e. the dividend ex-date). |
| price | <code>String</code> | false | false | The market value of the underlying at the time the dividend was paid, used to calculate reinvestment quantities (decimal-fomratted string). |
| amount | <code>String</code> | true | false | The amount of the dividend (e.g the rate multiplied by the quantity eligible to receive the dividend, as a decimal-fomratted string). |


**Example**:

```json
{
  "rate": "0.125",
  "effective": "2020-08-30",
  "price": "499.23",
  "amount": "12.50"
}
```

* * *

### transaction-extension-for-split :id=schemastransaction-extension-for-split
**Type**: <code>Object</code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| numerator | <code>String</code> | true | false | The numerator in the following fraction [ shares owned after dividend ] / [ shares owned before dividend ] (decimal-fomratted string). |
| denominator | <code>String</code> | true | false | The denominator in the following fraction [ shares owned after dividend ] / [ shares owned before dividend ] (decimal-fomratted string). |
| effective | <code>String</code> | true | false | The day (YYYY-MM-DD) used to determine the quantity eligible to receive the dividend (i.e. the split ex-date). |


**Example**:

```json
{
  "numerator": "4",
  "denominator": "1",
  "effective": "2020-08-30"
}
```

* * *

### transaction-create :id=schemastransaction-create
**Type**: <code>Object</code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| portfolio | <code>String</code> | true | false | The portfolio identifier (assigned by the backend). |
| position | <code>String</code> | true | false | The position identifier (or use \"new\" to create a new position). |
| type | [<code>enum-transaction-create-type</code>](#schemasenum-transaction-create-type) | true | false | The type of transaction to create. |
| instrument | [<code>transaction-create-instrument</code>](#schemastransaction-create-instrument) | false | false | Information about the instrument (required when opening a new position, ignored otherwise). |
| date | <code>String</code> | true | false | The day of the transaction (YYYY-MM-DD). |
| price | <code>String</code> | false | false | The unit price of the instrument at the time the transaction executes (decimal-fomratted string). |
| quantity | <code>String</code> | true | false | The number of units affected by the transaction (decimal-fomratted string). |
| fee | <code>String</code> | false | false | A fee paid to execute the transaction (decimal-fomratted string). |


**Example**:

```json
{
  "portfolio": "6ce12dec-bba9-4bf3-b865-8a4eab6e43a3",
  "position": "96af2dc6-2236-4a82-84c2-bff969389e00",
  "type": "B",
  "instrument": {
    "symbol": {
      "barhcart": "AAPL",
      "display": "AAPL"
    }
  },
  "date": "2022-01-13",
  "price": "123.45",
  "quantity": "100",
  "fee": "9.99"
}
```

* * *

### transaction-create-instrument :id=schemastransaction-create-instrument
**Type**: <code>Object</code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| symbol | [<code>misc-symbols</code>](#schemasmisc-symbols) | true | false | Symbols used to identify the target instrument. |


**Example**:

```json
{
  "symbol": {
    "barhcart": "AAPL",
    "display": "AAPL"
  }
}
```

* * *

### transaction-mutate-result :id=schemastransaction-mutate-result
**Type**: <code>Object</code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| positions | [<code>transaction-mutate-result-positions</code>](#schemastransaction-mutate-result-positions) | true | false | Positions which were affected by a transaction (create, update, or delete) operation. |


**Example**:

```json
{
  "positions": {
    "saved": [
      {
        "user": "ad4b0bd3-b5e1-4f7d-96b1-54d22d99960d",
        "portfolio": "6ce12dec-bba9-4bf3-b865-8a4eab6e43a3",
        "instrument": {
          "id": "c6471c5f-48d4-4979-8dd7-56c5ff1439c7",
          "name": "Apple Inc",
          "type": "EQUITY",
          "currency": "USD",
          "symbol": {
            "barhcart": "AAPL",
            "display": "AAPL"
          }
        },
        "position": "96af2dc6-2236-4a82-84c2-bff969389e00",
        "transaction": 42,
        "cash": true,
        "reinvest": true,
        "snapshot": {
          "date": "2022-01-13",
          "open": "100",
          "direction": "LONG",
          "buys": "-18256",
          "sells": "0",
          "gain": "0",
          "basis": "0",
          "income": "22",
          "value": "18256"
        }
      }
    ],
    "deleted": [
      {
        "user": "ad4b0bd3-b5e1-4f7d-96b1-54d22d99960d",
        "portfolio": "6ce12dec-bba9-4bf3-b865-8a4eab6e43a3",
        "instrument": {
          "id": "c6471c5f-48d4-4979-8dd7-56c5ff1439c7",
          "name": "Apple Inc",
          "type": "EQUITY",
          "currency": "USD",
          "symbol": {
            "barhcart": "AAPL",
            "display": "AAPL"
          }
        },
        "position": "96af2dc6-2236-4a82-84c2-bff969389e00",
        "transaction": 42,
        "cash": true,
        "reinvest": true,
        "snapshot": {
          "date": "2022-01-13",
          "open": "100",
          "direction": "LONG",
          "buys": "-18256",
          "sells": "0",
          "gain": "0",
          "basis": "0",
          "income": "22",
          "value": "18256"
        }
      }
    ]
  }
}
```

* * *

### transaction-mutate-result-positions :id=schemastransaction-mutate-result-positions
**Type**: <code>Object</code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| saved | [<code>Array&lt;position&gt;</code>](#schemasposition) | true | false | All positions which were created or updated. |
| deleted | [<code>Array&lt;position&gt;</code>](#schemasposition) | true | false | All positions which were deleted. |


**Example**:

```json
{
  "saved": [
    {
      "user": "ad4b0bd3-b5e1-4f7d-96b1-54d22d99960d",
      "portfolio": "6ce12dec-bba9-4bf3-b865-8a4eab6e43a3",
      "instrument": {
        "id": "c6471c5f-48d4-4979-8dd7-56c5ff1439c7",
        "name": "Apple Inc",
        "type": "EQUITY",
        "currency": "USD",
        "symbol": {
          "barhcart": "AAPL",
          "display": "AAPL"
        }
      },
      "position": "96af2dc6-2236-4a82-84c2-bff969389e00",
      "transaction": 42,
      "cash": true,
      "reinvest": true,
      "snapshot": {
        "date": "2022-01-13",
        "open": "100",
        "direction": "LONG",
        "buys": "-18256",
        "sells": "0",
        "gain": "0",
        "basis": "0",
        "income": "22",
        "value": "18256"
      }
    }
  ],
  "deleted": [
    {
      "user": "ad4b0bd3-b5e1-4f7d-96b1-54d22d99960d",
      "portfolio": "6ce12dec-bba9-4bf3-b865-8a4eab6e43a3",
      "instrument": {
        "id": "c6471c5f-48d4-4979-8dd7-56c5ff1439c7",
        "name": "Apple Inc",
        "type": "EQUITY",
        "currency": "USD",
        "symbol": {
          "barhcart": "AAPL",
          "display": "AAPL"
        }
      },
      "position": "96af2dc6-2236-4a82-84c2-bff969389e00",
      "transaction": 42,
      "cash": true,
      "reinvest": true,
      "snapshot": {
        "date": "2022-01-13",
        "open": "100",
        "direction": "LONG",
        "buys": "-18256",
        "sells": "0",
        "gain": "0",
        "basis": "0",
        "income": "22",
        "value": "18256"
      }
    }
  ]
}
```

* * *

### misc-symbols :id=schemasmisc-symbols
**Type**: <code>Object</code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| barhcart | <code>String</code> | true | false | The symbol used by Barchart (required to lookup quotes and determine prices). |
| display | <code>String</code> | false | false | The symbol used for display purposes (often the same as the Barchart symbol). |


**Example**:

```json
{
  "barhcart": "AAPL",
  "display": "AAPL"
}
```

* * *

### misc-valuation-container :id=schemasmisc-valuation-container
**Type**: <code>Object</code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| user | <code>String</code> | true | false | The identifier of the portfolio's owner. |
| portfolio | <code>String</code> | true | false | The portfolio identifier. |
| position | <code>String</code> | true | false | The position identifier (an asterisk (*) indicates the valuation are for the entire portfolio). |
| currency | [<code>enum-currency</code>](#schemasenum-currency) | false | false | The currency of the valuations (absent if no valuations are available). |
| valuations | [<code>Array&lt;misc-valuation&gt;</code>](#schemasmisc-valuation) | true | false | Daily valuations for the position (or the entire portfolio). |


**Example**:

```json
{
  "user": "ad4b0bd3-b5e1-4f7d-96b1-54d22d99960d",
  "portfolio": "6ce12dec-bba9-4bf3-b865-8a4eab6e43a3",
  "position": "96af2dc6-2236-4a82-84c2-bff969389e00",
  "currency": "USD",
  "valuations": [
    {
      "date": "2020-08-30",
      "market": 20924.08
    }
  ]
}
```

* * *

### misc-valuation :id=schemasmisc-valuation
**Type**: <code>Object</code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| date | <code>String</code> | true | false | The date of the valuation (YYYY-MM-DD). |
| market | <code>Number</code> | true | false | The market value of the position (or portfolio). |


**Example**:

```json
{
  "date": "2020-08-30",
  "market": 20924.08
}
```

* * *

### enum-currency :id=schemasenum-currency
**Type**: <code>String</code>

>Currencies used to trade and value instruments and positions.

**Enum values**:

```json
USD,CAD
```

**Example**:

```json
USD
```

* * *

### enum-instrument-type :id=schemasenum-instrument-type
**Type**: <code>String</code>

>Codes which define asset classes for instruments.

**Enum values**:

```json
EQUITY,FUND,CASH,OTHER
```

**Example**:

```json
EQUITY
```

* * *

### enum-position-direction :id=schemasenum-position-direction
**Type**: <code>String</code>

>Codes which describe position size — positive values are LONG, negative values are SHORT and zero values are EVEN.

**Enum values**:

```json
LONG,SHORT,EVEN
```

**Example**:

```json
LONG
```

* * *

### enum-transaction-type :id=schemasenum-transaction-type
**Type**: <code>String</code>

>Single letter codes for transaction types (e.g. B for BUY, S for SELL; see \&quot;Appendicies &gt; Enumerations\&quot; in SDK documentation for more info), including types which are managed by the backend (e.g. DV for dividend).

**Enum values**:

```json
B,S,BS,SS,F,D,W,DR,CR,V,I,DV,DX,DS,SP,F,FU,DL,MO,MC,SPF,SPFO,DC,DY,DF,D,W,DR,CR
```

**Example**:

```json
B
```

* * *

### enum-transaction-create-type :id=schemasenum-transaction-create-type
**Type**: <code>String</code>

>Single letter codes for transaction types (e.g. B for BUY, S for SELL; see \&quot;Appendicies &gt; Enumerations\&quot; in SDK documentation for more info) which can be created by a consumer (this is a subset of the  &quot;enum-transaction-type&quot; component).

**Enum values**:

```json
B,S,BS,SS,F,D,W,V,I
```

**Example**:

```json
B
```

* * *

### service-metadata :id=schemasservice-metadata
**Type**: <code>Object</code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| server | [<code>service-metadata-server</code>](#schemasservice-metadata-server) | false | false |  |
| user | [<code>service-metadata-user</code>](#schemasservice-metadata-user) | false | false |  |
| context | [<code>service-metadata-context</code>](#schemasservice-metadata-context) | false | false |  |


**Example**:

```json
{
  "server": {
    "name": "barchart/portfolio-private-api-main",
    "description": "API for Barchart Portfolio Service",
    "environment": "prod",
    "semver": "5.6.1"
  },
  "user": {
    "id": "me"
  },
  "context": {
    "id": "BARCHART"
  }
}
```

* * *

### service-metadata-context :id=schemasservice-metadata-context
**Type**: <code>Object</code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| id | <code>String</code> | false | false |  |


**Example**:

```json
{
  "id": "BARCHART"
}
```

* * *

### service-metadata-server :id=schemasservice-metadata-server
**Type**: <code>Object</code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| name | <code>String</code> | false | false |  |
| description | <code>String</code> | false | false |  |
| environment | <code>String</code> | false | false |  |
| semver | <code>String</code> | false | false |  |


**Example**:

```json
{
  "name": "barchart/portfolio-private-api-main",
  "description": "API for Barchart Portfolio Service",
  "environment": "prod",
  "semver": "5.6.1"
}
```

* * *

### service-metadata-user :id=schemasservice-metadata-user
**Type**: <code>Object</code>

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| id | <code>String</code> | false | false |  |


**Example**:

```json
{
  "id": "me"
}
```

* * *

## Security

### JWT :id=securityjwt

>

**Type**: http bearer

#### Headers
| Name | Format | Example |
| ---- | ------ | ------- |
| Authorization | JWT | Authorization: Bearer <code>&lt;Token&gt;</code> |

* * *


