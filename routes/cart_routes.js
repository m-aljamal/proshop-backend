const router = require("express").Router();
const isAuth = require("../middlewares/isAuth");
const cartController = require("../controllers/cart_controller");

router.post("/add", isAuth, cartController.add);

router.get("/", isAuth, cartController.getCart);

router.delete("/remove", isAuth, cartController.removeCart);
module.exports = router;
