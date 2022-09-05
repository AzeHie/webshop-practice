const Wunderbaum = require("../models/wunderbaum");

exports.loadWunderbaums = (req, res, next) => {
  Wunderbaum.find() //find() returns all entries from DB
    .then((result) => {
      //then() returns a promise (which includes data found from DB)
      res.status(200).json({
        message: "Wunderbaums fetched successfully",
        wunderbaums: result,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching products failed!",
      });
    });
};

exports.loadSingleWunderbaum = (req, res, next) => {
  Wunderbaum.findById(req.params.id)
    .then((wunderbaum) => {
      if (wunderbaum) {
        res.status(200).json(wunderbaum);
      } else {
        res.status(404).json({ message: "Product not found!" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Loading product failed!",
      });
    });
};

exports.addWunderbaum = (req, res, next) => {
  console.log(req.body);
  const url = req.protocol + "://" + req.get("host");
  const wunderbaum = new Wunderbaum({
    title: req.body.title,
    imagePath: req.file ? url + "/images/" + req.file.filename : "",
    description: req.body.description,
    price: req.body.price,
  });
  wunderbaum
    .save()
    .then((addedWunderbaum) => {
      res.status(201).json({
        message: "New product added successfully",
        wunderbaum: {
          ...addedWunderbaum,
          id: addedWunderbaum._id,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "An error occurred when adding new product!",
      });
    });
};

exports.updateWunderbaum = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const wunderbaum = new Wunderbaum({
    _id: req.body.id,
    title: req.body.title,
    imagePath: imagePath,
    description: req.body.description,
    price: req.body.price,
  });
  Wunderbaum.updateOne({ _id: req.params.id }, wunderbaum)
    .then((result) => {
      res.status(200).json({ message: "Update successful!" });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Updating product failed!",
      });
    });
};

exports.deleteWunderbaum = (req, res, next) => {
  Wunderbaum.deleteOne({ _id: req.params.id })
    .then((result) => {
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Product deleted succesfully!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Deleting product failed!",
      });
    });
};
