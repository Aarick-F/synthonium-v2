const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Load Post Model
const Post = require("../../models/Post");

// Validation
const validatePostInput = require("../../validation/post");

// @route   GET api/post/test
// @desc    Tests post route
// @access  Public
router.get("/test", (req, res) => {
  res.json({msg: "Post test route!"});
});

// @route   GET api/post
// @desc    Get Posts
// @access  Public
router.get("/", (req, res) => {
  Post.find()
    .sort({date: -1})
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json(err));
});

// @route   POST api/post/create
// @desc    Creates a post
// @access  Hidden
router.post("/create", (req, res) => {
  const {errors, isValid} = validatePostInput(req.body);

  if(!isValid) {
    // If errors, send 400 with errors
    return res.status(400).json(errors);
  }

  const newPost = new Post({
    title: req.body.title,
    synthType: req.body.synthType,
    notes: req.body.notes,
    username: req.body.username
  });

  newPost.save()
    .then(post => res.json(post));
});

module.exports = router;