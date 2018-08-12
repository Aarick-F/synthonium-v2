require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

const post = require("./routes/api/post");

// Database Config
const db = process.env.MONGO_URI;
mongoose
  .connect(db)
  .then(() => console.log("Mongo is listening"))
  .catch(err => console.log("Mongo is broken", err));

// Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "client", "build")));

// Use API routes
app.use("/api/post", post);

const port = process.env.PORT || 5000;

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(port, () => console.log(`Server listening on port ${port}`));