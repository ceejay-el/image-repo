/**
 # UPLOAD IMAGES TO REPOSITORIES
 * running server program
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
const port = process.env.PORT || 3000;
const userdbURI = process.env.USERDB_URI;
// end of variable declarations



/**
 * initialize middleware
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
// end of initializing middleware



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



/**
 * ROUTING AND USER AUTHENTICATION ======================================================== //
 * login page (landing), signup page and access to gallery
 */
app.get("/signup", function(request, respond){
    respond.sendFile(__dirname + "/public/signup.html");
})

// register with username and password. Password is excrypted with `md5`
app.post("/signup", function(request, respond){
    const newUser = new User({
        username: request.body.username,
        password: md5(request.body.password)
    });
    newUser.save(function(err){
        if (err)
            console.log(err)
        else
            respond.redirect("/upload");
    });
});


// get landing page - `login.html`
app.get("/", function(request, respond){
    respond.sendFile(__dirname + "/public/login.html");
});

app.post("/", function(request, respond){
    const username = request.body.username;
    const password = md5(request.body.password);

    User.findOne({username: username}, function(error, foundUser){
        if (error)
            console.log(error);
        else {
            if (foundUser){
                if (foundUser.password === password)
                    respond.redirect("/upload");
                else
                    respond.send("I feel a great disturbance in the force");
            }
        }
    });
});
// ======================================================================================= //


/**
 * IMAGE REPOSITORY GRAPHICAL INTERFACE ================================================== //
 */
app.get("/upload", engines.galleryDisplay);

app.post("/upload", engines.uploadFiles);

// display image
app.get("/images/:filename", engines.displayImage);

// delete image
app.delete("/images/:id", engines.deleteImage);
// ====================================================================================== //



app.listen(port, function(){
    console.log("server is listening on port " + port);
});