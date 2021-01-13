const { body } = require("express-validator");

exports.productValidation = [
  body("name").notEmpty().withMessage("Product name is required"),
  body("description").notEmpty().withMessage("Product description is required"),
  body("price").notEmpty().withMessage("Product price is required"),
  body("quantity").notEmpty().withMessage("Product quantity is required"),
];
