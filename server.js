var named = require('node-named');
var dns = require('dns');
var os = require('os');
var server = named.createServer();
var interfaces = os.networkInterfaces();

module.exports = function (data) {
  function domainMatchesFilters (domain) {
    for (var i=0, j=data.hosts.length; i<j; i++) {
      if ( typeof data.hosts[i].substring(0,1) === '/' ) {
        if (domain.match(data.hosts[i])) {
          return true;
        }
      } else {
        if ( domain === data.hosts[i] ) {
          return true;
        }
      }
    }
    return false;
  }

  var hostname = data.serverHost;
  if (!hostname) {
    for (var i=0; i<interfaces.en1.length; i++) {
      if (interfaces.en1[i].family === 'IPv4') {
        hostname = interfaces.en1[i].address;
        break;
      }
    }
  }

  server.listen(53, hostname, function () {
    console.log('Listening on port 53 with hostname "' + hostname + '"...');
  });

  server.on('query', function (query) {
    var domain = query.name();
    var answer;
    if ( domainMatchesFilters(domain) ) {
      console.log('Serving', query.name(), 'as local domain with type', query.type());
      answer = new named.ARecord('10.0.1.3');
      query.addAnswer(domain, answer, 300);
      server.send(query);
    } else {
      console.log('Forwarding', query.name(), 'request of type', query.type());
      dns.resolve(domain, query.type(), function (err, addresses) {
        if (err) console.log('Problem getting DNS record:', err);

        if ( !addresses || addresses.length < 1 ) {
          console.log('Response is apparently empty: ' + typeof addresses);
          server.send(query);
          return;
        }
        switch(query.type()) {
          case 'A':
            answer = new named.ARecord(addresses[0]);
            break;
          case 'AAAA':
            console.log(JSON.stringify(addresses));
            answer = new named.AAAARecord(addresses[0]);
            break;
          case 'CNAME':
            answer = new named.CnameRecord(addresses[0]);
            break;
          case 'MX':
            var rec = addresses[0];
            answer = new named.MxRecord(rec.exchange, {
              priority: rec.priority
            });
            break;
          default:
            console.log(query.type(), 'WTF is this??');
            server.send(query);
            return;
        }
        query.addAnswer(domain, answer, 300);
        server.send(query);
      });
    }
  });
}
