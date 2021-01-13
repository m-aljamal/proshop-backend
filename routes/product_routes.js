const router = require("express").Router();
const productController = require("../controllers/product_controller");
const { productValidation } = require("../validators/product-validation");
const validateRequest = require("../middlewares/validation-request");
const isAuth = require("../middlewares/isAuth");
const isAdmin = require("../middlewares/isAdmin");
const filters = require("../middlewares/filters");
const Product = require("../models/Product");
router
  .route("/add")
  .post(
    isAuth,
    isAdmin("publisher", "admin"),
    productValidation,
    validateRequest,
    productController.create
  );

router
  .route("/:id/edit")
  .put(isAuth, isAdmin("publisher", "admin"), productController.edit);

router
  .route("/:id/delete")
  .delete(isAuth, isAdmin("publisher", "admin"), productController.remove);

router.route("/").get(filters(Product), productController.getProducts);

module.exports = router;
