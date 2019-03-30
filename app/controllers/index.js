module.exports.home = function(application, req, res){
	/* chamar a view .ejs */
		res.render("index", {validacao: {}});		
}