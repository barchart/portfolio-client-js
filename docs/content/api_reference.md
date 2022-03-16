# API Reference

## Portfolio API 3.7.0 {docsify-ignore}
    
> Portfolio API

## OpenAPI Definition {docsify-ignore}

[Download](static/openapi.yaml)

## Contents {docsify-ignore}

* [Servers](#Servers)
* [Components](#Components)
* [Paths](#Paths)

## Servers {docsify-ignore}

* [https://portfolio-test.aws.barchart.com/v1](https://portfolio-test.aws.barchart.com/v1)  - Hostname for test environment.
* [https://portfolio.aws.barchart.com/v1](https://portfolio.aws.barchart.com/v1)  - Hostname for production environment.

## Components {docsify-ignore}

### Responses 

* [Unauthorized](/content/api/components?id=responsesUnauthorized)
* [SchemaError](/content/api/components?id=responsesSchemaError)
* [ServerError](/content/api/components?id=responsesServerError)

### Schemas 

* [portfolio](/content/api/components?id=schemasportfolio)
* [portfolio-create](/content/api/components?id=schemasportfolio-create)
* [portfolio-update](/content/api/components?id=schemasportfolio-update)
* [portfolio-defaults](/content/api/components?id=schemasportfolio-defaults)
* [position](/content/api/components?id=schemasposition)
* [position-update](/content/api/components?id=schemasposition-update)
* [position-instrument](/content/api/components?id=schemasposition-instrument)
* [position-snapshot](/content/api/components?id=schemasposition-snapshot)
* [transaction](/content/api/components?id=schemastransaction)
* [transaction-reference](/content/api/components?id=schemastransaction-reference)
* [transaction-extension-for-trade](/content/api/components?id=schemastransaction-extension-for-trade)
* [transaction-extension-for-dividend](/content/api/components?id=schemastransaction-extension-for-dividend)
* [transaction-extension-for-split](/content/api/components?id=schemastransaction-extension-for-split)
* [transaction-create](/content/api/components?id=schemastransaction-create)
* [transaction-create-instrument](/content/api/components?id=schemastransaction-create-instrument)
* [transaction-mutate-result](/content/api/components?id=schemastransaction-mutate-result)
* [transaction-mutate-result-positions](/content/api/components?id=schemastransaction-mutate-result-positions)
* [misc-symbols](/content/api/components?id=schemasmisc-symbols)
* [misc-valuation-container](/content/api/components?id=schemasmisc-valuation-container)
* [misc-valuation](/content/api/components?id=schemasmisc-valuation)
* [enum-currency](/content/api/components?id=schemasenum-currency)
* [enum-instrument-type](/content/api/components?id=schemasenum-instrument-type)
* [enum-position-direction](/content/api/components?id=schemasenum-position-direction)
* [enum-transaction-type](/content/api/components?id=schemasenum-transaction-type)
* [enum-transaction-create-type](/content/api/components?id=schemasenum-transaction-create-type)
* [service-metadata](/content/api/components?id=schemasservice-metadata)
* [service-metadata-context](/content/api/components?id=schemasservice-metadata-context)
* [service-metadata-server](/content/api/components?id=schemasservice-metadata-server)
* [service-metadata-user](/content/api/components?id=schemasservice-metadata-user)

### Security 

* [JWT](/content/api/components?id=securityJWT)


## Paths {docsify-ignore}

* [GET /service](/content/api/paths?id=get-service)
* [POST /portfolios](/content/api/paths?id=post-portfolios)
* [GET /portfolios/{portfolio}](/content/api/paths?id=get-portfoliosportfolio)
* [PUT /portfolios/{portfolio}](/content/api/paths?id=put-portfoliosportfolio)
* [DELETE /portfolios/{portfolio}](/content/api/paths?id=delete-portfoliosportfolio)
* [GET /portfolios/{portfolio}/positions/{position}](/content/api/paths?id=get-portfoliosportfoliopositionsposition)
* [PUT /portfolios/{portfolio}/positions/{position}](/content/api/paths?id=put-portfoliosportfoliopositionsposition)
* [DELETE /portfolios/{portfolio}/positions/{position}](/content/api/paths?id=delete-portfoliosportfoliopositionsposition)
* [POST /portfolios/{portfolio}/positions/{position}/transactions](/content/api/paths?id=post-portfoliosportfoliopositionspositiontransactions)
* [GET /portfolios/{portfolio}/positions/{position}/transactions/{seqeunce}](/content/api/paths?id=get-portfoliosportfoliopositionspositiontransactionsseqeunce)
* [PUT /portfolios/{portfolio}/positions/{position}/transactions/{seqeunce}](/content/api/paths?id=put-portfoliosportfoliopositionspositiontransactionsseqeunce)
* [DELETE /portfolios/{portfolio}/positions/{position}/transactions/{seqeunce}](/content/api/paths?id=delete-portfoliosportfoliopositionspositiontransactionsseqeunce)
* [GET /portfolios/{portfolio}/positions/{position}/values](/content/api/paths?id=get-portfoliosportfoliopositionspositionvalues)
