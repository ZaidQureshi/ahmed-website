/*
Nodejs server
- Express model used for organizing web contact, allowing public files to be viewed
*/


// Configure the environment and API credentials for braintree
var braintree = require('braintree');
var gateway = braintree.connect({
	environment: braintree.Environment.Sandbox,
	merchantId: "z23ydwk2t9nkksgx",
	publicKey: "f8q9ryp4rnbjqpg4",
	privateKey: "61302bcc9938a0a3e6b9cb3460241302"
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

var nodemailer = require('nodemailer');

// Router to handle contact form being submitted
app.post('/contact_us', function (req, res){
	console.log(req.body);
	var transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: 'Leaflate17@gmail.com',
			pass: 'Lates2017%'
		}
	});

	var text = 'Name: ' + req.body.name + '\nEmail: ' + req.body.email + '\nUser ID: ' + req.body.userId + '\n\n' + req.body.message;
	var mailOptions = {
		from: req.body.email, // senders email
		to: 'testlates@gmail.com', // receivers email
		subject: req.body.subject, // Subject line
		text: text // body
		// html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if(error) {
			console.log(error);
			res.json({message: error});
			//return res.redirect('/');

		}
		else {
			console.log('Message sent:' + info.response);
			console.log(info);
			//res.json({message: info.response});
			return res.redirect('/');
		}
	});

});



app.engine('handlebars', exphbs({defaultLayout: 'main', helpers:  {partial: function (name) {
            return name;
        }}, layoutsDir: path.resolve(__dirname, 'views/layouts'), partialsDir: path.resolve(__dirname, 'views/partials')}));
//app.engine('handlebars', exphbs({defaultLayout: 'main',	helpers: { json: function (context) { return JSON.stringify(context); } } }));
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
	req.session.error = null;
	
});

app.get('/create', function (req, res){
	var isActive = false;
	if(req.session.username){
		var currentUser = req.session.username;
	    gateway.merchantAccount.find(currentUser, function (err, result) {
				if(err){
					console.log(err.message);
					//res.status(500).send(err);
				}
				console.log(result);
				if(result){
					if(result.status == "active"){
						isActive = true;
					}
				}
				return res.render('create', {
					layout: false,
					isActive: isActive,
					username: req.session.username});
		
			});
	}
	else {
		// return since it is an asynchronous call
		return res.redirect('/login');
	}
});

app.get('/submerchant', function (req, res){
    
	if(req.session.username){
		res.render('submerchant', {
			layout: false,
			username: req.session.username,
			submerchantError: req.session.submerchantError});
	}
	else{
		// return since it is an asynchronous call
		res.redirect('/');
	}
	req.session.submerchantError = null;
});


app.get('/logout',function(req,res){
	if(req.session.username){
		req.session.destroy(function(err) {
		  if(err) {
			console.log(err);
			//res.status(500).send(err);
		  } else {
			return res.redirect('/');
		  }
		});
	}
	else{
		return res.redirect('/');
	}
});

//user for testing file uploads
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
    
	if(req.session.username == "ahmed"){
		res.render('review', {
			layout: false,
			username: req.session.username});
	}
	else{
		// return since it is an asynchronous call
		// return to homepage if you are not Ahmed
		res.redirect('/');
	}
});


app.get('/review_template', function (req, res){
    
	if(req.session.username == "ahmed"){
		res.render('review_template', {
			layout: false,
			username: req.session.username});
	}
	else{
		// return since it is an asynchronous call
		// return to homepage if you are not Ahmed
		res.redirect('/');
	}
});


app.get('/my_template', function (req, res){
	var status;
	if(req.session.username){
		var currentUser = req.session.username;
		
	    gateway.merchantAccount.find(currentUser, function (err, result) {
			if(err){
				console.log(err.message);
			}
			if(result){
				console.log(result);
				status = result.status;
			}
			
			return res.render('my_template', {
						layout: false,
						username: req.session.username,
						merchantStatus: status});

		});
	}
	else{
		// return since it is an asynchronous call
		return res.redirect('/');
	}
});

app.get('/buy_template', function (req, res){
    
	if (req.session.username) {
		    res.render('buy_template', {
			layout: false,
			username: req.session.username
		});
	}
	else {
		res.redirect('/login');
	}
});

