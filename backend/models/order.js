const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  productId: { type: String, required: true, default: null },
  title: { type: String, required: true, default: null },
  price: { type: String, required: true, default: null },
  amount: { type: Number, required: true, default: null },
});

const orderSchema = mongoose.Schema({
  products: [productSchema],
  customer: {
    id: { type: String, required: true, default: null },
    firstname: { type: String, required: true, default: null },
    lastname: { type: String, required: true, default: null },
    address: { type: String, required: true, default: null },
    postcode: { type: String, required: true, default: null },
    city: { type: String, required: true, default: null },
    email: { type: String, required: true, default: null },
  },
  shippingMethod: { type: String, required: true, default: null },
  paymentMethod: { type: String, required: true, default: null },
});

module.exports = mongoose.model("order", orderSchema);
