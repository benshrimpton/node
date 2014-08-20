/**
 * Created by tebesfinwo on 8/18/14.
 */

'use strict';


module.exports = function(app){

    var Checkout = require('../../app/controllers/checkout'),
        Cart = require('../../app/controllers/cart'),
        Customer = require('../../app/controllers/customer');

    app
        .route('/checkout')
        .get( Customer.customer , Cart.cartToLocals , Checkout.renderCheckout);


    app
        .route('/place/order')
        .post(Cart.placeOrder);


};