/**
 * Created by tebesfinwo on 7/17/14.
 */
'use strict';


/**
 * Module Dependencies
 * */
var product = require('../../app/controllers/product');

module.exports = function(app){

    //to synchronize product and attributes
    app.route('/magento/sync/product')
        .get(product.synchProduct);


    //to synchronize category
    app.route('/magento/sync/category')
        .get(product.synchCategory);


    /*
    * Prototyping
    * retrieve all products
    * */
    app.route('/magento/product')
        .get(product.getProducts);

    /*
    * Retrieve the detail of the product using SKU
    * */
    app.route('/magento/product/:productSKU')


    //Binding the product with middleware
    app.param('productSKU', product.productBySKU);

};