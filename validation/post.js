const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";

  if(!Validator.isLength(data.title, {min: 1, max: 40})) {
    errors.text = "Post title must be between 1 and 40 characters";
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