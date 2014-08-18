/**
 * Created by tebesfinwo on 8/18/14.
 */

'use strict';


module.exports = function(app){

    var Checkout = require('../../app/controllers/checkout');

    app
        .route('/checkout')
        .get(Checkout.renderCheckout);


};