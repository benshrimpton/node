/**
 * Created by tebesfinwo on 7/9/14.
 */

'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var ProductSchema = new Schema({

    //Product ID
    productId:{
        type : String
    },

    //Product sku
    sku: {
        type : String
    },

    //Product Set
    set: {
        type : String
    },

    //Product type
    type : {
        type : String
    },

    //array of categories ( it is an array of string. may change it  )
    categories : [{
        type : Schema.Types.ObjectId,
        ref : 'category'
    }],

    //array of websites ( it is an array of string. may change it  )
    websites : [{
        type : Schema.Types.ObjectId,
        ref : 'websites'
    }],

    //Date when the product was created ( may remove in future )
    created_at : {
        type : String
    },

    //Date when the product was last updated ( may remove in future )
    updated_at : {
        type : String
    },

    //type id
    type_id : {
        type : String
    },

    //Product name
    name : {
        type : String
    },

    //Product Description
    description : {
        type : String
    },

    //Short description for a product
    short_description : {
        type : String
    },

    //Product weight
    weight : {
        type : String
    },

    //Status of a product
    status : {
        type : String
    },

    //Relative URL path that can be entered in place of a target path
    url_key : {
        type : String
    },

    //URL Path
    url_path : {
        type : String
    },

    //Product visibility on the frontend
    visibility : {
        type : String
    },

    //Array of category IDs ( it is an array of string. may change it  )
    category_ids : [{
        type : String
    }],

    //Array of website IDs ( it is an array of string. may change it  )
    websites_ids : [{
        type : String
    }],

    //Define whether the product has options
    has_options : {
        type : String
    },

    //Define whether the gift message for the product
    gift_message_available : {
        type : String
    },

    //Product Price
    price : {
        type : String
    },

    //Product Special Price
    special_price : {
        type : String
    },

    //Date starting from which the special price is applied to the product
    special_from_date : {
        type : String
    },

    //Date till which the special price is applied to the product
    special_to_date  : {
        type : String
    },

    //Tax Class ID
    tax_class_id : {
        type : String
    },

    //Array of catalogProductTiesPriceEntity
    tier_price : [{
        type : Schema.Types.ObjectId,
        ref:  'tierPrice'
    }],

    //Meta title
    meta_title : {
        type : String
    },

    //Meta keyword
    meta_keyword : {
        type : String
    },

    //Meta description
    meta_description : {
        type : String
    },

    //custom design
    custom_design : {
        type : String
    },

    //custom layout update
    custom_layout_update : {
        type : String
    },

    //options container
    options_container : {
        type : String
    },

    //Array of additionl attributes
    additional_attributes : [{
        type : String
    }],

    //Define whether Google Checkout is applied to the product
    enable_googlecheckout :{
       type : String
    }

    /**
     * continue on Monday
     * - install big number
     * - change some of the types
     * - flatten out some of the objects
     * */


});