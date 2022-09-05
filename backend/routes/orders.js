const express = require("express");

const router = express.Router();

const ordersController = require("../controllers/orders");

router.post("", ordersController.saveOrder);

module.exports = router;
