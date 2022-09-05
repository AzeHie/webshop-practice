const express = require("express");

const AuthController = require("../controllers/auth");

const checkAuth = require("../middlewares/check-auth");

const router = express.Router();

router.post("/signup", AuthController.createUser);

router.post("/login", AuthController.userLogin);

router.put("/updateuser", checkAuth, AuthController.updateUser);

router.put("/changepassword", checkAuth, AuthController.changePassword);

module.exports = router;
