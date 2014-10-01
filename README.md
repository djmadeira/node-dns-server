# About
I was getting tired of not being able to view my vhosts local sites on other devices. So I wrote a simple DNS server for that purpose. If a domain doesn't match the domains passed, it will try to pass it on to the normal DNS servers of the machine.

This isn't even in NPM (yet).

# Usage
```
var dnsServer = require('server.js');

dnsServer({
  host1: 'test.custom',
  host2: /*\.dev/
})
```

Hosts can be either a string or a regular expression.

On your device, set your DNS server to your local IP. (Currently, it determines the host to use by grabbing your IP from the Wi-Fi network device. Obviously, this is unacceptable, and will become an option in the near future.)

# Known issues
Currently, IPv6 records seem to not work at all. This may be a problem with a dependency, but I'm not sure. Maybe I'll try switching to [node-dns](https://github.com/tjfontaine/node-dns) and see if that works any better.
