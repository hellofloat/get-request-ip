'use strict';

const agent = require( 'superagent' ).agent( '' );
const async = require( 'async' );
const express = require( 'express' );
const getRequestIP = require( '../index.js' );
const test = require( 'tape' );
const utils = require( './utils.js' );

const PORT = 25252;

let app = null;
let server = null;
test( 'EXPRESS: create server', ( t ) => {
    app = express();
    t.ok( app, 'app created' );

    app.get( '/up', ( request, response ) => {
        response.send( {
            up: true
        } );
    } );

    server = app.listen( PORT, () => {
        agent
            .get( `http://localhost:${PORT}/up` )
            .end( ( error, response ) => {
                t.ok( response, 'got a response' );
                t.ok( response.ok, 'response is valid' );
                t.ok( response.body, 'response has body' );
                t.ok( response.body.up, 'server is up' );
                t.end();
            } );
    } );
    t.ok( server, 'server created' );
} );

test( 'EXPRESS: get ip of basic request', ( t ) => {
    app.get( '/basic', ( request, response ) => {
        const ip = getRequestIP( request );

        const matches = [
            '127.0.0.1',
            '::ffff:127.0.0.1'
        ].some( ( _ip ) => {
            return ip === _ip;
        } );

        t.ok( matches, 'got expected local ip address' );

        response.send( {
            ok: true
        } );
    } );

    utils.getWithTimeout( {
        agent: agent,
        url: `http://localhost:${PORT}/basic`,
        check: ( error, response, callback ) => {
            if ( error || !response ) {
                callback( error || 'missing response', true );
            }

            callback( null, response.ok && response.body.ok );
        }
    }, ( error ) => {
        if ( error ) {
            t.fail( typeof error === 'string' ? error : JSON.stringify( error ) );
        }

        t.end();
    } );
} );

test( 'EXPRESS: test default headers', ( t ) => {
    const headerIP = '10.1.1.1';
    const headers = getRequestIP.DEFAULTS.headers;
    let header = null;

    app.get( '/allow_default_headers', ( request, response ) => {
        const ip = getRequestIP( request );

        t.equal( ip, headerIP, `got correct ip address (${header})` );

        response.send( {
            ok: true
        } );
    } );

    async.eachSeries( headers, ( _header, next ) => {
        header = _header;
        const testHeaders = {};
        testHeaders[ header ] = headerIP;

        utils.getWithTimeout( {
            agent: agent,
            url: `http://localhost:${PORT}/allow_default_headers`,
            headers: testHeaders,
            check: ( error, response, callback ) => {
                if ( error || !response ) {
                    callback( error || 'missing response', true );
                }

                callback( null, response.ok && response.body.ok );
            }
        }, next );
    }, ( error ) => {
        if ( error ) {
            t.fail( typeof error === 'string' ? error : JSON.stringify( error ) );
        }

        t.end();
    } );
} );

test( 'EXPRESS: test default headers when no headers are allowed', ( t ) => {
    const headerIP = '10.1.1.1';
    const headers = getRequestIP.DEFAULTS.headers;
    let header = null;

    app.get( '/allow_no_headers', ( request, response ) => {
        const ip = getRequestIP( request, {
            headers: []
        } );

        t.notEqual( ip, headerIP, `header "${header}" can be disabled` );

        response.send( {
            ok: true
        } );
    } );

    async.eachSeries( headers, ( _header, next ) => {
        header = _header;
        const testHeaders = {};
        testHeaders[ header ] = headerIP;

        utils.getWithTimeout( {
            agent: agent,
            url: `http://localhost:${PORT}/allow_no_headers`,
            headers: testHeaders,
            check: ( error, response, callback ) => {
                if ( error || !response ) {
                    callback( error || 'missing response', true );
                }

                callback( null, response.ok && response.body.ok );
            }
        }, next );
    }, ( error ) => {
        if ( error ) {
            t.fail( typeof error === 'string' ? error : JSON.stringify( error ) );
        }

        t.end();
    } );
} );

test( 'EXPRESS: test allowing only custom headers', ( t ) => {
    const headerIP = '10.1.1.1';
    const customHeaders = [
        'x-custom-header-one',
        'x-custom-header-two'
    ];
    const headers = getRequestIP.DEFAULTS.headers.concat( customHeaders );
    let header = null;

    app.get( '/allow_custom_headers', ( request, response ) => {
        const ip = getRequestIP( request, {
            headers: customHeaders
        } );

        if ( customHeaders.indexOf( header ) === -1 ) {
            t.notEqual( ip, headerIP, `default header is ignored (${header})` );
        }
        else {
            t.equal( ip, headerIP, `custom header is respected (${header})` );
        }

        response.send( {
            ok: true
        } );
    } );

    async.eachSeries( headers, ( _header, next ) => {
        header = _header;
        const testHeaders = {};
        testHeaders[ header ] = headerIP;

        utils.getWithTimeout( {
            agent: agent,
            url: `http://localhost:${PORT}/allow_custom_headers`,
            headers: testHeaders,
            check: ( error, response, callback ) => {
                if ( error || !response ) {
                    callback( error || 'missing response', true );
                }

                callback( null, response.ok && response.body.ok );
            }
        }, next );
    }, ( error ) => {
        if ( error ) {
            t.fail( typeof error === 'string' ? error : JSON.stringify( error ) );
        }

        t.end();
    } );
} );

test( 'EXPRESS: stop server', ( t ) => {
    server.close( ( error ) => {
        t.error( error, 'server closed' );
        t.end();
    } );
} );