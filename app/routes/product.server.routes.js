/**
 * Created by tebesfinwo on 7/17/14.
 */
'use strict';


/**
 * Module Dependencies
 * */


module.exports = function(app){
    var product = require('../../app/controllers/product'),
        cart = require('../../app/controllers/cart'),
        customer = require('../../app/controllers/customer');

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
        .get(customer.customer, cart.cartToLocals, product.getProducts);

    /*
    * Retrieve all categories.
    * **/
    app.route('/magento/category/all')
        .get(product.getCategory);

    /*
     * Create Product
     * **/
    app.route('/magento/product/new')
        .post(product.createProduct);

    /*
     * Delete the product
     * **/
    app.route('/magento/product/delete/:productSKU')
        .get(product.removeProduct);

    /*
     * Update the product
     * **/
    app.route('/magento/product/update/:productSKU')
        .post(product.updateProduct);

    /*
    * Retrieve the detail of the product using SKU
    * */
    app.route('/magento/product/:productSKU')
        .get(customer.customer , cart.cartToLocals , product.getProductBySKU);

    //Binding the product with middleware
    app.param('productSKU', product.productBySKU);

};