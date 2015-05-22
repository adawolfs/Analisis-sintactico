var Production = require('../models/production')
var aHelper = require('../models/arrayHelper')
var bodyParser = require('body-parser')
var jQuery = require('jquery')
var nonRecursive = []
var productionMap = []
var functionFirst = []
var functionNext = []
var keys = []
function rest(expressServer){
	expressServer.use(bodyParser.json())
	expressServer.use((bodyParser.urlencoded({ extended: true })));
	expressServer.post('/leftRecursion',function(req,res){
		var value = req.body.value
		var lines = value.split('\n')
		var productions = []
		nonRecursive = []
		for(var i=0;i<lines.length;i++){
			var line = lines[i]
			var key = line.split("->")[0]
			var tokens = line.split("->")[1].split("|")
			var p = new Production(key,tokens)
			productions.push(p)
		}
		for(var i=0;i<productions.length;i++){
			var p = productions[i];
			var tk = [];
			var tkp = [];
			var recursive = false;
			if(p.tokens.length > 1){
				for(var j=0;j<p.tokens.length;j++){
					var token = p.tokens[j]
					if(p.key == token[0]){
						recursive = true
						tkp.push(token.substring(1,token.length) + p.key + "´")
					} else {
						tk.push(token + p.key + "´")
					}
				}
			}
			var prod = null
			tkp.push('€')
			if (recursive) {
				nonRecursive.push(new Production(p.key,tk))
				nonRecursive.push(new Production(p.key + "´",tkp))
			} else {
				nonRecursive.push(p)
			}
		}
		res.status(200)
		res.send(nonRecursive)
	})
	expressServer.post('/functionFirst',function(req,res){
		functionFirst = []
		var value = req.body.value
		keys = getKeys(value)
		productionMap = convertToMap(value)
		for(var i in keys){
			var key = keys[i]
			var productions = productionMap.get(key)
			var first = getFirst(productions,productionMap).split('')
			if(key.indexOf('´') > -1){
				first.push('€')
			}
			functionFirst.push(new Production(key,first))
		}
		res.status(200)
		res.send(functionFirst)
	})
	expressServer.post('/functionNext',function(req,res){
		functionNext= []
		for(var i = 0; i < keys.length; i++){
			var key = keys[i]
			var next = getNext(key)
			functionNext.push(new Production(key,next.reverse()))
		}
		res.status(200)
		console.log(functionNext)
		res.send(functionNext)
	})
}
function getNext(nKey){
	functionFirstMap = convertToMap(functionFirst)
	var nexts = []
	for(var i = 0; i <= keys.length; i++){
		var key = keys[i]
		var productions = productionMap.get(key)
		for(var j in productions){
			var production = splitParts(productions[j])
			var index = production.indexOf(nKey)
			if( index > -1){
				var next = production[index + 1]
				if (productionMap.get(next)) {
					nexts = nexts.concat(getNext(next))
				} else if (next == undefined){
					nexts = nexts.concat(getNext(key))
				} else {
					nexts = nexts.concat('$').reverse()
					nexts = nexts.concat(production[index + 1])
					return nexts
				}
				if(nKey.indexOf('´') < 0){
					nexts = nexts.concat(functionFirstMap.get(next))
				}
				return aHelper.remove(nexts,'€')
			}
		}
		

	}
}
function getFirst(productions){
	var reg = /^([-!$%^&*()_+|~={}\[\]:;<>?,.\/]|\w'*)/gi
	var fists = ''
	for(var j in productions){
		var prod = productions[j].match(reg)
		if(prod){
			var prod = prod[0]
			if(productionMap.get(prod)){
				fists += getFirst(productionMap.get(prod))
			} else {
				fists += prod
			}
		}
	}
	return fists
}
function splitParts(val){
	var parts = []
	var values = val.split('')
	for(var i in values){
		value = values[i]
		if(value != '´'){
			i1 = (parseInt(i)+1)
			if(values[i1] == '´'){
				parts.push(value + values[i1])
			} else {
				parts.push(value)
			}
		}
	}
	return parts
}
function convertToMap(productions){
	var productionMap = new Map();
	for(var i in productions){
		var production = productions[i]
		productionMap.set(production.key,production.tokens)
	}
	return productionMap
}
function getKeys(productions){
	var keys = []
	for(var i in productions){
		var production = productions[i]
		keys.push(production.key)
	}
	return keys
}
module.exports = rest;