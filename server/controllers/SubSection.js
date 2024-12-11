const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// create SubSection

exports.createSubSection = async (req, res) => {
  try {
    // fetch data from Request Body

    const { sectionId, title, timeDuration, description } = req.body;

    // extract File or Video
    const video = req.files.videoFile;

    // Validation
    if (!sectionId || !title || !timeDuration || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "All Fields are required",
      });
    }
    // upload video to cloudinary

    console.log("** video details ** ", video);
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );
    // create a sub section
    const SubSectionDetails = await SubSection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });
    // update section with this sub section ObjectID
    const updatedSection = await Section.findOneAndUpdate(
      {
        _id: sectionId,
      },
      {
        $push: {
          subSection: SubSectionDetails._id,
        },
      },
      { new: true }
    ).populate("subSection");

    // TODO: log updated section here, after adding populate query
    // return response
    return res.status(200).json({
      success: true,
      message: "Sub Section Created Successfully",
      updatedSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// TODO: update SubSection
exports.updateSubSection = async (req, res) => {
  try {
    // fetch  data from Request Body
    const { subSectionId, title, description } = req.body;

    // update subSection
    const subSection = await SubSection.findById(subSectionId);

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    if (title !== undefined) {
      subSection.title = title;
    }

    if (description !== undefined) {
      subSection.description = description;
    }
    

    // upload video on Cloudinary
    if (req.files && req.files.videoFile !== undefined) {
      const video = req.files.videoFile;
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      );

      // add videoUrl and timeDuration in subSection
      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = `${uploadDetails.duration}`;
    }

    // save subSection details
    await subSection.save();
    // return response
    return res.status(200).json({
      success: true,
      message: "SubSection Successfully Update",
      subSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "SubSection Update Problem Error",
      error: error.message,
    });
  }
};

// TODO: delete SubSection
exports.deleteSubSection = async (req, res) => {
  try {
    // fetch subSection id from request Body
    const { sectionId, subSectionId } = req.body;

    // delete subSection
    const deletedSubSection = await SubSection.findByIdAndDelete({
      _id: subSectionId,
    });

    if (!deletedSubSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    // update that particular Section
    await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $pull: {
          subSection: subSectionId,
        },
      },
      { new: true }
    );

    // return response

    return res.status(200).json({
      success: true,
      message: "Successfully delete SubSection",
      deletedSubSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Delete SubSection Error",
      error: error.message,
    });
  }
};
