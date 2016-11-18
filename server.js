/*
Nodejs server
- Express model used for organizing web contact, allowing public files to be viewed
*/


var Paypal = require('paypal-adaptive')
var paypalSdk = new Paypal({
	userId: 'userId',
	password: 'password',
	signature: 'signature',
	sandbox: true //defaults to false
});

var jimp = require('jimp');
var path = require('path');
var fs = require('fs');
//var admZip = require('adm-zip');
//var multer = require('multer');

var fileUpload = require('express-fileupload');
var extract = require('extract-zip')
	 
/*
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/zips')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
//var upload = multer({ dest: 'upload/zips' });
var upload = multer ({ storage: storage });
*/


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
var db = mongojs('ahmedapp:i9i14UEM2JYcEyS5T2VZ@104.196.151.170:27017/templates?authSource=admin', ['templates']); 
//var db = mongojs('ahmedapp:i9i14UEM2JYcEyS5T2VZ@127.0.0.1:27017/templates?authSource=admin', ['templates']); 

//var db_users = mongojs('ahmedapp:i9i14UEM2JYcEyS5T2VZ@104.196.151.170:27017/users?authSource=admin', ['users']); 



var bodyParser = require('body-parser');
// Allow public files (html, css, javascript) to be run on the server
app.use(express.static(__dirname + "/public"));	

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: true
}));


// default options
app.use(fileUpload());

// Bring Mongoose into the app
var mongoose = require('mongoose');

// Build the connection string
//var dbURI1 = 'mongodb://ahmedapp:i9i14UEM2JYcEyS5T2VZ@104.196.21.176:27017/users?authSource=admin'; 
var dbURI1 = 'mongodb://ahmedapp:i9i14UEM2JYcEyS5T2VZ@127.0.0.1:27017/users?authSource=admin'; 
//var dbURI3 = 'mongodb://ahmedapp:i9i14UEM2JYcEyS5T2VZ@127.0.0.1:27017/users?authSource=admin,127.0.0.1:27017/templates?authSource=admin'; 

//var dbURI2 = 'mongodb://ahmedapp:i9i14UEM2JYcEyS5T2VZ@104.196.151.170:27017/templates?authSource=admin'; 
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



app.engine('handlebars', exphbs({defaultLayout: 'main', layoutsDir: path.resolve(__dirname, 'views/layouts')}));
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
	//console.log("Query request " + req.query.id);
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
			error: req.session.error});
		console.log(req.session.error);
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

app.get('/upload', function(req, res){
	/*
	if(req.session.username){
		res.render('upload',{
			layout: false,
			username: req.session.username});
	}
	else{
		return res.redirect('/');
	}*/
	res.render('upload', { layout: false });
	
});

app.get('/review', function (req, res){
    
	//if(req.session.username == "ahmed"){
		res.render('review', {
			layout: false,
			username: req.session.username});
	//}
	/*else{
		// return since it is an asynchronous call
		// return to homepage if you are not Ahmed
		return res.redirect('/');
	}*/
});


app.get('/review_template', function (req, res){
    
	//if(req.session.username == "ahmed"){
		res.render('review_template', {
			layout: false,
			username: req.session.username});
	//}
	/*else{
		// return since it is an asynchronous call
		// return to homepage if you are not Ahmed
		return res.redirect('/');
	}*/
});


app.get('/my_template', function (req, res){
    
	if(req.session.username){
		res.render('my_template', {
			layout: false,
			username: req.session.username});
	}
	else{
		// return since it is an asynchronous call
		return res.redirect('/');
	}
});

app.get('/buy_template', function (req, res){
    
	//f(req.session.username){
		res.render('buy_template', {
			layout: false,
			username: req.session.username});
	//}
	//else{
		// return since it is an asynchronous call
		//return res.redirect('/');
	//}
});







// Sends back to the controller the GET data requested
// Store Controller makes Request to display all the tempaltes that have been approved
app.get('/templates', function(req, res){
	console.log("I received a GET request");
	
	//Users.collection.distinct
	Users.distinct('template', {"template.approved" : "true"},  function (err, docs){
		console.log(docs);	
		res.json(docs);
	});
	/* Users.findOne({"template.approved" : "true"}, "template", function (err, docs){
		console.log(docs);
		res.json(docs)
	}); */
	
	// Get the data from the database
	
});

// Return the templates that needs to be reviewed
// Revire Controller makes Request to display all templates that needs to be revied
app.get('/templates_review', function(req, res){
	console.log("I received a GET request");
	
	//Users.collection.distinct
	Users.distinct('template', {"template.approved" : "false"}, function (err, docs){
		console.log(docs);	
		res.json(docs);
	});
	// Get the data from the database
	
});


// Return the templates that needs to be reviewed
// My Templates Controller makes Request to display all templates that belongs to the user
app.get('/users_templates', function(req, res){
	console.log("I received a GET request");
	var user = req.session.username;
	//Users.collection.distinct
	Users.distinct('template', {"template.author" : user}, function (err, docs){
		console.log(docs);	
		res.json(docs);
	});
	// Get the data from the database
	
});


