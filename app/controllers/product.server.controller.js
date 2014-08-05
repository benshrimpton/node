/**
 * Created by tebesfinwo on 7/11/14.
 */
'use strict';

/**
 * Module Dependencies
 * */
var Promise = require('bluebird'),
    mongoose = require('mongoose'),
    Product = mongoose.model('Product'),
    Category = mongoose.model('Category'),
    MagentoStore = mongoose.model('Store'),
    ProductAttribute = mongoose.model('ProductAttribute'),
    Async = require('async'),
    _ = require('lodash');


var internal = {};

/**
 * Methods
 * */
//recursively retrieve the information from database.
function getTreeCategory(parentId){

    var obj = {};
    obj.parentId = (typeof parentId !== 'undefined') ? parentId : 0; //assuming the id of the root of the tree is zero.

    global.magento.catalogCategory.tree(obj ,function(err, catalogCategory){
        if (err) {
            console.log(err)
        } else {
            for(var i = 0; i < catalogCategory.children.length; i++){
                saveCategoryById(catalogCategory.children[i].category_id);
                if ( catalogCategory.children[i].children.length > 0 ){
                    getTreeCategory(catalogCategory.children[i].category_id);
                }
            }
        }
    });
}

/**
 * Save the category using the retrieved catalog id
 * @param String categoryId
 * @callback function cb(err, null|err);
 * */
var saveCategoryById = function(categoryId, cb){
    if ( typeof categoryId === 'undefined' )
        throw (new Error('Something is wrong with category'));
        //return cb(new Error('Something is wrong with category'));
    global.magento.catalogCategory.info({categoryId : categoryId}, function(err, categoryInfo){
        if (err) {
            throw err;
            //return cb(err);
        }
        Category.find({ category_id : categoryId }, function(err, category){
            if (err) {
                throw err;
                //return cb(err);
            }
            //category does not exist in the database
            if ( category.length !== 0 ){
                Category.update({ category_id : categoryId }, categoryInfo, function(err, affectedRow){
                    if(err) throw err;
                    console.log("Updated category row : " + affectedRow);
                    //return cb(err);
                });
            } else {
                var category = new Category(categoryInfo);
                category.save(function(err){
                    if (err) throw err;
                    console.log("Created new category in database");
                    //return cb(err);
                });
            }
        });
    });
};

/**
 * Save the existed category in the database, like product and posts
 * @callback cb function(err, results|null)
 * */
var synchCategory = function(cb){

    Category
        .find({})
        .remove()
        .exec(function(err){
            if (err) {
                return cb(err);
            } else {
                Product
                    .find({}, function(err, products){
                        if (err) {
                            return cb(err)
                        } else {
                            for(var i = 0; i < products.length; i++){
                                for(var j = 0; j < products[i].categories.length; j++){
                                    saveCategoryById(products[i].categories[j])
                                }
                            }
                            cb(null, products);
                        }
                    });
            }
        });

};

/**
 * save the product attribute to mongoDB
 * @param catalogProductAttributeEntity[] obj
 * @callback cb ( error | null )
 * */
var saveProductAttributeToDB = function(obj, cb){

    //For information, please read commnet on productAttribute.server.model
    obj.attributeOptions = obj.options;

    ProductAttribute.findOne({ attribute_id : obj.attribute_id }, function(err, attribute){
        if ( err ) {
            console.log(err);
            //do something with the error.
            return cb(err);
        } else {
            if (attribute) {

                attribute = _.extend(attribute , obj);

                attribute.save(function(err){
                    if (err){
                        console.log(err);
                        //handle the error;
                        cb(err)
                    }
                });

            } else {

                var attribute = new ProductAttribute(obj);

                attribute.save(function(err){
                    if (err){
                        console.log(err);
                        //handle the error
                        cb(err);
                    }
                });

            }
        }
        cb(null);
    });

}

/**
 * Loop out the array of product attribute to save it into database
 * @param String setId
 * @callback cb (error | null)
 * */
var saveProductAttribute = function(setId, cb){
    if ( typeof setId !== 'undefined' ){
        global.magento.catalogProductAttribute.list({ setId : setId }, function(err, productAttributes){
            for(var i = 0; i < productAttributes.length; i++ ){
                global.magento.catalogProductAttribute.info({ attribute : productAttributes[i].attribute_id }, function(err, attributeDetail ){
                    if (err) {
                        console.log(err);
                        //handle the error
                        return cb(err);
                    } else {
                        attributeDetail.product_set = setId;
                        saveProductAttributeToDB(attributeDetail, function(err){
                            if (err) {
                               return  cb(err);
                            }
                        });
                    }
                });
            }
            cb(null);
        });
    }
};

