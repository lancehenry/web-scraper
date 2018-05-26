// Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var logger = require('morgan');
var mongoose = require('mongoose');
var request = require('request');

// Scraping tools
var axios = require('axios');
var cheerio = require('cheerio');

// Require all models
var Article = require('./models/Article.js');
var Note = require('./models/Note.js');
// var db = require('./models');

var PORT = process.env.PORT || 8000;

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

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Connect to MongoDB
//mongoose.connect('mongodb://localhost/onion');

// Define local MongoDB URI
// var databaseUri = 'mongodb://localhost/onion';



var db = process.env.MONGODB_URI || "mongodb://localhost/onion";

mongoose.connect(db, function(error) {
  if (error) {
      console.log(error);
  }

else {
  console.log("mongoose connection is successful");
}
});



// Routes

// GET route displaying all articles
app.get('/', function(req, res) {
  //query the database to sort all entries from new to oldest
  Article.find()
    .sort({ _id: -1 })

    //execute the articles to handlebars and render
    .exec(function(err, doc) {
      if (err) {
        console.log(err);
      } else {
        var artcl = { article: doc };
        res.render('index', artcl);
      }
    });
});

// GET route for scraping the Onion website
app.get('/scrape', function(req, res) {
  // Grab the body of the html with request
  axios.get('https://politics.theonion.com/').then(function(response) {
    // Load that into cheerio and save it to $
    var $ = cheerio.load(response.data);

    $('article h1').each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, save them as properties of the result object
      var title = $(this)
        .children('a')
        .text();
      var link = $(this)
        .children('a')
        .attr('href');

      result.title = title;
      result.link = link;

      // Create a new Article using the 'result' object
      Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If error, sent it to the client
          return res.json(err);
        });
    });
    // If successful, send a message to the client
    res.redirect('/');
  });
});

app.get('/articles', function(req, res) {
  Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get('/articles/:id', function(req, res) {
  Article.findOne({ _id: req.params.id })
    .populate('note')
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.post('/articles/:id', function(req, res) {
  Note.create(req.body)
    .then(function(dbNote) {
      return Article.findOneAndUpdate(
        { _id: req.params.id },
        { note: dbNote._id },
        { new: true }
      );
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.listen(PORT, function() {
  console.log('App running on port ' + PORT + '!');
});
