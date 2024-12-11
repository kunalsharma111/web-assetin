const mongoose = require("mongoose");

// define the categorySchema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },
  courses: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
});

// exports the category Schema
module.exports = mongoose.model("Category", categorySchema);
