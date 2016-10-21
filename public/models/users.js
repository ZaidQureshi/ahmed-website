/**
 * Module dependencies
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var jsonwebtoken = require('jsonwebtoken');
var SALT_WORK_FACTOR = 12;
/**
 * User schema
 */
 
 
var TemplateSchema = new mongoose.Schema({
  name: {type: String, required: true},
  category: {type: String, required: true},
  icon: {type: String, required: true},
  price: {type: Number, required: true},
  author: {type: String, required: true}
});


 
var UserSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  username: {type: String, required: true, index: {unique: true}},
  password: {type: String, required: true},
  template: [TemplateSchema]
});


/**
 * Pre-save hooks
 * Hash Password before saving into the database
 */
UserSchema.pre('save', function (next) {
  var user = this;
  console.log('saving user!');
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      // override the clear-text password with the hashed one
      user.password = hash;
      next();
    });
  });
});


/**
 * Methods
 */
UserSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return callback(err);
    return callback(null, isMatch);
  });
};


/**
 * Statics
 */

UserSchema.statics.getAuthenticated = function (user, callback) {
  console.log('getAuthenticated', user);
  var emptyToken = '';
  this.findOne({username: user.username}, function (err, doc) {
    if (err) {
      console.log(err);
      return callback(err);
    }

    // make sure the user exists
    else if (!doc) {
      console.log('No user found,');
      return callback(new Error('Invalid username or password.', 401), emptyToken);
    }
    else {
      // test for a matching password
      doc.comparePassword(user.password, function (err, isMatch) {
        if (err) {
          console.log(err);
          return callback(err);
        }

        // check if the password was a match
        if (isMatch) {
          var user = {
            username: doc.username,
            id: doc.id,
            name: doc.name,
            email: doc.email
          };

          // return the jwt
          var token = jsonwebtoken.sign(user, 'supersecret', {
            expiresIn: 86400 // expires in 24 hours, expressed in seconds
          });
          return callback(null, token, user);
        }
        else {
          return callback(new Error('Invalid username or password.'), emptyToken);

        }
      });
    }
  });
};

/*
UserSchema.statics.Create = function (user, callback) {
  // find a user in Mongo with provided username
  this.findOne({'username': user.username}, function (err, doc) {
    // In case of any error return
    if (err) {
      return callback(err);
    }
    // already exists
    if (doc) {
      return callback(new Error('Username Already Exists'), false);
    } 
	else {

      if (user.password != user.confirm) {
        return callback(new Error('Passwords do not match.'), false);
      }

      // if there is no user with that username
      // create the user
      var User = mongoose.model('User', UserSchema);
      var newUser = new User({
        password: user.passwrd,
        username: user.username,
        name: user.name,
        email: user.email
      });
		
		
      // save the user
	  
      newUser.save(function (err) {
        // In case of any error, return using the done method
		console.log("Still good....\n")
        if (err) {
		  console.log("Still good....\n")
		  return callback(err, newUser); 
        }
		else{
        // User Registration succesful
        return callback(null, newUser);
		console.log("Still good....\n")
		}
      })
	  
    }
  });
};
*/



UserSchema.statics.Create = function (user, callback) {
      // create the user
      var User = mongoose.model('User', UserSchema);
      var newUser = new User({
        password: user.passwrd,
        username: user.username,
        name: user.name,
        email: user.email
      });
		
      // save the user
      newUser.save(function (err) {
        // In case of any error, return using the done method
		console.log("Still good....\n")
        if (err) {
			console.log("Still good....\n")
			console.log(err);
			return callback(err, newUser); 
        }
		else {
			// User Registration succesful
			return callback(null, newUser);
		}
      });
};

UserSchema.statics.usernameAvailable = function (username, callback) {
  // find a user in Mongo with provided username
  console.log("Username: " + username);
  console.log(username);
  this.findOne({'username': username}, function (err, doc) {
    
	console.log(err);
	console.log(doc);
	// In case of any error return
    if (err) {
      return callback(err);
    }	
	
    // already exists
    if (doc) {
      //return callback(new Error('Username Already Exists'), false);
	  return callback(null, false);
    } 
	
	// username doesn't exist
	else {
		return callback(null, true);

    }
  });
};

//Submit user entered information and store it into database
UserSchema.statics.CreateTemplate = function (template, callback) {

	// Call the model and schema
	var Template = mongoose.model('Template', TemplateSchema);
	// Create instance of Template following the schema
	var newTemplate = new Template({
		name: template.name,
        category: template.category,
        icon: template.icon,
        price: template.price,
		author: template.author
	});

	this.findOne({'username': template.author}, function (err, user) { 
	if(err) {
		return callback(err);
	}
	else{		
		console.log("This is the user" + user + "\n");
		user.template.push(newTemplate);
		console.log("This is the user's template" + user.template + "\n" + "This is the user as a whole" + user + "\n");
		user.save(function(err) {
			if(err) { return callback(err); }
			
			else {
				return callback(null, user);
			}
		});
		
	}	 	  
	});
};







/*
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));
*/

/**
 * Register UserSchema
 */
 
// Create a model to use the Schema
var Template = mongoose.model('Template', TemplateSchema); 

// Make this available to our users in our Node applications
module.exports = Template;
 
 
// Create a model to use the Schema
var User = mongoose.model('User', UserSchema); 

// Make this available to our users in our Node applications
module.exports = User;


