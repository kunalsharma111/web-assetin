const cloudinary = require("cloudinary").v2;

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
  const options = { folder }; // cloudinay directory
  options.public_id = file.name; // cloudinay uploaded file name == local machine file name

  if (height) {
    options.height = height;
  }
  if (quality) {
    options.quality = quality;
  }

  options.resource_type = "auto"; // important

  return await cloudinary.uploader.upload(
    file.tempFilePath,

    options,
    (error, result) => {
      if (error) {
        console.error("Upload Error: ", error);
      } else {
        console.log("Upload Successfully: ", result);
      }
    }
  );
};
