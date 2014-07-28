'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash'),
    Magento = require('magento'),
    async = require('async');

exports.index = function(req, res) {
	res.render('theme/index', {
		user: req.user || null,
        customer : req.session.customer || null
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