// Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var logger = require('morgan');
var mongoose = require('mongoose');

// Scraping tools
var axios = require('axios');
var cheerio = require('cheerio');

// Require all our models
var db = require('./models');

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Use morgan logger for logging requests
app.use(logger('dev'));

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));

// Use express.static to serve the public folder as static dir
app.use(express.static('public'));

// Handlebars
var exphbs = require('express-handlebars');

app.engine("hbs", exphbs({ defaultLayout: "main" }));
app.set("view engine", "hbs");

// Connect to MongoDB
mongoose.connect('mongodb://localhost/onion');

// Routes

// GET route for scraping the Onion website
app.get('/scrape', function(req, res) {
  // Grab the body of the html with request
  axios.get('https://www.theonion.com/').then(function(response) {
		// Load that into cheerio and save it to $
		var $ = cheerio.load(response.data);

		$('article h2')
  });
});
