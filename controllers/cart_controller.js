const Cart = require("../models/cart");
const User = require("../models/User");
const BadRequestError = require("../errors/bad-request-error");
const Product = require("../models/Product");
const add = async (req, res) => {
  req.body.orderedBy = req.user.id;

  let existingCart = await Cart.findOne({ orderedBy: req.body.orderedBy });
  if (existingCart) {
    existingCart.remove();
    console.log("old cart is removed");
  }

  let products = [];

  const cart = req.body.cartList;
  for (let i = 0; i < cart.length; i++) {
    let object = {};
    object.product = cart[i]._id;
    object.count = cart[i].count;
    // get the price from database not from frontend
    let { price } = await Product.findById(cart[i]._id).select("price").exec();
    object.price = price;
    console.log("object", object);
    products.push(object);
  }
  console.log("ppppppp", products);

  const cartTotal = products.reduce((cur, next) => {
    return cur + next.count * next.price;
  }, 0);

  await new Cart({
    products,
    cartTotal,
    orderedBy: req.body.orderedBy,
  }).save();

  res.status(201).json({ ok: true });
};

const getCart = async (req, res) => {
  console.log(req.user._id);
  const cart = await Cart.findOne({ orderedBy: req.user.id }).populate(
    "products.product",
    "_id name price "
  );
  if (!cart) throw new BadRequestError("User has no cart in database");
  const { products, cartTotal, _id } = cart;
  console.log(cart);
  res.status(200).json({ products, cartTotal, _id });
};

const removeCart = async (req, res) => {
  const cart = await Cart.findOne({ orderedBy: req.user.id });
  if (!cart) throw new BadRequestError("User has no cart in database");
  await cart.remove();
  res.status(201).json({ deleted: "ok" });
};
module.exports = {
  add,
  getCart,
  removeCart,
};
