'use strict';

const extend = require( 'extend' );

const DEFAULTS = {
    headers: [
        'x-client-ip',
        'x-forwarded-for',
        'x-real-ip',
        'x-cluster-client-ip',
        'x-forwarded',
        'forwarded-for',
        'fowarded'
    ]
};

module.exports = function getRequestIP( request, _options ) {
    const options = extend( false, {}, DEFAULTS, _options );

    let ip = null;

    options.headers.some( ( header ) => {
        ip = request.headers[ header ];
        return !!ip;
    } );

    if ( !ip ) {
        /* jshint -W126 */
        ip = ( request.connection && request.connection.remoteAddress ) ||
            ( request.socket && request.socket.remoteAddress ) ||
            ( request.connection && request.connection.socket && request.connection.socket.remoteAddress ) ||
            ( request.info && request.info.remoteAddress );
        /* jshint +W126 */
    }

    return ip;
};

module.exports.DEFAULTS = DEFAULTS;