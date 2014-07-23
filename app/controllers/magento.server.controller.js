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