app.get('/checkout', function (req, res){


	//if (req.session.username) {
		// Send a client token to your client
		console.log("I got a GET request from" + req.session.username + "\n");
		console.log(req.query.id);
		var templateID = req.query.id;


		Users.findOne({'template._id':templateID}, 'template',  function(err, doc){
			if(err) {
				console.log(err);
				return res.send(err);
			}
			//console.log("\n This is the resule of the query" + doc + "\n");
			//console.log(doc._id);
			
			//console.log(doc.template);
			//res.json(doc.template);
			Users.findOne({'_id': doc._id}, function (err, user) { 
				if(err) {
					return callback(err);
				}
				else{		
					//console.log("This is the user" + user + "\n");
					//console.log(user.template.id(template_id));
					//res.json(user.template.id(template_id));

					//gateway.clientToken.generate({}, function (err, response) {
				 	//console.log(response.clientToken);
				    res.render('checkout', {
						layout: false,
						username: req.session.username,
						template: user.template.id(templateID),
						//clientToken: response.clientToken,
						checkout_uri: req.session.checkout_uri
						});
				//});


					
				}
			});	
		});

		
	//}
	//else {
	//	res.redirect('/');
	//}
});


app.get('/get_transactions', function (req, res){
    
	if (req.session.username) {

		var currentUser = req.session.username;
		Users.distinct('transaction', {username : currentUser},  function (err, docs){
			console.log(docs);	
			res.render('get_transactions', {
				layout: false,
				username: req.session.username,
				transactions: docs
			});	
		});
	}
	else{
		// return since it is an asynchronous call
		res.redirect('/login');
	}
});




app.post('/get_transactions', function (req, res){
	if(req.session.username) {

	  var transaction;
	  var transactionID = req.body.transactionID;
	  console.log(transactionID);
	  var currentUser = req.session.username;

	  Users.findOne({ username: currentUser},  function(err, doc){
			//console.log("\n This is the resule of the query" + doc + "\n");
			console.log(doc + "\n");
			for(i = 0; i < doc.transaction.length; i++){
				if (doc.transaction[i].transactionID == transactionID){
					console.log(doc.transaction[i]);
					transaction = doc.transaction[i];
				}
			}
		
			res.render("order", {
				layout: false,
				transaction: transaction,
				username: req.session.username
			});
	  	req.session.transactionID = null;
		});
	}

	else{
		res.redirect('/');
	}
});


