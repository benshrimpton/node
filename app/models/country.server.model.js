/**
 * Created by tebesfinwo on 7/29/14.
 */
'use strict';

/**
 * Module Dependencies
 * */

var Mongoose = require('mongoose'),
    Schema = Mongoose.Schema;

/**
 * Country Schema
 * */
var CountrySchema = new Schema({
    country_id : {
        type : String
    },
    iso2_code : {
        type : String
    },
    iso3_code : {
        type : String
    },
    name : {
        type : String
    },
    regions : [{
        region_id : {
            type : String
        },
        code : {
            type : String
        },
        name : {
            type : String
        }
    }]
});


Mongoose.model('Country', CountrySchema);