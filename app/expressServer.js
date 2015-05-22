var express = require('express');
var ejs = require('ejs');
var http = require('http');
var middlewares = require('./middlewares/admin');
var rest = require('./website/controllers/rest')
var ExpressServer = function(config){
	config = config || {};
	this.expressServer = express();
	http = http.Server(this.expressServer);
	for(var middleware in middlewares){
		this.expressServer.use(middlewares[middleware])
	}
	this.expressServer.set('view engine', 'html');
	this.expressServer.engine('html',ejs.renderFile)
	this.expressServer.set('views', __dirname + '/website/views');
	this.expressServer.get('/',function(req,res){
		res.render('index.html',{title:'Hola'});
	})
	rest(this.expressServer)
	this.startServer = function(){
		http.listen(config.port, function(){
			console.log('Server Started at port: ' + config.port)
		});
	}
}
module.exports = ExpressServer;