// Sends back to the controller the GET data requested
// Store Controller makes Request to display all the tempaltes that have been approved
app.get('/templates', function(req, res){
	console.log("I received a GET request");
	
	//Users.collection.distinct
	Users.distinct('template', {"template.approved" : "true"},  function (err, docs){
		//console.log(docs);	
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

	if(req.session.username == "ahmed"){
		console.log("I received a GET request");
		
		//Users.collection.distinct
		Users.distinct('template', {"template.approved" : "false"}, function (err, docs){
			console.log(docs);	
			res.json(docs);
		});
		// Get the data from the database
	}
	else {
		res.redirect('/');
	}
});


// Return the templates that needs to be reviewed
// My Templates Controller makes Request to display all templates that belongs to the user
app.get('/users_templates', function(req, res){

	if(req.session.username){
		console.log("I received a GET request");
		var user = req.session.username;
		//Users.collection.distinct
		Users.distinct('template', {"template.author" : user}, function (err, docs){
			console.log(docs);	
			res.json(docs);
		});
		// Get the data from the database
	}
	else{
		res.redirect('/login');
	}
	
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
	
	
	//if (template_id != 'undefined') {
		Users.findOne({'template._id':template_id}, 'template',  function(err, doc){
			if(err) {
				console.log(err);
				return res.send(err);
			}
			//console.log("\n This is the resule of the query" + doc + "\n");
			//console.log(doc._id);
			
			//console.log(doc.template);
			//res.json(doc.template);
			Users.findOne({'_id': doc._id}, function (err, user) { 
				if(err) {
					return callback(err);
				}
				else{		
					console.log("This is the user" + user + "\n");
					//console.log(user.template.id(template_id));
					res.json(user.template.id(template_id));
					
				}
			});	
		});
	//}
});




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
	//req.session.error = null;
	
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
	if(req.session.username) {

	var sawHTML = false;
	var sawPNG = false;
	var sawTXT = false;

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
	// Get the author
	var author = req.body.author;
	// Initialize empty array to contain the list of field names
	var fieldName = [];

	//Store the author in the session to edit after the creation of the template is done
	req.session.author = author;
	
		// Creates a template and sends the template ID as the response
		Users.CreateTemplate(req.body, function (err, response){
			//Store the new id of the template for editing 
			req.session.createdTemplateID = response;
			if(err) {
				return res.send(err.message);
			}
			else {
		
				var sampleFile;
				sampleFile = req.files.file;

				sampleFile.mv('upload/zips/' + response + '.zip', function(err) {
					if (err) {
						return res.status(500).send(err);
					}
					else {
					   
						extract('upload/zips/' + response + '.zip', {dir: 'views/templates/' + response}, function (err) {
						//extract('upload/zips/' + template_id + '.zip', {dir: 'upload/templates/'}, function (err) {
							if (err) {
								return res.status(500).send(err);
							}
							else {
								
								fs.readdir(__dirname + "/views/templates/" + response, function(err, files) {
								if (err) {
									return res.status(500).send(err);
								}
								
								// Iterate through each file and change the names of the files to match the template id that was generated
								files.forEach(function(f) {
									console.log('Files: ' + f);
									
									
									if((f.substr(f.length -4)) ==  "html"){
										if(!sawHTML){
										fs.rename('views/templates/' + response + '/' + f, 'views/partials/' + response  + '.handlebars', function(err) {
											//if ( err ) console.log('ERROR: ' + err);
											if (err) {
												return res.send(err);
											}
											console.log(f);
											fs.readFile('views/partials/' + response  + '.handlebars', 'utf8', function(err, data) {
												  if (err) return  res.send(err);
												  console.log('OK: ' + f);
												  console.log(data);
												  //var temp = '{{full_Name}} {{address}} >{{job_Title}} {{phone}}</span></p>'

													//var re = new RegExp('/({{.*?}})/');
													var r = data.match(/{{.*?}}/g)
													//var r  = temp.match(re);
													if (r){
												    	console.log(r[1]);
												    	console.log(r);
												    }

												    //var iList = [];
												    for(i = 0; i < r.length; i++){
												    	var x = r[i].length - 4;
												    	//console.log(r[i].substr(2, x));
												    	iList.push(r[i].substr(2, x)); 
												    	//console.log(r[i].length);
												    	console.log(iList[i]);
												    }

												    for(i = 0; i < iList.length; i++){
														var str = iList[i].toLowerCase().split('_');
														for(j = 0; j < str.length; j++){
															str[j] = str[j].charAt(0).toUpperCase() + str[j].substring(1);
														}
													   	fieldName.push(str.join(' '));
													  	console.log(fieldName[i]);	
													}

												});
											sawHTML = true;
										});		
										}
									}	
									
									if((f.substr(f.length -3)) ==  "png"){
										if(!sawPNG){
										fs.rename('views/templates/' + response + '/' + f, 'public/images/uploads/' + response + '.png', function(err) {
											if ( err ) console.log('ERROR: ' + err);
											iconPath = "images/uploads/" + response + ".png";
											resizePath = "public/" + iconPath;
											jimp.read(resizePath, function (err, template) {
												if (err){ 
													//console.log(err);
													//return res.status(400).send(err);
													return res.status(500).send(err);
												} //throw err;
												sawPNG = true;
												template.resize(512, 512)            // resize 
													 .quality(100)                 // set JPEG quality 
													 //.greyscale()                 // set greyscale 
													 .write(resizePath); // save
												Users.EditTemplate(author, response, iList, iconPath, fieldName, function (err, user) {
												if (err) {
													 return res.status(400).send(err);
												} 
												else {
													console.log(user);
													return res.redirect('/my_template');
												}
									});
												
											});

											console.log(iconPath);

										});
									}
									}

								}); // end of filesForEach

								
							});	// end of reading all files in directory
						}	
					}); 
				}
			});			
		}// end of the else statement if not an error when creating the template
	});	// end of creating template 
	}
	else {
		return res.redirect('/');
	}	
});




