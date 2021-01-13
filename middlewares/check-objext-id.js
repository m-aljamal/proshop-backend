const mongoose = require("mongoose");
const BadRequestError = require("../errors/bad-request-error");
const checkObjectId = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    throw new BadRequestError("campground is not found");
  next();
};

module.exports = checkObjectId;
