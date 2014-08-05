/**
 * Created by tebesfinwo on 7/23/14.
 */

'use strict';

/**
 * Module Dependencies
 * */
var Promise = require('bluebird'),
    mongoose = require('mongoose'),
    MagentoStore = mongoose.model('Store'),
    Country = mongoose.model('Country'),
    async = require('async'),
    _ = require('lodash');


/**
 * Sync Magento Store and core information
 * */
exports.syncStore = function(req, res){

    MagentoStore.find({}).remove().exec(function(err){
        if (err) {
            return res.send(500, {
                message  : err.message
            });
        }
        var store = {};

        global
            .magento
            .core
            .info(function(err, info){
                if (err) {
                    return res.send(500, {
                        message : err.message
                    });
                }

                store.magento_version = info.magento_version;
                store.magento_edition = info.magento_edition;


                global
                    .magento
                    .store
                    .list(function(err, storeEntity){
                        if (err) {
                            return res.send(500, {
                                message : err.message
                            });
                        }

                        store.store = storeEntity;

                        var magentoStore = new MagentoStore(store);

                        magentoStore.save(function(err, magentoStore){
                            if (err) {
                                return res.send(500, {
                                    message : err.message
                                });
                            } else {
                                res.jsonp(magentoStore);
                            }
                        });

                    });

            });

    });

};



/**
 * Sync country and region.
 * */
exports.syncCountryRegion = function(req, res){

    async.waterfall([
        function(callback){
            Country
                .find({})
                .remove()
                .exec(function(err){
                    callback(err);
                });
        },
        function(callback){
            global
                .magento
                .directoryCountry
                .list(function(err, countries){
                    if (err) {
                        callback(err);
                    } else {
                        //console.log(countries);
                        callback(null, countries)
                    }
                });
        },
        function(countries, callback){
//            async.each(countries, function(country, callback){
//                var obj = {
//                    name : country.name,
//                    iso2_code : country.iso2_code,
//                    iso3_code : country.iso3_code,
//                    country_id : country.country_id,
//                };
//                global
//                    .magento
//                    .directoryRegion
//                    .list({
//                        country : country.iso3_code
//                    }, function(err, regions){
//                        if (err) {
//                            callback(err);
//                        } else {
//                            obj.regions = regions;
//                            console.log(obj);
//                            var country = new Country(obj);
//                            country.save(function(err){
//                                callback(err);
//                            });
//                        }
//                    });
//            }, function(err){
//                if (err) {
//                    callback(err);
//                } else {
//                    callback(null);
//                }
//            });


            _.forEach(countries, function(country){
                var obj = {
                    name : country.name,
                    iso2_code : country.iso2_code,
                    iso3_code : country.iso3_code,
                    country_id : country.country_id,
                };
                global
                    .magento
                    .directoryRegion
                    .list({
                        country : country.iso3_code
                    }, function(err, regions){
                        if (err) {
                            callback(err);
                        } else {
                            obj.regions = regions;
                            console.log(obj);
                            var country = new Country(obj);
                            country.save(function(err){
                                callback(err);
                            });
                        }
                    });
            });
            return callback(null);

        }
    ], function(err, results){
        if (err) {
            return res.send(500, {
                err : err.message
            });
        } else {
            return res.send(200, {
                message : 'awesome'
            });
        }
    });

};

/**
 * Retrieve the store details
 * */
exports.getStoreDetail = function(req, res){
    MagentoStore
        .find({})
        .exec(function(err, stores){
            if (err) {
                return res.send(500, {
                   message : err.message
                });
            } else {
                return res.send(200, stores);
            }
        });
};

/**
 * Retrieve all of the country and its regions.
 * */
exports.getCountryRegion = function(req, res){
    Country
        .find({})
        .exec(function(err, countryRegion){
            if (err) {
                return res.send(500, {
                    message : err.message
                })
            } else {
                return res.send(200, countryRegion);
            }
        });
};

/**
 * Retrieve regions using the country id.
 * */
exports.getRegionByCountryId = function(req, res){
    Country
        .findOne({ country_id : req.params.countryId  })
        .exec(function(err, country){
            if (err) {
                res.send(500,{
                    message : err.message
                });
            } else {
                res.format({
                    text : function(){
                        res.jsonp(country.regions);
                    }
                });
            }
        });
};