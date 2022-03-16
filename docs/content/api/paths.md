# Paths

## GET /service 

> Returns the version number of the Barchart Portfolio Service along with the user identifier and context of the authorized user (of the JWT).

**Summary**: Returns the version and the authorized user

**Security**: 
[JWT](/content/api/components?id=securityJWT)
#### Responses

**Status Code**: 200

> An object describing the remote service and the authorized user.

**Content Type**: <code>application/json</code>

**Response Type:** [<code>service-metadata</code>](/content/api/components?id=schemasservice-metadata)

**Example**:

```
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

**Status Code**: 401 - [Unauthorized](/content/api/components?id=responsesunauthorized)

* * *

## POST /portfolios 

> Creates a new portfolio for the current user.

**Summary**: Creates a new portfolio.

**Security**: 
[JWT](/content/api/components?id=securityJWT)
#### Request Body

**Content Type**: application/json

**Type**: [<code>portfolio-create</code>](/content/api/components?id=schemasportfolio-create)

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

#### Responses

**Status Code**: 200

> The newly created portfolio.

**Content Type**: <code>application/json</code>

**Response Type:** [<code>portfolio</code>](/content/api/components?id=schemasportfolio)

**Example**:

```
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

**Status Code**: 400 - [SchemaError](/content/api/components?id=responsesschemaerror)

* * *

**Status Code**: 401 - [Unauthorized](/content/api/components?id=responsesunauthorized)

* * *

**Status Code**: 500 - [ServerError](/content/api/components?id=responsesservererror)

* * *

## GET /portfolios/{portfolio} 

> Returns one (or more) portfolios, owned by the current user. If the user has no portfolios, an empty array is returned.

**Summary**: Returns one (or more) portfolios, owned by the current user.

**Security**: 
[JWT](/content/api/components?id=securityJWT)
#### Path Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| portfolio | <code>String</code> | true | false | The identifier of the portfolio to retrieve. Use an asterisk (*) to retrieve all portfolios for the current user. |

#### Responses

**Status Code**: 200

> An array of portfolios (with zero, one, or many items).

**Content Type**: <code>application/json</code>

**Response Type:** [<code>Array&lt;portfolio&gt;</code>](/content/api/components?id=schemasportfolio)

**Example**:

```
[
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
]
```

* * *

**Status Code**: 401 - [Unauthorized](/content/api/components?id=responsesunauthorized)

* * *

**Status Code**: 500 - [ServerError](/content/api/components?id=responsesservererror)

* * *

## PUT /portfolios/{portfolio} 

> Updates a portfolio.

**Summary**: Updates a portfolio.

**Security**: 
[JWT](/content/api/components?id=securityJWT)
#### Path Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| portfolio | <code>String</code> | true | false | The identifier of the portfolio to update. |

#### Request Body

**Content Type**: application/json

**Type**: [<code>portfolio-update</code>](/content/api/components?id=schemasportfolio-update)

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

#### Responses

**Status Code**: 200

> The updated portfolio.

**Content Type**: <code>application/json</code>

**Response Type:** [<code>portfolio</code>](/content/api/components?id=schemasportfolio)

**Example**:

