## Request/Response Model

Regardless of whether you choose to use the SDK or directly communicate with the REST API over HTTP, interactions follow a basic [request-response model](https://en.wikipedia.org/wiki/Request%E2%80%93response).

## JavaScript Objects and JSON

Data is passed to the JavaScript SDK as JavaScript objects. Data is passed to the API as [JSON](https://en.wikipedia.org/wiki/JSON).

* [Schemas for JavaScript objects](/content/sdk/lib-data?id=schema)
* [Schemas for JSON documents](/content/api_reference?id=schemas)

#### Custom Structures

In most cases, JavaScript object attribute values are common, garden-variety [primitive data types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#primitive_values) (e.g. strings, numbers, booleans, etc).  However, in some cases, custom-built data structures are used.

**Immutable Classes**

| Custom Data Type                                                | Purpose                                                           | Source Code                                                                                     |
|-----------------------------------------------------------------|-------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|
| [Day](/content/appendices/data_model_structures?id=day)         | Stores a date whose the time is unnecessary or irrelevant.        | [common-js/lang/Day](https://github.com/barchart/common-js/blob/master/lang/Day.js)             |
| [Decimal](/content/appendices/data_model_structures?id=decimal) | Allows arbitrary-precision calculations.                          | [common-js/lang/Decimal](https://github.com/barchart/common-js/blob/master/lang/Decimal.js)     |
| [Enum](/content/appendices/data_model_structures?id=enum)       | Restricts the set of all possible values to well-defined choices. | [common-js/lang/Enum](https://github.com/barchart/common-js/blob/master/lang/Enum.js)           |
| Timestamp                                                       | An immutable class that represents an exact moment in time.       | [common-js/lang/Timestamp](https://github.com/barchart/common-js/blob/master/lang/Timestamp.js) |

For more information about these custom data types, including sample code, see the following appendices:

* [Appendices: Data Model: Structures](/content/appendices/data_model_structures)
* [Appendices: Data Model: Enumerations](/content/appendices/data_model_enumerations)

#### Attribute Serialization

When using the SDK, custom data types are serialized (converted) into primitive JavaScript types before transmission to the backend. Conversely, when the SDK receives data from the backend, it deserializes primitive JavaScript types into these custom data types automatically. 

However, when using the API directly, you must encode data in the same way the custom data types are serialized:

* Days are represented as strings:
  * January 1st, 2022 as `"2022-01-01"`
  * December 31st, 2022 as `"2022-12-32"`
* Decimals are also represented as strings:
  * One hundred as `"100"`
  * Fifteen and a quarter as `"15.25"`

#### Attribute Ordering

Proprietary logic is used to convert JavaScript objects into JSON and vice versa. This logic expects the attributes within a JSON string to appear in a specific order. 

This requirement can be ignored with using the SDK. That's because the SDK handles serialization automatically. **However, when using the API directly, correct attribute ordering is your responsibility.** 

Consider the [schema for portfolio creation](/content/api/components?id=schemasportfolio-create). In the example below, the first JSON string is valid and the second is invalid, even though they both convey the same information. Again, _attribute ordering matters_.


```javascript
const validJson = '{"name":"My First Portfolio","timezone":"America/New_York","defaults":{"cash":false,"currency":"USD","reinvest":false}}';
const invalidJson = '{"timezone":"America/New_York","name":"My First Portfolio","defaults":{"cash":false,"currency":"USD","reinvest":false}}';
```


