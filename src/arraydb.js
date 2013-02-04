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

        // null
        if ( obj === null && pattern === null ) { return true; }

        // undefined
        if (   obj === undefined
            && pattern === undefined
            && arguments.length >= 2 ) {

            return true;

        }

        // Number & String objects, regexes & functions
        if (
               ( obj instanceof Number && pattern instanceof Number )
            || ( obj instanceof String && pattern instanceof String )
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
        if ( isNaN( obj ) && isNaN( pattern ) ) {

            return true;

        }

        // Strings (primitive values)
        if ( '' + obj === obj && '' + obj === obj ) {

            return obj === pattern;

        }

        // ("classic"-)Objects & Arrays -> TODO

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
