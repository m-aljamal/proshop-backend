const router = require("express").Router();

const isAuth = require("../middlewares/isAuth");
const isAdmin = require("../middlewares/isAdmin");

const couponeController = require("../controllers/coupone_controller");

router.post("/add", isAuth, isAdmin("admin"), couponeController.create);
router.get("/", couponeController.getAllCoupones);
router.delete("/:id/remove", isAuth, isAdmin("admin"), couponeController.remove);

module.exports = router;