```
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

**Status Code**: 401 - [Unauthorized](/content/api/components?id=responsesunauthorized)

* * *

**Status Code**: 500 - [ServerError](/content/api/components?id=responsesservererror)

* * *

## DELETE /portfolios/{portfolio} 

> Deletes a portfolio and everything associated with the portoolio — including all positions, transactions, and summaries, etc.

**Summary**: Deletes a portfolio and everything associated with the portoolio — including all positions, transactions, and summaries, etc.

**Security**: 
[JWT](/content/api/components?id=securityJWT)
#### Path Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| portfolio | <code>String</code> | true | false | The identifier of the portfolio to delete. |

#### Responses

**Status Code**: 200

> Deletion of portfolio successful. No data is returned.

* * *

**Status Code**: 401 - [Unauthorized](/content/api/components?id=responsesunauthorized)

* * *

**Status Code**: 500 - [ServerError](/content/api/components?id=responsesservererror)

* * *

## GET /portfolios/{portfolio}/positions/{position} 

> Returns positions, optionally filtering for portfolio.

**Summary**: Returns positions, optionally filtering for portfolio.

**Security**: 
[JWT](/content/api/components?id=securityJWT)
#### Path Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| portfolio | <code>String</code> | true | false | The identifier of the portfolio which contains the positions to query. Use an asterisk (*) to retrieve all positions, regardless of portfolio. |
| position | <code>String</code> | true | false | The identifier the specific position to retrieve. Use an asterisk (*) to retrieve all positions. |

#### Responses

**Status Code**: 200

> An array of positions (with zero, one, or many items).

**Content Type**: <code>application/json</code>

**Response Type:** [<code>Array&lt;position&gt;</code>](/content/api/components?id=schemasposition)

**Example**:

```
[
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
```

* * *

**Status Code**: 401 - [Unauthorized](/content/api/components?id=responsesunauthorized)

* * *

**Status Code**: 500 - [ServerError](/content/api/components?id=responsesservererror)

* * *

## PUT /portfolios/{portfolio}/positions/{position} 

> Updates a position (e.g. defaults like automatic re-investment).

**Summary**: Updates a position.

**Security**: 
[JWT](/content/api/components?id=securityJWT)
#### Path Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| portfolio | <code>String</code> | true | false | The identifier of the portfolio to containing the position to update. |
| position | <code>String</code> | true | false | The identifier of the position to update. |

#### Request Body

**Content Type**: application/json

**Type**: [<code>position-update</code>](/content/api/components?id=schemasposition-update)

**Example**:

```json
{
  "portfolio": "6ce12dec-bba9-4bf3-b865-8a4eab6e43a3",
  "position": "96af2dc6-2236-4a82-84c2-bff969389e00",
  "cash": true,
  "reinvest": true
}
```

#### Responses

**Status Code**: 200

> The updated position.

**Content Type**: <code>application/json</code>

**Response Type:** [<code>position</code>](/content/api/components?id=schemasposition)

**Example**:

```
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

**Status Code**: 401 - [Unauthorized](/content/api/components?id=responsesunauthorized)

* * *

**Status Code**: 500 - [ServerError](/content/api/components?id=responsesservererror)

* * *

## DELETE /portfolios/{portfolio}/positions/{position} 

> Deletes a position and everything associated with the position — including all transactions, summaries, etc.

**Summary**: Deletes a position and everything associated with the position — including all transactions, summaries, etc.

**Security**: 
[JWT](/content/api/components?id=securityJWT)
#### Path Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| portfolio | <code>String</code> | true | false | The identifier of the portfolio to containing the position to delete. |
| position | <code>String</code> | true | false | The identifier of the position to delete. |

#### Responses

**Status Code**: 200

> Deletion of position successful. No data is returned.

* * *

**Status Code**: 401 - [Unauthorized](/content/api/components?id=responsesunauthorized)

* * *

**Status Code**: 500 - [ServerError](/content/api/components?id=responsesservererror)

* * *

## POST /portfolios/{portfolio}/positions/{position}/transactions 

> Creates a new transaction for the current user.

**Summary**: Creates a new new transaction

**Security**: 
[JWT](/content/api/components?id=securityJWT)
#### Path Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| portfolio | <code>String</code> | true | false | The identifier of the portfolio. |
| position | <code>String</code> | true | false | The identifier of the position to which the transaction will be added, use \"new\" to create a new position. |

#### Request Body

**Content Type**: application/json

**Type**: [<code>transaction-create</code>](/content/api/components?id=schemastransaction-create)

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

#### Responses

**Status Code**: 200

> An object listing the positions affected by the new transaction.

**Content Type**: <code>application/json</code>

**Response Type:** [<code>transaction-mutate-result</code>](/content/api/components?id=schemastransaction-mutate-result)

**Example**:

```
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

**Status Code**: 400 - [SchemaError](/content/api/components?id=responsesschemaerror)

* * *

**Status Code**: 401 - [Unauthorized](/content/api/components?id=responsesunauthorized)

* * *

**Status Code**: 500 - [ServerError](/content/api/components?id=responsesservererror)

* * *

## GET /portfolios/{portfolio}/positions/{position}/transactions/{seqeunce} 

> Returns transactions.

**Summary**: Returns transactions.

**Security**: 
[JWT](/content/api/components?id=securityJWT)
#### Path Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| portfolio | <code>String</code> | true | false | The identifier of the portfolio containing the transactions to retrieve. |
| position | <code>String</code> | true | false | The identifier of the position containing the transactions to retrieve. |
| seqeunce | <code>Number</code> | true | false | The sequence number of the transaction to retrieve (e.g. 1). Use an asterisk (*) to retrieve all transactions for the position. |

#### Responses

**Status Code**: 200

> An array of transactions (with zero, one, or many items).

**Content Type**: <code>application/json</code>

**Response Type:** [<code>Array&lt;transaction&gt;</code>](/content/api/components?id=schemastransaction)

**Example**:

```
[
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
]
```

* * *

**Status Code**: 400 - [SchemaError](/content/api/components?id=responsesschemaerror)

* * *

**Status Code**: 401 - [Unauthorized](/content/api/components?id=responsesunauthorized)

* * *

**Status Code**: 500 - [ServerError](/content/api/components?id=responsesservererror)

* * *

## PUT /portfolios/{portfolio}/positions/{position}/transactions/{seqeunce} 

> Edits a transaction (e.g. change dates, prices, quantities).

**Summary**: Edits a transaction.

**Security**: 
[JWT](/content/api/components?id=securityJWT)
#### Path Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| portfolio | <code>String</code> | true | false | The identifier of the portfolio containing the transaction to edit. |
| position | <code>String</code> | true | false | The identifier of the position containing the transaction to edit. |
| seqeunce | <code>Number</code> | true | false | The sequence number of the transaction to edit (e.g. 1). |

#### Request Body

**Content Type**: application/json

**Type**: [<code>transaction</code>](/content/api/components?id=schemastransaction)

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

#### Responses

**Status Code**: 200

> An object listing the positions affected by the transaction deletion.

**Content Type**: <code>application/json</code>

**Response Type:** [<code>transaction-mutate-result</code>](/content/api/components?id=schemastransaction-mutate-result)

**Example**:

```
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

**Status Code**: 401 - [Unauthorized](/content/api/components?id=responsesunauthorized)

* * *

**Status Code**: 500 - [ServerError](/content/api/components?id=responsesservererror)

* * *

## DELETE /portfolios/{portfolio}/positions/{position}/transactions/{seqeunce} 

> Deletes a transaction from a position.

**Summary**: Deletes a transaction from a position.

**Security**: 
[JWT](/content/api/components?id=securityJWT)
#### Path Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| portfolio | <code>String</code> | true | false | The identifier of the portfolio containing the transaction to delete. |
| position | <code>String</code> | true | false | The identifier of the position containing the transaction to delete. |
| seqeunce | <code>Number</code> | true | false | The sequence number of the transaction to delete (e.g. 1). |

#### Responses

**Status Code**: 200

> An object listing the positions affected by the transaction deletion.

**Content Type**: <code>application/json</code>

**Response Type:** [<code>transaction-mutate-result</code>](/content/api/components?id=schemastransaction-mutate-result)

**Example**:

```
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

**Status Code**: 401 - [Unauthorized](/content/api/components?id=responsesunauthorized)

* * *

**Status Code**: 500 - [ServerError](/content/api/components?id=responsesservererror)

* * *

## GET /portfolios/{portfolio}/positions/{position}/values 

> Returns a daily history of valuations for positions (or an entire portfolio).

**Summary**: Returns a daily history of valuations for positions (or an entire portfolio).

**Security**: 
[JWT](/content/api/components?id=securityJWT)
#### Path Parameters

| Name | Type | Required | Nullable | Description |
| ---- | ---- | -------- | -------- | ----------- |
| portfolio | <code>String</code> | true | false | The identifier of the portfolio. |
| position | <code>String</code> | true | false | The identifier a specific position. Use an asterisk (*) to retrieve all positions, resulting in the valuation of the entire portfolio. |

#### Responses

**Status Code**: 200

> An array of valuations (with zero, one, or many items).

**Content Type**: <code>application/json</code>

**Response Type:** [<code>misc-valuation-container</code>](/content/api/components?id=schemasmisc-valuation-container)

**Example**:

```
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

**Status Code**: 401 - [Unauthorized](/content/api/components?id=responsesunauthorized)

* * *

**Status Code**: 500 - [ServerError](/content/api/components?id=responsesservererror)

* * *

