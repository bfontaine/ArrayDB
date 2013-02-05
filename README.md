ArrayDB
=======

[![Build Status](https://travis-ci.org/bfontaine/ArrayDB.png)](https://travis-ci.org/bfontaine/ArrayDB)

Use your arrays as DB tables, and make queries on them.

Install
-------

```
[sudo] npm install [-g] arraydb
```

Usage
-----

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

You can also monkey-patch `Array` objects:

```js
var ArrayDB = require( 'arraydb' ).ArrayDB;

ArrayDB.monkeyPatch();

typeof [].query === 'function'; // true
```
