/**
 * Created by tebesfinwo on 7/17/14.
 */
'use strict';


/**
 * Module Dependencies
 * */
var magento = require('../../app/controllers/magento');

module.exports = function(app){

    app.route('/magento')
        .get(magento.synchProduct);

};