// Approve or Disapprove a template by changing it's field in the database
app.post('/approve', function(req, res){
	if(req.session.username){
		var author = req.body.author;
		var templateID = req.body.templateID;
		var approve = req.body.approve;
		var review = req.body.review;
		console.log("Got POST request");
		console.log(req.body);

	    Users.approve(author, templateID, approve, review, function (err, response) {
	            if (err) {
	                return res.send(err.message);
	            } else {
					console.log(response);
	                //res.send(response);
	                return res.redirect('/review')
	            }
	        });
	   // }
	}
	else {
		return res.redirect('/');
	}
});


// Create transaction subdocument to store templates infomration to be rendered and redirect to the checkout page
// Store the template information that the user submitted for the template they want to purchase in a session
app.post('/render_purchased_template', function(req, res){

	if(req.session.username) {
		console.log("Got POST request");
		console.log(req.body);

		// Assign layout to be false when rendered with the template and template data
		req.body['layout'] = false;
		req.session.templateData = req.body;

		// Template ID to be stored in the transaction field of the user 
		var templateID = req.body.templateID;
		req.session.templateID = templateID;
		// Template Data that was entered by the user
		var templateData = req.body;
		// Author of the template to search for the author's access_token and account_id for the transaction
		var templateAuthor = req.body.templateAuthor;
		req.session.templateAuthor = templateAuthor;
		// The user (buyer) that is purchasing the template, used to append the transaction information to the user's account
		var currentUser = req.session.username;

		// Search for the author of the template to retrieve accesc_token and accound_id to process the transaction
		Users.findOne({ username: templateAuthor},  function(err, doc) {
			if(err) { return res.send(err.message); }

		
			console.log("Printing template for sale: ");
			console.log(doc.template.id(templateID));
			console.log(doc.template.id(templateID).price);
			var templatePrice = doc.template.id(templateID).price;
	
			// Assign settings for wepay instance
			var wepay_settings = {
				'client_id'     : '181327',
		    	'client_secret' : '059b31fd34',
			    //'access_token' : doc.accessToken //author's access_token
			}

			var wp = new wepay(wepay_settings);
			wp.use_staging(); // use staging environment (payments are not charged)

		    wp.call('/preapproval/create', {
		        	'client_id' : '181327',
		        	'client_secret' : '059b31fd34',
		        	'amount' : templatePrice,
		        	'short_description' : 'Template ID: ' + templateID +  ' Author: '+ templateAuthor,
		        	'period' : 'once',
		        	'currency' :'USD',
				//"redirect_uri": "http://localhost/order?",
			    	"redirect_uri": "http://localhost/order?",
			    		
		        },
		        function(payment) {
		        	console.log("Creating WePay Transaction.");
		        	payment = JSON.parse(payment.toString('utf8'));
		        	if(payment) {
		        		console.log(payment);
		        		req.session.checkout_uri = payment.preapproval_uri;
		        		req.session.preapproval_id = payment.preapproval_id;
		        		var preapproval_id = payment.preapproval_id;
		        		console.log(req.session.checkout_uri);
		        		req.session.transaction = payment;

		        		Users.CreateTransaction(templateID, templateData, currentUser, payment, payment.preapproval_id, function (err, response) {
											if (err) {
												res.send(err.message);
											} 
											else {
												console.log(payment);
												//req.session.templateData = null; 
												//req.session.transactionID = result.transaction.id;
								              	//return res.redirect("/order" + "?id=" + transactionID);
								              	return res.redirect("/checkout" + "?id=" + req.body.templateID);
										    }
										}); // end of storing the transaction into the database


					} // end of if statemnet
		        	else {
		        		return res.redirect('/index');
		        	}
		    }); // end of wp.call('/checkout/create')
    	}); // end of finding the author of template
	}
	else {
		return res.redirect('/');
	}
});


app.get('/orderComplete', function(req, res){

	var transactionID = req.session.transactionID;
	var transaction;
	currentUser = 'b';

	Users.findOne({ username: currentUser},  function(err, doc){
			//console.log("\n This is the resule of the query" + doc + "\n");
			console.log(doc + "\n");
			for(i = 0; i < doc.transaction.length; i++){
				if (doc.transaction[i].transactionID == transactionID){
					console.log(doc.transaction[i]);
					transaction = doc.transaction[i];
				}
			}
		
			res.render("order", {
				layout: false,
				transaction: transaction,
				username: req.session.username
			});
	  	//req.session.transactionID = null;
		});



});



