const express = require("express");
const mongoose = require("mongoose");
const app = express();
const errorHandler = require("./middlewares/error-handler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const cookieSession = require("cookie-session");
  
 
require("dotenv").config();
require("express-async-errors");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("database connected");
});
// Once in production, don't forget to modify req.headers.origin to the exact website you wish to allow to connect.
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,UPDATE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );
  next();
});
// app.use(cors());
app.set("trust proxy", true);
app.use(express.json({ limit: "50mb" }));
// app.use(
//   cookieSession({
//     signed: false,
//     secure: process.env.NODE_ENV !== "dev", // user visit from https
//   })
// );

app.use(cookieParser());
app.use("/api/auth", require("./routes/user_routes"));
app.use("/api/products", require("./routes/product_routes"));
app.use("/api/images", require("./routes/cloudinary_routes"));
app.use("/api/cart", require("./routes/cart_routes"));
app.use("/api/coupones", require("./routes/coupone_routes"));
app.use("/api/payment", require("./routes/strip_routes"));
app.use("/api/orders", require("./routes/order_routes"));
app.use(errorHandler);
app.all("*", async (req, res) => {
  res.status(404).send({ error: "route is not found" });
});
const port = process.env.PORT;
 

app.listen(port, () => {
  console.log("app start at port " + port);
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
