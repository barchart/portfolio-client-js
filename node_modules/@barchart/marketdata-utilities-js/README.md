# @barchart/marketdata-utilities-js
## JavaScript library for working with Barchart's DDF messages

This library provides common code for parsing and interpreting DDF messages (a proprietary, string-based protocol for market data). The library is intended for use in client (i.e. browser) and server (i.e. Node.js) environments. However, since the source code uses ES6, some assembly may be required for browser use (i.e. polyfills and transpilation).


### npm

To import the library as a dependency to your application using npm, use the following command:

	> npm install @barchart/marketdata-utilities-js -S


### Source control

The git repository is publicly-accessible (here)[https://github.com/barchart/marketdata-utilities-js].


## Documentation

(JSDoc)[http://usejsdoc.org/] is used to document the source code. HTML documentation can be generated (into a "docs" folder), as follows:

	> gulp document


## Unit Testing

Execute the (Jasmine)[https://jasmine.github.io/] unit tests, as follows:

	> gulp test