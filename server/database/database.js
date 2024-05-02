const mongoose = require("mongoose");
// mongoo db connection
const URI =
  "mongodb+srv://mkenchappajunjanna1:diSfCZ5VwjfbA477@plantify-cluster.kraujc7.mongodb.net/";
mongoose
  .connect(URI, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });
