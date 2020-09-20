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
const GridFsStorage = require("multer-gridfs-storage");
const methodOverride = require("method-override");
// end of requiring dependencies



// varibale declarations
const app = express();
const port = process.env.PORT || 3000;
const mongoURI = "mongodb://localhost:27107/photogallerydb";
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
 * create storage engine
 * initialize gridfs stream
 */
// connect to database
const connect = mongoose.createConnection(mongoURI, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});

// create model for gallery collection
const gallerySchema = mongoose.Schema({
    path: {type: String},   // store path of uploaded image
    caption: {type: String} // user caption
});
const Gallery = mongoose.model("Gallery", gallerySchema);

// create storage engine
const storage = new GridFsStorage({
    url: mongoURI,
    file: function(req, file){
        return {
            filename: "file_" + Date.now()
        }
    }
});
const upload = multer({storage});

// initialize gridfs stream
connect.once("open", function(){
    let gfs = new mongoose.mongo.GridFSBucket(connect.db);
});




app.get("/", function(request, respond){
    respond.sendFile(__dirname + "/public/gallery.html");
});

app.listen(port, function(){
    console.log("server is listening on port " + port);
});