app.get('/order', function (req, res) {

	console.log(req.query.preapproval_id);
	//var transaction = req.session.transactdion;	
	//console.log(transaction);
	var transactionID = req.query.preapproval_id;
	req.session.transactionID = transactionID;
	var preapproval_id = req.session.preapproval_id;
	var templateID = req.session.templateID;


	var templateAuthor = req.session.templateAuthor;
		// Search for the author of the template to retrieve accesc_token and accound_id to process the transaction
		Users.findOne({ username: templateAuthor},  function(err, doc) {
			if(err) { return res.send(err.message); }

			console.log(doc.accessToken);
			console.log(doc.accountID);
			console.log("Printing template for sale: ");
			console.log(doc.template.id(templateID));
			console.log(doc.template.id(templateID).price);
			var templatePrice = doc.template.id(templateID).price;
	
			
				       	var wepay_settings = {
					       	'account_id' : '69241989',
							'client_id' : '181327',
					    	'client_secret' : '059b31fd34',
						    'access_token' :  'STAGE_898b945443a6a489b8f2ed07d1b8ee0d9096b2ae1cc66209bed6e821ce4846f2',
						    'preapproval_id' : preapproval_id
						}

						var wp1 = new wepay(wepay_settings);
						wp1.use_staging(); // use staging environment (payments are not charged)


						var templatePriceAhmed = Math.floor(templatePrice *.5);
						wp1.call('/checkout/create', {
					        	'account_id' : '69241989',
					        	'amount' : templatePriceAhmed,
					        	'short_description' : 'Services rendered by freelancer',
					        	'type' : 'service',
					        	'currency' :'USD',
					        	'payment_method' : {
					        		'type' : 'preapproval',
					        		'preapproval' : {
					        			'id' : preapproval_id
					        		}
					        	},
					        },
					        function(response1){
					        	response1 = JSON.parse(response1.toString('utf8'));
					        	console.log(response1);


					        	var wepay_settings = {
							       	'account_id' : doc.accountID,
									'client_id' : '181327',
							    	'client_secret' : '059b31fd34',
								    'access_token' :  doc.accessToken,
								    'preapproval_id' : preapproval_id
								}

								var wp2 = new wepay(wepay_settings);
								wp2.use_staging(); // use staging environment (payments are not charged)


								var templatePriceMerchant = templatePrice - templatePriceAhmed;
								wp2.call('/checkout/create', {
							        	'account_id' : doc.accountID, //req.session.account_id,
							        	'amount' : templatePriceMerchant,
							        	'short_description' : 'Services rendered by freelancer',
							        	'type' : 'service',
							        	'currency' :'USD',
							        	'payment_method' : {
							        		'type' : 'preapproval',
							        		'preapproval' : {
							        			'id' : preapproval_id
							        		}
							        	},
							        },
							        function(response2){
							        	response2 = JSON.parse(response2.toString('utf8'));
							        	console.log(response2);
							        	return res.redirect('/orderComplete');
							        	

							    }); // end of wepay 'checkout/create' call 2 (template author)

					        }); // end of wepay 'checkout/create' call 1 (ahmed)

			});





/*
	currentUser = 'b';

	Users.findOne({ username: currentUser},  function(err, doc){
			//console.log("\n This is the resule of the query" + doc + "\n");
			console.log(doc + "\n");
			for(i = 0; i < doc.transaction.length; i++){
				if (doc.transaction[i].transactionID == transactionID){
					console.log(doc.transaction[i]);
					transaction = doc.transaction[i];
				}
			}
		
			res.render("order", {
				layout: false,
				transaction: transaction,
				username: req.session.username
			});
	  	//req.session.transactionID = null;
		});
*/

	/*
	
	if(req.session.username) {
	  var transaction;
	  var transactionID = req.session.transactionID;
	  //var transactionID = "g2z6xbe2";
	  console.log(transactionID);
	  var currentUser = req.session.username;
	  //var currentUser = "c";

	  Users.findOne({ username: currentUser},  function(err, doc){
			//console.log("\n This is the resule of the query" + doc + "\n");
			console.log(doc + "\n");
			for(i = 0; i < doc.transaction.length; i++){
				if (doc.transaction[i].transactionID == transactionID){
					console.log(doc.transaction[i]);
					transaction = doc.transaction[i];
				}
			}
		

	  
	  req.session.transactionID = null;

	  //gateway.transaction.find(transactionID, function (err, transaction) {
	    //result = createResultObject(transaction);
	  //});
	  });
	}

	else{
		//res.redirect('/');
	}
	*/
	

});


