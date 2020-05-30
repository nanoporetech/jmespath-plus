![Node.js CI](https://github.com/nanoporetech/jmespath-plus/workflows/Node.js%20CI/badge.svg?branch=master)

# @metrichor/jmespath-plus


@metrichor/jmespath-plus extends [@metrichor/jmespath](https://www.npmjs.com/package/@metrichor/jmespath) with all `lodash` functions and a few extra typed functions.

JMESPath is a query language for JSON. It will take a JSON document
as input and transform it into another JSON document
given a JMESPath expression.

Where this library departs is by adding a number of extra functions to the JMESPath expressions that are helpful if you require more powerful JSON transforms of simpler expressions.

## INSTALLATION

```
npm install @metrichor/jmespath-plus
```

## EXTENDED FUNCTIONS

- All builtin functions described in the [JMESPath spec](https://jmespath.org/specification.html#built-in-functions)
- ** ALL `LODASH` FUNCTIONS ** - see [CAVEAT](#CAVEAT) below
- Custom functions:
  - mean - Calculate the mean/average of an array of numbers
  - mode - Calculate the most common number in an array of numbers
  - median - Calculate the middle value from an array of numbers
  - toFixed - Set the precision of a float
  - formatNumber - Format a number with units at a set precision
  - uniq - De-duplicate a list of values
  - mod - Calculate the modulus of two numbers
  - divide - Divide two numbers
  - split - Split a string on a given character or character sequence
  - entries - Flatten a hash into key, value tuples
  - format - Format a string given a template and input values (array/object)
  - flatMapValue - Flatten all values in a object into key, value tuples
  - toUpperCase - Uppercase (locale based) all characters in a string
  - toLowerCase - Lowercase (locale based) all characters in a string
  - trim - Remove flanking whitespace from a string
  - groupBy - Group an array of objects by a value or expression
  - combine - Create an object from a tuple of key, value pairs (inverse of entries)


## CAVEAT

All lodash functions are registered as JMESPath function expressions **HOWEVER**:
1. They are prefixed with an `_` character to ensure no name clashes and overwrites for example the [lodash zip] function:

```tsx
/* In Javascript this looks as follows... */

_.zip(['a', 'b'], [1, 2], [true, false]);
// => [['a', 1, true], ['b', 2, false]]


/* In JMESPath however, this looks as follows... */

search([['a', 'b'], [1, 2], [true, false]], '_zip([0], [1], [2])')

// => [['a', 1, true], ['b', 2, false]]

```

2. **`THEY WON'T ALL WORK!!!!`**

Some lodash functions require predicates as arguments that are JS functions. This is obviously not possible to express in a JMESPath expression. `lodash` functions are also untyped as they have been registered in the most generic way possible. `lodash` support is merely a convenience and "proper" JMESPath function extensions will be added over time as use cases arise.


## USAGE

### `search(data: JSONValue, expression: string): JSONValue`

```javascript
/* using ES modules */
import { search } from '@metrichor/jmespath-plus';


/* using CommonJS modules */
const search = require('@metrichor/jmespath-plus').search;


search({foo: {bar: {baz: [0, 1, 2, 3, 4]}}}, "foo.bar.baz[2]")

// OUTPUTS: 2

```

In the example we gave the `search` function input data of
`{foo: {bar: {baz: [0, 1, 2, 3, 4]}}}` as well as the JMESPath
expression `foo.bar.baz[2]`, and the `search` function evaluated
the expression against the input data to produce the result `2`.

The JMESPath language can do *a lot* more than select an element
from a list.  Here are a few more examples:

```javascript
import { search } from '@metrichor/jmespath-plus';

/* --- EXAMPLE 1 --- */

let JSON_DOCUMENT = {
  foo: {
    bar: {
      baz: [0, 1, 2, 3, 4]
    }
  }
};

search(JSON_DOCUMENT, "foo.bar");
// OUTPUTS: { baz: [ 0, 1, 2, 3, 4 ] }


/* --- EXAMPLE 2 --- */

JSON_DOCUMENT = {
  "foo": [
    {"first": "a", "last": "b"},
    {"first": "c", "last": "d"}
  ]
};

search(JSON_DOCUMENT, "foo[*].first")
// OUTPUTS: [ 'a', 'c' ]


/* --- EXAMPLE 3 --- */

JSON_DOCUMENT = {
  "foo": [
    {"age": 20},
    {"age": 25},
    {"age": 30},
    {"age": 35},
    {"age": 40}
  ]
}

search(JSON_DOCUMENT, "foo[?age > `30`]");
// OUTPUTS: [ { age: 35 }, { age: 40 } ]
```


### `registerFunction(functionName: string, customFunction: RuntimeFunction, signature: InputSignature[]): void`

Extend the list of built in JMESpath expressions with your own functions.

```javascript
  import {search, registerFunction, TYPE_NUMBER} from '@metrichor/jmespath-plus'


  search({ foo: 60, bar: 10 }, 'divide(foo, bar)')
  // THROWS ERROR: Error: Unknown function: divide()

  registerFunction(
    'divide', // FUNCTION NAME
    (resolvedArgs) => {   // CUSTOM FUNCTION
      const [dividend, divisor] = resolvedArgs;
      return dividend / divisor;
    },
    [{ types: [TYPE_NUMBER] }, { types: [TYPE_NUMBER] }] //SIGNATURE
  );

  search({ foo: 60,bar: 10 }, 'divide(foo, bar)');
  // OUTPUTS: 6

```

### `compile(expression: string): ExpressionNodeTree`

You can precompile all your expressions ready for use later on. the `compile`
function takes a JMESPath expression and returns an abstract syntax tree that
can be used by the TreeInterpreter function


## More Resources

The example above only show a small amount of what
a JMESPath expression can do. If you want to take a
tour of the language, the *best* place to go is the
[JMESPath Tutorial](http://jmespath.org/tutorial.html).

One of the best things about JMESPath is that it is
implemented in many different programming languages including
python, ruby, php, lua, etc.  To see a complete list of libraries,
check out the [JMESPath libraries page](http://jmespath.org/libraries.html).

And finally, the full JMESPath specification can be found
on the [JMESPath site](http://jmespath.org/specification.html).
