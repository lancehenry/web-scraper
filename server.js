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

		$('h2.js_curation-click').each(function(i, element) {
      
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, save them as properties of the result object
      result.title = $(this).children('a').text();
      result.link = $(this).children('a').attr('href');

      // Create a new Article using the 'result' object
      db.Article.create(result).then(function(dbArticle) {
        console.log(dbArticle);
      })
      .catch(function(err) {
        // If error, sent it to the client
        return res.json(err);
      });
    });
    // If successful, send a message to the client
    res.send('Scrape complete!');
  });
});
