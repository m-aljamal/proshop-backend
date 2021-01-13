const Product = require("../models/Product");
const BadRequestError = require("../errors/bad-request-error");
const slugify = require("slugify");

const create = async (req, res) => {
  let product = await Product.findOne({ name: req.body.name });
  if (product)
    throw new BadRequestError(
      "There is a product with same name, choose another name"
    );
  req.body.user = req.user.id;
  product = await Product.create(req.body);
  res.status(201).json(product);
};

const edit = async (req, res) => {
  let product = await Product.findById(req.params.id);
  if (!product) throw new BadRequestError("Product is not found");
  if (req.body.name) req.body.slug = slugify(req.body.name, { lower: true });
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(product);
};

const remove = async (req, res) => {
  let product = await Product.findById(req.params.id);
  if (!product) throw new BadRequestError("Product is not found");
  product = await Product.findByIdAndRemove(req.params.id);
  res.status(200).json(product);
};

const getProducts = async (req, res) => {
  res.json(res.advancedResult);
};
module.exports = {
  create,
  edit,
  remove,
  getProducts,
};
