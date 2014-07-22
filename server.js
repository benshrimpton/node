'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	mongoose = require('mongoose'),
    Promise = require('bluebird'),
    Magento = require('magento');

/**
 *
 * */


/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = mongoose.connect(config.db);

// Init the express application
var app = require('./config/express')(db);

// Bootstrap passport config
require('./config/passport')();

// Start the app by listening on <port>
app.listen(config.port);

var magento = new Magento({
    host : 'kikavargas.blackandblackcloud.com',
    port : 80,
    path : '/api/xmlrpc',
    login : 'tebesfinwo',
    pass : '5U{us6fe=0F8f7}]fA_?n37Rb4FlVk'
});

/**
 * Global object be accessible by other module
 * In other words, it is public and has been exposed to all modules.
 * Beware with this global properties, and it may pose as a security risk.
 * */
magento.login(function(err, sessionId){
    if (err) throw err;
    global.magento = magento;
});



// Expose app
exports = module.exports = app;



// Logging initialization
console.log('MEAN.JS application started on port ' + config.port);