app.post('/checkout', function(req, res) {

	if(req.session.username) {
		console.log(req.body);
		// Receive a payment method nonce from the client
		var nonce = req.body.payment_method_nonce;
		console.log(nonce);
		//res.send("Success");

		var currentUser = req.session.username;
		console.log(currentUser);
		var templateID = req.body.templateID; 
		var templateData = req.session.templateData;
		var merchantAccountId = req.body.templateAuthor;
		console.log("This is the seller: " + merchantAccountId);
		console.log("This is the buyer: " + currentUser);

		var templatePrice = req.body.price;
		var serviceFee = 0.1;
		var serviceAmount = (templatePrice*serviceFee);
		serviceAmount = Math.ceil(serviceAmount);
		console.log(templatePrice);
		console.log(serviceAmount);

		if(merchantAccountId == "ahmed"){
				// Create the Transaction
				gateway.transaction.sale({
				  //merchantAccountId: merchantAccountId,
				  amount: templatePrice,
				  //serviceFeeAmount: serviceAmount,
				  paymentMethodNonce: nonce,
				  options: {
				    submitForSettlement: true
				  }
				}, function (err, result) {
					if (err) {
						res.send(err.message);
					}
					else {
						if(result.success){
							console.log(result.success);
							console.log(result.transaction);
							var transaction = result.transaction;
							var transactionID = result.transaction.id;
							//console.log(result); 	

							// If transaction is successful, render template that was requested for purcahse with the data stored in transaction
							if(result.success){
								Users.CreateTransaction(templateID, templateData, currentUser, transaction, transactionID, function (err, response) {
						            if (err) {
						                res.send(err.message);
						            } else {
										console.log(response);
										req.session.templateData = null; 
										req.session.transactionID = result.transaction.id;
						                return res.redirect("/order" + "?id=" + transactionID);
						            }
						        });
								
								
							}
						}
						else{
							console.log(result.success);
							return res.redirect("/");
						}
					}

				});
				//res.send("Success");
			}
			else {
			// Create the Transaction
				gateway.transaction.sale({
				  merchantAccountId: merchantAccountId,
				  amount: templatePrice,
				  serviceFeeAmount: serviceAmount,
				  paymentMethodNonce: nonce,
				  options: {
				    submitForSettlement: true
				  }
				}, function (err, result) {
					if (err) {
						res.send(err.message);
					}
					else {
						if(result.success){
							console.log(result.success);
							console.log(result.transaction);
							var transaction = result.transaction;
							var transactionID = result.transaction.id;
							//console.log(result); 	

							// If transaction is successful, render template that was requested for purcahse with the data stored in transaction
							if(result.success){
								Users.CreateTransaction(templateID, templateData, currentUser, transaction, transactionID, function (err, response) {
						            if (err) {
						                res.send(err.message);
						            } else {
										console.log(response);
										req.session.templateData = null; 
										req.session.transactionID = result.transaction.id;
						                return res.redirect("/order" + "?id=" + transactionID);
						            }
						        });
								
								
							}
						}
						else{
							console.log(result.success);
							console.log("Something went wrong here");
							console.log(result);
							return res.redirect("/");
						}
					}

				});
				//res.send("Success");
			}

		}
		
		else {
			res.redirect('/');
		}

});


var hbs = exphbs.create({
    defaultLayout: 'main'
    //helpers: require("path-to-your-helpers-if-any"),
});

var htmlToPdf = require('html-to-pdf');
var pdf = require('html-pdf');

