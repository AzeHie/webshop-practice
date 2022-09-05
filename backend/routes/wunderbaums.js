const express = require("express");

const router = express.Router();

const WunderbaumController = require("../controllers/wunderbaums");
const multerFile = require("../middlewares/multerFile");

router.post("", multerFile, WunderbaumController.addWunderbaum);

router.put("/:id", multerFile, WunderbaumController.updateWunderbaum);

router.get("", WunderbaumController.loadWunderbaums);

router.get("/:id", WunderbaumController.loadSingleWunderbaum);

router.delete("/:id", WunderbaumController.deleteWunderbaum);

module.exports = router;
