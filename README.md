## get-request-ip

A small, configurable module to get a request's IP address.

## Code Example

```javascript
const getRequestIP = require( 'get-request-ip' );

// get the ip address, respecting the following headers if they
// are set:
//      x-client-ip
//      x-forwarded-for
//      x-real-ip
//      x-cluster-client-ip
//      x-forwarded
//      forwarded-for
//      fowarded

server.get( '/defaults', ( request, response ) => {
    const ip = getRequestIP( request );

    console.log( `REQUEST FROM IP: ${ip}` );

    response.send( {
        ok: true
    } );
} );

// or you can configure only the headers you want to respect
server.get( '/custom', ( request, response ) => {
    const ip = getRequestIP( request, {
        headers: [
            'x-custom-ip-header'
        ]
    } );

    console.log( `REQUEST FROM IP: ${ip}` );

    response.send( {
        ok: true
    } );
} );

// or you can ignore all headers and only try to read from the request's connection
server.get( '/no_headers', ( request, response ) => {
    const ip = getRequestIP( request, {
        headers: []
    } );

    console.log( `REQUEST FROM IP: ${ip}` );

    response.send( {
        ok: true
    } );
} );
```

## Motivation

There are a handful of implementations out there for getting the IP address that a request
came from. I haven't seen one that is both configurable and tested. This module aims to
fulfill both those requirements.

## Installation

```
npm install --save get-request-ip
```

## Options Reference

### headers

An array of headers to trust for determining the source IP. Default:

```javascript
[
    'x-client-ip',
    'x-forwarded-for',
    'x-real-ip',
    'x-cluster-client-ip',
    'x-forwarded',
    'forwarded-for',
    'fowarded'
]
```

Be wary of this setting. It is very liberal by default, which could allow a malicious actor
to spoof an IP . This liberal setup assumes that you have set up your app behind a sane proxy.
If you'd like to lock this down, it's an easy configuration change:

```javascript
server.get( '/locked_down', ( request, response ) => {
    const ip = getRequestIP( request, {
        headers: []
    } );
    
    ...
} );
```

## Tests

```
npm run test
```

## Contributing

Contributions are encouraged and appreciated. To make the process as quick and
painless as possible for everyone involved, here's a checklist that will make
a pull request easily accepted:

 1) Implement your new feature or bugfix
 2) Add or update tests to ensure coverage
 3) Ensure your code passes jshint according to the jshintConfig in package.json
 4) Ensure your code is formatted according to the .jsbeautifyrc
 5) Submit

## License

MIT
