const { body } = require("express-validator");

exports.userSignupValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Email must be valid"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 charcters"),
];

exports.userSigninValidator = [
  body("email").isEmail().withMessage("Email must be valid"),
  body('password').trim().notEmpty().withMessage('You must supply password')
];
