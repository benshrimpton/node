/**
 * Created by tebesfinwo on 7/23/14.
 */
'use strict';

var magento = require('../../app/controllers/magento');


module.exports = function(app){

    //to synchronize magento store
    app.route('/magento/sync/store')
        .get(magento.syncStore);


};