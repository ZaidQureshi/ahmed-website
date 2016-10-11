/*
Nodejs server
- Express model used for organizing web contact, allowing public files to be viewed
*/


var path = require('path');
// Require express modules to be used
var express = require('express');
var app = express();

var expressValidator = require('express-validator');
var expressJwt = require('express-jwt');
app.use('/private/*', expressJwt({secret: 'supersecret'}));


// Require mongojs modules to interact with database
var mongojs = require('mongojs');

// Authenticate into the database in the server
//var db = mongojs('ahmedapp:i9i14UEM2JYcEyS5T2VZ@104.196.151.170:27017/templates?authSource=admin', ['templates']); 
var db = mongojs('ahmedapp:i9i14UEM2JYcEyS5T2VZ@127.0.0.1:27017/templates?authSource=admin', ['templates']); 

//var db_users = mongojs('ahmedapp:i9i14UEM2JYcEyS5T2VZ@104.196.151.170:27017/users?authSource=admin', ['users']); 



var bodyParser = require('body-parser');
// Allow public files (html, css, javascript) to be run on the server
app.use(express.static(__dirname + "/public"));	

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: true
}));




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

// BRING IN  SCHEMAS & MODELS
var Users = require('./public/models/users');







// Redirect to links requested from GET
app.get('/', function (req, res){
    //res.sendfile('public/index.html');
	res.sendFile('public/index.html', { root: __dirname });
});
	
app.get('/store', function (req, res){
    //res.sendfile('public/store.html');
	res.sendFile('public/store.html', { root: __dirname });
});

app.get('/view', function (req, res){
    //res.sendfile('public/view.html');
	//var template_id = req.params.id;
	res.sendFile('public/view.html', { root: __dirname });
	
});

app.get('/register', function (req, res){
    //res.sendfile('public/register.html');
	res.sendFile('public/register.html', { root: __dirname });
});
	
app.get('/login', function (req, res){
    //res.sendfile('public/login.html');
	res.sendFile('public/login.html', { root: __dirname });
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


// Check if username already exists in database during registration form
app.post('/users', function(req, res){
	var username = req.body.username;
	console.log("Got POST request");
	//console.log(username);
	

    Users.usernameAvailable(username, function (err, response) {
            if (err) {
                res.send(err.message);
            } else {
				console.log(response);
                res.send(response);
            }
        });
   // }
});


app.post('/login', function (req, res) {

    Users.getAuthenticated(req.body, function (err, token) {
        if (err) {
            console.log(err.message);
			console.log("The token is: " + token);
			//res.send(false);
            //res.status(400).send(err.message);
			res.send(false);
        } else {
			//console.log(token);
            res.send(token);
        }
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


