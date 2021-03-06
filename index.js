const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./config");
const app = express();
const port = 8000;

const categories = require("./app/categories");
const users = require("./app/users");
const products = require("./app/products");

const run = async () => {
  await mongoose.connect(config.getDbUrl(), {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

  app.use(cors());
  app.use(express.static("public"));
  app.use(express.json());
  app.use("/categories", categories());
  app.use("/users", users());
  app.use("/products", products());


  app.listen(port, () => {
    console.log("Server started at http://localhost:" + port);
  });
};

run().catch(e => console.log(e));
