/**
 * Created by tebesfinwo on 8/11/14.
 */

'use strict';

var Promise = require('bluebird'),
    _ = require('lodash');

var internal = {};

/**
 * Get all available shipments in Magento
 *
 * */
internal.getShipmentsList = function(filters){
    return new Promise(function(resolve, reject){
        global
            .magento
            .salesOrderShipment
            .list(filters, function(err, shipments){
                if (err) {
                    reject(err);
                } else {
                    resolve(shipments);
                }
            });
    });
};

/**
 * Get the specified shipment info
 *
 * */
internal.getShipmentInfo = function(shipmentIncrementId){
    return new Promise(function(resolve, reject){
        global
            .magento
            .salesOrderShipment
            .info({
                shipmentIncrementId : shipmentIncrementId
            }, function(err, shipment){
                if (err) {
                    reject(err);
                } else {
                    resolve(shipment);
                }
            });
    });
};

/**
 * Get all of the carriers for a specific shipment 
 *
 * */
internal.getCarriers = function(shipmentIncrementId){
    return new Promise(function(resolve, reject){
        global
            .magento
            .salesOrderShipment
            .getCarriers({
                shipIncrementId : shipmentIncrementId
            }, function(err, carries){
                if (err) {
                    reject(err);
                } else {
                    resolve(carries);
                }
            });
    });
};









