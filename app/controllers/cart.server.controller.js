/**
 * Created by tebesfinwo on 7/22/14.
 */

/**
 * QuoteId is also known as the shopping cart Id.
 * */

'use strict';

/**
 * Module Dependencies
 * */
var Promise = require('bluebird'),
    mongoose = require('mongoose'),
    Product = mongoose.model('Product'),
    Category = mongoose.model('Category'),
    Store = mongoose.model('Store'),
    ProductAttribute = mongoose.model('ProductAttribute'),
    Async = require('async'),
    _ = require('lodash'),
    CreditCard = require('credit-card');


var internal = {};


/**
 * Retrieve active store object
 * */
internal.getCurrentStoreId = function(cb){
    Store
        .findOne()
        .exec(function(err, currentStore){
        if (err) {
            return cb(err);
        } else {
            var activeStore = _.find(currentStore.store, function(store){
                return store.is_active === 1;
            });
            return cb(null, activeStore);
        }
    });
};

/**
 * Add coupon to the cart
 *
 * args must be an object such as following
 *
 * args = {
 *  cartId : Your Cart Id ,
 *  couponCode : Your coupon code
 * }
 *
 * */
internal.addCouponToCart = function(args, callback){

    if (typeof couponCode === 'function' ) {
        throw new Error('Wrong type couponCode');
    } else if ( ! couponCode ) {
        throw new Error('Coupon Code cannot be empty');
    }


    global
        .magento
        .checkoutCartCoupon
        .add({
            quoteId : args.cartId,
            couponCode : args.couponCode
        }, function(err, isAdded){
            callback(err, isAdded);
        });

};


/**
 * Remove coupon from cart
 *
 * args must be an object such as following
 * args = {
 *  cartId : Your cart ID
 * }
 *
 * */
internal.removeCouponFromCart = function(args, callback){

    global
        .magento
        .checkoutCartCoupon
        .remove({
            quoteId : args.cartId
        }, function(err, isRemoved){
           callback(err, isRemoved);
        });

};

/**
 * Retrieve a list of available payments methods for a shopping cart
 * */
internal.getPaymentMethods = function(cartId, callback){

    global
        .magento
        .checkoutCartPayment
        .list({
            quoteId : cartId
        }, function(err, shoppingCartPaymentMethods){
            callback(err, shoppingCartPaymentMethods);
        });

};

/**
 * Set a payment method for a shopping cart
 *
 * args = {
 *  cartId : Shopping Cart Id
 *  po_number : Purchase Order number,
 *  method : payment method,
 *  cc_cid : credit card CID,
 *  cc_owner ; credit card owner,
 *  cc_number : credit card number,
 *  cc_type : credit card type,
 *  cc_exp_year : credit card expiration year,
 *  cc_exp_month : credit card expiration month
 * }
 *
 * */
internal.setupPayment = function(args, callback){

    if (_.isNull(args) || _.isUndefined(args) || _.isFunction(callback) === false ){
        throw new Error('Wrong argument type');
    }

    var card = {
        cardType :args.cc_type.toUpperCase(),
        number : args.cc_number,
        expiryMonth : args.cc_exp_month,
        expiryYear : args.cc_exp_year
    };

    var validation = CreditCard.validate(card);

    if( validation.validCardNumber === false ) {
        return callback(new Error('Your credit card number is not valid'));
    } else if ( validation.validExpiryMonth === false ) {
        return callback(new Error('Your expiry month is incorrect'));
    } else if ( validation.validExpiryYear === false ) {
        return callback(new Error('Your expiry year is incorrect'));
    } else if (validation.validCvv === false) {
        return callback(new Error('Your CVV is incorrect'));
    } else if ( validation.isExpired ){
        return callback(new Error('Your card has expired'));
    }

    var paymentData = _.clone(args);
    delete magentoCC.cartId;

    global
        .magento
        .checkoutCartPayment
        .method({
            quoteId : args.cartId,
            paymentData : paymentData
        }, function(err, isSucess){
            callback(err, isSucess);
        });



};

