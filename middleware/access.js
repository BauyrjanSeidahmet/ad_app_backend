const Product = require('../models/Product');

const access = async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (product === null || product.user.toString() !== req.user._id.toString()) {
    return res.status(403).send('Product was not found');
  }

  next();
};

module.exports = access;
