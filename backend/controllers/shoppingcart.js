const CartItem = require("../models/cartitem");

exports.loadCart = async (req, res, next) => {
  try {
    const cartQuery = await CartItem.find({ creator: req.userData.userId });

    return res.status(200).json({
      message: "Cart loaded successfully!",
      cartItems: cartQuery,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Loading the cart failed!",
    });
  }
};

exports.addCartItem = async (req, res, next) => {
  const cartItem = new CartItem({
    productId: req.body.productId,
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    amount: req.body.amount,
    imagePath: req.body.imagePath,
    creator: req.userData.userId,
  });

  try {
    await cartItem.save();
    res.status(201).json({
      message: "New item added successfully",
      cartItem: {
        ...cartItem,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Adding new item failed!",
    });
  }
};

exports.addStorageItems = async (req, res, next) => {
  const storageCart = req.body;

  try {
    let currentCart = await CartItem.find({
      creator: req.userData.userId,
    });

    if (currentCart.length < 1) {
      // if there is no items in the user's cart already, add them one by one
      for (let storageItem of storageCart) {
        const cartItem = new CartItem({
          productId: storageItem.productId,
          title: storageItem.title,
          price: storageItem.price,
          description: storageItem.description,
          amount: storageItem.amount,
          imagePath: storageItem.imagePath,
          creator: req.userData.userId,
        });
        await cartItem.save();
      }
    } else { // there was items in the user's cart already, there is chance that we have to edit some of them
      for (let storageItem of storageCart) {
        currentCart = await currentCart.map((cartItem) => {
          if (storageItem.productId === cartItem.productId) { // if item exists in cart already, edit amount & price
            let tempItem = storageItem;
            tempItem.price = parseFloat(tempItem.price);
            tempItem.price += +cartItem.price;
            tempItem.price = tempItem.price.toFixed(2);
            tempItem.amount += cartItem.amount;
            return tempItem;
          } else {
            return storageItem;
          }
        });
      }
      for (let item of currentCart) {
        await CartItem.findOneAndReplace(
          {
            $and: [
              { creator: req.userData.userId }, // filter
              { productId: item.productId }, // another filter
            ],
          },
          { // replace with:
            productId: item.productId,
            title: item.title,
            price: item.price,
            description: item.description,
            amount: item.amount,
            imagePath: item.imagePath,
            creator: req.userData.userId,
          },
          {
            returnDocument: "after", // return updated document
          }
        );
    }
    }
    return res.status(200).json({
      message: "Storage items added successfully!",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong!",
    });
  }
};

exports.editCartItem = (req, res, next) => {
  let doc = CartItem.findOneAndUpdate(
    {
      $and: [
        { creator: req.userData.userId },
        { productId: req.body.productId },
      ],
    },
    { price: req.body.price, amount: req.body.amount }
  );
  doc
    .then((updatedItem) => {
      res.status(200).json({
        message: "item updated succesfully",
        cartItem: {
          ...updatedItem,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Item update failed!",
      });
    });
};

exports.deleteCartItem = (req, res, next) => {
  CartItem.deleteOne({ creator: req.userData.userId, productId: req.params.id })
    .then((deletedItem) => {
      res.status(200).json({ message: "Item deleted successfully!" });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Deleting failed!",
      });
    });
};

exports.emptyCart = (req, res, next) => {
  CartItem.deleteMany({ creator: req.userData.userId })
    .then(() => {
      res.status(200).json({
        message: "Cart is now empty!",
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Something went wrong!",
      });
    });
};