app.post('/render_template', function(req, res) {
	//if(req.session.username) {

		//var currentUser = req.session.username;
		var currentUser = 'b';
		console.log(currentUser + " is the user");
		console.log(req.body);
		//var currentUser = req.session.username;
		//var currentUser = "c";
		var transactionID = req.body.transactionID; 
		console.log(transactionID);
		var transaction;

		Users.findOne({ username: currentUser},  function(err, doc){
			//console.log("the user is: " + doc);
			if(err) {
				return res.send(err.message);
			}
			if(doc) {
				for(i = 0; i < doc.transaction.length; i++){
					console.log("Printing the Transactions");
					console.log(doc.transaction.id);
					if (doc.transaction[i].id == transactionID){
						console.log(doc.transaction[i]);
						transaction = doc.transaction[i];
					}
				}
			}
			else {
				return res.redirect('/');
			}

			//console.log(transaction);
			console.log("This is the transaction: /n" + transaction);
			var templateData = transaction.templateData;
			var templateID = templateData.templateID;
			console.log(templateData);
			console.log(templateID);

			res.render('partials/' + templateID, templateData, function(err, hbsTemplate){
			     // hbsTemplate contains the rendered html, do something with it...
			     if(err){
			     	return res.send(err.message);
			     	//res.status(500).send(err);
			     }
			     console.log(hbsTemplate);
			     var html = hbsTemplate; //Some HTML String from code above 


			     Users.findOne({'template._id':templateID}, 'template',  function(err, user){
			     	if(err) {
			     		return res.send(err);
			     	}

					console.log(user);
					console.log(user.template.id(templateID));
					template = user.template.id(templateID);

					var options = { 
					//"height": template.height,         
	  				//"width": template.width
	  				height: template.height+"px",
	  				width: template.width+"px"
					};
					console.log(options.height);
					console.log(options.width);
				 
					pdf.create(html, options).toFile('views/pdf/' + transactionID + '.pdf', function(err, templatePDF) {
					  if (err) {
					  	return res.send(err);
					  }

					  console.log(templatePDF); // { filename: '/app/businesscard.pdf' } 

					  //return res.sendFile(templatePDF); 
					  var downloadtemplate = 'views/pdf/' + transactionID + '.pdf';
					  return res.download(downloadtemplate);

					});

				});

			});
		});
	//}

	//else {
	//	return res.redirect('/');
	//}
});



// load in your modules
var wepay = require('wepay').WEPAY;       // if wepay.js is installed globally/locally
// var wepay = require('./wepay').WEPAY;  // if wepay.js is in the same directory as your script

app.post('/createWepayToken', function(req, res) {
	console.log(req.body);
	console.log("Creating WePay access token.");

	// local variables
	var wepay_settings = {
	    'client_id'     : '181327',
	    'client_secret' : '059b31fd34', // used for oAuth2
	    // 'api_version': 'API_VERSION'
	}

	var wp = new wepay(wepay_settings);
	wp.use_staging(); // use staging environment (payments are not charged)

	wp.call('/oauth2/token',
    {
    	'client_id'     : '181327',
    	'client_secret' : '059b31fd34',
        "redirect_uri": "http://localhost:80/",
        "code": req.body.data
    },

    function(response) {
        console.log(response);
        req.session.access_token = response.access_token;
        return res.redirect('/createWepayAccount');
    	}
	);
});

app.get('/createWepayAccount', function(req, res){
	// local variables
	var wepay_settings = {
	    'access_token' : req.session.access_token
	}

	var wp = new wepay(wepay_settings);
	wp.use_staging(); // use staging environment (payments are not charged)

	wp.call('/account/create', {
        	'name' : req.session.username,
        	'description' : req.session.username + " seller's account"
        },

        function(account) {
        	console.log("Creating WePay Account.");
        	if(account.account_id) {
        		console.log(account);
        		req.session.account_id = account.account_id;
        		Users.CreateMerchantAccount(req.session.username, account.account_id, req.session.access_token, function(err, response){
        			if(err){
        				res.send(err.message);
        			}
        			else{
        				console.log(response);
        				//return res.redirect();
        			}
        		});
        	}
        	else {
        		return res.redirect('/');
        	}
    });
});


