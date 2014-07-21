/**
 * Created by tebesfinwo on 7/17/14.
 */
'use strict';


/**
 * Module Dependencies
 * */
var magento = require('../../app/controllers/magento');

module.exports = function(app){

    //to synchronize product and attributes
    app.route('/magento/product')
        .get(magento.synchProduct);


    //to synchronize category
    app.route('/magento/category')
        .get(magento.synchCategory);

    /*
    * Prototyping
    * retrieve all products
    * */
    app.route('/magento/product/all')
        .get(magento.getProducts);

};