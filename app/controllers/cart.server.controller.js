/**
 * Created by tebesfinwo on 7/22/14.
 */
'use strict';

/**
 * Module Dependencies
 * */
var Promise = require('bluebird'),
    mongoose = require('mongoose'),
    Product = mongoose.model('Product'),
    Category = mongoose.model('Category'),
    ProductAttribute = mongoose.model('ProductAttribute'),
    async = require('async'),
    _ = require('lodash');

/*
* QuoteId is also known as the shopping cart Id.
* */

/**
 * add a single product to the cart
 *
 * In the form, it needs to have the following names (either product_id or sku needs to be present in the form) :
 * 1. product_id
 * 2. sku
 * 3. qty
 * */
exports.addToCart = function(req, res){
    if (!req.session.cart){
        global.magento.checkoutCart.create(function(err,quoteId){
            if (err) {
                return res.send(500, {
                    message : err.message
                });
            }
            req.session.cart = {};
            req.session.cart.id = quoteId;
        });
    } else {

        var product = {};

        product.product_id = req.body.product_id;
        product.sku = req.body.sku;
        product.qty = req.body.qty;

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
            .add({ quoteId : req.session.cart.id , products : product}, function(err, isSuccess){
                if (err) {
                    return res.send(500, {
                        message : err.message
                    });
                }
                if (isSuccess) {
                    /*
                    * Retrieve the most updated cart
                    * */
//                    global
//                        .magento
//                        .checkoutCartProduct
//                        .list(function(err, itemsInCart){
//                            if (err) {
//                                return res.send(500, {
//                                    message : err.message
//                                });
//                            }
//                            res.jsonp(itemsInCart);
//                        });

                    return res.send(200, {
                        message : "The product has been added to the cart"
                    });

                } else {
                    return res.send(400, {
                        message : "The product was not added to the cart"
                    });
                }
        });
    }
};

/**
 * retrieve a list of products in the shopping cart (quote) in the form of array.
 * @return JSON
 * */
exports.getCart = function(req, res){
    if ( !req.session.cart ) {
        return res.send(400, {
            message : 'You cart is empty'
        });
    }
    global
        .magento
        .checkoutCartProduct
        .list(function(err, itemsInCart){
            if (err) {
                return res.send(500, {
                    message : err.message
                });
            }
            res.jsonp(itemsInCart);
        });
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


exports.removeItemFromCart = function(req, res){
    if (!req.session.cart){
        return res.send(400, {
            message  : 'You cart is empty'
        });
    }
};

/**
 * Clear all of items in the cart
 * @return status
 * */
exports.clearCart = function(req, res){

    if (!req.session.cart){
        return res.send(400, {
            message  : 'You cart is empty'
        });
    }

    global
        .magento
        .checkoutCartProduct
        .list({ quoteId : req.session.cart.id }, function(err, products){
            if (err) {
                return res.send(500, {
                    message : err.message
                })
            } else {
                global
                    .magento
                    .checkoutCartProduct
                    .remove({ quoteId : req.session.cart.id , productsData : products }, function(err, isRemoved){
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
        });

};


exports.checkout = function(req, res){

};