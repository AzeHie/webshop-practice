const mongoose = require("mongoose");

const wunderbaumSchema = mongoose.Schema({
  title: { type: String, required: true },
  imagePath: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
});

module.exports = mongoose.model("Wunderbaum", wunderbaumSchema);
