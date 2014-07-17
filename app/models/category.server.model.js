/**
 * Created by tebesfinwo on 7/17/14.
 */
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Category Schema
 * */

var CategorySchema = new Schema({

    //category id
    category_id : {
        type : String,
        required : true,
        unique : true
    },

    //Defines whether the category is active
    is_active : {
        type : Number
    },

    //Category position
    position : {
        type : String
    },

    //Category level
    level : {
        type : String
    },

    //Parent Category id
    parent_id : {
        type : String
    },

    //All child categories of the current category
    all_children : {
        type : String
    },

    //names of direct child category
    children : {
        type : String
    },

    //Date when the category was created
    created_at : {
        type : String
    },

    //Date when the category was updated
    updated_at : {
        type : String
    },

    //Category name
    name : {
        type : String
    },

    //A relative URL path which can be entered in place of the standard target path (optional)
    url_key : {
        type : String
    },

    //Category description
    description  : {
        type : String
    },

    //Category meta title
    meta_title : {
        type : String
    },

    //Category meta keywords
    meta_keywords : {
        type : String
    },

    //Category meta description
    meta_description : {
        type : String
    },

    //Path
    path : {
        type : String
    },

    //URL path
    url_path : {
        type : String
    },

    //Number of child categories
    children_count : {
        type : Number
    },

    //Content that will be displayed on the category view page (optional)
    display_mode : {
        type : String
    },

    //Defines whether the category is anchored
    is_anchor : {
        type : Number
    },

    //All available options by which products in the category can be sorted
    available_sort_by : [{
        type : String
    }],

    //The custom design for the category (optional)
    custom_design : {
        type : String
    },

    //Apply the custom design to all products assigned to the category
    custom_apply_to_products : {
        type : String
    },

    //Date starting from which the custom design will be applied to the category (optional)
    custom_design_from : {
        type : String
    },

    //Date till which the custom design will be applied to the category (optional)
    custom_design_to : {
        type : String
    },

    //Type of page layout that the category should use (optional)
    page_layout : {
        type : String
    },

    //Custom layout update (optional)
    custom_layout_update : {
        type : String
    },

    //The default option by which products in the category are sorted
    default_sort_by : {
        type : String
    },

    //Landing page
    landing_page : {
        type : Number
    },

    //defines whether the category is available on the magento top menu bar
    include_in_menu : {
        type : Number
    },

    //Price range of each price level displayed in the layered navigation block
    filter_price_range : {
        type : String
    },

    //Defines whether the category will inherit custom design settings of the category to which it is assigned. 1 - yes, 0 - no
    custom_use_parent_settings : {
        type : Number
    }

});

mongoose.model('Category',CategorySchema);