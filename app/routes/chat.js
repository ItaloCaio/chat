module.exports = function(application){
	/* chamar a pagina do chat */
	/* lembrando de alterar o verbo de GET para POST */
	application.post('/chat', function(req, res){
		
		application.app.controllers.chat.iniciaChat(application, req, res);

	});

	/* chamar a pagina do chat */
	/* De forma GET*/
	application.get('/chat', function(req, res){
		/* chamar a view chat.EJS a partir do controller */
		application.app.controllers.chat.iniciaChat(application, req, res);
	});
}
