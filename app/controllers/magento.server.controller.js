/**
 * Created by tebesfinwo on 7/11/14.
 */
'use strict';

/**
 * Module Dependencies
 * */
var mongoose = require('mongoose'),
    Product = mongoose.model('Product'),
    Category = mongoose.model('Category'),
    async = require('async'),
    _ = require('lodash');


exports.synchProduct = function(req, res){
    synchProduct(function(err, results){
        if (err) {
            return res.send(500, {
                message : err.message
            })
        }
        res.jsonp(results[0]);
    });
};

/**
 * Synchronize the category
 * @callback function cb(err ,null|[objects]
 * */
var synchCategory = function(cb){
    async.waterfall([
        function(cb){
            //to sync all categories
            global.magento.catalogCategory.tree(function(err, catalogCategoryTree){
                if (err) {
                    cb(err);
                } else {
                    cb(null, catalogCategoryTree);
                }
            });
        },
        function( catalogCategoryTree, cb){
            _.forEach(catalogCategoryTree, function(catalogCategory){
                //save and update the catalogCategory
            });
        }
    ], function(err, results){
        if (err) {
            cb(err)
        }else {
            cb(null, results);
        }
    });
};

/**
 * Save the category using the retrieved catalog id
 * @param String categoryId
 * @callback function cb(err, null|err);
 * */
var saveCategoryById = function(categoryId, cb){
    if ( typeof categoryId === 'undefined' )
        cb(new Error('Something is wrong with category'));
    global.magento.catalogCategory.info(categoryId, function(err, categoryInfo){
        if (err) {
            return cb(err);
        }
        Category.find({ category_id : categoryId }, function(err, category){
            if (err) {
                return cb(err);
            }
            //category does not exist in the database
            if ( category.length !== 0 ){
                console.log("Found category in database");
                Category.update({ category_id : categoryId }, categoryInfo, function(err, affectedRow){
                    console.log("Updated category row : " + affectedRow);
                    cb(err, affectedRow);
                });
            } else {
                var category = new Category(categoryInfo);
                category.save(function(err){
                    cb(err);
                });
            }
        });
    });
};

/**
 * Synchronize the product
 * @callback function cb(err, null|[objects])
 * */
var synchProduct = function(cb){
    async.waterfall([
        function(cb){
            global.magento.catalogProduct.list(function(err, storeView){
                cb(err, storeView);
            });
        },
        function(storeView, cb){
            _.forEach(storeView, function(catalogProductEntity){
                saveProductById(catalogProductEntity.product_id);
            });
            cb(null, storeView);
        }
    ],function(err, results){
        if ( typeof cb === 'function' ){
            if (err) cb(err);
            cb(null, results);
        }
    });
};

/**
 * Save the product using the retrieved product id.
 *
 * @Param String productId
 * @callback function cb(err, null|err)
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
                        console.log("The number of updated product was %d", numAffectedRow);
                        cb(err, numAffectedRow);
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
                        cb(err);
                    });
                }
            }
        });
    });


};

