// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the articles information on the page
      $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].headline + "<br />" + data[i].link +"<br />" + data[i].summary + "<br />" + data[i].immage + "<br />" + data[i].comments + "</p>");
    }
  });
 
  $(document).on("click", "p", function() {
    
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the comments information to the page
      .then(function(data) {
        console.log(data);
        // The headline of the article
        $("#articles").append("<h2>" + data.headline + "</h2>");
        // An input to enter a new comment
        $("#comments").append("<input id='titleinput' name='headline' >");
        // A textarea to add a new comment body
        $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new articles, with the id of the article saved to it
        $("#comments").append("<button data-id='" + data._id + "' id='savecomments'>Save Comments</button>");
  
        // If there's a comment on the article
        if (data.comments) {
          // Place the headline of the articles in the headline input
          $("#titleinput").val(data.articles.headline);
          // Place the body of the articles in the body textarea
          $("#bodyinput").val(data.articles.body);
        }
      });
  });
  
  // When you click the savearticles button
  $(document).on("click", "#savearticles", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the articles, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/comments/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from comments textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the articles section
      });
  
    // Also, remove the values entered in the input and textarea for articles entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
  