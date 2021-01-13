const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const imageUpload = async (req, res) => {
  let result = await cloudinary.uploader.upload(
    req.body.image,

    {
      public_id: `${Date.now()}`,
      resource_type: "auto", // jpeg, png
    }
  );
  res.json({
    public_id: result.public_id,
    url: result.secure_url,
  });
};
const imageRemove = async (req, res) => {
  let image_id = req.body.public_id;
  await cloudinary.uploader.destroy(image_id);
  res.json("image removed");
};

module.exports = {
  imageUpload,
  imageRemove,
};
