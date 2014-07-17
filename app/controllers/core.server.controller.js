'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash'),
    Magento = require('magento'),
    async = require('async');

exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null
	});
};