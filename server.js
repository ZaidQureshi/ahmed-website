/*
Nodejs server
- Express model used for organizing web contact, allowing public files to be viewed
*/

// Require express modules to be used
var express = require('express');

// Require ejs modules to be used for live binding to html page
var ejs = require('ejs');

// Require mongojs modules to interact with database
var mongojs = require('mongojs');
// Authenticate into the database in the server
//var db = mongojs('ahmedapp:i9i14UEM2JYcEyS5T2VZ@104.196.151.170:27017/templates?authSource=admin', ['templates']); 
var db = mongojs('ahmedapp:i9i14UEM2JYcEyS5T2VZ@127.0.0.1:27017/templates?authSource=admin', ['templates']); 


var app = express();

var bodyParser = require('body-parser');
// Allow public files (html, css, javascript) to be run on the server
app.use(express.static(__dirname + "/public"));	

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: true
}));





// Sends back to the controller the GET data requested
app.get('/templates', function(req, res){
	console.log("I received a GET request");
	
	// Get the data from the database
	db.templates.find(function (err, docs){
		console.log(docs);
		res.json(docs);
	});
});

app.get('/templates/:id', function (req, res){
	var id = req.params.id;
	db.templates.findOne({_id: mongojs.ObjectId(id)}, function(err, doc){
	res.json(doc);
	});
});



app.listen(3000);
console.log("Server running on port 3000");


