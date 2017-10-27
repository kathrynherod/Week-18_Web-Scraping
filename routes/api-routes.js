var db = require("../models");
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app) {
    // A GET route for scraping the echojs website
    app.get("/scrape", function(req, res) {
        // First, we grab the body of the html with request
        axios.get("https://www.theguardian.com/world/series/eyewitness").then(function(response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);

            // Now, we grab every h2 within an article tag, and do the following:
            $(".fc-container__inner").each(function(i, element) {
                // Save an empty result object
                var result = {};
                console.log(i);
                // Add the text and href of every link, and save them as properties of the result object
                result.title = $(this).children(".fc-container__body").children(".fc-slice-wrapper").children("ul").children("li").children(".fc-item").children(".fc-item__container").children("a").text();
                result.link = $(this).children(".fc-container__header").children("a").attr("href");
                result.desc = $(this).children(".fc-container__body").children(".fc-slice-wrapper").children("ul").children("li").children(".fc-item").children(".fc-item__container").children(".fc-item__content").children(".fc-item__standfirst").text();
                result.pubDate = $(this).children(".fc-container__header").children("a").children("time").text();
                result.photo = $(this).children(".fc-container__body").children(".fc-slice-wrapper").children("ul").children("li").children(".fc-item").children(".fc-item__container").children(".fc-item__media-wrapper").children(".fc-item__image-container").children("picture").children("source").attr("srcset");
                //    .children("picture source[media='(min-width: 980px)']").srcset;
                //    .children("picture").children("img").currentSrc;
                //    .children("picture").children("source").srcset;
                //    .children("picture").children("source").currentSrc;
                console.log(result);
                // Create a new Article using the `result` object built from scraping
                db.Article
                    .create(result)
                    .then(function(dbArticle) {
                        // If we were able to successfully scrape and save an Article, send a message to the client
                        res.redirect('/');
                    })
                    .catch(function(err) {
                        // If an error occurred, send it to the client
                        res.json(err);
                    });
            }); // close .each function
        }); // close axios
        //db.Article.remove({ photo: undefined });
        //db.Article.deleteOne({ "photo": undefined });
    }); //close app.get

    app.get("/clear", function(req, res) {
        // Grab every document in the Articles collection
        db.Article
            .remove({})
            .then(function(dbArticle) {
                // If we were able to successfully find Articles, send them back to the client
                res.redirect('/');
            })
            .catch(function(err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Route for getting all Articles from the db
    app.get("/articles", function(req, res) {
        // Grab every document in the Articles collection
        db.Article
            .find({})
            .then(function(dbArticle) {
                // If we were able to successfully find Articles, send them back to the client
                res.json(dbArticle);
            })
            .catch(function(err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Route for grabbing a specific Article by id, populate it with it's note
    app.get("/articles/:id", function(req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Article
            .findOne({ _id: req.params.id })
            // ..and populate all of the notes associated with it
            .populate("note")
            .then(function(dbArticle) {
                // If we were able to successfully find an Article with the given id, send it back to the client
                res.json(dbArticle);
            })
            .catch(function(err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Route for saving/updating an Article's associated Note
    app.post("/articles/:id", function(req, res) {
        // Create a new note and pass the req.body to the entry
        db.Note
            .create(req.body)
            .then(function(dbNote) {
                // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
                // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
                // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
                
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
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
};