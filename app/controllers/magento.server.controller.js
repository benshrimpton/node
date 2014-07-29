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



exports.syncCountryRegion = function(req, res){

    async.parallel([
        function(callback){
            Country
                .find({})
                .remove()
                .exec(function(err){
                    callback(err);
                });
        },
        function(callback){
            Region
                .find({})
                .remove()
                .exec(function(err){
                    callback(err);
                });
        }
    ], function(err, results){
        if (err) {
            return res.send(500, {
                message  : err.message
            });
        } else {
            global
                .magento
                .directoryCountry
                .list(function(err, countries){
                    if (err) {
                        return res.send(500, {
                            message  : err.message
                        })
                    } else {
                        for(var i = 0; i < countries.length; i++){

                            global
                                .magento
                                .directoryRegion
                                .list(function(err, regions){
                                    if (err) {
                                        return res.send(500, {
                                            message : err.message
                                        });
                                    } else {
                                        var country = new Country(countries[i]);
                                        country.save(function(err){
                                            if (err) {
                                                return res.send(500, {
                                                    message : err.message
                                                });
                                            } else {
                                                return res.send(200, {
                                                    message : 'It has been sync'
                                                });
                                            }
                                        });
                                    }
                                });
                        }
                    }
                });
        }
    });

};