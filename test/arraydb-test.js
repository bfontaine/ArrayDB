var chai    = require( 'chai' ),
    mocha   = require( 'mocha' ),
    ArrayDB = require( __dirname + '/../src/arraydb' ).ArrayDB,
    expect  = chai.expect,
    should  = chai.should;

describe( 'ArrayDB objects', function() {

    it( 'should not be Arrays objects', function() {

        var a = new ArrayDB();

        expect( a ).not.to.be.a( 'array' );

    });

    it( 'should inherit Arrays\' properties', function() {

        var a = new ArrayDB();

        expect( a.constructor ).to.equal( Array );
        expect( a.length ).to.equal( 0 );
        a.push( 2 );
        expect( a.length ).to.equal( 1 );

    });

    it( 'can be initialized with an array', function() {

        var a = new ArrayDB([ 1, 2, 'foo' ]);

        expect( a.length ).to.equal( 3 );
        expect( a[0] ).to.equal( 1 );
        expect( a[1] ).to.equal( 2 );
        expect( a[2] ).to.equal( 'foo' );

    });

    it( 'can be initialized with a set of arguments', function() {

        var a = new ArrayDB( 1, 2, 'foo' ),
            b = new ArrayDB( [], [] );

        expect( a.length ).to.equal( 3 );
        expect( b.length ).to.equal( 2 );
        expect( a[0] ).to.equal( 1 );
        expect( a[1] ).to.equal( 2 );
        expect( a[2] ).to.equal( 'foo' );

    });

    describe('.query method', function() {

        it( 'should be a function', function() {

            var a = new ArrayDB();

            expect( a.query ).to.be.a( 'function' );

        });

        it( 'should return an array', function() {

            var a = new ArrayDB();

            expect( a.query() ).to.be.a( 'array' );
            expect( a.query([]) ).to.be.a( 'array' );
            expect( a.query({}) ).to.be.a( 'array' );
            expect( a.query(0) ).to.be.a( 'array' );
            expect( a.query(NaN) ).to.be.a( 'array' );
            expect( a.query(true) ).to.be.a( 'array' );

        });

        it( 'should works without Array#filter', function() {

            var a = new ArrayDB( 1, 2, 3 ),

                _filter = Array.prototype.filter;

            Array.prototype.filter = null;

            expect( a.query( 42 ) ).to.deep.equal( [] );

            Array.prototype.filter = _filter;

        });

        it( 'should be empty if the query is empty', function() {

            var a = new ArrayDB(),
                b = new ArrayDB([]),
                c = new ArrayDB( 1, 2, 3 );

            expect( a.query() ).to.deep.equal( [] );
            expect( b.query() ).to.deep.equal( [] );
            expect( c.query() ).to.deep.equal( [] );

        });

        it( 'should limit the results count if the `limit` param is set',
            function() {

            var a = new ArrayDB( 1, 1, 1, 2, 12, 1, 5 );

            expect( a.query( 1, 2 ).length ).to.equal( 2 );
            expect( a.query({ query: 1, limit: 2 }).length ).to.equal( 2 );

        });

        it( 'should slice the results if the `offset` param is set',
            function() {

            var a = new ArrayDB( 1, 1, 1, 2, 12, 1, 5 );

            expect( a.query( 1, 10, 1 ).length ).to.equal( 3 );
            expect( a.query({ query: 1, offset: 1 }).length ).to.equal( 3 );

        });

        it( 'should work without Array#filter', function() {

            var a = new ArrayDB( 42, 'something', [], 42, 78 ),
                f = Array.prototype.filter;

            Array.prototype.filter = null;

            expect( a.query( 42 ).length ).to.equal( 2 );
            expect( a.query( 42, 1 ).length ).to.equal( 1 );
            expect( a.query( 42, 3, 1 ).length ).to.equal( 1 );

            expect( a.query({ query: 42 }).length ).to.equal( 2 );
            expect( a.query({ query: 42, limit: 1 }).length ).to.equal( 1 );
            expect( a.query({ query: 42, offset: 1 }).length ).to.equal( 1 );

            Array.prototype.filter = f;

        });

        describe( 'in strict mode', function() {

            it( 'should match only elements of the same type', function() {

                var a = new ArrayDB( 2, '2', [2], true );

                expect( a.query({
                    query: 2, strict: true }).length ).to.equal( 1 );
                expect( a.query({
                    query: '2', strict: true }).length ).to.equal( 1 );
                expect( a.query({
                    query: [2], strict: true }).length ).to.equal( 1 );
                expect( a.query({
                    query: true, strict: true }).length ).to.equal( 1 );

            });

            it( 'should match booleans if they are the same values',
                function() {

                var a = new ArrayDB( false, true, 1, false );

                expect( a.query({
                    query: true, strict: true }).length ).to.deep.equal( 1 );

                expect( a.query({
                    query: false, strict: true }).length ).to.deep.equal( 2 );

            });

            it( 'should match null values if they are the same', function() {

                var a = new ArrayDB( null, 'null', false );

                expect( a.query({
                    query: null, strict: true }).length ).to.equal( 1 );

            });

            it( 'should match undefined values if they are the same', function() {

                var a = new ArrayDB( undefined, 'undefined' );

                expect( a.query({
                    query: undefined, strict: true }).length ).to.equal( 1 );

            });

            it( 'should not match undefined values with an empty query',
                function() {

                var a = new ArrayDB( undefined, 'undefined' );

                expect( a.query({ strict: true }).length ).to.equal( 0 );

            });

            it( 'should match regexp values if they are the same', function() {

                var a = new ArrayDB( /foo*bar/, /foo\*bar/, /foo*bar/g,
                                     'foo*bar', 'foobar' );

                expect( a.query({
                    query: /foo*bar/, strict: true }).length ).to.equal( 1 );

            });

            it( 'should match number values if they are the same', function() {

                var a = new ArrayDB( 1, 2, -Infinity, Infinity, 0, 2, 0.1 );

                expect( a.query({ query: 2, strict: true }).length ).to.equal( 2 );
                expect( a.query({
                    query: Infinity, strict: true }).length ).to.equal( 1 );
                expect( a.query({
                    query: 0.1, strict: true }).length ).to.equal( 1 );

            });

            it( 'should match NaN values if they are the same', function() {

                var a = new ArrayDB( NaN, 42, NaN, 'NaN', ['a'] );

                expect( a.query({
                    query: NaN, strict: true }).length ).to.equal( 2 );

            });

            it( 'should match string values if they are the same', function() {

                var a = new ArrayDB( 'foo', 'foo\n', 'FOO' );

                expect( a.query({
                    query: 'FOO', strict: true }).length ).to.equal( 1 );

            });

            it( 'should match function values '
               + 'if their string values are the same', function() {

                   var f = function f() { return 2+2; },
                       g = function g() { return 2+2; },
                       h = function f() { return 2+2; },
                       i = function f() { return 2+3; },

                       a = new ArrayDB( f, g, h, i );

                   expect( a.query({
                       query: f, strict: true }).length ).to.equal( 2 );

            });

            it( 'should match array values if their elements match', function() {

                var a = [ [[ 1 ]], [ 3, 2 ], true, 'NaN' ],
                    b = [  [ 1 ],  [ 3, 2 ], true, 'NaN' ],
                    c = [ [[ 1 ]], [ 3, 3 ], 1, 'NaN' ],

                    d = new ArrayDB( a, b, c );

                expect( d.query({
                    query: a.slice(), strict: false }) ).to.deep.equal([ a ]);

            });

            it( 'should not match object values '
              + 'if they don\'t have the same properties', function() {

                var o = { foo: 1, bar: 2 },
                    p = {},

                    a = new ArrayDB( o, p );

                expect( a.query({
                    query: { moo: 2 }, strict: false }).length ).to.equal( 0 );

            });

            it( 'should match object values '
              + 'if their mutual properties have the same values', function() {

                var o = { foo: [ 2 ], bar: { a: 2 }, moo: NaN },
                    p = { bar: { a: 2, b: 4 } },
                    q = { moo: NaN, barfoo: 42 },

                    a = new ArrayDB( o, p, q );

                expect( a.query({
                    query: {}, strict: true }).length ).to.equal( 3 );
                expect( a.query({
                    query: { bar: { a: 2 } },
                    strict: true }).length ).to.equal( 2 );

            });
    
        });

        describe( 'in non-strict mode', function() {

            it( 'should match null values if they are the same', function() {

                var a = new ArrayDB( null, 'null', false );

                expect( a.query({
                    query: null, strict: false }).length ).to.equal( 1 );

            });

            it( 'should match undefined values if they are the same', function() {

                var a = new ArrayDB( undefined, 'undefined' );

                expect( a.query({
                    query: undefined, strict: false }).length ).to.equal( 1 );

            });

            it( 'should not match undefined values with an empty query',
                function() {

                var a = new ArrayDB( undefined, 'undefined' );

                expect( a.query({ strict: false }).length ).to.equal( 0 );

            });

            it( 'should not match regexp values', function() {

                var a = new ArrayDB( /foo*bar/, /foo\*bar/, /foo*bar/g );

                expect( a.query({
                    query: /foo*bar/, strict: false }).length ).to.equal( 0 );

            });

            it( 'should match regexp values and string values '
              + 'if the former match the latter', function() {

                var a = new ArrayDB( 'moo', 'foo', 'fooo', 'bar' );

                expect( a.query({
                    query: /^foo+/, strict: false }).length ).to.equal( 2 );

            });

            it( 'should match boolean with truthy and falsy values',
                function() {

                var a = new ArrayDB( false, 1, 0, true, '' );

                expect( a.query({
                    query: true, strict: false }).length ).to.equal( 2 );
                expect( a.query({
                    query: false, strict: false }).length ).to.equal( 3 );

            });

            it( 'should match NaN with non-numbers', function() {

                var a = new ArrayDB( 'foo', 42, ['a'], 1 );

                expect( a.query({
                    query: NaN,
                    strict: false }) ).to.deep.equal([ 'foo', ['a'] ]);

            });

            it( 'should match function values with other ones '
              + 'if the former called on the later returns a truthy value',
                function() {

                var gt2    = function( e ) { return e > 2; },
                    eq3    = function( e ) { return e == 3; },
                    truthy = function() { return 'foo'; },

                    a = new ArrayDB( 1, 2, 3, 4, 5, { foo: 2 }, { foo: 3 } );

                expect( a.query({
                    query: gt2, strict: false }).length ).to.equal( 3 );
                expect( a.query({
                    query: eq3, strict: false }).length ).to.equal( 1 );
                expect( a.query({
                    query: truthy, strict: false }).length ).to.equal( 7 );

                expect( a.query({
                    query: { foo: eq3 }, strict: false }).length ).to.equal( 1 );

            });

            it( 'should match string values if they are the same', function() {

                var a = new ArrayDB( 'foo', 'foo\n', 'FOO' );

                expect( a.query({
                    query: 'FOO', strict: false }).length ).to.equal( 1 );

            });

            it( 'should match array values if their elements match', function() {

                var a = [ [[ 1 ]], [ 3, 2 ], true, 'NaN' ],
                    b = [  [ 1 ],  [ 3, 2 ], true, 'NaN' ],
                    c = [ [[ 1 ]], [ 3, 3 ], 1, 'NaN' ],

                    d = new ArrayDB( a, b, c );

                expect( d.query({
                    query: a.slice(), strict: false }) ).to.deep.equal([ a ]);

            });

            it( 'should not match object values '
              + 'if they don\'t have the same properties', function() {

                var o = { foo: 1, bar: 2 },
                    p = {},

                    a = new ArrayDB( o, p );

                expect( a.query({
                    query: { moo: 2 }, strict: false }).length ).to.equal( 0 );

            });

            it( 'should match object values '
              + 'if their mutual properties have the same values', function() {

                var o = { foo: [ 2 ], bar: { a: 2 }, moo: NaN },
                    p = { bar: { a: 2, b: 4 } },
                    q = { moo: NaN, barfoo: 42 },

                    a = new ArrayDB( o, p, q );

                expect( a.query({
                    query: {}, strict: false }).length ).to.equal( 3 );
                expect( a.query({
                    query: { bar: { a: 2 } },
                    strict: false }).length ).to.equal( 2 );

            });

            it( 'should match number values if they are the same', function() {

                var a = new ArrayDB( 1, 2, -Infinity, Infinity, 0, 2, 0.1 );

                expect( a.query({ query: 2, strict: false }).length ).to.equal( 2 );
                expect( a.query({
                    query: Infinity, strict: false }).length ).to.equal( 1 );
                expect( a.query({
                    query: 0.1, strict: false }).length ).to.equal( 1 );

            });

        });

    });

});