app.get('/createWepayTransaction', function(req, res){
	var currentUser = 'a';

	Users.findOne({ username: currentUser},  function(err, doc){
			//console.log("the user is: " + doc);
		if(err) {
			return res.send(err.message);
			}

	console.log(doc);
	console.log(doc.accessToken);
	console.log(doc.accountID);

	// local variables
	var wepay_settings = {
		'client_id'     : '181327',
    	'client_secret' : '059b31fd34',
	    'access_token' : doc.accessToken //req.session.access_token
	}

	var wp = new wepay(wepay_settings);
	wp.use_staging(); // use staging environment (payments are not charged)

	wp.call('/checkout/create', {
        	'account_id' : doc.accountID, //req.session.account_id,
        	'amount' : 10,
        	'short_description' : 'Services rendered by freelancer',
        	'type' : 'service',
        	'currency' :'USD',
        	"hosted_checkout": {
		      "redirect_uri": "http://localhost/order?"
       		},

        },
        function(payment) {
        	console.log("Creating WePay Transaction.");
        	if(payment) {
        		console.log(payment);
        		req.session.checkout_uri = payment.hosted_checkout.checkout_uri;
        		console.log(req.session.checkout_uri);
        		return res.redirect('/checkout');
        	}
        	else {
        		return res.redirect('/index');
        	}
    });
    	});
});




app.post('/submerchant', function(req, res) {

	if(req.session.username) { 
		var currentUser = req.session.username;
		//var currentUser = "d";
		console.log(req.data);

		console.log(req.body);

		merchantAccountParams = {
		  individual: {
		    firstName: req.body.firstName,
		    lastName: req.body.lastName,
		    email: req.body.email,
		    dateOfBirth: req.body.dateOfBirth,
		    //dateOfBirth: "1981-11-19",
		    address: {
		      streetAddress: req.body.streetAddress,
		      locality: req.body.locality,
		      region: req.body.region,
		      //region: "IL",
		      postalCode: req.body.postalCode
		    }
		  },
		  funding: {
		    destination: braintree.MerchantAccount.FundingDestination.Email,
		    email: req.body.venmoEmail,
		  },
		  tosAccepted: true,
		  masterMerchantAccountId: "lates",
		  id: currentUser
		};

		/*
		gateway.merchantAccount.find(currentUser, function (err, result) {
			if(err){
				console.log(err.message);
			}
			console.log(result);
		});*/

		gateway.merchantAccount.create(merchantAccountParams, function (err, result) {
			if(err) {
				console.log("This is the error:" + err);
				return res.redirect('/submerchant');
				//res.status(500).send(err);
			}
			else {
				/*
				console.log(result);
				console.log(result.message);
				var errors = result.errors.deepErrors();
				console.log(errors);
				console.log(result.merchantAccount);*/
				if(result.merchantAccount){
					console.log(result.merchantAccount.status);
					console.log(result.merchantAccount.id);
					console.log(result.merchantAccount.masterMerchantAccount.id);	
					return res.redirect('/my_template');
				}
				else {
					req.session.submerchantError = result.message;
					return res.redirect('/submerchant');
				}

			}
			
		});
	}

	else {
		res.redirect('/');
	}

});


app.post('/render_template_review', function(req, res) {
	if(req.session.username) {

		//var templateUser = req.body.author;
		req.body['layout'] = false;
		console.log(req.body);


		var templateData = req.body;
		var templateID = req.body.templateID;
	
			res.render('partials/' + templateID, templateData, function(err, hbsTemplate){
			     // hbsTemplate contains the rendered html, do something with it...
			     if(err){
			     	return res.send(err.message);
			     	//res.status(500).send(err);
			     }
			     console.log("Printing template html code");
			     console.log(hbsTemplate);
			     var html = hbsTemplate; //Some HTML String from code above 


			     Users.findOne({'template._id':templateID}, 'template',  function(err, user){
			     	if(err) {
			     		return res.send(err);
			     	}

					//console.log(user);
					//console.log(user.template.id(templateID));
					template = user.template.id(templateID);

					var options = { 
					"height": template.height,         
	  				"width": template.width
					};
					console.log(options.height);
					console.log(options.width);
				 
					pdf.create(html, options).toFile('views/review_pdf/' + templateID + '.pdf', function(err, templatePDF) {
					  if (err) {
					  	return res.send(err);
					  }

					  console.log(templatePDF); // { filename: '/app/businesscard.pdf' } 

					  //return res.sendFile(templatePDF); 
					  var downloadtemplate = 'views/review_pdf/' + templateID + '.pdf';
					  return res.download(downloadtemplate);

					});

				});

			});
		
	}

	else {
		redirect('/');
	}
});



app.listen(80);
console.log("Server running on port 80");