/**
 * Retrieve the list of available shipping methods for a shopping cart
 *
 * args = {
 *  cartId : Your shopping cart id
 *
 * }
 *
 * */
internal.getShippingMethods = function(args, callback){

    if (_.isNull(args) || _.isUndefined(args) || _.isFunction(callback) === false ){
        throw new Error('Wrong argument type');
    }


    global
        .magento
        .checkoutCartShipping
        .list({
            quoteId : args.cartId
        }, function(err, shoppingCartMethods){
            return callback(err, shoppingCartMethods);
        });

};

/**
 * Set a shipping method for a shopping cart
 *
 * args = {
 *  cartId : Your shopping cart id,
 *  shippingMethod : Your shipping method code
 * }
 * */
internal.setShippingMethodToCart = function(args, callback){

    if (_.isNull(args) || _.isUndefined(args) || _.isFunction(callback) === false ){
        throw new Error('Wrong argument type');
    }

    global
        .magento
        .checkoutCartShipping
        .method({
            quoteId : args.cartId,
            shippingMethod : args.shippingMethod
        }, function(err, isSet){
            return callback(err, isSet);
        });

};

/**
 *
 * */
internal.addItemToCart = function(args, callback){

};


/**
 * Retrieve the total prices for a shopping cart.
 *
 * @params String cartId
 * */
internal.getCartTotal = function(cartId){

    return new Promise(function(resolve, reject){
        internal.getCurrentStoreId(function(err, activeStore){
            if (err) {
                reject(err);
            } else {
                global
                    .magento
                    .checkoutCart
                    .totals({
                        quoteId : cartId,
                        storeView : activeStore.store_id
                    }, function(err, totals){
                        if (err) {
                            reject(err);
                        } else {
                            resolve(totals);
                        }
                    });
            }
        });
    });

};

/**
 * Retrieve full information about the shopping cart.
 *
 * @params String cartId
 *
 * @return []
 * */
internal.getTotalInfo = function(cartId){
    return new Promise(function(resolve, reject){
        console.log(cartId + ' %%^%&%^&^%&^%^767%^&%^&%^&');
        global
            .magento
            .checkoutCart
            .info({
                quoteId : cartId
            }, function(err, cartInfo){
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log(cartInfo);
                    resolve(cartInfo);
                }
            });
    });
};

/**
 * Retrieve the website license agreement for the quote according to the store
 *
 * @param String cartId (required)
 * @param String storeView (optional)
 * @param String agreements (optional)
 *
 * @return []
 *
 * */
internal.getLicense = function(cartId, storeView, agreements){
    return new Promise(function(resolve, reject){
        global
            .magento
            .checkoutCart
            .order({
                quoteId : cartId,
                storeView : (storeView) ? storeView : null,  //enforce null
                agreements : (agreements) ? agreements : null
            }, function(err, license){
                if (err) {
                    reject(err);
                } else {
                    resolve(license);
                }
            });
    });
};


/**
 * Retrieve the list of products in the shopping cart
 *
 * @param String cartId (required)
 *
 * @return []
 * */
internal.getProductInCart = function(cartId){
    return new Promise(function(resolve, reject){
        global
            .magento
            .checkoutCartProduct
            .list({
                quoteId : cartId
            }, function(err, products){
                if (err) {
                    reject(err);
                } else {
                    resolve(products);
                }
            });
    });
};


/**
 * add a single product to the cart
 *
 * In the form, it needs to have the following names (either product_id or sku needs to be present in the form) :
 * 1. product_id
 * 2. sku
 * 3. qty
 * */
