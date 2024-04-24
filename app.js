var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");

/**
 * Routers
 */
var dashBoardRouter = require("./server/routes/dashBoardRouter");
var addPlantRouter = require("./server/routes/addPlantRouter");
var detailsRouter = require("./server/routes/detailsRouter");
var chatRouter = require("./server/routes/chatRouter");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("node_modules"));

// Routes
app.use("/", dashBoardRouter);
app.use("/addPlant", addPlantRouter);
app.use("/details", detailsRouter);
app.use("/chat", chatRouter);

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

// mongoo db connection
const URI =
  "mongodb+srv://mkenchappajunjanna1:diSfCZ5VwjfbA477@plantify-cluster.kraujc7.mongodb.net/";
mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

module.exports = app;
