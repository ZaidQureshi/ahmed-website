/*
Nodejs server
- Express model used for organizing web contact, allowing public files to be viewed
*/


var path = require('path');
// Require express modules to be used
var express = require('express');
var session = require('express-session');
var exphbs  = require('express-handlebars');
var app = express();

//app.use(session({ secret: 'ssshhhh'})); 
app.use(session({
  secret: 'ssshhhh',
  resave: false,
  saveUninitialized: true
}))


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
//var dbURI1 = 'mongodb://ahmedapp:i9i14UEM2JYcEyS5T2VZ@104.196.151.170:27017/users?authSource=admin'; 
var dbURI1 = 'mongodb://ahmedapp:i9i14UEM2JYcEyS5T2VZ@127.0.0.1:27017/users?authSource=admin'; 
//var dbURI3 = 'mongodb://ahmedapp:i9i14UEM2JYcEyS5T2VZ@127.0.0.1:27017/users?authSource=admin,127.0.0.1:27017/templates?authSource=admin'; 

var dbURI2 = 'mongodb://ahmedapp:i9i14UEM2JYcEyS5T2VZ@104.196.151.170:27017/templates?authSource=admin'; 
//var dbURI2 = 'mongodb://ahmedapp:i9i14UEM2JYcEyS5T2VZ@127.0.0.1:27017/users?authSource=admin'; 


//mongoose.createConnection(dbURI3);
mongoose.connect(dbURI1);
//mongoose.connect(dbURI2);
//mongoose.connect(conn);


// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + dbURI1);
    //console.log('Mongoose default connection open to ' + dbURI2);
	
});
// If the connection throws an error
mongoose.connection.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err);
});
// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});


// BRING IN SCHEMAS & MODELS
var Users = require('./public/models/users');
//var Templates = require('./public/models/templates');


/*
Users.remove({}, function(err) { 
   console.log('collection removed') 
});
*/




app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home', {
		layout: false, 
		username: req.session.username});
});

app.get('/store', function (req, res){
    res.render('store', {
		layout: false,
		username: req.session.username});
});

app.get('/view', function (req, res){
    res.render('view', {
		layout: false,
		username: req.session.username});
});

app.get('/register', function (req, res){
    
	if(!req.session.username){
		res.render('register', {
			layout: false,
			username: req.session.username});
	}
	else{
		// return since it is an asynchronous call
		return res.redirect('/');
	}
});
	
app.get('/login', function (req, res){
	if(!req.session.username){
		res.render('login', {
			layout: false,
			username: req.session.username});
	}
	else{
		// return since it is an asynchronous call
		return res.redirect('/');
	}
	
});

app.get('/create', function (req, res){
    
	if(req.session.username){
		res.render('create', {
			layout: false,
			username: req.session.username});
	}
	else{
		// return since it is an asynchronous call
		return res.redirect('/');
	}
});

app.get('/logout',function(req,res){
	if(req.session.username){
		req.session.destroy(function(err) {
		  if(err) {
			console.log(err);
		  } else {
			return res.redirect('/');
		  }
		});
	}
	else{
		return res.redirect('/');
	}
});



// Redirect to links requested from GET
app.get('/', function (req, res){
    //res.sendfile('public/index.html');
	console.log("Hello World");
	console.log("The username is: " + req.session.username);
	res.sendFile('public/home.html', { root: __dirname });
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

app.get('/create', function (req, res){
    //res.sendfile('public/login.html');
	res.sendFile('public/create.html', { root: __dirname });
});




// Sends back to the controller the GET data requested
app.get('/templates', function(req, res){
	console.log("I received a GET request");
	
	//Users.collection.distinct
	Users.distinct('template', function (err, docs){
		//console.log(docs);
		res.json(docs);
	});
	// Get the data from the database
	
});


// Store ID of template clicked on
//var template_id = 0;
app.get('/templates/:id', function (req, res){
	var template_id = req.params.id;
	//console.log("The templates id: " + template_id);
	
	/*
	db.findOne({_id: mongojs.ObjectId(template_id)}, function(err, doc){
		console.log(doc);
		res.json(doc);
		});
	*/
	console.log("\n This is the template id: " + template_id + "\n");
	
	// find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
	// Person.findOne({ 'name.last': 'Ghost' }, 'name occupation', function (err, person) {
	
	/*
		
	Users.distinct('template', {'template._id':template_id}, function (err, docs){
		console.log(docs);
		res.json(docs);
	});
	
	Users.find({
    'template._id': { $in: [
        mongoose.Types.ObjectId(template_id)
    ]}
	}, function(err, docs){
		 console.log(docs);
});
	*/
	
	Users.findOne( {'template._id':template_id}, 'template',  function(err, doc){
		console.log("\n This is the resule of the query" + doc + "\n");
		res.json(doc.template);
		});	

		
});


app.post('/registration', function(req, res){
	console.log("Got POST request");
	console.log(req.body);
	sess.req.session;
	sess.name = req.body.name;
	
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
	sess = req.session;
	console.log(sess);
	
	
    Users.getAuthenticated(req.body, function (err, token) {
        if (err) {
            console.log(err.message);
			console.log("The token is: " + token);
			//res.send(false);
            //res.status(400).send(err.message);
			res.send(false);
			//res.status(400).send(err.message);
        } else {
			//console.log(token);
            //res.send(token);
			req.session.username = req.body.username;
			console.log(req.session.username);
			res.redirect('/');
        }
    });
});








// Store the user created template into the document of templates
app.post('/create', function(req, res){
	console.log("Got POST request");
	console.log(req.body);
	console.log(req.body.author);
		Users.CreateTemplate(req.body, function (err, response){
			if(err) {
				res.send(err.message);
			}
			else{
				console.log("This is the user after function call" + response + "\n");
				res.send(response);
			}
		});	  	
	
    //Templates.Create(req.body, function (err, user) {
	
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