exports.addToCart = function(req, res){

    var product = {};
    product.sku = (req.body.sku) ? req.body.sku : null;
    product.qty = (req.body.qty || req.body.qty > 0) ? parseFloat(req.body.qty) : 1.00;

    /*
     * Following variables were not added into the cart since
     * it is not always requested.
     *
     * associativeArray Options - an array in the form of option_id => content (optional)
     * associateArray bundle_option - an array of bundle item options (optional)
     * associateArray bundle_option_qty - an array of bundle items quantity (optional)
     * ArrayOfString links - an array of links (optional)
     * */

    /*
     * Add item into cart
     * */
     global
        .magento
        .checkoutCartProduct
        .add({
            quoteId : req.session.cart.id ,
            products : product
        }, function(err, isSuccess){
            if (err) {
                return res.send(500, {
                    message : err.message
                });
            } else {
                if (isSuccess) {
                    /*
                     * Retrieve the most updated cart
                     * */
                    global
                        .magento
                        .checkoutCart
                        .info({
                            quoteId : parseInt(req.session.cart.id)
                        }, function(err, info){
                            if (err) {
                                return res.send(500, {
                                    err : err
                                });
                            } else {

                                req.session.cart.details = info;

                                res.format({
                                    html : function(){
                                        return res.redirect('/cart');
                                    },
                                    json : function(){
                                        return res.send(200, {
                                            message : "The product has been added to the cart",
                                            cart : info
                                        });
                                    }
                                });
                            }
                        });
                } else {
                    return res.send(400, {
                        message : "The product was not added to the cart"
                    });
                }
            }
        });
};

/**
 * Retrieve cart detail
 * */
exports.getCart = function(req, res){
    if ( !req.session.cart ) {
        res.format({
            html : function(){
                return res.render('theme/checkout/cart');
            },
            json : function(){
                return res.send(400, {
                    message : 'You cart is empty'
                });
            }
        });
    } else {
        return res.render('theme/checkout/cart', {
            cartInfo : req.session.cart.details
        });

    }
};

/**
 * Update an product in the shopping cart
 * @return status 200
 * */
exports.updateItemInCart = function(req, res){
    if ( !req.session.cart ) {
        return res.send(400, {
            message : 'You cart is empty'
        });
    } else if ( typeof req.body.qty !== 'number' ){
        return res.send(400, {
            message : 'Naughty naughty, please use a proper number'
        });
    } else {
        var product = {};

        product.product_id = req.body.product_id;
        product.sku = req.body.sku;
        product.qty = (req.body.qty < 0) ? 0 : req.body.qty;

        /*
         * Following variables were not added into the cart since
         * it is not always requested.
         *
         * associativeArray Options - an array in the form of option_id => content (optional)
         * associateArray bundle_option - an array of bundle item options (optional)
         * associateArray bundle_option_qty - an array of bundle items quantity (optional)
         * ArrayOfString links - an array of links (optional)
         * */

        global
            .magento
            .checkoutCartProduct
            .update({ quoteId : req.session.cart.id , productsData : product}, function(err, isUpdated){
                if ( err ) {
                    return res.send(500, {
                        message : err.message
                    });
                }
                if (isUpdated) {
                    return res.send(200, {
                        message : "The product has been updated."
                    });
                } else {
                    res.send(400, {
                        message : "The product could not be updated"
                    });
                }

            });
    }
};

/**
 * Remove an item from the shopping cart
 * */
exports.removeItemFromCart = function(req, res){
    if (!req.session.cart){
        return res.send(400, {
            message  : 'You cart is empty'
        });
    } else if ( ! req.params.sku ) {
        return res.send(400, {
            message : 'No SKU is defined'
        });
    }

    var sku = req.params.sku;

    global
        .magento
        .checkoutCartProduct
        .list({ quoteId : req.session.cart.id }, function(err, products){
            if (err) {
                return res.send(200, {
                    message : err.message
                });
            } else {
                /*
                * Does it need to loop through the whole thing to remove the item ?
                * It needs to investigate.
                *
                * Update the following snippet of code to that it will break from the loop once it finds the item and
                * remove the item.
                * */
              for(var i = 0; i < products.length; i++){
                  if ( products[i].sku === sku ) {
                      global
                          .magento
                          .checkoutCartProduct
                          .remove({ quoteId : req.session.cart.id , productsData : products[i] }, function(err, isRemoved){
                              if (err) {
                                  return res.send(200, {
                                      message : err.message
                                  })
                              } else {
                                  if (isRemoved) {
                                      return res.send(200, {
                                          message : 'The cart has been cleared'
                                      })
                                  } else {
                                      return res.send(400, {
                                          message : 'The cart was not cleared'
                                      });
                                  }
                              }
                          });
                  }
              }
            }
        });

};

