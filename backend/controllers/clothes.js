const Cloth = require("../models/cloth");

exports.loadProducts = (req, res, next) => {
  Cloth.find()
    .then((result) => {
      res.status(200).json({
        message: "Clothes fetched successfully",
        clothes: result,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching clothes failed!",
      });
    });
};

exports.loadSingleProduct = (req, res, next) => {
  Cloth.findById(req.params.id)
    .then((cloth) => {
      if (cloth) {
        res.status(200).json(cloth);
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Loading product failed!",
      });
    });
};

exports.addProduct = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const product = new Cloth({
    title: req.body.title,
    imagePath: req.file ? url + "/images/" + req.file.filename : "",
    description: req.body.description,
    price: req.body.price,
  });
  product
    .save()
    .then((addedProduct) => {
      res.status(201).json({
        message: "New product added!",
        product: {
          ...addedProduct,
          id: addedProduct._id,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "An error occurred when adding product!",
      });
    });
};

exports.updateProduct = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const product = new Cloth({
    _id: req.body.id,
    title: req.body.title,
    imagePath: imagePath,
    description: req.body.description,
    price: req.body.price,
  });
  Cloth.updateOne({ _id: req.params.id })
    .then((result) => {
      res.status(200).json({
        message: "Product updated!",
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Updating product failed!",
      });
    });
};

exports.deleteProduct = (req, res, next) => {
  Cloth.deleteOne({ _id: req.params.id })
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
