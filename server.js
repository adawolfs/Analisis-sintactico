var expressServer = require('./app/expressServer');
var config = require('./config')
var http = require('http')
var app = new expressServer(config);
app.startServer();