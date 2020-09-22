/**
 # UPLOAD IMAGES TO REPOSITORIES
 * upload images to mongodb using mongoose and multer
 * include user authentication with md5 encryption
 */
// require dependencies
// require dependencies
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const engines = require("./engines");
const md5 = require("md5");
// end of requiring dependencies


// varibale declaration and assignments
const app = express();
app.use(express.static("public"));
const port = process.env.PORT || 3000;
// end of variable declarations


/**
 * initialize middleware
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// end of initializing middleware


// get home page
app.get("/", function(request, respond){
    respond.sendFile(__dirname + "/public/login.html");
});


/**
 ## USER AUTHENTICATION
 * login page (landing), signup page and access to gallery
 */
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

// upload images post route
app.post("/upload", engines.uploadFiles);


app.listen(port, function(){
    console.log("server is listening on port " + port);
});