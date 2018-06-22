var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;

var app = express();


app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


app.get("/scrape", function(req, res) {
    axios.get("https://www.npr.org/sections/art-design/").then(function(response) {
      var $ = cheerio.load(response.data);

      $("article").each(function(i, element) {
        var result = {};
  
        result.image = $(this).children("div").children("div").children("a").children("img")
          .attr("src");
        result.link = $(this).children("div").children("div").children("a")
          .attr("href");
        result.headline = $(this).children("div").children("h2")
          .text();
        result.summary = $(this).children("div").children("p").children("a")
          .text();
  
        db.Article.create(result)
          .then(function(dbArticle) {
            console.log(dbArticle);
          })
          .catch(function(err) {
            return res.json(err);
          });
      });
  
      res.send("Scrape Complete");
    });
  });
  
  app.get("/articles/", function(req, res) {
    db.Article.find({})
      .then(function(dbArticle) {
        res.render("articles", {"article": dbArticle});
      })
      .catch(function(err) {
        res.json(err);
      });
  });
  
  app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate("comments")
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });
  
  app.post("/articles/:id", function(req, res) {
    db.Comments.create(req.body)
      .then(function(dbComments) {
 
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { comments: dbComments._id }, { new: true });
      })
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });
  

  app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });