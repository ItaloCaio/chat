
const AWS = require('aws-sdk');
const Busboy = require('busboy');
const fs = require('fs');

const BUCKET_NAME = 'cadpublics3';
const IAM_USER_KEY = 'AKIAJFOZMOPXDYOESSYQ';
const IAM_USER_SECRET = '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';

function uploadToS3(file) {
 let s3bucket = new AWS.S3({
   accessKeyId: IAM_USER_KEY,
   secretAccessKey: IAM_USER_SECRET,
   Bucket: BUCKET_NAME,
 });
 s3bucket.createBucket(function () {
   var params = {
    Bucket: BUCKET_NAME,
    Key: file.name,
    Body: file.data,
   };
   s3bucket.upload(params, function (err, data) {
    if (err) {
     console.log('error in callback');
     console.log(err);
    }
    console.log('success');
    console.log(data);
    return ;
   });
 });
}

function backup(file) {
 let s3bucket = new AWS.S3({
   accessKeyId: IAM_USER_KEY,
   secretAccessKey: IAM_USER_SECRET,
   Bucket: BUCKET_NAME,
 });
 s3bucket.createBucket(function () {
   var params = {
    Bucket: BUCKET_NAME,
    Key: 'backup.txt',
    Body: file,
   };
   s3bucket.upload(params, function (err, data) {
    if (err) {
     console.log('error in callback');
     console.log(err);
    }else{
    console.log('success');
    console.log(data);
    return ;
	}
   });
 });
}

module.exports = (app) => {

	 app.post('/', function (req, res, next) {

	 	const element1 = req.body.element1;

	    var busboy = new Busboy({ headers: req.headers });

	  //  const file1 = req.files.element1;
	   // console.log('element1 Exemplo:', file1);
	    // The file upload has completed
	    busboy.on('finish', function() {
	      console.log('Upload finished');
	      
	      // Your files are stored in req.files. In this case,
	      // you only have one and it's req.files.element2:
	      // This returns:
	      // {
	      //    element2: {
	      //      data: ...contents of the file...,
	      //      name: 'Example.jpg',
	      //      encoding: '7bit',
	      //      mimetype: 'image/png',
	      //      truncated: false,
	      //      size: 959480
	      //    }
	      // }
	      
	      var file = 'backup.txt';

	      var read = fs.readFileSync(file, "utf8");
	  
	      console.log(read);

	     // console.log(req.files);

	      // Grabs your file object from the request.
	      //const file = req.files.arquivo;


	     

	      // Begins the upload to the AWS S3
	    res.render("index", {validacao: {}});	
	    backup(read);
	    });

	    console.log("fim");
		req.pipe(busboy);
 	console.log("dps do pipe");
	 });



};