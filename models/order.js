const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
        },
        count: Number,
      },
    ],
    paymnetIntent: {},
    orderStatus: {
      type: String,
      default: "not processed",
      enum: [
        "not processed",
        "processing",
        "dispatched",
        "cancelled",
        "completed",
        "cash on Delivery ",
      ],
    },
    orderedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
