const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const indexRouter = require("./routes/exercise4");
const usersRouter = require("./routes/users");

//Load the express module installed to constant express
const app = express();
// enable CORS (cross-origin resource sharing)
app.use(cors());
// modify the log using tokens or add color to them by defining 'dev' or even logging out to an output stream, like a file.
app.use(logger("dev"));
//middleware that only parses JSON and only looks at the requests where the content-type header matches the type option.
app.use(express.json());
//parses incoming requests with urlencoded payloads and is based on body-parser.
app.use(express.urlencoded({ extended: false }));
//expose the cookies send along with client request.
app.use(cookieParser());
//adapt path for different operating system
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

//
app.use((req, res, next) => {
  const error = new Error("Path not found");
  error.statusCode = 404;
  next(error);
});

//error handler
app.use((error, req, res, next) => {
  console.log(error.message);
  if (!error.statusCode) {
    error.statusCode = 500;
  }
  res.status(error.statusCode).send(error.message);
});

module.exports = app;
