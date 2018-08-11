const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";

  if(!Validator.isLength(data.title, {min: 5, max: 42})) {
    errors.text = "Post title must be between 5 and 42 characters";
  }

  if(Validator.isEmpty(data.title)) {
    errors.title = "Title field is required";
  }

  if(Validator.isEmpty(data.notes)) {
    errors.notes = "You must select at least 1 note";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}