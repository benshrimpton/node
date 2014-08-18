'use strict';

module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core');
    var cart = require('../../app/controllers/cart');

	app.route('/').get(cart.cartToLocals ,core.index);

    app.route('/admin').get(core.admin);
};