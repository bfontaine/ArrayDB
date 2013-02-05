(function( ctx ) {

    var ArrayDB = function ArrayDB( a ){

        var init = [], i, _l;

        if ( arguments.length === 1 && arguments[0] instanceof Array ) {
        
            init = a;
        
        } else if ( arguments.length >= 1 ) {

            init = arguments;

        }

        for ( i=0, _l=init.length; i<_l; i++ ) {

            this[ this.length++ ] = init[ i ];

        }

    };

    ArrayDB.prototype = new Array();

    /**
     * Private function. Return `true` if the one of the conditions
     * below are true:
     *
     *  - @obj and @pattern are both strings, numbers, regexes,
     *    or functions, AND have the same .toString() value.
     *
     *  - @obj and @pattern are both null or undefined
     *
     *  - @obj and @pattern are arrays, and for i from 0 to @pattern.length,
     *    match(@obj[i], @pattern[i]) is truthy
     *
     *  - @obj and @pattern are arrays, and for each @pattern's property p,
     *    match(@obj[p], @pattern[p]) is truthy
     *
     **/
    function match( obj, pattern ) {

        var i, _l;

        if ( typeof obj !== typeof pattern ) { return false; }

        // null
        if ( obj === null && pattern === null ) { return true; }

        // undefined
        if (   obj === undefined
            && pattern === undefined
            && arguments.length >= 2 ) {

            return true;

        }

        // Number, Boolean & String objects, regexes & functions
        if (
               ( obj instanceof Number && pattern instanceof Number )
            || ( obj instanceof String && pattern instanceof String )
            || ( obj instanceof Boolean && pattern instanceof Boolean )
            || ( obj instanceof RegExp && pattern instanceof RegExp )
            || ( obj instanceof Function && pattern instanceof Function )
           ) {

            return obj.toString() === pattern.toString();

        }

        // Numbers (primitive values)
        if ( 0 + obj === obj && 0 + pattern === pattern ) {

            return obj === pattern;

        }

        // NaN
        if (   typeof obj === 'number' && isNaN( obj )
            && typeof pattern === 'number' && isNaN( pattern ) ) {

            return true;

        }

        // Strings (primitive values)
        if ( '' + obj === obj && '' + pattern === pattern ) {

            return obj === pattern;

        }

        // Booleans (primitive values)
        if ( !!obj === obj && !!pattern === pattern ) {

            return obj === pattern;

        }

        // Arrays
        if ( pattern instanceof Array ) {

            if (   !obj instanceof Array
                || obj.length !== pattern.length ) { return false; }

            for ( i=0, _l=obj.length ; i<_l; i++ ) {

                if ( !match( obj[ i ], pattern[ i ] ) ) { return false; }

            }

            return true;

        }

        // other Objects
        if ( obj instanceof Object && pattern instanceof Object ) {

            for ( i in pattern ) {

                if ( pattern.hasOwnProperty( i ) ) {

                    if (   !( i in obj )
                        || !match( obj[ i ], pattern[ i ] ) ) {

                            return false;

                        }

                }

            }

            return true;
        }

        return false;

    }

    /**
     * Main function. Will be called on an ArrayDB or Array
     * object.
     * @q [Object]: the query
     * @limit [Number]: optional. The maximum number of results. Default
     *                  to Infinity.
     * @offset [Number]: optional. Default to 0.
     **/
    function query( q, limit, offset ) {

        var i, _l, res;

        if ( this.length === 0 || arguments.length === 0 ) {
        
            return [];
        
        }

        if ( limit === undefined ) {
            
            limit = Infinity;
        
        }

        offset = offset || 0;

        if ( typeof Array.prototype.filter === 'function' ) {

            return this.filter(function( e ) {
                return match( e, q );
            }).slice( offset, offset + limit );

        }

        res = [];
        _l  = Math.min( this.length, limit );
        i   = 0;

        for ( ; i<_l; i++ ) {

            if ( match( this[ i ], q ) ) {

                res.push( this[ i ] );

            }

        }

        return res;

    }


    function _extends( obj ) {

        Object.defineProperty( obj.prototype, 'query', {

            value: query,
            enumerable: false,
            configurable: true,
            writable: true

        });

    }
    _extends( ArrayDB );

    ArrayDB.monkeyPatch = function() { _extends( Array ); }

    // exports
    ctx.ArrayDB = ArrayDB;

})( typeof exports === 'object' ? exports : this );
