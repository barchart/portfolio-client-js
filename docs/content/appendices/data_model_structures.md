## Day

The [```@barchart/common-js/lang/Day```](https://github.com/barchart/common-js/blob/master/lang/Day.js) class is used to represent a "day" without consideration for time or timezone.

For example, let's say a dividend was paid on February 10, 2022. In that case, we use a ```Day``` instance.

> It would be incorrect to use more traditional time-aware structures like a [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) because we don't know the exact time the dividend is paid. Using a "[magic value](https://en.wikipedia.org/wiki/Magic_number_(programming))", like midnight, only increases the changes for misunderstandings and bugs. 

Here are some actual uses of the `Day` class:

* The ```date``` a transaction was executed.
* The ```date``` position snapshot is compiled.
* The ```effective``` date for a dividend or split.

Generally speaking, the Barchart Portfolio Service does not store times. When two transactions occur on the say day, ordering is controlled by ```sequence``` number — not by the time of day.

#### Using the SDK

The ```PortfolioGateway``` expects to receive ```Day``` instances as input (usually as attribute values of larger objects). Similarly, the ```PortfolioGateway``` will return ```Day``` instances as output (usually as attribute values of larger objects).

So, as you use the SDK, you'll need to create ```Day``` instances (e.g. when building a [```TransactionCreate```](/content/sdk/lib-data?id=schematransactioncreate) object).

```javascript
const Day = require('@barchart/common-js/lang/Day');

const date = new Day(2022, 2, 10); // February 10, 2022.

const transactionCreate = { date };
```

#### Using the API

For JSON serialization, ```Day``` instances are converted to ```string``` values using the ```YYYY-MM-DD``` format. Here's an example:

```json
{
  "date": "2022-02-10"
}
```

## Decimal
