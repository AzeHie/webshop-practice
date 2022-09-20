const express = require("express");

const router = express.Router();

const ProductController = require("../controllers/products");
const multerFile = require("../middlewares/multerFile");

router.post("", multerFile, ProductController.addProduct);

router.put("/:id", multerFile, ProductController.updateProduct);

router.get("", ProductController.loadProducts);

router.get("/:id", ProductController.loadSingleProduct);

router.delete("/:id", ProductController.deleteProduct);

module.exports = router;
