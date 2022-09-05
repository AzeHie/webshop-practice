const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.createUser = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10) // encrypting password
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        address: req.body.address,
        postcode: req.body.postcode,
        city: req.body.city,
      });
      user
        .save()
        .then(() => {
          res.status(201).json({
            message: "New user added successfully",
          });
        })
        .catch((error) => {
          res.status(500).json({
            message: "Authentication failed!",
          });
        });
    });
};

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Invalid username or password!",
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Invalid username or password!",
        });
      }
      const token = jwt.sign(
        //creating json webtoken, has to be installed with cli
        { email: fetchedUser.email, userId: fetchedUser._id },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
        firstname: fetchedUser.firstname,
        lastname: fetchedUser.lastname,
        address: fetchedUser.lastname,
        postcode: fetchedUser.postcode,
        city: fetchedUser.city,
        email: fetchedUser.email,
      });
    })
    .catch((error) => {
      return res.status(401).json({
        message: "Invalid authetication credentials!",
      });
    });
};

exports.updateUser = (req, res, next) => {
  let doc = User.findOneAndUpdate(
    { _id: req.userData.userId }, // FILTER
    {
      firstname: req.body.firstname, // UPDATE
      lastname: req.body.lastname,
      address: req.body.address,
      postcode: req.body.postcode,
      city: req.body.city,
      email: req.body.email,
    },
    { returnDocument: "after" } // RETURN UPDATED DOC
  );
  doc
    .then((updatedUser) => {
      res.status(200).json({
        message: "User updated!",
        userDetails: {
          id: updatedUser._id,
          firstname: updatedUser.firstname,
          lastname: updatedUser.lastname,
          address: updatedUser.address,
          postcode: updatedUser.postcode,
          city: updatedUser.city,
          email: updatedUser.email,
        },
      });
    })
    .catch((error) => {
      return res.status(500).json({
        message: "Updating user failed!",
      });
    });
};

exports.changePassword = async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  try {
    const user = await User.findById(req.userData.userId);
    if (!user) {
      return res.status(400).json({
        message: "User not found!",
      });
    }
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        message: "Current password is wrong",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate(
      { _id: req.userData.userId },
      { password: hashedPassword }
    );
    return res.status(200).json({
      message: "Password updated!",
    });
  } catch (err) {
    return res.status(500).json({ message: "Updating password failed!" });
  }
};
