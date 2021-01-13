const User = require("../models/User");
const Cart = require("../models/cart");
const Product = require("../models/Product");
const Coupone = require("../models/coupone");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

const createPayment = async (req, res) => {
  const { cartTotal, totalAfterDiscount } = await Cart.findOne({
    orderedBy: req.user._id,
  });
  const amount = totalAfterDiscount
    ? totalAfterDiscount * 100
    : cartTotal * 100;

  const paymnet = await stripe.paymentIntents.create({
    amount, // stripe will make it in cents so *100 will be in dolar
    currency: "usd",
  });
  res.send({ clinetSecret: paymnet.client_secret });
};

module.exports = {
  createPayment,
};
