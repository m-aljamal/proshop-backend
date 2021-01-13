const router = require("express").Router();
const cloudinaryController = require("../controllers/cloudinary_controller");
const isAuth = require("../middlewares/isAuth");
const isAdmin = require("../middlewares/isAdmin");
router.post(
  "/uploadimages",
  isAuth,
  isAdmin("publisher", "admin"),
  cloudinaryController.imageUpload
);
router.post(
  "/removeimages",
  isAuth,
  isAdmin("publisher", "admin"),
  cloudinaryController.imageRemove
);

module.exports = router;
