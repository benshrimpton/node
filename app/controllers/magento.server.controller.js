/**
 * Created by tebesfinwo on 7/11/14.
 */
'use strict';

/**
 * Module Dependencies
 * */
var mongoose = require('mongoose'),
    Product = mongoose.model('Product'),
    async = require('async'),
    _ = require('lodash');


exports.synchProduct = function(req, res){
    async.waterfall([
        function(cb){
            global.magento.catalogProduct.list(function(err, storeView){
                cb(err, storeView);
            });
        },
        function(storeView, cb){
            _.forEach(storeView, function(catalogProductEntity){
                saveProductById(catalogProductEntity.product_id);
//                console.log(catalogProductEntity);
            });
            cb(null, storeView);
        }
    ], function(err, results){
        if(err) throw err;
        res.jsonp(results[0]);
    });
};

/**
 * Save the product using the retrieved product id.
 *
 * @Param String productId
 * @callback function cb(null|err)
 * */
var saveProductById = function(productId, cb){

    var isSaved = true;

    if (typeof productId === 'undefined')
        cb(new Error('The product id is undefined'));

    global.magento.catalogProduct.info({ id : productId }, function(err, productInfo){

        if (err)
            cb(err);

        var obj = {};

        obj.product_id = productInfo.product_id;
        obj.sku = productInfo.sku;
        obj.product_set = productInfo.set;
        obj.type = productInfo.type;
        obj.created_at = productInfo.created_at;
        obj.updated_at = productInfo.updated_at;
        obj.type_id = productInfo.type_id;
        obj.name = productInfo.name;
        obj.description = productInfo.description; 
        obj.short_description = productInfo.short_description; 
        obj.weight = (productInfo.weight) ? productInfo.weight : null;
        obj.status = productInfo.status;
        obj.url_key = productInfo.url_key; 
        obj.url_path = productInfo.url_path;
        obj.visibility = productInfo.visibility;
        obj.has_options = productInfo.has_options;
        obj.gift_message_available = productInfo.gift_message_available;
        obj.price = productInfo.price;
        obj.special_price = productInfo.special_price;
        obj.special_from_date = productInfo.special_from_date;
        obj.special_to_date = productInfo.special_to_date;
        obj.tax_class_id = productInfo.tax_class_id;
        obj.meta_title = productInfo.meta_title;
        obj.meta_description = productInfo.meta_description;
        obj.custom_design = productInfo.custom_design; //don't think that we need this variable;
        obj.custom_layout_update = productInfo.custom_layout_update; //don't think that we need this variable;
        obj.options_container = productInfo.options_container;
        obj.enable_googlecheckout = productInfo.enable_googlecheckout;


        Product.find({ product_id : productInfo.product_id }, function(err, product){
            if (err) {
                console.log(err);
            } else {
                //there is something in the product
                if (product.length !== 0) {
                    //update the product instead;
                    console.log("Found the product in database " + productInfo.name);
                    Product.update({ product_id : productInfo.product_id }, obj, function(err, numAffectedRow){
                        if (err) {
                            console.log(err);
                            throw err;
                        }
                        console.log("The number of updated documents was %d", numAffectedRow);
                    });
                } else {
                    //create the product instead;
                    console.log(productInfo.name + " is created in database ");
                    var product = new Product(obj);

                    product.save(function(err){
                        if (err) {
                            isSaved = false;
                            console.log(err);
                        }
                    });
                }
            }
        });
    });


};

