/*
Nodejs server
- Express model used for organizing web contact, allowing public files to be viewed
*/

var passport = require('passport');
var path = require('path');

//  Bring in the data model
require('./app_api/models/db');

//  Bring in the Passport config after model is defined
require('./app_api/config/passport');

//  Bring in the routes for the API (delete the default routes)
var routesApi = require('./app_api/routes/index');


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


app.use(passport.initialize());
app.use('/api', routesApi);



/* Set the app_client folder to serve static resources
app.use(express.static(path.join(__dirname, 'app_client')));


// [SH] Otherwise render the index.html page for the Angular SPA
// [SH] This means we don't have to map all of the SPA routes in Express
app.use(function(req, res) {
  res.sendFile(path.join(__dirname, 'app_client', 'index.html'));
});*/



// Redirect to links requested from GET
app.get('/', function (req, res){
    res.sendfile('public/index.html');
});

app.get('/store', function (req, res){
    res.sendfile('public/store.html');
});

app.get('/view', function (req, res){
    //res.sendfile('public/view.html');
	db.templates.findOne({_id: mongojs.ObjectId(template_id)}, function(err, docs){
		console.log(docs);
		res.json(docs);
		});
});



// Sends back to the controller the GET data requested
app.get('/templates', function(req, res){
	console.log("I received a GET request");
	
	// Get the data from the database
	db.templates.find(function (err, docs){
		console.log("Success");
		res.json(docs);
	});
});


// Store ID of template clicked on
var template_id = 0;
app.get('/templates/:id', function (req, res){
	template_id = req.params.id;
	console.log("The templates id: " + template_id);
	db.templates.findOne({_id: mongojs.ObjectId(template_id)}, function(err, doc){
		console.log(doc);
		res.json(doc);
		});
});

app.get('/templates123', function(req, res){
	console.log("I received a GET request");
	console.log("The templates id: " + template_id);
	// Get the data from the database
	db.templates.findOne({_id: mongojs.ObjectId(template_id)}, function(err, doc){
		console.log(doc);
		res.json(doc);
		});
});



/*
app.post("/", function (req, res) {
    //console.log(req.body.user.name)
    //console.log(req.body.user.email)
	console.log(req.body.user);
});

<form method="post" action="/">
<input type="text" name="user[name]">
<input type="text" name="user[email]">
<input type="submit" value="Submit">
</form>
*/



app.listen(3000);
console.log("Server running on port 3000");


