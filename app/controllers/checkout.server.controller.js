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
           Country.find({}).exec(function (err, countries) {
               cb(err, countries);
           });
       },
       billingAddress : function(cb){
           if (req.session.customer.info.default_billing && req.session.customer.addresses.length > 0 ){
               _.forEach(req.session.customer.addresses, function(address){
                   if ( address.customer_address_id ===  req.session.customer.info.default_billing) {
                       //console.log(address.street);
                       //address.street = address.street.split('\n');
                       if (_.isArray(address.street) === false ) {
                           address.street = address.street.split('\n');
                       }
                       return cb(null, address);
                   }
               });
           } else {
               return cb(null, null);
           }
       },
       shippingAddress : function(cb){
           if (req.session.customer.info.default_shipping && req.session.customer.addresses.length > 0 ){
               _.forEach(req.session.customer.addresses, function(address){
                   if ( address.customer_address_id ===  req.session.customer.info.default_shipping) {
                       //console.log(address.street);
                       //address.street = address.street.split('\n');
                       if (_.isArray(address.street) === false ) {
                           address.street = address.street.split('\n');
                       }
                       return cb(null, address);
                   }
               });
           } else {
               return cb(null, null);
           }
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
                shippingAddress : results.shippingAddress
            });
        }
    });
};

















