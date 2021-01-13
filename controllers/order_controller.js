const Order = require("../models/order");
const BadRequestError = require("../errors/bad-request-error");

const getOrders = async (req, res) => {
  const orders = await Order.find({})
    .populate("orderedBy", "name email address")
    .populate("products.product")
    .sort("-createdAt");
  res.json(orders);
};

const updateStatus = async (req, res) => {
  let order = await Order.findById(req.params.id);
  if (!order) throw new BadRequestError("Order is not found");
  order = await Order.findByIdAndUpdate(
    req.params.id,
    { orderStatus: req.body.orderStatus },
    { new: true }
  ); 
  res.status(201).json(order);
};
module.exports = {
  getOrders,
  updateStatus,
};
