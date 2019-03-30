module.exports.iniciaChat = function(application, req, res){
	
	//Acessar o body através do middleware bodyParser retornando o JSON
	var dadosForm = req.body;

	/*  Mostra o JSON do atributo name do input */
	// console.log(dadosForm);


	/* Validando atraves do assert do middleware do express-validator*/
	req.assert('apelido', 'Nome ou apelido é obrigatório').notEmpty();
	req.assert('apelido', 'Nome ou apelido de conter entre 3 e 15 caracteres').len(3, 15);

	/* acessa os erros do request JSON*/
	var erros = req.validationErrors();

	if(erros){
		// para mostrar que ha erros
		 // res.send("Existem erros no formulário");

		// de forma mais inteligente
		res.render("index", {validacao: erros })

		/* manter o return */
		return;
	}

	application.get('io').emit(
		'msgParaCliente', {apelido: dadosForm.apelido, mensagem: ' acabou de entrar no chat'}
	);



	/* chamar a view .ejs */
		res.render("chat", {dadosForm: dadosForm});
}