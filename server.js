const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');

const axios = require('axios');
const cheerio = require('cheerio');

const db = require('./models');

const PORT = 3000;

const app = express();

app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/articlesdb';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });


app.get('/scrape', function(req, res) {
  axios.get('http://www.bbc.com/').then(function(response) {
    const $ = cheerio.load(response.data);
    console.log('scraped');

    $("div.media__content").each(function(i, element) {
      let result = {};

      result.title = $(this).find('a.media__link').text().trim();
      result.link = 'http://www.bbc.com' + $(this).find('a.media__link').attr('href').trim();
      result.summary = $(this).find('p.media__summary').text().trim();

      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });

      

    });
    res.send('Scrape Complete');
  });
});

app.get('/articles', function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get('/articles/:id', function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate('note')
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.post('/articles/:id', function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id}, { new: true });
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