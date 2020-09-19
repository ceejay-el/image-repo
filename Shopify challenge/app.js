/**
 # UPLOAD IMAGES TO REPOSITORIES
 * upload images to mongodb using mongoose and multer
 * include user authentication with md5 encryption
 */
// require dependencies
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
// end of requiring dependencies

// varibale declarations
const app = express();
const port = process.env.PORT || 3000;
// end of variable declarations

/**
 ## MIDDLEWARE
 */
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
//end of middleware


/**
 ## DATABASE 
 * connect to the database
 * create model for gallery collection
 */
// connect to database
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://{}", {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

// create model for gallery collection
const gallerySchema = mongoose.Schema({
    path: {type: String},
    caption: {type: String}
});
const Gallery = mongoose.model("Gallery", gallerySchema);


app.get("/", function(request, respond){
    respond.sendFile(__dirname + "/public/gallery.html");
});

app.listen(port, function(){
    console.log("server is listening on port " + port);
})