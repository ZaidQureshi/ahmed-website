/*
Nodejs server
- Express model used for organizing web contact, allowing public files to be viewed
*/

// Require express modules to be used
var express = require('express');
var app = express();

// Allow public files (html, css, javascript) to be run on the server
app.use(express.static(__dirname + "/public"));

app.listen(3000);
console.log("Server running on port 3000");