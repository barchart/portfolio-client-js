# Barchart Portfolio Public

[![AWS CodeBuild](https://codebuild.us-east-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiM0hCbTN3M253WGFUUUpFcnk1RFZOSTdUcUZnOWJxbXltaEMvQ3JrcENZeWI0cFRDWlFidks2VFhNR3lHeHlBUVdOSjk5TDU5MWd1bE1abGtoc3p1NjFrPSIsIml2UGFyYW1ldGVyU3BlYyI6InZMalFMNG9pZ3E1ekxJSEciLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)](https://github.com/barchart/portfolio-public)

Public JavaScript packages for the Barchart Investor Portfolio.

### Packages

* [@barchart/portfolio-api-common](./packages/portfolio-api-common) — shared portfolio models, schemas, processing, and validation.
* [@barchart/portfolio-client-js](./packages/portfolio-client-js) — JavaScript SDK for communicating with the Portfolio Service.

### Development

Install dependencies:

```shell
yarn install
```

Run all checks:

```shell
yarn lint
yarn test
```

Package versions are managed together with Lerna.
