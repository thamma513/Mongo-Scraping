var express = require("express");
var db = require("/models")

var router = express.Router();



// Create all our routes and set up logic within those routes where required.
router.get("/", function(req, res) {
  db.articles.all(function(data) {
    var hbsObject = {
      articles: data
    };
    console.log(hbsObject);
    res.render("articles", hbsObject);
  });
});

router.post("/api/comments", function(req, res) {
  comments.create(["title", "body"], [req.body.title, req.body.body], function(result) {
    // Send back the ID of the new quote
    res.json({ id: result.insertId });
  });
});


// Export routes for server.js to use.
module.exports = router;
