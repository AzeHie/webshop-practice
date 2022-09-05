const Order = require("../models/order");

exports.saveOrder = (req, res, next) => {
  const order = new Order({
    products: req.body.products,
    customer: req.body.customerDetails,
    shippingMethod: req.body.shippingMethod,
    paymentMethod: req.body.paymentMethod,
  });
  order
    .save()
    .then(() => {
      res.status(201).json({
        message: "Order saved successfully!",
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Please, check details and try again!",
      });
    });
};
