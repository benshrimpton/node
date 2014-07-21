/**
 * Created by tebesfinwo on 7/21/14.
 */
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Product Attribute Schema
 * */
var productAttributeSchema = new Schema({

    //Attribute Id
    attribute_id : {
        type : String
    },

    //Attribute Code
    attribute_code : {
        type : String
    },

    //Attribute type
    frontend_input : {
        type : String
    },

    //Attribute scope
    scope : {
        type : String
    },

    //Attribute default value
    default_value : {
        type : String
    },

    //Defines whether the attribute is unique
    is_unique : {
        type : Number
    },

    //Defines whether the attribute is required
    is_required : {
        type : Number
    },

    /*
    * Apply to Empty for "Apply to all" or array of the following possible
    * values: 'simple', 'grouped', 'configurable', 'virtual', 'bundle', 'downloadable', 'giftcard'
    * */
    apply_to : [{
        type : String
    }],

    //Defines whether the attribute can be used for configurable products
    is_configurable : {
        type : Number
    },

    //Defines whether the attribute can be used in Quick Search
    is_searchable : {
        type : Number
    },

    //Defines whether the attribute can used in Advanced Search
    is_visible_in_advanced_search :{
        type : Number
    },

    //Defines whether the attribute can be compared on the frontend
    is_comparable : {
        type : Number
    },

    //Defines whether the attribute can be used for promo rules
    is_used_for_promo_rules : {
        type : Number
    },

    //Defines whether the attribute is visible on the frontend
    is_visible_on_front : {
        type : Number
    },

    //Defines whether the attribute can be used in product listing
    used_in_product_listing : {
        type : Number
    },

    /*
    * Array of additional fields
    * For information, please visit magento API DOC
    * http://www.magentocommerce.com/api/soap/catalog/catalogProductAttribute/product_attribute.info.html
    * */
    additionalFields : [{
        /*
        * Input validation for store owner. Possible values: 'validate number'(Decimal Number), 'validate-digits' (Integer Number),
        * 'validate-email' , 'validate-url', 'validate-alpha' (Letters), 'validate-alphanum' (Letters(a-z, A-Z), Numbers(0-9))
        * */
        frontend_class : {
            type : String
        },

        //Defines whether the HTML tags are allowed on the frontend
        is_html_allowed_on_front : {
            type : Boolean
        },

        //Defines whether it is used for sorting in product listing
        used_for_sort_by : {
            type : Boolean
        },

        //Enable Enable WYSIWYG flag
        is_wysiwyg_enabled : {
            type : Boolean
        },

        //Defines whether it is used in layered navigation
        is_filterable : {
            type : Boolean
        },

        //Defines whether it is used in search results layered navigation
        is_filterable_in_search : {
            type : Boolean
        },

        //Position
        position : {
            type : Number
        }

    }],

    /*
    * Array of catalogAttributeOptionEntity
    * Note : on Magento DOC, it is called options. Due to 'options' is a restricted keyword in mongoose,
    * 'AttributeOptions' is used instead.
    * */
    attributeOptions : [{
        //Text Label
        label : {
            type : String
        },
        //Option Id
        value : {
            type : String
        }
    }],

    //Array of catalogProductAttributeFrontendLabel
    frontend_label : [{
        //Store ID
        store_id : {
            type : String
        },
        //Text label
        label : {
            type : String
        }
    }]
});

mongoose.model('ProductAttribute', productAttributeSchema);