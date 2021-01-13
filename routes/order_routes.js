const router = require("express").Router();
const isAuth = require("../middlewares/isAuth");
const isAdmin = require("../middlewares/isAdmin");
const orderController = require("../controllers/order_controller");
const Order = require("../models/order");
const filters = require("../middlewares/filters");

router.get(
  "/",
  isAuth,
  isAdmin("admin"),

  orderController.getOrders
);

router.put("/:id", isAuth, isAdmin("admin"), orderController.updateStatus);

module.exports = router;
