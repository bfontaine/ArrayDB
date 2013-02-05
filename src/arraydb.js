(function( ctx ) {

    /**
     * Main object
     * @a (Optional): if it's an array, it's used as the DB table. If not
     *                all arguments are put in the DB table.
     **/
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

    // better typeof
    function get_type( o ) {

        if ( o === null )                          { return 'null'; }
        if ( o === undefined )                     { return 'undefined'; }

        if ( o instanceof Array )                  { return 'array'; }
        if ( o instanceof RegExp )                 { return 'regexp'; }
        
        if ( typeof o === 'function' )             { return 'function'; }

        if ( !!o === o || o instanceof Boolean )   { return 'boolean'; }
        if (  +o === o || o instanceof Number )    { return 'number'; }
        if ( ''+o === o || o instanceof String )   { return 'string'; }

        if ( isNaN( o ) && typeof o === 'number' ) { return 'nan'; }

        return 'object';
    }

    function match_arrays( o, p, strict ) {

        var i, _l;

        if ( o.length !== p.length ) { return false; }

        for( i=0, _l=o.length; i<_l; i++ ) {

            if ( !match( o[ i ], p[ i ], strict ) ) { return false; }

        }

        return true;

    }

    function match_objects( o, p, strict ) {

        var prop;

        for ( prop in p ) {

            if ( p.hasOwnProperty( prop ) && !( prop in o ) ) { return false; }
            if ( !match( o[ prop ], p[ prop ], strict ) ) { return false; }
        
        }

        return true;

    }

    // o:object, p:pattern
    function match( o, p, strict ) {

        var o_type = get_type( o ),
            p_type = get_type( p );

        if ( strict ) {

            // In strict mode, objects must have the same type
            if ( o_type !== p_type ) { return false; }

            switch( o_type ) {

                case 'nan':
                case 'null':
                case 'undefined':
                    return true;

                case 'function':
                case 'number':
                case 'regexp':
                case 'string':
                    return o.toString() === p.toString();

                case 'boolean':
                    return o === p;

                case 'array':
                    return match_arrays( o, p, strict );

                case 'object':
                    return match_objects( o, p, strict );

            }

        }

    }

    /**
     * Main function. Will be called on an ArrayDB or Array
     * object.
     * @q [Object]: the query. If it's the only one argument and it has
     *              a 'query' property, it's used to specify other arguments,
     *              e.g.: {
     *                  query: <the query>,
     *                  limit: <the limit>,
     *                  offset: <the offset>,
     *                  strict: <strict mode?>,
     *                  reverse: <reversed query?>
     *              }
     * @limit [Number]: optional. The maximum number of results. Default
     *                  to Infinity.
     * @offset [Number]: optional. Default to 0.
     **/
    function query( q, limit, offset ) {

        var i, _l, res,
        
            strict  = true,
            reverse = false;

        if ( this.length === 0 || arguments.length === 0 ) {
        
            return [];
        
        }

        if ( typeof q === 'object' && q != null
            && 'query' in q
            && arguments.length === 1 ) {

            limit   = +q.limit;
            offset  = +q.offset;
            strict  = !!q.strict;
            reverse = !!q.reverse;
            q       = q.query;

        }

        if ( isNaN( limit ) ) {
            
            limit = Infinity;
        
        }

        offset = offset || 0;

        if ( typeof Array.prototype.filter === 'function' ) {

            return this.filter(function( o ) {

                return match( o, q, true );
            
            }).slice( offset, offset + limit );

        }

        res = [];
        _l  = Math.min( this.length, limit );
        i   = 0;

        for ( ; i<_l; i++ ) {

            if ( match( this[ i ], q, true ) ) {

                if ( offset-- > 0 ) { continue; }

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
