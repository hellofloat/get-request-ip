'use strict';

const agent = require( 'superagent' );
const extend = require( 'extend' );

module.exports = {
    getWithTimeout: ( _options, callback ) => {
        const options = extend( true, {}, {
            agent: agent,
            timeout: 60 * 1000,
            delay: 1000,
            headers: {},
            check: ( error, response, _callback ) => {
                if ( error || !response ) {
                    _callback( error || 'missing response', true );
                    return;
                }

                _callback( null, true );
            }
        }, _options );

        const start = Date.now();

        ( function makeRequest() {
            const now = Date.now();
            if ( now - start > options.timeout ) {
                callback( 'timed out' );
                return;
            }

            let request = options.agent.get( options.url );

            Object.keys( options.headers ).forEach( ( key ) => {
                const value = options.headers[ key ];
                request = request.set( key, value );
            } );

            request.end( ( error, response ) => {
                options.check( error, response, ( _error, stop ) => {
                    if ( stop ) {
                        callback( _error );
                        return;
                    }

                    setTimeout( makeRequest, options.delay );
                } );
            } );
        } )();
    }
}