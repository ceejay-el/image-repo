/**
 # UPLOAD IMAGES TO REPOSITORIES
 * upload images to mongodb using mongoose and multer
 */
// require dependencies
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");
const path = require("path");
const util = require("util");
const crypto = require("crypto");
// end of requiring dependencies


// varibale declaration and assignments
const app = express();
let gfs;
// end of variable declarations


/**
 * initialize middleware
 */
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(methodOverride("_method"));
// end of initializing middleware




/**
 ### GALLERY DATABASE ================================================================================= /
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
        return new Promise(function(resolve, reject){
            crypto.randomBytes(16, function(err, buf){
                if (err) {
                return reject(err);
                }
                const fileInfo = {
                    filename: "image_" + Date.now() + path.extname(file.originalname),
                    bucketName: "uploads"
                };
                resolve(fileInfo);
            });
        });
    }
});

// initialize GridFS stream and upload up to 5 images
const upload = multer({storage: storage}).array("files", 5);
const uploadFilesEngine = util.promisify(upload);

const connect = mongoose.createConnection(process.env.GALLERYDB_URI, {useUnifiedTopology: true, useNewUrlParser: true});
connect.once("open", function(){
    gfs = Grid(connect.db, mongoose.mongo);
    gfs.collection("uploads");
});
// ------------------------------------------------------------------------------------------------- /


// handle multiple image uploads and export to `app.js`
async function uploadImages(request, respond){
    try {
        await uploadFilesEngine(request, respond);

        console.log(request.files);
        if(request.files.length <= 0)
            return respond.send("Ay, select a file! At least ONE file!");
        else {
            respond.redirect("/upload");
        }
    } catch (err) {
        console.log(err);
        if (err.code === "LIMIT_UNEXPECTED_FILE")
            return respond.send("Woah, calm down! How many fingers you got?");
        else
            return respond.send("Might I interest you in upload error? No? Ok.");
    }
}
module.exports.uploadFiles = uploadImages;


// display image
module.exports.displayImage = function(request, respond){
    gfs.files.findOne({filename: request.params.filename}, function(error, file){
        if(!file || file.length === 0)
            return respond.status(404).send("Oops. The file you are looking for does not exist");
        else {
            return gfs.createReadStream(file.filename).pipe(respond);
        }
    });
}
/**
 * 
 */
// ================================================================================================= /