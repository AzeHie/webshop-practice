const express = require("express");

const router = express.Router();

const shoppingCartController = require("../controllers/shoppingcart");
const checkAuth = require("../middlewares/check-auth");

router.post("", checkAuth, shoppingCartController.addCartItem);

router.put("", checkAuth, shoppingCartController.editCartItem);

router.put(
  "/addStorageItems",
  checkAuth,
  shoppingCartController.addStorageItems
);

router.get("", checkAuth, shoppingCartController.loadCart);

router.delete("", checkAuth, shoppingCartController.emptyCart);

router.delete("/:id", checkAuth, shoppingCartController.deleteCartItem);

module.exports = router;
