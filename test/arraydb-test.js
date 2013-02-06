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

            it( 'should match functions values '
              + 'if their string values are the same', function() {

                var f = function f() { return 2+2; },
                    g = function g() { return 2+2; },
                    h = function f() { return 2+2; },
                    i = function f() { return 2+3; },

                    a = new ArrayDB( f, g, h, i );

                expect( a.query({
                    query: f, strict: true }).length ).to.equal( 2 );

          });

        // TODO arrays & objects
    
        });

        // TODO in non-strict mode

    });

});
