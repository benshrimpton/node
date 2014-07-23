/**
 * Created by tebesfinwo on 7/23/14.
 */

'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var storeSchema =  new Schema({
    //Magento version
    magento_version : {
        type : String
    },

    //Magento edition()
    magento_edition : {
        type : String
    },

    store : [{
        //Store view ID
        store_id : {
            type : Number
        },
        //Store view code
        code : {
            type : String
        },
        //Website ID
        website_id : {
            type : Number
        },
        //Group ID
        group_id : {
          type : Number
        },
        //Store name
        name : {
            type : String
        },
        //Store view sort order
        sort_order : {
            type : Number
        },
        //Defines whether the store is active
        is_active : {
            type : Number
        }
    }]


});

mongoose.model('Store', storeSchema);