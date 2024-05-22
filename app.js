const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const connectDb = require("./db/mongoose");

// const gravatar = require("gravatar");
// const newAvatar = gravatar.url(
//   "efverevev",
//   { s: 100, r: "g", d: "retro" },
//   true
// );
// console.log(newAvatar);

const indexRouter = require("./routes/index");

const app = express();
connectDb();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// security
app.disable("x-powered-by");
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "img-src": ["s.gravatar.com"],
    },
  })
);

// performance
app.use(compression());

// base middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
