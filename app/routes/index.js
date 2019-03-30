module.exports = function(application){
	/* chamar a pagina inicial */
	application.get('/', function(req, res){
		/* chamar a view .ejs render a partir do controller */
		/* A segunda referencia é a propriedade exportada no controllers 
			Se fosse application.app.controllers.index.incial() mudaria a propriedade 
			no controller para inicial */
		application.app.controllers.index.home(application, req, res);
	})
}