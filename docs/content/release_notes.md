# Release Notes

## 5.2.0
**New Features**

* Added official documentation, which has been published at [docs.barchart.com/portfolio](https://docs.barchart.com/portfolio).
* Updated [JSDoc](https://jsdoc.app/) extensively (in support of official documentation).
* Updated the ```PortfolioGateway.readPositionValuations``` function signature, adding a third parameter called ```parse```.

**Bug Fixes**

* Removed the `PortfolioGateway.importPorfolios` function. This function was incomplete and does not appear to have been used by any consumers.
* Removed the `PortfolioGateway.querySymbol` function. Again, this function was incomplete and does not appear to have been used by any consumers.

**Other**

* Switched GitHub repository to public visibility.
* Switched NPM package to public visibility.

## 5.1.2
**Other**

* Added an `.npmignore` file, which reduces the size of the published package.

## 5.1.1
**Technical Enhancements**

* Updated `barchart/common-js` to the v4.9.0.
* Updated `gulp` script.

## 5.1.0
**New Features**

* Added `PortfolioGateway.switchTransaction` function, allowing the reinvestment choice for a single dividend or distribution to be changed.
* Added `readPositionValuationsAvailability` method.

**Other**

* Removed legacy `observeValuationsForPortfolio` and `observeValuationsForPositions` methods.


## 5.0.1
**Other**

* Corrected internal implementation of SDK to address breaking changes to remote API.

## 4.1.0
**New Features**

* Added `sequence` parameter for the `readTransactions` function.


## 4.0.0
**Breaking Changes**

* Renamed ```PortfolioGateway.readPositionsValues``` function to ```PortfolioGateway.readPositionValuations```.
* Renamed ```PortfolioGateway.readMarketValue``` function to ```PortfolioGateway.queryPositionValuations```.
* Renamed ```PortfolioGateway.observePositionCalculating``` function to ```PortfolioGateway.observeValuationsForPosition```.
* Renamed ```PortfolioGateway.observePortfolioCalculating``` function to ```PortfolioGateway.observeValuationsForPortfolio```.

## 3.4.1
**Bug Fixes**

* Fixed ```PortfolioGateway.readMarketValue``` function.


## 3.4.0
**New Features**

* Added ```PortfolioGateway.readMarketValue``` function.


## 3.3.0
**New Features**

* Added optional ```product``` argument to the ```PortfolioGateway``` constructor.


## 3.2.0
**New Features**

* Added ```PortfolioGateway.queryPositionsForSymbol``` function.

## 3.1.0
**New Features**

* Added ```JwtProvider.forAdmin``` function.

## 3.0.0
**Breaking Changes**

* Changed mechanism for passing JSON Web Tokens to the ```PortfolioGateway```. Consumers are now required to provide ```JwtProvider``` instances instead of a ```RequestInterceptor``` instances. Here are the specifics:
  * The ```RequestInterceptor``` argument was replaced with a ```JwtProvider``` argument on static factory functions (e.g. ```PortfolioGateway.forProduction```).
  * The ```RequestInterceptor``` argument was removed from the ```PortfolioGateway``` constructor.
  * The ```PortfolioGateway.start``` function was renamed to ```PortfolioGateway.connect``` and now has a ```JwtProvider``` argument.
  * The ```JwtGateway``` and ```JwtEndpoint``` classes were removed.
  * Static factory functions for impersonating users in the ```test``` and ```development``` environments were added. See ```JwtProvider.forTest``` and ```JwtProvider.forDevelopment```.
* Removed ```PortfolioGateway.batchTransactions``` function.
