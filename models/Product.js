const mongoose = require('mongoose');
const idValidator = require("mongoose-id-validator");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    enum: ['Computers', 'Cars', 'Others'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  price: {
    type: Schema.Types.Decimal128,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  }
});

ProductSchema.plugin(idValidator, {
  message: "Bad ID value for {PATH}"
});

ProductSchema.methods.addUser = function (userId) {
  this.user = userId;
};

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;