const express = require('express');
const fs = require('fs');
const historyApiFallback = require('connect-history-api-fallback');
const mongoose = require('mongoose');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const app = express();



const busboy = require('connect-busboy');
const busboyBodyParser = require('busboy-body-parser');

const config = require('../config/config');
const webpackConfig = require('../webpack.config');

const isDev = process.env.NODE_ENV !== 'production';
const port  = process.env.PORT || 8080;


var upload = require('express-fileupload');
var consign = require('consign');

/* importar o módulo do body-parser */
var bodyParser = require('body-parser');

/*importar o módulo do express validator */
var expressValidator = require('express-validator');


/* setar as variaveis 'view engine' e 'views' do expres */
app.set ('view engine', 'ejs');
app.set('views', 'app/views');

/*configurar o middleware express.static */

app.use(express.static('./app/public'));

/* configurar o middleware body-parser*/
app.use(bodyParser.urlencoded({extended:true}));

/* configurar o middleware expess-validator */
app.use(expressValidator());

/* fazer o uploade das rotas, controllers, models para o objeto app */
consign()
  .include('app/routes')
  .then('app/models')
  .then('app/controllers')
  .into(app);



// Configuration
// ================================================================================================

// Set up Mongoose
mongoose.connect(isDev ? config.db_dev : config.db);
mongoose.Promise = global.Promise;



// ARQUIVO
app.use(busboy());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//Busboy body parser

app.use(busboyBodyParser());

// API routes
require('./routes')(app);




if (isDev) {
  const compiler = webpack(webpackConfig);

  app.use(historyApiFallback({
    verbose: false
  }));

  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    contentBase: path.resolve(__dirname, '../client/public'),
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  }));

  app.use(webpackHotMiddleware(compiler));
  app.use(express.static(path.resolve(__dirname, '../dist')));
} else {
  app.use(express.static(path.resolve(__dirname, '../dist')));
  app.get('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, '../dist/index.html'));
    res.end();
  });
}

var server = app.listen(port, function(){
	console.log('Servidor online');
}); 

/* lendo e escrevendo arquivo 
//var backUp = fs.readFileSync('backUp.txt', 'utf-8');
console.log(backUp);
fs.writeFileSync('write.txt',backUp);
fs.appendFile('write.txt', "Tentando um append");
*/

var io = require('socket.io').listen(server);

app.set('io', io);

/* criar a conexão para websocket */
io.on('connection', function(socket){
	
	console.log('Usuario se conectou');

	socket.on('msgParaServidor', function(data){

		/* dialogos */
		socket.emit(
				'msgParaCliente', {apelido: data.apelido, mensagem: data.mensagem}
			);

		socket.broadcast.emit(
				'msgParaCliente', {apelido: data.apelido, mensagem: data.mensagem}
			);


		/* particiantes*/

		if(parseInt(data.apelidos_atualizado_dos_clientes) == 0){
			
			socket.emit(
					'participantesParaCliente', {apelido: data.apelido}
				);

			socket.broadcast.emit(
					'participantesParaCliente', {apelido: data.apelido}
				);
	}


	fs.appendFileSync('backup.txt', data.apelido + ": " + data.mensagem + "\r\n");
	});


});

module.exports = app;