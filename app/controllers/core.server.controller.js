'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash'),
    Magento = require('magento'),
    mongoose = require('mongoose'),
    Product = mongoose.model('Product'),
    async = require('async');

/**
* Will need to fix it later on in the process, to make it easier to maintain in the future.
* */
exports.index = function(req, res) {

    Product.find({}, function(err, products){
        if (err) {
            res.send(500, {
                message : 'Something is definitely wrong'
            });
        } else {
            res.render('theme/index', {
                user: req.user || null,
                customer : req.session.customer || null,
                products : products
            });
        }
    });

};


/**
 * Need to REVISE the following function.
 * Note: The following function can't be used in production
 * */
exports.admin = function(req, res){
  res.render('admin/admin', {
      user : req.user || null
  })
};