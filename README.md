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

#### app.js
- Start by getting the basics done; you know: requiring dependencies, initializing the middleware, initializing the view engine, and defining the `get` and `post` routes.
