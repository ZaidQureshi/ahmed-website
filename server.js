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
var db = mongojs('templates', ['templates']); 

var app = express();
// Allow public files (html, css, javascript) to be run on the server
app.use(express.static(__dirname + "/public"));	




// Sends back to the controller the GET data requested
app.get('/templates', function(req, res){
	console.log("I received a GET request");
	
	// Get the data from the database
	db.templates.find(function (err, docs){
		console.log(docs);
		res.json(docs);
	});
});




app.listen(3000);
console.log("Server running on port 3000");


