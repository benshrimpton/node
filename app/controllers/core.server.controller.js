'use strict';

/**
 * Module dependencies.
 */

var Magento = require('magento');
var _ = require('lodash');

exports.index = function(req, res) {

    var magento = new Magento({
        host : 'kikavargas.blackandblackcloud.com',
        port : 80,
        path : '/api/xmlrpc',
        login : 'tebesfinwo',
        pass : '5U{us6fe=0F8f7}]fA_?n37Rb4FlVk'
    });

    magento.login(function(err, sessionId) {
        if (err) throw err;

        magento.core.info(function(err, info){
            if (err) throw err;
            console.log(info);
        });

        magento.directoryCountry.list(function(err, countries) {
            if (err) throw err;
            console.log('Found %d countries', countries.length);
        });

        magento.catalogCategory.tree(function(tree){
            console.log(tree);
            _.forEach(tree, function(leave){
                console.log()
            });
        });


        console.log(sessionId);
    });


	res.render('index', {
		user: req.user || null
	});
};