describe( 'ArrayDB#monkeyPatch method', function() {

    it( 'should add a .query method on arrays', function() {
    
        var a = [];

        expect( a.query ).to.be.a( 'undefined' );
        ArrayDB.monkeyPatch();
        expect( a.query ).to.be.a( 'function' );
    
    });

});

describe( 'ArrayDB helpers', function() {

    it( 'should include an `any` function', function() {

        var a = new ArrayDB( [ 1, 2, 'foo' ],
                             [ 1, 3, 'foo' ],
                             [ 1, 3, 'bar' ] );

        expect( a.query({
            query: [ 1, ArrayDB.any, 'foo' ],
            strict: false }).length ).to.equal( 2 );

    });

    it( 'should include a `lt` function', function() { 

        var a = new ArrayDB( 1, 2, 3, 4 );

        expect( a.query({
            query: ArrayDB.lt( 3 ), strict: false }).length ).to.equal( 2 );

    });

    it( 'should include a `gt` function', function() {

        var a = new ArrayDB( 1, 2, 3, 4 );

        expect( a.query({
            query: ArrayDB.gt( 3 ), strict: false }).length ).to.equal( 1 );

    });

    it( 'should include a `le` function', function() {

        var a = new ArrayDB( 1, 2, 3, 4 );

        expect( a.query({
            query: ArrayDB.le( 3 ), strict: false }).length ).to.equal( 3 );

    });

    it( 'should include a `ge` function', function() {        

        var a = new ArrayDB( 1, 2, 3, 4 );

        expect( a.query({
            query: ArrayDB.ge( 3 ), strict: false }).length ).to.equal( 2 );

    });

    it( 'should include an `eq` function', function() {        

        var a = new ArrayDB( 1, 2, 3, 4 );
        
        expect( a.query({
            query: ArrayDB.eq( 3 ), strict: false }).length ).to.equal( 1 );
    
    });
    
    it( 'should include a `ne` function', function() {        

        var a = new ArrayDB( 1, 2, 3, 4 );

        expect( a.query({
            query: ArrayDB.ne( 3 ), strict: false }).length ).to.equal( 3 );
    
    });
        
});      
