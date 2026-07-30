**This SDK connects your applications to the _Barchart Portfolio Service_ — a robust tool for building and tracking investment portfolios.**

Using the Portfolio Service, your applications can:

* Create unlimited portfolios
* Enter, edit, and delete individual transactions (e.g. buy stock)
* Monitor position and portfolio performance
* Track cash positions, with support for multiple currencies
* Automatically apply corporate actions to positions (e.g. dividends and splits)
* Generate monthly and yearly performance reports

## Rich User Experiences

You can combine the Portfolio Service with additional [Barchart Solutions](https://www.barchart.com/solutions) to build powerful and engaging products:

* Add [streaming market data](https://www.barchart.com/solutions/services/stream) quotes to your portfolios (and track performance in real time).
* Add rich [charting](https://www.barchart.com/solutions/services/digital/charting) with live updates to your portfolios.
* Add [fundamental data](https://www.barchart.com/ondemand) to your portfolios.
* Add news articles from major news services to your portfolios.

Here is a simple single-page web application:

![Web Application](images/portfolio_ui_web.png)

## Demo Application

You can access a demo application, built with the Portfolio Service and other, related Barchart services at:

> https://demo.barchart.com/portfolio

Obviously, this demo application represents only _one possible UI concept_ for portfolio applications. Use the Barchart Portfolio Service as the foundation for your tools and the possibilities for interactive and engaging user experiences are endless.

## Supported Environments

This SDK provides a convenient way to interact with the Portfolio Service. We recommend using it in JavaScript environments.

#### Web Browsers

This SDK can be distributed as part of your browser-based applications. The source code is written in [ES2018](https://en.wikipedia.org/wiki/ECMAScript#9th_Edition_%E2%80%93_ECMAScript_2018). Consequently, transpilation (or polyfill use) is recommended before distribution.

#### Node.js

This SDK is compatible with Node.js.

#### Direct Access

The Portfolio Service implements a REST interface via HTTP. You may choose to interact with the remote service directly, bypassing this SDK entirely. An [OpenAPI](https://www.openapis.org/) specification of the interface can be found in the [API Reference](/content/api_reference) section.

#### Other

If JavaScript isn't suitable for your environment, and you're not interested in direct access, please contact us at solutions@barchart.com or (866) 333-7587.

## User Privacy

Privacy is important to Barchart. We do not wish to transmit or collect personally identifiable information about your users. We encourage users of the Portfolio Service to avoid sharing identifying information.

Here's how:

* Each portfolio has an owner. Therefore, you **must** provide Barchart with unique user identifiers. However, these identifiers can be **meaningless** — other than to differentiate one user from another. [Universally Unique Identifiers](https://en.wikipedia.org/wiki/Universally_unique_identifier) are commonly used for this purpose.
* Each request to Barchart is authorized using JWT technology. You generate "tokens" and the Barchart verifies their authenticity. The tokens provide security; however they do not contain any sensitive information (e.g. passwords). You can read more about this in the [Key Concepts: Security](/content/concepts/security) section of the documentation.
