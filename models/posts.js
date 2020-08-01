const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
  naslov: String,
  images: String,
  description: String,
  category: String,
  datum: Date,
});
module.exports = mongoose.model("Post", PostSchema);