/**
 * Clear all of items in the cart
 *
 *
 * Deleting cart in session is sufficient enough since Magento doesn't mention
 * how to perform delete in Magento.
 *
 * @return status
 * */
exports.clearCart = function(req, res){

    delete req.session.cart;

    res.format({
        html : function(){
            return res.redirect('/cart');
        },
        json : function(){
            return res.status(200).send({
                message : 'The Cart has been cleared.'
            });
        }
    });

//    global
//        .magento
//        .checkoutCartProduct
//        .list({ quoteId : req.session.cart.id }, function(err, products){
//            if (err) {
//                return res.send(500, {
//                    message : err.message
//                })
//            } else {
//                global
//                    .magento
//                    .checkoutCartProduct
//                    .remove({ quoteId : req.session.cart.id , productsData : products }, function(err, isRemoved){
//                        if (err) {
//                            return res.send(200, {
//                                message : err.message
//                            })
//                        } else {
//                            if (isRemoved) {
//
//                                res.format({
//                                    html : function(){
//                                        return res.redirect('/cart');
//                                    },
//                                    json : function(){
//                                        return res.send(200, {
//                                            message : 'The cart has been cleared'
//                                        })
//                                    }
//                                });
//                            } else {
//                                return res.send(400, {
//                                    message : 'The cart was not cleared'
//                                });
//                            }
//                        }
//                    });
//            }
//        });

};

/**
 * Add coupon to the cart
 * */
exports.addCoupon = function(req, res){

    if (!req.session.cart){
        return res.send(400, {
            message  : 'You cart is empty'
        });
    }

    var obj =  {
        cartId : req.session.cart.id,
        couponCode : req.body.couponCode
    };

    internal.addCouponToCart(obj, function(err, isAdded){
        if (err) {
            return res.send(500, {
                message : err.message
            });
        } else {
            if (isAdded) {
                /**
                 * Store the coupon code in session.
                 * */
                req.session.cart.details.coupon_code = obj.couponCode;

                return res.status(200).send({
                    message : 'Coupon Monster likes your coupon',
                    isAdded : isAdded
                });
            } else {
                return res.status(400).send({
                    message  : 'Sorry, Coupon Monster does not like your coupon.',
                    isAdded : isAdded
                });
            }
        }
    });

};

/**
 * Remove coupon to the cart
 * */
exports.removeCoupon = function(req, res){

    if (!req.session.cart){
        return res.send(400, {
            message  : 'You cart is empty'
        });
    }

    var obj =  {
        cartId : req.session.cart.id
    };

    internal.removeCouponFromCart(obj, function(err, isRemoved){
        if (err) {
            return res.send(500, {
                message : err.message
            });
        } else {
            if (isRemoved) {

                req.session.cart.details.coupon_code = null;

                return res.status(200).send({
                    message :  'Coupon has been taken away from the Coupon Monster',
                    isRemoved : isRemoved
                });

            } else {
                return res.status(400).send({
                    message : 'Coupon Monster is still having your coupon. Please try again later.',
                    isRemoved : isRemoved
                });
            }
        }
    });

};



/**
 * Retrieve a list of available payment methods for a shopping cart
 * */
exports.getPaymentMethods = function(req, res){

    internal.getPaymentMethods({
        cartId : req.session.cart.id
    }, function(err, paymentMethods){
        if (err) {
            return res.send(500, {
                message : err.message,
                error : err
            });
        } else {
            return res.send(200, {
                paymentMethods : paymentMethods
            });
        }
    });

};


/**
 * Retrieve a list of available shipping methods for a shopping cart
 * */
exports.getShippingMethods = function(req, res){

    if (!req.session.cart){
        return res.send(403, {
            message  : 'You are forbidden '
        });
    }

    var obj = {
        cartId : req.session.cart. id
    };

    internal.getShippingMethods(obj, function(err , shippingMethods){
        if (err) {
            return res.send(500, {
                message : err.message
            });
        } else {
            return res.send(200,{
                shippingMethods : shippingMethods
            });
        }
    });

};


