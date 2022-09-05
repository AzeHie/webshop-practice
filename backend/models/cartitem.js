const mongoose = require("mongoose");

const cartItemSchema = mongoose.Schema({
  productId: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  imagePath: { type: String, required: true },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("cartItem", cartItemSchema);
