/*
Nodejs server
- Express model used for organizing web contact, allowing public files to be viewed
*/

<<<<<<< HEAD
=======
var passport = require('passport');
var path = require('path');

//  Bring in the data model
//require('./app_api/models/db');

//  Bring in the Passport config after model is defined
//require('./app_api/config/passport');

//  Bring in the routes for the API (delete the default routes)
//var routesApi = require('./app_api/routes/index');
>>>>>>> 69df6a0f607802700b7c44734c2ee8934831667d


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


<<<<<<< HEAD
=======
//app.use(passport.initialize());
//app.use('/api', routesApi);
>>>>>>> 69df6a0f607802700b7c44734c2ee8934831667d



// Bring Mongoose into the app
var mongoose = require('mongoose');

// Build the connection string
//var dbURI = 'mongodb://ahmedapp:i9i14UEM2JYcEyS5T2VZ@104.196.151.170:27017/users?authSource=admin'; 
var dbURI = 'mongodb://ahmedapp:i9i14UEM2JYcEyS5T2VZ@127.0.0.1:27017/users?authSource=admin'; 

// Create the database connection
mongoose.connect(dbURI);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

// BRING IN YOUR SCHEMAS & MODELS
//require('/models/users');

//var Users = mongoose.model('User', UserSchema);

//var Users = mongoose.model('User', UserSchema);

var Users = require('./public/models/users');







// Redirect to links requested from GET
app.get('/', function (req, res){
    res.sendfile('public/index.html');
});
	
app.get('/store', function (req, res){
    res.sendfile('public/store.html');
});

app.get('/view', function (req, res){
    res.sendfile('public/view.html');
	//var template_id = req.params.id;
	
});

app.get('/register', function (req, res){
    res.sendfile('public/register.html');
});
	
app.get('/login', function (req, res){
    res.sendfile('public/login.html');
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
//var template_id = 0;
app.get('/templates/:id', function (req, res){
	var template_id = req.params.id;
	console.log("The templates id: " + template_id);
	db.templates.findOne({_id: mongojs.ObjectId(template_id)}, function(err, doc){
		console.log(doc);
		res.json(doc);
		});
});

app.post('/templates', function(req, res){
	console.log("Got POST request");
	console.log(req.body);
	
	//req.check('username').isAlphanumeric(); // check to see if not empty

    //var errors = req.validationErrors();

    //if (errors){
     //   res.status(400).send(errors);
    //} else {

    Users.Create(req.body, function (err, user) {
            if (err) {
                res.status(400).send(err.message);
            } else {
                res.sendStatus(200);
            }
        });
   // }
	
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


