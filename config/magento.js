/**
 * Created by tebesfinwo on 7/9/14.
 */

'use strict';

/**
 * Module dependencies.
 */

var Magento = require('magento');


module.exports = function(){

    console.log("Calling from magento.js");

    var magento = new Magento({
        host : 'kikavargas.blackandblackcloud.com',
        port : 80,
        path : '/api/xmlrpc',
        login : 'tebesfinwo',
        pass : '5U{us6fe=0F8f7}]fA_?n37Rb4FlVk'
    });

    magento.login(function(err, sessionId) {
        if (err) throw err;
        console.log(sessionId);
        return magento;
    });


    return magento;
};