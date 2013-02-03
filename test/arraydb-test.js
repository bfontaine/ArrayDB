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

    });

});
