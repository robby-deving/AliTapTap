const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "ddye8veua",   // Replace with your Cloudinary cloud name
  api_key: "322784156822461",         // Replace with your Cloudinary API key
  api_secret: "9DX1o2OApTwCBghO2OHVl_snNuQ",   // Replace with your Cloudinary API secret
});

module.exports = cloudinary;
