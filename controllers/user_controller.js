const User = require("../models/User");
const BadRequestError = require("../errors/bad-request-error");
const Coupone = require("../models/coupone");
const Cart = require("../models/cart");
const Order = require("../models/order");
const Product = require("../models/Product");
//? Get token for model , create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    //   30 dayes

    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  // first what to call the cookie then the value
  res.status(statusCode).cookie("token", token, options).json({ token });
};

const signup = async (req, res) => {
  const { email, name, password, role } = req.body;
  let user = await User.findOne({ email });
  if (user) throw new BadRequestError("User is already created");
  user = User.build({ email, name, password, role });
  await user.save();
  sendTokenResponse(user, 200, res);
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email }).select("+password");
  if (!user) throw new BadRequestError("User is not found");
  const isPasswordMatch = await user.matchPassword(password);
  if (!isPasswordMatch) throw new BadRequestError("Wrong password");
  // const token = user.getSignedJwtToken();
  // req.session.token = token;
  // res.status(200).json({ token });
  sendTokenResponse(user, 200, res);
};

const getLogedUser = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json(user);
};

const logout = async (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({});
};

const addAddress = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { address: req.body.address },
    { new: true }
  ).select("-password");
  res.status(200).json(user.address);
};

const addCoupone = async (req, res) => {
  const validateCoupone = await Coupone.findOne({ name: req.body.coupone });
  if (!validateCoupone) throw new BadRequestError("Coupone is not found");
  let { cartTotal } = await Cart.findOne({
    orderedBy: req.user._id,
  }).populate("products.product", "_id name price");
  let totalAfterDiscount = (
    cartTotal -
    (cartTotal * validateCoupone.discount) / 100
  ).toFixed(2);
  await Cart.findOneAndUpdate(
    { orderedBy: req.user._id },
    { totalAfterDiscount },
    {
      new: true,
    }
  );
  res.status(201).json({ totalAfterDiscount });
};

const createOrder = async (req, res) => {
  let { products } = await Cart.findOne({ orderedBy: req.user._id });
  let newOrder = await new Order({
    products,
    paymnetIntent: req.body.paymentIntent,
    orderedBy: req.user._id,
  }).save();
  //  decrement qty of sold  product
  let bulkOption = products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id },
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });
  let updated = await Product.bulkWrite(bulkOption, { new: true });

  res.status(201).json({ ok: true, order: newOrder });
};

const getOrders = async (req, res) => {
  const orders = await Order.find({ orderedBy: req.user._id })
    .populate("products.product", "_id name price")
    .sort("-createdAt");
  res.status(201).json(orders);
};
const createCashOrder = async (req, res) => {};
module.exports = {
  signup,
  getOrders,
  addCoupone,
  signin,
  getLogedUser,
  logout,
  addAddress,
  createOrder,
  createCashOrder,
};
