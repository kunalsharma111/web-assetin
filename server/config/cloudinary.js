const cloudinary = require("cloudinary").v2;

exports.cloudinaryConnect = () => {
  try {
    cloudinary.config({
      // Configuring the Cloudinary to Upload MEDIA
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });
    console.log("Cloudinary Successfully Connect");
  } catch (error) {
    console.log("cloudinary Connection problem : ", error);
  }
};
