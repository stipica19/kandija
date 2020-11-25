const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
  naslov: String,
  images: String,
  description: String,
  category: String,
  datum: Date,
  visit: Number,
});
module.exports = mongoose.model("Post", PostSchema);
