

const axios = require("axios");
const cheerio = require("cheerio");
var db = require("./../models");
module.exports = function (app) {
app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with request
    axios.get("https://www.thedailybeast.com/category/us-news/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
      // Now, we grab every h2 within an article tag, and do the following:
      $("article.LatestCard").each(function(i, element) {
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(element).children('div.LatestCard__info')
          .children('a').children('h2.LatestCard__heading')
          .text();
        result.summary = $(element).children('div.LatestCard__info')
          .children("p.LatestCard__description")
          .text();
          result.url=$(element).children('div.LatestCard__info')
          .children('a').attr('href');
//  res.send(result.url)
        // Create a .new Article using the `result` object built from scraping
        db.Articles
          .create(result)
          .then(function(dbArticle) {
            // If we were able to successfully scrape and save an Article, send a message to the client
            res.send("Scrape Complete");
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
          });
      });
    });
  });

  app.get('/',function(req,res){
    db.Articles
    .find({})
    .then(function(Article) {
        console.log(Article)
      // If we were able to successfully find Articles, send them back to the client
      res.render('articles',{Article})
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
      
    });
  })
  app.get('/i',function(req,res){
    db.Notes
    .find({})
    .then(function(Article) {
        console.log(Article)
        console.log(Article)
      // If we were able to successfully find Articles, send them back to the client
      res.render('articles',{Article})
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
      
    });
  })

  app.get('/articles/:id',function(req,res){
    db.Articles
    .findById(req.params.id)
    // ..and populate all of the notes associated with it
    .populate("Notes")
    .then(function(dbArticle) {
        console.log(dbArticle)
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
  })

  app.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Notes
      .create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { notes: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
}