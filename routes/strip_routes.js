const router = require("express").Router();

const stiprController = require("../controllers/stipe_controller");
const isAuth = require("../middlewares/isAuth");
const isAdmin = require("../middlewares/isAdmin");

router.post("/create-payment", isAuth, stiprController.createPayment);


module.exports = router