require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

const post = require("./routes/api/post");

// Database Config
const db = process.env.MONGO_URI;
console.log(db);
mongoose
  .connect(db)
  .then(() => console.log("Mongo is listening"))
  .catch(err => console.log("Mongo is broken", err));

// Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use API routes
app.use("/api/post", post);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server listening on port ${port}`));