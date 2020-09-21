/**
 # UPLOAD IMAGES TO REPOSITORY
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
const path = require("path");
const gridfsStream = require("gridfs-stream");
const md5 = require("md5");
// end of requiring dependencies




// varibale declarations
const app = express();
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGODB_URI;
// end of variable declarations




/**
 ## MIDDLEWARE
 */
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
//end of middleware




/**
 ## DATABASE
 * set up new user database
 *
 * connect to the database
 * create model for gallery collection
 * create storage engine
 * initialize gridfs stream
 */
// set up new user database
const userSchema = {
    username: String,
    password: String
};
const User = new mongoose.model("User", userSchema);

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




/**
 * USER AUTHENTICATION
 */

app.get("/", function(request, respond){
    respond.sendFile(__dirname + "/public/login.html");
});

app.get("/signup", function(request, respond){
    respond.sendFile(__dirname + "/public/signup.html");
})

app.post("/signup", function(request, respond){
    const newUser = new User({
        username: request.body.username,
        password: md5(request.body.password)
    });
    newUser.save(function(err){
        if (err)
            console.log(err)
        else
            respond.sendFile(__dirname + "/public/gallery.html");
    });
});




// upload up to 3 images
app.post("/", upload.array("file", 3), function(request, respond, next){
    respond.json({file: request.JSON});
});



app.listen(port, function(){
    console.log("server is listening on port " + port);
});
