# image-repo
NodeJS image upload to Mongodb with multer.


## Project Structure
### Front-end
- `signup.html`: contains html form for registering with any username and password.
- `login.html` is the landing page. Gallery is private. User has to log in with their username and password
- User uploads and views images from `gallery.html`


### Server-side
- `app.js` handles user authentication with `md5` password encryption, as well as creating the storage engine and running the express app.

#### npm modules
- **express.js**, a simple NodeJS framework with a robust set of features
- **mongoose** a "MongoDB object modeling tool designed to work in an asynchronous environment. Mongoose supports both promises and callbacks." Ok basically makes it easier to use the MongoDB in the express server, so that you don't have to write all the MongoDB server code.
- **body-parser** for parsing the html body data
- **multer** for handling `multipart/form-data` from the html body.
- **multer-gridfs-storage** which creates a mongodb connection automatically.
- **method-override** to allow for the deleting function.
- **gridfs-stream** to allow for easy streaming of files to and from mongodb GridFS
- **md5** for password encryption.
- **dotenv** to keep our secret variables at, like the encryption key and the database uris, that, you know, have your database username and password!!

#### initialize engine for uploading and storing images
- I created the engine in the engines.js. Also, saying "I created the engine" and "look it up in the engines file" are such cool things to say, so I'll do it just because I can.
```
// dependencies
require("dotenv").config();
const express = require("express");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const path = require("path");
const util = require("util");

// create storage engine
const storage = new GridFsStorage({
    url: process.env.GALLERYDB_URI,
    options: {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true},
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
const upload = multer({storage: storage}).array("files", 5);
const uploadFilesEngine = util.promisify(upload);
```

- With the storage engine, you can now control the image uploads and export it to `app.js`
```
// handle image uploads
async function uploadImages(request, respond){
    try {
        await uploadFilesEngine(request, respond);

        console.log(request, file);
        if(request.file == undefined)
            return respond.send("Ay, select a file!");
        else
            respond.send("Good work, now go grab yourself a biscuit or something");
    } catch (err) {
        console.log(err);
        return respond.send("Might I interest you in upload error? No? Ok.");
    }
}
module.exports = {
    uploadFiles: uploadImages
};
```

- Create the express app server: Require the necessary dependencies; initialize middleware; add the landing, signup and uploads get and post methods. To import the uploading function from `engines.js`, start by importing it:
> `const engines = require("./engines");`
- This would allow you to call the methods from `engines.js`. The post route, for example, uses the uploading function from engines. So:
> `app.post("/upload", engines.uploadFiles);`
