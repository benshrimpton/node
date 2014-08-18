/**
 * Created by tebesfinwo on 8/18/14.
 */

'use strict';


/**
 * Module Dependencies
 * */
var Promise = require('bluebird'),
    mongoose = require('mongoose'),
    Product = mongoose.model('Product'),
    Country = mongoose.model('Country'),
    Async = require('async'),
    _ = require('lodash'),
    CreditCard = require('credit-card');


exports.renderCheckout = function(req, res){
    Async.parallel({
       shippings : function(cb){
           global
               .magento
               .checkoutCartShipping
               .list({
                   quoteId : req.session.cart.id
               },function(err, shipping){
                   cb(err, shipping);
               });
       },
       payments : function(cb){
           global
               .magento
               .checkoutCartPayment
               .list({
                   quoteId : req.session.cart.id
               }, function(err, payments){
                   cb(err, payments)
               });
       },
       countries : function(cb){
           Country.find({}).exec(function(err, countries){
               cb(err, countries);
           });
       }
    }, function(err, results){
        if (err) {
            return res.status(500).send(err);
        } else {
            console.log(results.payment);
            res.render('theme/checkout/checkout',{
                shippings : results.shippings,
                payments : results.payments,
                countries : results.countries,
                cartInfo : req.session.cart.details
            });
        }
    });
};

















