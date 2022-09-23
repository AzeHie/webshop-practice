const Order = require("../models/order");

exports.saveOrder = async (req, res, next) => {
  const order = new Order({
    products: req.body.products,
    customer: req.body.customerDetails,
    shippingMethod: req.body.shippingMethod,
    paymentMethod: req.body.paymentMethod,
  });

  try {
    await order.save();
    res.status(201).json({
      message: "Order saved successfully!"
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong when sending the order! Please, check the details!",
    });
  };
};
