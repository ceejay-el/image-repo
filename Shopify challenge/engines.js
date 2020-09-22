/**
 # UPLOAD IMAGES TO REPOSITORIES
 * upload images to mongodb using mongoose and multer
 * include user authentication with md5 encryption
 */
// require dependencies
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const methodOverride = require("method-override");
const path = require("path");
const gridfsStream = require("gridfs-stream");
const md5 = require("md5");
const util = require("util");
// end of requiring dependencies



// varibale declaration and assignments
const app = express();
const userdbURI = process.env.USERDB_URI;
// end of variable declarations





/**
 ### USER DATABASE
 * connect to user database
 * create model for user collection
 * initialize user server
 */
// connect to user database
async function connectUserdb(){
    try {
        await mongoose.connect(userdbURI, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
        console.log("connected to userdb!");
    } catch (err) {
        console.log(err);
        throw(err);
    }
}

// configure user model
const userSchema = mongoose.Schema({
    username: String,
    password: String
});
const User = new mongoose.model("User", userSchema);

// initialize mongo userdb server
connectUserdb();

// handle user registration with md5 encryption
/*
function registerUser(request, respond){
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
}
*/




/**
 ### GALLERY DATABASE
 * create model for gallery collection
 * create storage engine
 * initialize gridfs stream
 */

// configure model for gallery collection
const gallerySchema = mongoose.Schema({
    path: {type: String},   // store path of uploaded image
    caption: {type: String} // user caption
});
const Gallery = mongoose.model("Gallery", gallerySchema);

// create storage engine
const storage = new GridFsStorage({
    url: process.env.GALLERYDB_URI,
    options: {useNewUrlParser: true, useUnifiedTopology: true},
    file: function(req, file){
        const match = ["image/png", "image/jpeg"];
        if(match.indexOf(file.mimetype) === -1){
            return {
                filename: "file_" + Date.now() + path.extname(file.originalname),
                bucketname: "uploads"
            };
        }
    }
});

// initialize GridFS stream and upload up to 5 images
const upload = multer({storage: storage}).array("files", 10);
const uploadFilesEngine = util.promisify(upload);


// handle multiple image uploads and export to `app.js`
async function uploadImages(request, respond){
    try {
        await uploadFilesEngine(request, respond);

        console.log(request.files);
        if(request.files.length <= 0)
            return respond.send("Ay, select a file! At least ONE file!");
        else
            respond.send("Good work, now go grab yourself a biscuit or something");
    } catch (err) {
        console.log(err);
        if (err.code === "LIMIT_UNEXPECTED_FILE")
            return respond.send("Woah, calm down! How many fingers you got?");
        else
            return respond.send("Might I interest you in upload error? No? Ok.");
    }
}
module.exports = {uploadFiles: uploadImages};