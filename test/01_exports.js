'use strict';

const test = require( 'tape' );

test( 'EXPORTS: module exports something', function( t ) {
    const getRequestIP = require( '../index.js' );
    t.ok( getRequestIP, 'exports ok' );
    t.end();
} );

test( 'EXPORTS: module exports a function', function( t ) {
    const getRequestIP = require( '../index.js' );
    t.equal( typeof getRequestIP, 'function', 'exports a function' );
    t.end();
} );