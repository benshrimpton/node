/**
 * Created by tebesfinwo on 7/17/14.
 */
'use strict';


/**
 * Module Dependencies
 * */


module.exports = function(app){
    var product = require('../../app/controllers/product');

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
    * Retrieve all categories.
    * **/
    app.route('/magento/category/all')
        .get(product.getCategory);

    /*
    * Retrieve the detail of the product using SKU
    * */
    app.route('/magento/product/:productSKU')
        .get(product.getProductBySKU);


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

    //Binding the product with middleware
    app.param('productSKU', product.productBySKU);

};