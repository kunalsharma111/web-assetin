const Category = require("../models/Category");
const User = require("../models/User");

// create Category handler function
exports.createCategory = async (req, res) => {
  // fetch data
  const { name, description } = req.body;

  // validation

  if (!name || !description) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }
  // create entry in DB

  try {
    const categoryDetails = await Category.create({
      name: name,
      description: description,
    });
    console.log(categoryDetails);

    // add the new category to the user schema of admin
    // const adminDetails = await User.findById(req.user.id);
    await User.findByIdAndUpdate(
      { _id: req.user.id },
      {
        $push: { courses: categoryDetails._id },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Category created successfully",
    });
  } catch (error) {
    console.error("Error creating category by Admin: ", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.showAllCategories = async (req, res) => {
  try {
    const allcategories = await Category.find(
      {},
      { name: true, description: true }
    );

    return res.status(200).json({
      success: true,
      message: "All categorys Access Successfully",
      allcategories,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "All categorys access Problem",
    });
  }
};

// Category page details handler chaiye
exports.categoryPageDetails = async (req, res) => {
  try {
    // get categoryId

    const { categoryId } = req.body;
    // get courses for specified categoryId
    const selectedCategory = await Category.findById(categoryId)
      .populate("courses")
      .exec();

    // validation
    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Data  not found",
      });
    }

    // get course for different categories
    const differentCategories = await Category.find({
      _id: { $ne: categoryId },
    })
      .populate("courses")
      .exec();

    // get top selling courses

    // TODO: write it on your own
    // return response
    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategories,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
