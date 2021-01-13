const router = require("express").Router();
const userController = require("../controllers/user_controller");
const {
  userSignupValidator,
  userSigninValidator,
} = require("../validators/user-validator");
const isAuth = require("../middlewares/isAuth");
const validateRequest = require("../middlewares/validation-request");
router
  .route("/signup")
  .post(userSignupValidator, validateRequest, userController.signup);

router
  .route("/signin")
  .post(userSigninValidator, validateRequest, userController.signin);

router.route("/logout").get(userController.logout);

router.route("/me").get(isAuth, userController.getLogedUser);

router.post("/address/add", isAuth, userController.addAddress);
router.post("/cart/coupone", isAuth, userController.addCoupone);
router.post("/order/create", isAuth, userController.createOrder);
router.post("/order/cash-order", isAuth, userController.createCashOrder);
router.get("/orders", isAuth, userController.getOrders);
module.exports = router;
