const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const app = express();

const productRoutes = require("./routes/products");
const shoppingCartRoutes = require("./routes/shoppingcart");
const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/orders");

mongoose
  .connect(
    "mongodb+srv://AZE:" +
      process.env.MONGO_ATLAS_PW +
      "@azesshopdb.olxjf.mongodb.net/azesshopDatabase?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection to database failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  //middleware for all incoming requests
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/products", productRoutes);
app.use("/api/shoppingcart", shoppingCartRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
module.exports = app;