/**
 * Cart Middleware
 * */

/**
 * Create cart in session if it does not exist
 * */
exports.createCart = function(req, res, next){

    if (_.isUndefined(req.session.cart)){
        Store.findOne().exec(function(err, store){
            if (err) {
                return res.send(500, {
                    message : err.message
                });
            } else {
                var activeStore = _.find(store.store, function(store){
                    return store.is_active === 1;
                });
                global
                    .magento
                    .checkoutCart
                    .create({
                        storeView  : activeStore.store_id
                    },function(err,quoteId){
                        if (err) {
                            return res.send(500, {
                                message : err.message
                            });
                        } else {

                            var billingAddress = {
                                mode : 'billing',
                                firstname : 'john',
                                lastname : 'doe',
                                company : 'dummy',
                                street : '123 abc',
                                city : 'abc',
                                region : 'abcd',
                                postcode : '0123456',
                                country_id  : 'id',
                                telephone : '0123456789',
                                fax : '0123456789',
                                is_default_billing : 0,
                                is_default_shippping : 0
                            };

                            var shippingAddress = {
                                mode : 'shipping',
                                firstname : 'john',
                                lastname : 'doe',
                                company : 'dummy',
                                street : '123 abc',
                                city : 'abc',
                                region : 'abcd',
                                postcode : '0123456',
                                country_id  : 'id',
                                telephone : '0123456789',
                                fax : '0123456789',
                                is_default_billing : 0,
                                is_default_shippping : 0
                            };

                            if (_.isUndefined(req.session.customer) === false){

                                var customer = {}
                                customer.mode = 'customer';
                                customer.customer_id = req.session.customer.info.customer_id;

                                shippingAddress = {};
                                billingAddress = {};

                                if (_.isNull(req.session.customer.info.default_billing) === false ) {
                                    billingAddress.mode = 'billing';
                                    billingAddress.address_id = req.session.customer.info.default_billing;
                                }

                                if (_.isNull(req.session.customer.info.default_shipping) === false ){
                                    shippingAddress.mode = 'shipping';
                                    shippingAddress.address_id = req.session.customer.info.default_shipping;
                                }


                                global
                                    .magento
                                    .checkoutCartCustomer
                                    .set({
                                        quoteId : quoteId,
                                        customerData :customer
                                    }, function(err, isSet){
                                        if (err) {
                                            return res.status(500).send({
                                                message : err.message,
                                                error : err
                                            });
                                        } else {
                                            global
                                                .magento
                                                .checkoutCartCustomer
                                                .addresses({
                                                    quoteId : quoteId,
                                                    customerAddressData : [  billingAddress ,  shippingAddress ]
                                                }, function(err, isSet){
                                                    if (err) {
                                                        return res.send(500, {
                                                            message : err.message,
                                                            error : err
                                                        });
                                                    } else {
                                                        req.session.cart = {};
                                                        req.session.cart.id = quoteId;
                                                        next ();
                                                    }
                                                });
                                        }
                                    });

                            } else {

                                global
                                    .magento
                                    .checkoutCartCustomer
                                    .addresses({
                                        quoteId : quoteId,
                                        customerAddressData : [  billingAddress ,  shippingAddress ]
                                    }, function(err, isSet){
                                        if (err) {
                                            return res.send(500, {
                                                message : err.message,
                                                error : err
                                            });
                                        } else {
                                            req.session.cart = {};
                                            req.session.cart.id = quoteId;
                                            next ();
                                        }
                                    });
                            }
                        }
                    });
            }
        });
    } else {
        next();
    }
};


/**
 * Expose cart to locals
 * */
exports.cartToLocals = function(req, res, next){
    if (req.session.cart){
        res.locals.cart = req.session.cart.details;
        next();
    } else {
        next();
    }
};


/**
 * Double check that the cart does exist in the session.
 * */
exports.cartRequire = function(req, res, next){
    if (!req.session.cart) {
        return res.status(500).send({
            message : 'There is something wrong with the cart. Please contact Admin'
        });
    } else {
        next();
    }
};