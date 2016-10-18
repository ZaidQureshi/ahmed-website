/**
 * Module dependencies
 */
var mongoose = require('mongoose');

//var jsonwebtoken = require('jsonwebtoken');

/**
 * Template schema
 */
var TemplateSchema = new mongoose.Schema({
  name: {type: String, required: true},
  category: {type: String, required: true},
  icon: {type: String, required: true, index: {unique: true}},
  price: {type: Number, required: true},
  author: {type: String, required: true}
});


/**
 * Pre-save hooks
 * 
 */
TemplateSchema.pre('save', function (next) {
  var template = this;
  console.log('Saving Template!');
  next();
});

/**
 * Methods
 */
 


/**
 * Statics
 */
 
TemplateSchema.statics.Create = function (template, callback) {

	  
      var Template = mongoose.model('Template', TemplateSchema);
      var newTemplate = new Template({
        name: template.name,
        category: template.category,
        icon: template.icon,
        price: template.price,
		author: template.author
      });

      // save the template
      newTemplate.save(function (err) {
        // In case of any error, return using the done method
        if (err) {
          return callback(err);
        }
        // Template creation succesful
        return callback(null, newTemplate);
      });
    };




/**
 * Register TemplateSchema
 */
 
// Create a model to use the Schema
var Template = mongoose.model('Template', TemplateSchema); 

// Make this available to our Node applications
module.exports = Template;


