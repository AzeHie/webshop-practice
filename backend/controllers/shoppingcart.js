const CartItem = require("../models/cartitem");

exports.loadCart = (req, res, next) => {
  let cartItems = [];
  let creatorId = req.userData.userId;
  const cartQuery = CartItem.find({ creator: req.userData.userId });
  cartQuery
    .then((documents) => {
      for (let i = 0; i < documents.length; i++) {
        if (documents[i].creator == creatorId) {
          let item = {
            productId: documents[i].productId,
            title: documents[i].title,
            price: documents[i].price,
            imagePath: documents[i].imagePath,
            description: documents[i].description,
            amount: documents[i].amount,
            creator: documents[i].creator,
          };
          cartItems.push(item);
        }
      }
      res.status(200).json({
        message: "Cart loaded successfully!",
        cartItems: cartItems,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Loading cart failed!",
      });
    });
};

exports.addCartItem = (req, res, next) => {
  const cartItem = new CartItem({
    productId: req.body.productId,
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    amount: req.body.amount,
    imagePath: req.body.imagePath,
    creator: req.userData.userId,
  });
  cartItem
    .save()
    .then((addedCartItem) => {
      res.status(201).json({
        message: "New item added successfully",
        cartItem: {
          ...addedCartItem,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Adding new item failed!",
      });
    });
};

exports.addStorageItems = async (req, res, next) => {
  const storageCart = req.body;
  let currentCart = await CartItem.find({
    creator: req.userData.userId,
  });
  try {
    if (currentCart.length < 1) {
      // if there is no items in the user's cart already
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
    } else {
      for (let storageItem of storageCart) {
        for (let i = 0; i < currentCart.length; i++) {
          if (storageItem.productId === currentCart[i].productId) {
            // check if item is already in the user's cart, if so, edit price and amount
            let tempItem = storageItem;
            tempItem.price = parseFloat(tempItem.price);
            tempItem.price += +currentCart[i].price;
            tempItem.amount += currentCart[i].amount;
            tempItem.price = tempItem.price.toFixed(2);
            await CartItem.findOneAndUpdate(
              {
                $and: [
                  { creator: req.userData.userId },
                  { productId: tempItem.productId },
                ],
              },
              { price: tempItem.price, amount: tempItem.amount },
              { returnDocument: "after" }
            );
            currentCart = await CartItem.find({
              creator: req.userData.userId,
            });
            break;
          } else {
            // if item is not in the user's cart already
            const cartItem = new CartItem({
              productId: storageItem.productId,
              title: storageItem.title,
              price: storageItem.price,
              description: storageItem.description,
              amount: storageItem.amount,
              imagePath: storageItem.imagePath,
              creator: req.userData.userId,
            });

            const AlreadyInCart = (item, currentCart) => {
              // because we don't want to add same item twice?
              for (let i = 0; i < currentCart.length; i++) {
                if (currentCart[i].productId === item.productId) {
                  return true;
                }
              }
              return false;
            };
            const cartQuery = AlreadyInCart(cartItem, currentCart);
            if (cartQuery === false) {
              await cartItem.save();
              currentCart = await CartItem.find({
                creator: req.userData.userId,
              });
              break;
            }
          }
        }
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
      console.log(deletedItem);
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
