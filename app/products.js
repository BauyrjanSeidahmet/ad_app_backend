const express = require('express');
const multer = require('multer');
const { nanoid } = require('nanoid');
const path = require('path');
const Product = require('../models/Product');
const config = require('../config');
const ValidationError = require('mongoose').Error.ValidationError;
const auth = require('../middleware/auth');
const access = require('../middleware/access');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, nanoid() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const createRouter = () => {
  router.get('/', async (req, res) => {
    const allProducts = await Product.find().populate('category', 'title');
    if (req.query.category) {
      const categoryProducts = allProducts.filter(
        oneProduct => oneProduct.category.title === req.query.category
      );
      return res.send(categoryProducts);
    }
    res.send(allProducts);
  });
  router.post('/', [upload.single('image'), auth], async (req, res) => {
    const product = { ...req.body };
    if (req.file) {
      product.image = req.file.filename;
    }

    const result = new Product(product);
    try {
      result.addUser(req.user.id);
      await result.save();
      res.send(result);
    } catch (err) {
      if (err instanceof ValidationError) {
        res.status(400).send(err);
      } else {
        res.sendStatus(500);
      }
    }
  });
  router.get('/:id', async (req, res) => {
    try {
      const product = await Product.findById(req.params.id)
        .populate('category', 'title')
        .populate('user');
      if (product) {
        res.send(product);
      } else {
        res.sendStatus(404);
      }
    } catch (e) {
      res.sendStatus(500);
    }
  });
  router.delete('/:id', auth, access, async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.send('Product was deleted');
    } catch (e) {
      res.status(400).send(e);
    }
  });

  return router;
};

module.exports = createRouter;
