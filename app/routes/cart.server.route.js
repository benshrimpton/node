/**
 * Created by tebesfinwo on 8/6/14.
 */


'use strict';



module.exports = function(app){

    var Cart = require('../../app/controllers/cart');




    app
        .route('/cart')
        .get(Cart.getCart);


    app
        .route('/cart/add')
        .post(Cart.createCart , Cart.addToCart);

    app
        .route('/cart/shipments')
        .get(Cart.createCart, Cart.getShippingMethods);

    app
        .route('/cart/payments')
        .get(Cart.createCart, Cart.getPaymentMethods);

};