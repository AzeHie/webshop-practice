const mongoose = require("mongoose");

const clothSchema = mongoose.Schema({
  title: { type: String, required: true },
  imagePath: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
});

module.exports = mongoose.model("Cloth", clothSchema);