// View from the store, View from the Review to just get the template with the ID in the url
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
	
	Users.findOne({'template._id':template_id}, 'template',  function(err, doc){
		//console.log("\n This is the resule of the query" + doc + "\n");
		console.log(doc._id);
		
		//console.log(doc.template);
		//res.json(doc.template);
		Users.findOne({'_id': doc._id}, function (err, user) { 
			if(err) {
				return callback(err);
			}
			else{		
				console.log("This is the user" + user + "\n");
				console.log(user.template.id(template_id));
				res.json(user.template.id(template_id));
				
			}
		});	
	})
});


/* Request to display the specific template that is in the process of being purchased
app.get('/templates_buy', function (req, res){
	var template_id = req.params.id;

	console.log("\n This is the template id: " + template_id + "\n");

	
	Users.findOne({'template._id':template_id}, 'template',  function(err, doc){
		Users.findOne({'_id': doc._id}, function (err, user) { 
			if(err) {
				return callback(err);
			}
			else{		
				console.log("This is the user" + user + "\n");
				console.log(user.template.id(template_id));
				res.json(user.template.id(template_id));	
			}
		});	
	})
});
*/




app.post('/registration', function(req, res){
	console.log("Got POST request");
	console.log(req.body);
	
	//req.check('username').isAlphanumeric(); // check to see if not empty

    //var errors = req.validationErrors();

    //if (errors){
     //   res.status(400).send(errors);
    //} else {

    Users.Create(req.body, function (err, user) {
            if (err) {
                res.status(400).send(err);
            } else {
                res.redirect('/login');
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
	req.session.error = null;
	
    Users.getAuthenticated(req.body, function (err, token) {
        if (err) {
            console.log(err.message);
			console.log("The token is: " + token);
			//res.send(false);
            //res.status(400).send(err.message);
			//res.send(false);
			//res.status(400).send(err.message);
			req.session.error = err.message;
			console.log(req.session.error);
			return res.redirect('/login');
        } else {
			//console.log(token);
            //res.send(token);
			req.session.username = req.body.username;
			console.log(req.session.username);
			return res.redirect('/');
        }
    });
});




// Store the user created template into the document of templates
// Return the template id that was created
// Rename all the files to the template id
app.post('/create', function(req, res){
	console.log("Got POST request");
	console.log(req.body);
	console.log("\n" + req.files.file + "\n");
	
	// Defeat values if Ahmed makes a template
	if(req.session.username == "ahmed") {
		req.body.reviewed = "true";
		req.body.approved = "true";
	}
	
	
	// Initialize empty array to contain the list of identifiers that will be saved into the template
	var iList = [];
	// Empty variable to store the image path that will be saved into the template
	var iconPath = "";
	
		// Creates a template and sends the template ID as the response
		Users.CreateTemplate(req.body, function (err, response){
			if(err) {
				res.send(err.message);
			}
			else {
		
				var sampleFile;
				sampleFile = req.files.file;

				sampleFile.mv('upload/zips/' + response + '.zip', function(err) {
					if (err) {
						res.status(500).send(err);
					}
					else {
					   
						extract('upload/zips/' + response + '.zip', {dir: 'views/templates/' + response}, function (err) {
						//extract('upload/zips/' + template_id + '.zip', {dir: 'upload/templates/'}, function (err) {
							if (err) {
								res.status(500).send(err);
							}
							else {
								
								fs.readdir(__dirname + "/views/templates/" + response, function(err, files) {
								if (err) return;
								
								// Iterate through each file and change the names of the files to match the template id that was generated
								files.forEach(function(f) {
									console.log('Files: ' + f);
									
									
									if((f.substr(f.length -4)) ==  "html"){
										fs.rename('views/templates/' + response + '/' + f, 'views/templates/' + response + '/' + response + '.handlebars', function(err) {
											if ( err ) console.log('ERROR: ' + err);
										});										
									}
									
									if((f.substr(f.length - 3)) == "txt"){
										fs.readFile('views/templates/' + response + '/' + f, "utf-8", function (err, data) {
										  if (err) {
											return console.log(err);
										  }
										  var identifierList = data.split("\r\n");
										
										  //var identifierList = identifierList.split("\t");
										  for(var i = 0; i < identifierList.length; i++){
											  x = identifierList[i].split("\t");
											  iList.push(x);
										  }
										
										});
									}
									
									if((f.substr(f.length -3)) ==  "png"){
										fs.rename('views/templates/' + response + '/' + f, 'public/images/uploads/' + response + '.png', function(err) {
											if ( err ) console.log('ERROR: ' + err);
										});
										iconPath = "images/uploads/" + response + ".png";
										resizePath = "public/" + iconPath;
										jimp.read(resizePath, function (err, template) {
											if (err){ 
												console.log(err);
												return res.status(400).send(err);
											} //throw err;
											template.resize(256, 256)            // resize 
												 .quality(100)                 // set JPEG quality 
												 //.greyscale()                 // set greyscale 
												 .write(resizePath); // save 
										});
										console.log(iconPath);
									}
								
								});
									Users.EditTemplate(req.body.author, response, iList, iconPath, function (err, user) {
												if (err) {
													return res.status(400).send(err);
												} else {
													//res.redirect('/login');
													//return res.send(user);
													return res.redirect('/');
												}
										});								
							});	
						}	
					}); 
				}
			});			
		}
	});	  	
});



// Approve or Disapprove a template by changing it's field in the database
app.post('/approve', function(req, res){
	
	var author = req.body.author;
	var templateID = req.body.templateID;
	var approve = req.body.approve;
	var review = req.body.review;
	console.log("Got POST request");
	console.log(req.body);

    Users.approve(author, templateID, approve, review, function (err, response) {
            if (err) {
                res.send(err.message);
            } else {
				console.log(response);
                res.send(response);
            }
        });
   // }
});


var requestData = {
    requestEnvelope: {
        errorLanguage:  'en_US',
        detailLevel:    'ReturnAll'
    },
    payKey: 'AP-1234567890'
};
 
paypalSdk.callApi('AdaptivePayments/PaymentDetails', requestData, function (err, response) {
    if (err) {
        // You can see the error 
        console.log(err);
        //And the original Paypal API response too 
        console.log(response);
    } else {
        // Successful response 
        console.log(response);
    }
});



app.post('/render_purchased_template', function(req, res){
	console.log("Got POST request");
	console.log(req.body);
	req.body['layout'] = false;
	//req.check('username').isAlphanumeric(); // check to see if not empty

    //var errors = req.validationErrors();

    //if (errors){
     //   res.status(400).send(errors);
    //} else {
    res.render('templates/' + req.body['id'] + '/' + req.body['id'], req.body );

});








/*
	
	console.log("Got POST request");
	console.log(req.file);
	console.log(req.file.path);
	
	var zip = new admZip(req.file.path);
	console.log(zip.getZipComment());
	
	var zipEntries = zip.getEntries();
	
	zipEntries.forEach(function(zipEntry) {
        console.log(zipEntry.toString()); // outputs zip entries information
		//zipEntry.entryName = req.file.filename;
    });
	
	zip.extractAllTo("upload/templates/", true);






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




/*
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



app.get('/create_template', function (req, res){
    //res.sendfile('public/login.html');
	//res.sendFile('upload/templates/5/example_template.html', { root: __dirname });
	//res.render('5', { layout: false });
	tid = "5820c6c13de7b320f8dfd8b8";
	
	fs.realpath(__dirname, function(err, path) {
		if (err) {
			console.log(err);
		 return;
		}
		console.log('Path is : ' + path);
	});
	
	fs.readdir(__dirname + "/views/templates/5820c6c13de7b320f8dfd8b8", function(err, files) {
		if (err) return;
		files.forEach(function(f) {
			console.log('Files: ' + f);
			if(f.length > 5){
					console.log(f.substr(f.length - 4));
					if((f.substr(f.length -4)) ==  "html"){
						fs.rename('views/templates/5820c6c13de7b320f8dfd8b8/' + f, 'views/5.handlebars', function(err) {
							if ( err ) console.log('ERROR: ' + err);
						});
						//res.sendFile('views/templates/5820c6c13de7b320f8dfd8b8/' + f, { root: __dirname }); 
						
					}
			}
			if((f.substr(f.length - 3)) == "txt"){
				fs.readFile('views/templates/' + '5820c6c13de7b320f8dfd8b8' + '/' + f, "utf-8", function (err,data) {
										  if (err) {
											return console.log(err);
										  }
										  console.log(data);
										  var identifierList = data.split("\r\n");
										  var iList = [];
										  //var identifierList = identifierList.split("\t");
										  for(var i = 0; i < identifierList.length; i++){
											  x = identifierList[i].split("\t");
											  iList.push(x);
										  }
										  console.log(iList);
										  templateID = "5817bc792df6ef2bf8362b87";
										  author = "a";
										  Users.EditTemplate(author, tid, iList, function (err, user) {
												if (err) {
													res.status(400).send(err);
												} else {
													//res.redirect('/login');
													
												}
											});
			
					});
			}
			
		});
	});
	
	res.render('templates/5820c6c13de7b320f8dfd8b8/5820c6c13de7b320f8dfd8b8', {
							layout: false,
							company_Name: "Zaid's Hairy Chest",
							full_name: "Starboy",
							address: "P9 cleaner than your church shoes" ,
							job_Title: "Professional Fantasy Player",
							phone: "You wish you can get these digits"
							});
	
	
	
});


app.post('/upload', function(req, res){
		
		var template_id = 5;
		var sampleFile;
		sampleFile = req.files.file;
		//console.log(req.files);
		//console.log(req.files.file);
		sampleFile.mv('upload/zips/' + template_id + '.zip', function(err) {
			if (err) {
				res.status(500).send(err);
			}
			else {
			   
			    extract('upload/zips/'+template_id+'.zip', {dir: 'views/templates/'+template_id}, function (err) {
				//extract('upload/zips/' + template_id + '.zip', {dir: 'upload/templates/'}, function (err) {
					if (err) {
						res.status(500).send(err);
					}
					else{
						res.send('File uploaded!');
					}
				});
			   
			}
		});
});
	

*/




app.listen(3000);
console.log("Server running on port 3000");
