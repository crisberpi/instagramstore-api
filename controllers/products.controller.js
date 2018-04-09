const mongoose = require('mongoose');
const Shop = require('../models/shop.model');
const ApiError = require('../models/api-error.model');
const Product = require('../models/product.model');

module.exports.list = (req, res, next) => {
  Product.find()
    .then(product => res.status(200).json(product))
    .catch(error => next(error));
}

module.exports.get = (req, res, next) => {
  const id = req.params.id;
  Product.findById(id)
    .then(product => {
      if (product) {
        res.json(product)
      } else {
        next(new ApiError(`Product not found`, 404));
      }
    }).catch(error => next(error));
}

module.exports.createProduct = (req, res, next) => {
  const ownerId = req.shop._id;
  const product = new Product(req.body);
  if (req.file) {
    shop.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  }
  product.save()
  .then(productSaved => {
  console.log(productSaved);
  Shop.findById(ownerId)
  .then(shop => {
    shop.products.push(product._id);
    shop.save()
    .then(() => {
      res.json(product);
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new ApiError(error.errors));
      } else {
        next(new ApiError(error.message, 500));
      }
    })
  })
      .catch(error => next(new ApiError('Shop not found', 400)))
    })
    .catch(error => next(new ApiError('Couldn\'t save product', 400)))
  }


module.exports.editProduct = (req, res, next) => {
  const id = req.params.id;
  if (req.file) {
    body.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  }
  Product.findByIdAndUpdate(id, { $set: req.body }, { new: true })
    .then(product => {
      if (product) {
        res.json(product)
      } else {
        next(new ApiError(`Product not found`, 404));
      }
    }).catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new ApiError(error.message, 400, error.errors));
      } else {
        next(new ApiError(error.message, 500));
      }
    });
}



module.exports.deleteProduct = (req, res, next) => {
  const id = req.params.id;
  Product.findByIdAndRemove(id)
    .then(product => {
      if (product) {
        res.status(204).json()
      } else {
        next(new ApiError(`Product not found`, 404));
      }
    }).catch(error => next(error));
}