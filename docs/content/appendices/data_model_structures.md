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

const txCreate = { };

txCreate.date = new Day(2022, 2, 10); // February 10, 2022
```

#### Using the API

For JSON serialization, ```Day``` instances are converted to ```string``` values using the ```YYYY-MM-DD``` format. Here's an example:

```json
{
  "date": "2022-02-10"
}
```

## Decimal

Mathematical operations involving money must be accurate — to the penny. However, since JavaScript uses [floating point numbers](https://en.wikipedia.org/wiki/IEEE_754), some decimal values cannot be represented — leading to potentially confusing results.

Here's a classic example, using Node.js; however, the same concerns apply to the JavaScript execution engines used by modern web browsers:

```shell
% node
Welcome to Node.js v14.17.3.
Type ".help" for more information.
> 0.1 + 0.2
0.30000000000000004
```

Consequently, the JavaScript SDK uses a custom data structure to ensure the accuracy of decimal-based operations. Specifically, decimal values are represented using the [```@barchart/common-js/lang/Decimal```](https://github.com/barchart/common-js/blob/master/lang/Decimal.js) class. Here are some actual uses of the `Decimal` class:

* The unit ```price``` of a transaction.
* The ```quantity``` of a transaction.
* The aggregate size of an ```open``` position.

Any numeric value, used as input to (or output from) the SDK, will be an instance of the ```Decimal``` class. In the following example, the ```Decimal``` class is used to begin construction of a [```TransactionCreate```](/content/sdk/lib-data?id=schematransactioncreate) object:

```javascript
const Decimal = require('@barchart/common-js/lang/Decimal');

const txCreate = { };

txCreate.quantity = new Decimal(100); // from float
txCreate.quantity = new Decimal('100'); // from string
```

#### Using the API

For JSON serialization, ```Decimal``` instances are converted to ```string``` values for transmission to (or from) the Barchart Portfolio Service. Here's an example:

```json
{
  "quantity": "100"
}
```






