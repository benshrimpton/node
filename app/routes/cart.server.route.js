/**
 * Created by tebesfinwo on 8/6/14.
 */


'use strict';



module.exports = function(app){

    var Cart = require('../../app/controllers/cart');

    app
        .route('/cart/products')
        .get(Cart.getAllCart);


    app
        .route('/cart/add')
        .post(Cart.createCart , Cart.addToCart);

};