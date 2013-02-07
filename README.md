# ArrayDB

[![Build Status](https://travis-ci.org/bfontaine/ArrayDB.png)](https://travis-ci.org/bfontaine/ArrayDB)

Use your arrays as DB tables, and make queries on them.

## Install

```
[sudo] npm install [-g] arraydb
```

## Usage

ArrayDB objects expose one method, `.query`, which use pattern-matching:

```js
var ArrayDB = require( 'arraydb' ).ArrayDB;

var a = new ArrayDB([

    { name: "Foo", age: 42 },
    { name: "Bar", age: 24 },
    { name: "Moo", age: 42 }

]);

a.query({ age: 42 }); // [ { name:"Foo", age:42 }, { name:"Moo",age:42} ]
```

It takes an object with the key below:

* `query` [Anything]: The query. Can be any JS value.
* `limit` [Number]: Optional (default to `Infinity`).
* `offset` [Number]: Optional (default to `0`).
* `reverse` [Boolean]: Optional (default to `false`). Reverse the query.
* `strict` [Boolean]: Optional (default to `true`). Define the matching mode of
  the query (see below).

You can also monkey-patch `Array` objects:

```js
var ArrayDB = require( 'arraydb' ).ArrayDB;

ArrayDB.monkeyPatch();

typeof [].query === 'function'; // true
```

### Strict mode

`.query` works in *strict* mode by default. In this mode, objects have to be
strictly equal to be matched. You can specify the mode using an object:

```js
var a = new ArrayDB( NaN, 'foo' );

a.query({ query: NaN }); // [ NaN ]
a.query({ query: NaN, strict: true }); // [ NaN ]
a.query({ query: NaN, strict: false }); // [ NaN, 'foo' ]
```

### Non-Strict mode

Non-strict mode provide some helpers to match elements:

* Regexps can be used to test strings
* Functions can be used to test anything
* Booleans match truthy (and falsy) elements
* `NaN` match any non-number (where `isNaN(element)` is true)

```js
var a = new ArrayDB(
    { age: 2, name: "Bar" },
    { age: 46, name: "Foo" },
    { name: "NoAge" }
);

// returns only objects with an `age` property
a.query({ query: { age: true }, strict: false });

// returns only names that start with "F"
a.query({ query: { name: /^F/ }, strict: false });
```

Also, `ArrayDB` provides some helpers:

* `.lt( e )`: match elements lesser than `e`
* `.gt( e )`: match elements greater than `e`
* `.le( e )`: match elements lesser than, or equal to `e`
* `.ge( e )`: match elements greater than, or equal to `e`
* `.eq( e )`: match elements equal to `e`
* `.ne( e )`: match elements that are not equal to `e`
* `.any()`: match anything

```js
var a = new ArrayDB(
    { name: "John Doe", age: 23 },
    { name: "Foo Bar", age: 12 },
    { name: "Bar Foo", age: 35 },
    { name: "Bar Moo", age: 42  }
);

// match only objects with a .age property greater than 18
a.query({ query: { age: ArrayDB.gt( 18 ) }, strict: false });

// match only objects with an .age property equal to 42
a.query({ query: { age: ArrayDB.eq( 42 ) }, strict: false });
```
