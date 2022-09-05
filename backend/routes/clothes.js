const express = require("express");

const router = express.Router();

const clothesController = require("../controllers/clothes");
const multerFile = require("../middlewares/multerFile");

router.post("", multerFile, clothesController.addProduct);

router.put("/:id", multerFile, clothesController.updateProduct);

router.get("", clothesController.loadProducts);

router.get("/:id", clothesController.loadSingleProduct);

router.delete("/:id", clothesController.deleteProduct);

module.exports = router;
