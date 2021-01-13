const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const Product = require("./models/Product");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const products = JSON.parse(
  fs.readFileSync(`${__dirname}/data/products.json`, "utf-8")
);
const importsData = async () => {
  try {
    await Product.create(products);

    console.log("data imported");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};
const deleteData = async () => {
  try {
    await Product.deleteMany();
    console.log("data destroyed");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};
if (process.argv[2] === "-import") {
  importsData();
} else if (process.argv[2] === "-delete") {
  deleteData();
}
