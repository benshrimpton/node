/**
 * Created by tebesfinwo on 7/28/14.
 */
'use strict';

var Mongoose = require('mongoose'),
    Schema = Mongoose.Schema;

/**
 * Customer Group Schema
 * */
var customerGroupSchema = new Schema({
    customer_group_id : {
        type : Number
    },
    customer_group_code : {
        type : String
    }
});

Mongoose.model('CustomerGroup', customerGroupSchema);