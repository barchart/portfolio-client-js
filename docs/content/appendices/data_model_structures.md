## Day

The [```@barchart/common-js/lang/Day```](https://github.com/barchart/common-js/blob/master/lang/Day.js) class is used to represent a "day" without consideration for time or timezone.

For example, we use a ```Day``` instances indicate when dividend payments are made. We don't know the exact time payments will occur; we only know that payments will occur sometime over the course of the specified day.

> In many cases, use time-aware structures, like the JavaScript [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) class is less than ideal. Either an exact time is unknown or unimportant. Furthermore, use of "[magic values](https://en.wikipedia.org/wiki/Magic_number_(programming))", like midnight, can lead to misunderstandings and bugs. 

Here are some cases where the ```Day``` class is used by the Portfolio Service:

* The day a dividend was paid.
* The day a transaction was executed.
* The day a position "snapshot" was taken.

Generally speaking, the Barchart Portfolio Service does not store times. In some cases, a time is implied (e.g. "end of day").

#### Using the SDK

The SDK expects to receive ```Day``` instances as input (usually as attribute values). Similarly, the SDK will return ```Day``` instances as output (usually as attribute values).

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

Here's a classic example, using Node.js:

```shell
% node
Welcome to Node.js v14.17.3.
Type ".help" for more information.
> 0.1 + 0.2
0.30000000000000004
```

Consequently, the Portfolio Service uses a custom data structure to ensure the accuracy of decimal-based operations. Specifically, decimal values are stored as instances of the [```@barchart/common-js/lang/Decimal```](https://github.com/barchart/common-js/blob/master/lang/Decimal.js) class. Here are some usages, specific to the Portfolio Service:

* The unit ```price``` of a transaction.
* The ```quantity``` of a transaction.
* The aggregate size of an ```open``` position.


#### Using the SDK

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

## Enum

Many programming languages use the concept of an _enumeration_ to restrict an attribute's value to a limited set of choices. Unfortunately, native JavaScript does not include this concept.

To make up for this shortcoming, the [```@barchart/common-js/lang/Enum```](https://github.com/barchart/common-js/blob/master/lang/Enum.js) class is used throughout the Portfolio Service.

Here is a fictitious implementation:

```javascript
const Enum = require('@barchart/common-js/lang/Enum');

class PrimaryColor extends Enum {
	constructor(code, hex) {
		super(code, code);

		this._hex = hex;
	}

	get hex() {
		return this._hex;
	}
	
	static RED() {
		return red;
	}
	
	static GREEN() {
		return green;
	}
	
	static BLUE() {
		return blue;
	}
}

const red = new PrimaryColor('RED', '#ff0000');
const green = new PrimaryColor('GREEN', '#00ff00');
const blue = new PrimaryColor('BLUE', '#0000ff');
```

Portfolio-specific implementations, like ```TransactionType``` are described in the [Enumerations](/content/appendices/data_model_enumerations) appendix.

#### Using the SDK

For the purposes of the SDK, restricted attributes will use enumeration items. In the following example, the ```TransactionType``` class is used to construct part of a [```TransactionCreate```](/content/sdk/lib-data?id=schematransactioncreate) object:

```javascript
const TransactionType = require('@barchart/portfolio-api-common/lib/data/TransactionType');

const txCreate = { };

txCreate.type = TransactionType.BUY;
```

#### Using the API

For JSON serialization, ```Enum``` instances are converted to ```string``` values for transmission to (or from) the Barchart Portfolio Service. Here's an example:

```json
{
  "type": "B"
}
```








