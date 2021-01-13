const Coupone = require("../models/coupone");
const BadRequestError = require("../errors/bad-request-error");

const create = async (req, res) => {
  let coupone = await Coupone.findOne({ name: req.body.name });
  if (coupone) throw new BadRequestError("Coupone is already created");
  coupone = await Coupone.create(req.body);
  res.status(201).json(coupone);
};

const getAllCoupones = async (req, res) => {
  const coupones = await Coupone.find({}).sort("-createdAt");
  res.status(201).json(coupones);
};

const remove = async (req, res) => {
  let coupone = await Coupone.findById(req.params.id);
  if (!coupone) throw new BadRequestError("Coupone is not found");
  await Coupone.findByIdAndDelete(req.params.id);
  res.status(201).json({ delete: "ok" });
};
module.exports = {
  create,
  getAllCoupones,
  remove,
};
