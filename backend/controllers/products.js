const Product = require("../models/product");

exports.loadProducts = async (req, res, next) => {
  const result = await Product.find();

  try {
    return res.status(200).json({
      message: "Wunderbaums fetched successfully",
      products: result
    });
  } catch (err) {
    return res.status(500).json({
      message: "Fetching products failed!"
    });
  };
};

exports.loadSingleProduct = async (req, res, next) => {
  const result = await Product.findById(req.params.id);

  try {
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Product not found!"});
    }
  } catch (err) {
    return res.status(500).json({
      message: "Loading the product failed!"
    });
  };
};

exports.addProduct = async (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const product = new Product({
    title: req.body.title,
    imagePath: req.file ? url + "/images/" + req.file.filename : "",
    description: req.body.description,
    price: req.body.price,
    productType: req.body.productType
  });
  console.log(product);
  try {
    const addedProduct = await product.save();

    return res.status(200).json({
      message: "New product added successfully",
      product: {
        ...addedProduct,
        id: addedProduct._id,
      }
    });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong when adding new product!"
    });
  };
};

exports.updateProduct = async (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const product = new Product({
    _id: req.body.id,
    title: req.body.title,
    imagePath: imagePath,
    description: req.body.description,
    price: req.body.price,
    productType: req.body.productType
  });

  try {
    const result = await Product.updateOne({ _id: req.params.id }, product);
    return res.status(200).json({ message: "Product Updated successfully!" });
  } catch {
    return res.status(500).json({ message: "Updating the product failed" });
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const result = await Product.deleteOne({ _id: req.params.id });
    if (result.deletedCount > 0) {
      return res.status(200).json({ message: "Product deleted successfully!" });
    } else {
      return res.status(401).json({ message: "Product deletion failed due you're not authorized!"});
    }
  } catch (err) {
    return res.status(500).json({ message: "Product deletion failed. Something went wrong!" });
  }
};
