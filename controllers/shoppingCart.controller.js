const mongoose = require('mongoose');
const ShoppingCart = require('../models/shoppingCart.model');
const Product = require('../models/product.model');
const paypalConfig = require('../configs/paypal.config');
const paypal = require('paypal-rest-sdk');
const ApiError = require('../models/api-error.model');

module.exports.list = (req, res, next) => {
  //Aquí tenemos que trabajar con las cookies para poder pasar a la vista carrito la info de carrito de un no-logueado
    if (req.user) {
        const userEmail = req.user.email;
        ShoppingCart.findOne({ userEmail:userEmail }, (err, cart) => {
            if (err) { return next(err); }
                if (cart) {
                  res.status(201).json(cart)
                }else{
                  next(new ApiError(`shoppingCart not found`, 404));
                }
        });
    } else {
    next(new ApiError(`You have to login if you want to buy`, 404));
    }
};


module.exports.removeProductFromCart = (req, res, next) => {
    const removedProductUserEmail = req.params.email;
    const removedProductName = req.params.name;

    ShoppingCart.findOne({userEmail:removedProductUserEmail}, (err, cart) => {

        for (let i = 0; i < cart.productsArray.length; i++) {
            if (cart.productsArray [ i ].name === removedProductName) {
                indexOfProduct = i;
            }
        }
        cart.totalCartPrice -= cart.productsArray [indexOfProduct].price;
        cart.productsArray.splice(indexOfProduct,1);
        cart.save();
    });
    res.status(200).json(cart)
}


module.exports.addProductToCart = (req, res, next) => {

    const pushedToCartProductName = req.params.name;

    Product.findOne({name:pushedToCartProductName}, (err, pushedToCartProduct) => {
        //console.log(pushedToCartProduct);
        pushedToCartProduct = pushedToCartProduct;

        if (req.user) {
            const userEmail = req.user.email;

            ShoppingCart.findOne({ userEmail:userEmail }, (err, cart) => {
                if (err) { return next(err); }
                if (cart) {
                    cart.productsArray.push(pushedToCartProduct);
                    cart.totalCartPrice += pushedToCartProduct.price;
                    cart.save();
                    //console.log(cart);
                } else {
                    const newShoppingCart = new ShoppingCart({
                        userEmail: userEmail
                    });
                    newShoppingCart.productsArray.push(pushedToCartProduct);
                    newShoppingCart.save();
                    newShoppingCart.totalCartPrice = pushedToCartProduct.price;
                    //console.log(newShoppingCart);
                }
            });
            //Flash product added to cart
            res.status(204).json()
        }else{
            //Message: need to login to purchase
            next(new ApiError(`You have to login if you want to buy`, 404));
        }
    });
};
//







module.exports.pay = (req, res, next) => {
  const create_payment_json = paypalConfig.createPayment(req.body);

  paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
          console.log(error.response);
          throw error;
      } else {
        const response = {};
        for (var index = 0; index < payment.links.length; index++) {
          if (payment.links[index].rel === 'approval_url') {
            response.redirectUrl = payment.links[index].href;
          }
        }
        res.json(response);
      }
  });
};

module.exports.executePayment = (req, res, next) => {

         const payerId = req.query.PayerID;
         const paymentId = req.query.paymentId;
         const execute_payment_json = {
           "payer_id": payerId,
         };


      paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
         if (error) {
           console.log(error.response);
           throw error;
         } else {
           res.redirect('http://localhost:4200/')
        }
      })
};


module.exports.onPaypalError = (req, res, next) => {
  res.send('Cancel');
}
