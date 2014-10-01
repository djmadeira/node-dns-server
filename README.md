# About
A really simple DNS server for viewing vhosts in other devices. It will forward requests not matching the given options to the normal DNS lookup process.

# Usage
```
var dnsServer = require('server.js');

dnsServer({
  hosts: [
    '/*\.dev/',
    'example.com'
  ],
  serverHost: '10.0.1.3'
})
```

Hosts can be either a string or a `/`-bounded RegExp string.

On your device, set your DNS server to your development server's IP. Use the `serverHost` option to setup your IP in the DNS server (should be a string.)

# Known issues
Currently, IPv6 records seem to not work at all. This may be a problem with a dependency, but I'm not sure. Maybe I'll try switching to [node-dns](https://github.com/tjfontaine/node-dns) and see if that works any better.
