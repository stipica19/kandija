const mongoose = require("mongoose");

const GrobljaSchema = mongoose.Schema({
  images: [String],
  description: String,
  groblje: String,
});
module.exports = mongoose.model("Groblja", GrobljaSchema);
