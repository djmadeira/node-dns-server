var server = require('./server.js');

server({
  hosts: ['example.dev', '/*\.dev/'],
  serverHost: '10.0.1.3'
});
