const Section = require("../models/Section");
const Course = require("../models/Course");

// create section handler
exports.createSection = async (req, res) => {
  try {
    // data fetch

    const { sectionName, courseId } = req.body;
    // data validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }
    // create Section

    const newSection = await Section.create({ sectionName });
    // update course with section ObjectID
    const updatedCourseDetails = await Course.findOneAndUpdate(
      { _id: courseId },
      {
        $push: { coursContent: newSection._id },
      },
      { new: true }
    ).populate("coursContent");
    // .strictPopulate("subSection");
    // TODO: use populate to replace section/sub-section both in the updatedCourseDetails

    //return response

    return res.status(200).json({
      success: true,
      message: "Section created Successfully",
      updatedCourseDetails,
    });
  } catch (error) {
    // console.error(error);
    return res.status(500).json({
      success: false,
      message: "Course Creation Process Failed Check it",
      error: error.message,
    });
  }
};

// upadate Section details handler
exports.updateSection = async (req, res) => {
  try {
    // fetch data input

    const { sectionName, sectionId } = req.body;

    // data validition
    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Missing Properties",
      });
    }

    // update data
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );
    // return res
    return res.status(200).json({
      success: true,
      message: "Section Updated Successfully",
      section,
    });
  } catch (error) {
    // console.error(error);
    return res.status(500).json({
      success: false,
      message: "Course Updation Process Failed Check it",
      error: error.message,
    });
  }
};

// deleted section handler
exports.deleteSection = async (req, res) => {
  try {
    // get ID - params me id aa rahi hai
    const { sectionId, courseId } = req.query;

    // console.log("sectionId : ", sectionId);
    // console.log("courseId : ", courseId);

    
    // "sectionId": "65b0b68f1f8d9c4672f285e6",
    // "courseId": "65b0b5cb1f8d9c4672f285d5"

    // use findByIdAndDelete
    const deletedSection = await Section.findByIdAndDelete({ _id: sectionId });

    // validation on deletedSection

    if (!deletedSection) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    // TODO[testing]: do we need to delte the entry from the course schema ??
    //update course
    const courseDetails = await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $pull: {
          coursContent: sectionId,
        },
      },
      { new: true }
    );

    // return respone
    return res.status(200).json({
      success: true,
      message: "Section Deleted Successfully",
      // deletedSection,
      courseDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete Section, Please try Again",
      error: error.message,
    });
  }
};
