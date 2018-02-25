# @barchart/portfolio-client-js
## JavaScript library for interfacing with Barchart's Portfolio API

## Documentation

The code is documented with [JSDoc](http://usejsdoc.org/). While the output hasn't been committed to source control, you can generate the documentation by using the following commands:

    > npm install
    > gulp document


## Development

Gulp is used to check "linting" and to run unit tests.

    > nvm use 6.10.1
    > npm install
    > gulp lint
    > gulp test


## Build

Polyfills for ES6 are required:

* Promise