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
       countries : function(cb) {
           Country.find({}).sort('name').exec(function (err, countries) {
               cb(err, countries);
           });
       },
       billingAddress : function(cb){
           if (req.session.customer && req.session.customer.addresses.length > 0 ){

               for(var i = 0; i < req.session.customer.addresses.length; i++){
                   if ( req.session.customer.addresses[i].customer_address_id ===  req.session.customer.info.default_billing) {
                       if (_.isArray(req.session.customer.addresses[i].street) === false ) {
                           req.session.customer.addresses[i].street = req.session.customer.addresses[i].street.split('\n');
                       }
                       return cb(null, address);
                   }
               }

           } else {
               return cb(null, null);
           }
       },
       shippingAddress : function(cb){
           if (req.session.customer && req.session.customer.addresses.length > 0 ){

               for(var i = 0; i < req.session.customer.addresses.length; i++){
                   if ( req.session.customer.addresses[i].customer_address_id ===  req.session.customer.info.default_shipping) {
                       if (_.isArray(req.session.customer.addresses[i].street) === false ) {
                           req.session.customer.addresses[i].street = req.session.customer.addresses[i].street.split('\n');
                       }
                       return cb(null, address);
                   }
               }

           } else {
               return cb(null, null);
           }
       },
       license : function(cb) {
           global
               .magento
               .checkoutCart
               .license({
                   quoteId : req.session.cart.id,
                   storeView : req.session.cart.details.store_id
               }, function(err, license){
                   cb(err, license);
               });
       }
    }, function(err, results){
        if (err) {
            return res.status(500).send(err);
        } else {
            res.render('theme/checkout/checkout',{
                shippings : results.shippings,
                payments : results.payments,
                countries : results.countries,
                cartInfo : req.session.cart.details,
                billingAddress : results.billingAddress,
                shippingAddress : results.shippingAddress,
                license : results.license,
                failMsg : JSON.stringify(req.flash('failMsg'))
            });
        }
    });
};

