/**
 * Synchronize the product attribute
 * @callback cb (error | null)
 * */
var synchProductAttribute = function(cb){
    /*
    * Clear the database, and reconstruct the database;
    * */
    ProductAttribute
        .find({})
        .remove()
        .exec(function(err){
            if (err) {
                return cb(err);
            }
            global.magento.catalogProductAttributeSet.list(function(err, sets){
                if (err) {
                    return cb(err);
                }

                for(var i = 0; i < sets.length; i++){
                    saveProductAttribute(sets[i].set_id, function(err){
                        if (err) {
                            return cb(err);
                        }
                    });
                }
                return cb(null);
            });
        });

};





/**
 * Save the product using the retrieved product id.
 *
 * @Param String productId
 * @callback function cb(err, null|err)
 *
 *
 * Note : It needs to be flatten out for maintainable. It also needs to clear out the program
 *
 * */
var saveProductById = function(productId, cb){

    if (typeof productId === 'undefined')
        throw(new Error('The product id is undefined'));

    global.magento.catalogProduct.info({ id : productId }, function(err, productInfo){

        if (err){
            console.log(err);
            //handle error
        } else {
            productInfo.product_set = productInfo.set;
            productInfo.weight = (productInfo.weight) ? productInfo.weight : null;

            global.magento.catalogProductAttributeMedia.list({ product : productInfo.product_id}, function(err, media){
                if (err) {
                    console.log(err);
                    //handle the error
                } else {

                    productInfo.product_media = media;

                    global.magento.catalogProductTierPrice.info({ product : productInfo.product_id }, function(err, tierPrice){
                        if (err) {
                            console.log(err)
                            //handle the error
                        } else {

                            productInfo.product_tier_price = tierPrice;

                            global.magento.catalogProduct.currentStore(function(err, storeView){
                                if (err) {
                                    console.log(err);
                                    //handle the error
                                } else {

                                    global.magento.catalogProductTag.list({ productId : productInfo.product_id , storeView : storeView }, function(err, tags){

                                        if (err) {
                                            console.log(err);
                                        } else {

                                            console.log("___________________");
                                            console.log(tags);
                                            console.log("___________________");

                                            productInfo.product_tags = tags;

                                            global.magento.catalogProductCustomOption.list({ productId : productInfo.product_id }, function(err, customOption){
                                                if (err) {
                                                    console.log(err);
                                                } else {

                                                    productInfo.product_customOptions = customOption;

                                                    if ( productInfo.type === 'downloadable' ) {
                                                        global.magento.catalogProductDownloadableLink.list({ productId : productInfo.product_id }, function(err, productDownloadableLink){
                                                            if (err) {
                                                                console.log(err);
                                                                //handle the error
                                                            } else {
                                                                productInfo.links = productDownloadableLink.links;
                                                                productInfo.samples = productDownloadableLink.samples;
                                                            }

                                                            Product.findOne({ product_id : productInfo.product_id }, function(err, product){
                                                                if (err) {
                                                                    console.log(err);
                                                                } else {
                                                                    //there is something in the product
                                                                    if (product) {
                                                                        //update the product instead;
                                                                        console.log("Found the product in database " + product.name);
                                                                        Product.update({ product_id : productInfo.product_id }, productInfo, function(err, numAffectedRow){
                                                                            if (err) {
                                                                                console.log(err);
                                                                                throw err;
                                                                            }
                                                                            console.log("The number of updated product was %d", numAffectedRow);
                                                                            //cb(err, numAffectedRow);
                                                                        });

                                                                    } else {
                                                                        //create the product instead;
                                                                        var product = new Product(productInfo);

                                                                        product.save(function(err, product, numAffectedRow){
                                                                            if (err) {
                                                                                console.log(err);
                                                                            }
                                                                            //cb(err);
                                                                        });
                                                                    }
                                                                }
                                                            });

                                                        });
                                                    } else {
                                                        Product.findOne({ product_id : productInfo.product_id }, function(err, product){
                                                            if (err) {
                                                                console.log(err);
                                                            } else {
                                                                //there is something in the product
                                                                if (product) {
                                                                    //update the product instead;
                                                                    Product.update({ product_id : productInfo.product_id }, productInfo, function(err, numAffectedRow){
                                                                        if (err) {
                                                                            console.log(err);
                                                                            throw err;
                                                                        }
                                                                        //cb(err, numAffectedRow);
                                                                    });

                                                                } else {
                                                                    //create the product instead;
                                                                    var product = new Product(productInfo);

                                                                    product.save(function(err, product, numAffectedRow){
                                                                        if (err) {
                                                                            console.log(err);
                                                                        }
                                                                        //cb(err);
                                                                    });
                                                                }
                                                            }
                                                        });
                                                    }

                                                }
                                            });
                                        }

                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};


internal.getProductDetail = function(storeView, callback){
    Async.parallel({
        productInfo : function(callback){
            global
                .magento
                .catalogProduct
                .info({
                    id : storeView.product_id
                }, function(err, productInfo){
                    callback(err, productInfo);
                });
        },
        media : function(callback){
            global
                .magento
                .catalogProductAttributeMedia
                .list({
                    product : storeView.product_id
                }, function(err, media){
                    callback(err, media);
                });
        },
        tierPrice : function(callback){
            global
                .magento
                .catalogProductTierPrice
                .info({
                    product : storeView.product_id
                }, function(err, tierPrice){
                    callback(err, tierPrice);
                });
        },
        productTags : function(callback){
            global
                .magento
                .catalogProduct
                .currentStore(function(err, view){
                    if (err) {
                        return callback(err);
                    } else {
                        global
                            .magento
                            .catalogProductTag
                            .list({
                                product : storeView.product_id,
                                storeView : view
                            }, function(err, tags){
                                return callback(err, tags);
                            })
                    }
                });
        },
        customOptions : function(callback){
            global
                .magento
                .catalogProductCustomOption
                .list({
                    product : storeView.product_id
                }, function(err, customOptions){
                    callback(err, customOptions);
                });
        },
        downloadable : function(callback){
            if ( storeView.type === 'downloadable' ) {
                global
                    .magento
                    .catalogProductDownloadableLink
                    .list({
                        product : storeView.product_id
                    }, function(err, productDownloadableLink){
                        callback(err, productDownloadableLink);
                    });
            } else {
                callback(null);
            }
        }
    }, function(err, results){
        if (err) {
            return callback(err);
        } else {

            var productInfo =  results.productInfo;
            productInfo.product_set = productInfo.set;
            productInfo.weight = (productInfo.weight) ? productInfo.weight : nul;
            productInfo.product_media = results.media;
            productInfo.product_tier_price = results.tierPrice;
            productInfo.product_tags = results.productTags;
            productInfo.product_customOptions = results.customOptions;

            if (results.downloadable){
                productInfo.links = results.downloadable.links;
                productInfo.samples = results.downloadable.samples;
            }

            var product = new Product(productInfo);
            product.save(function(err, savedProduct){
                return callback(err, savedProduct);
            });


        }
    });
};

/**
 * will use the following method to sync all products in the future.
 * */
var syncProduct = function(callback){

    Async.waterfall([
        function(callback){
            Product
                .find({})
                .remove()
                .exec(function(err){
                    callback(err);
                });
        },
        function(callback){
            global
                .magento
                .catalogProduct
                .list(function(err, storeView){
                    callback(err, storeView);
                });
        }
    ], function(err, results){
        if (err) {
            return callback(err);
        } else {
            Async.each(results[0],
                function(storeView, callback){
                    internal.getProductDetail(storeView, function(err){
                        if (err) {
                            return callback(err);
                        } else {
                            return callback();
                        }
                    });
                }, function(err){
                    return callback(err);
                });
        }
    });

};




/**
 * Synchronize the product
 * @callback function cb(err, null|[objects])
 * */
var synchProduct = function(cb){
    global.magento.catalogProduct.list(function(err, storeView){
        if (err) {
            return cb(err);
        } else {
            var currentIndex = 0;
            for(var i = 0; i < storeView.length; i++){
                currentIndex = i;
                saveProductById(storeView[i].product_id);
            }
            if (currentIndex === (storeView.length - 1))
                cb(null, storeView);
        }
    });
};


exports.synchProduct = function(req, res){
    synchProduct(function(err, results){
        if (err) {
            return res.send(500, {
                message : err.message
            });
        }
        getTreeCategory();
        synchProductAttribute(function(err){
            if (err) {
                return res.send(500, {
                    message : err.message
                });
            } else {
                res.jsonp(results[0]);
            }
        });
    });
};

exports.synchCategory = function(req, res){
    synchCategory(function(err, results){
        if (err) {
            return res.send(500, {
                message : err.message
            });
        }
        res.jsonp(results[0]);
    });
};


exports.getProducts = function(req, res){
    Product.find({}, function(err, products){
        if (err) {
            return res.send(500, {
                message : err.message
            });
        } else {

            res.format({
                html : function(){
                    res.render('theme/product/products', {
                        products : products
                    });
                },
                json : function(){
                    res.jsonp(products);
                }
            });
//
//            res.jsonp(products);
        }
    });
};


exports.getCategory = function(req, res){
    Category.find({}, function(err, categories){
        if (err) {
            return res.send(500, {
                message : err.message
            });
        } else {
            res.jsonp(categories);
        }
    });
};

/**
* Product Type
*
* @return JSON productTypes[]
*
*
* There are only four product types, which are :
*
* type : simple
* label : Simple Product
*
* type : grouped
* label : Grouped Product
*
* type : virtual
* label : Virtual Product
*
* type : bundle
* label : Bundle Product
*
* type : downloadable
* label : Downloadable
*
* */
exports.getProductTypes = function(req, res){

    global
        .magento
        .catalogProductType
        .list(function(err, productTypes){
            if (err) {
                return res.send(500, {
                    message : err.message
                });
            } else {
                return res.send(200, {
                    productTypes : productTypes
                });
            }
        });

};


/**
 * Retrieve product attribute set.
 *
 * @return JSON productAttributeSet[]
 *
 * Properties:
 * set_id, name
 *
 * */
exports.getProductAttributeSet = function(req, res){

    global
        .magento
        .catalogProductAttributeSet
        .list(function(err, productAttributeSet){
            if (err) {
                return res.send(500, {
                    err : err.message
                });
            } else {
                return res.send(200, {
                    productAttributeSet : productAttributeSet
                });
            }
        });

};

/**
 * Create a product (Simple, experimental, much more to add to it later on)
 * */
exports.createProduct = function(req, res){

    global
        .magento
        .catalogProduct
        .create({
            type : req.body.productType,
            set : req.body.productAttributeType,
            sku : req.body.sku,
            data : req.body
        }, function(err, createdProductId){
            if (err) {
                console.log(err);
                return res.send(500, {
                    message : err.message
                });
            } else {

                /*
                * Save directly into MongoDB. Should we ?
                * **/
                var obj =  req.body;
                obj.type_id = obj.type;
                obj.product_id = createdProductId;

                var product = new Product(obj);
                product.save(obj, function(err, createdProduct){
                    if (err) {
                        console.log(err);
                        return res.send(500, {
                            message : err.message
                        });
                    } else {
                        return res.send(200, {
                            product : createdProduct
                        });
                    }
                });
            }
        });

};

/**
 * Delete product
 * */
exports.removeProduct = function(req, res){
    if (!req.product) {
        return res.send(404, {
            message : 'Not product was found'
        });
    }
    global
        .magento
        .catalogProduct
        .delete({
            id : req.product.product_id
        }, function(err, isRemoved){
            if (err) {
                return res.send(500, {
                    message : err.message
                })
            } else {
                req.product
                    .remove(function(err){
                        if (err) {
                            return res.send(500, {
                                message : err.message
                            });
                        } else {
                            return res.send(200, {
                                isRemoved : isRemoved
                            });
                        }
                    });
            }
        });
};

/**
 * Update product
 * */
exports.updateProduct = function(req, res){

    Product
        .findOne({ sku : req.params.sku })
        .exec(function(err, product){
            if (err) {
                return res.send(500, {
                    message : err.message
                });
            } else {
                global
                    .magento
                    .catalogProduct
                    .update({
                        id : product.product_id,
                        data : req.body
                    }, function(err, isUpdated){
                        if (err) {
                            return res.send(500, {
                                message : err.message
                            })
                        } else {
                            if (isUpdated) {
                                product = _.extend(product, req.body);
                                product.save(function(err){
                                    if (err) {
                                        return res.send(500, {
                                            message : err.message
                                        });
                                    } else {
                                        return res.send(200, {
                                            isUpdated : isUpdated
                                        })
                                    }
                                });
                            } else {
                                return res.send(200, {
                                    isUpdated : isUpdated
                                });
                            }
                        }
                    });
            }
        });

};


/*
* Get the product using its SKU
*
* @return JSON product
* */
exports.getProductBySKU = function(req, res){
    res.format({
        html : function(){
            res.render('theme/product/product', {
                product : req.product
            });
        },
        json : function(){
            res.jsonp(req.product);
        }
    });
};

/**
 * Magento Express Middleware
 * */
exports.productBySKU = function(req, res, next, sku){

    Product.findOne({ sku : sku }).exec(function(err, product){
        if (err) {
            return next(err);
        }
        if (!product) {
            return next(new Error('The product (' + sku + ') is not our product.'));
        }
        req.product = product;
        next();
    });

};


