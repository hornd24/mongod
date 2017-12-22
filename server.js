//Require NPM packages needed to create a server
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
var db = require("./models");
// const db = require("./models");
const exphbs = require("express-handlebars");
const logger = require("morgan");
const mongoose = require("mongoose");
const cheerio = require("cheerio");
//Set up express APP and create PORT to start listening to 
const app = express();
const PORT = process.env.PORT || 8000;
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
app.use(logger("dev"));
mongoose.Promise = Promise;
mongoose.connect(
 MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/news", {
  useMongoClient: true
});

app.use(bodyParser.json());
//parses urlencoded bodies 
app.use(bodyParser.urlencoded({ extended: true}));
//parses text 
app.use(bodyParser.text());

// //link libraries / sscript files to this folder
app.use(express.static("public/assets"));


require("./controller/api-routes.js")(app);
// require("./controller/html-routes.js")(app);


    app.listen(PORT, function() {
      console.log("App listening on PORT " + PORT);
    });
