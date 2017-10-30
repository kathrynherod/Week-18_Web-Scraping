var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
// mongoose.connect("mongodb://localhost/webscrapingHW", {
//     useMongoClient: true
// });



// // Routes
// // =============================================================
require("./routes/api-routes.js")(app);

// // Start the server
// app.listen(PORT, function() {
//     console.log("App running on port " + PORT + "!");
// });

var db = process.env.MONGODB_URI || "mongodb://localhost/webscrapingHW";

mongoose.connect(db, function(error) {
  if (error) {
      return error;
  }
  else {
    console.log("Connection Success!");
  }
});

app.listen(PORT, function() {
  console.log("Listening on port:" + PORT);
});