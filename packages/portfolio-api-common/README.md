# @barchart/portfolio-api-common

A *private* library of shared JavaScript code pertaining to the paper-trading portfolio system.

### Overview

Simply put, this project contains code that runs on both the servers (i.e. Serverless applications) and clients (e.g. browser, mobile, etc).

#### [Serialization](https://github.com/barchart/portfolio-api-common/tree/master/lib/serialization)

Data is passed between client and server in JSON format. However, the code works with more complex types.

For example, [Decimal](https://github.com/barchart/barchart-common-js/blob/master/lang/Decimal.js) instances are used in place of [native JavaScript floats](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number). [Day](https://github.com/barchart/barchart-common-js/blob/master/lang/Day.js) instances are used instead of [native JavaScript Dates](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date).

So, before data is sent, it must be converted to pure JSON. Conversely, when data is received, as pure JSON, its translated into more complex types before use. This is facilitated by the [Schema](https://github.com/barchart/barchart-common-js/blob/master/serialization/json/Schema.js) definitions which build custom "reviver" functions for [JSON parsing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse).

#### [Processing](https://github.com/barchart/portfolio-api-common/tree/master/lib/processing)

For reporting and display purposes, positions can be grouped together (by asset class, by portfolio, by user, etc). This code supports aggregation and gain/loss calculation. It is used by server-generated reports and dynamic user interfaces.

### Notable Consumers

* [aws-lambda-portfolio](https://github.com/barchart/aws-lambda-portfolio) - Serverless applications for maintaining paper-trading portfolios.
* [portfolio-client-js](https://github.com/barchart/portfolio-client-js) - JavaScript client SDK for consuming API of exposed by Serverless applications.
* [tgam-portfolio-ui-js](https://github.com/barchart/tgam-portfolio-ui-js) - A dynamic, single-page HTML application for managing paper-trading portfolios.

### Package Managers

This library has been published as a *private* module to NPM as [@barchart/portfolio-api-common](https://www.npmjs.com/package/@barchart/portfolio-api-common).

    > npm login
    > npm install @barchart/portfolio-api-common -S