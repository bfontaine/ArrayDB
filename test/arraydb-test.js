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

        var a = new ArrayDB( 1, 2, 'foo' );

        expect( a.length ).to.equal( 3 );
        expect( a[0] ).to.equal( 1 );
        expect( a[1] ).to.equal( 2 );
        expect( a[2] ).to.equal( 'foo' );


    });

    describe('’ .query method', function() {

        it( 'should be a function, taking 3 arguments', function() {

            var a = new ArrayDB();

            expect( a.query ).to.be.a( 'function' );
            expect( a.query.length ).to.be.equal( 3 );

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

        it( 'should be empty if the object is empty', function() {

            var a = new ArrayDB(),
                b = new ArrayDB([]),
                c = new ArrayDB( 1, 2, 3 );

            expect( a.query() ).to.deep.equal( [] );
            expect( b.query() ).to.deep.equal( [] );
            expect( c.query() ).to.deep.equal( [] );

        });

        it( 'should be empty if the query is empty', function() {

            var a = new ArrayDB( 1, 2, 3 );

            expect( a.query() ).to.deep.equal( [] );

        });

        it( 'should be empty if the query is not of '
          + 'the same type of any of the DB elements', function() {

            var a = new ArrayDB( 1, 2, 3 );

            expect( a.query( function(){} ) ).to.deep.equal( [] );
            expect( a.query( undefined ) ).to.deep.equal( [] );
            expect( a.query( true ) ).to.deep.equal( [] );
            expect( a.query( null ) ).to.deep.equal( [] );
            expect( a.query( /o/ ) ).to.deep.equal( [] );
            expect( a.query( {} ) ).to.deep.equal( [] );
            expect( a.query( [] ) ).to.deep.equal( [] );

        });

        it( 'should be empty if the `limit` is less than 1', function() {

            var a = new ArrayDB( 1, 2, 3 );

            expect( a.query( 2, 0 ) ).to.deep.equal( [] );

        });

        it( 'should be empty if the `offset` is equal or larger '
          + 'than the array size', function() {

            var a = new ArrayDB( 1, 2, 3 );

            expect( a.query( 2, 10, 3 ) ).to.deep.equal( [] );
            expect( a.query( 2, 10, 4 ) ).to.deep.equal( [] );

        });

        describe( 'with an array of numbers', function() {

            it( 'should match only equal numbers', function() {

                var a = new ArrayDB( 42, 1, 18, -42, 42 );

                expect( a.query( 42 ) ).to.deep.equal([ 42, 42 ]);

            });

            it( 'should match NaN values with a NaN query', function() {

                var a = new ArrayDB( 1, NaN, 2 );

                expect( a.query( NaN ) ).to.deep.equal([ NaN ]);

            });

        });

    });

});
