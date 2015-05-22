module.exports = function(req,res,next){
	res.locals.title = 'Ping Pong Game';
	next();
}