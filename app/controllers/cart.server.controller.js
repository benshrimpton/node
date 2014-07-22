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

exports.addToCart = function(req, res){
    if (!req.session.cart){
        global.magento.checkoutCart.create(function(err,quoteId){
            req.session.cart = {};
            req.session.cart.id = quoteId;
        });
    } else {
        global.magento.checkoutCartProduct.add({  });
    }
};

exports.updateCart = function(req, res){

};


exports.removeItemFromCart = function(req, res){

};


exports.clearCart = function(req, res){

};


exports.checkout = function(req, res){

};