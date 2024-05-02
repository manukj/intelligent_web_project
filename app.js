var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("./server/database/database");

/**
 * Routers
 */
var dashBoardRouter = require("./server/routes/dashBoardRouter");
var addPlantRouter = require("./server/routes/addPlantRouter");
var detailsRouter = require("./server/routes/detailsRouter");
var chatRouter = require("./server/routes/chatRouter");
var offlineRouter = require("./server/routes/offlineRouter");

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
app.use("/error", offlineRouter);

// catch 404 and forward to error handler
// Middleware to handle 404 - Not Found
app.use((req, res, next) => {
  res.status(404).render("error/404_error", { url: req.url });
});

module.exports = app;
