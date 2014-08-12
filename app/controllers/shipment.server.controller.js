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
            .list(function(err, shipments){
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
internal.getCarriers = function(orderIncrementId){
    return new Promise(function(resolve, reject){
        global
            .magento
            .salesOrderShipment
            .getCarriers({
                orderIncrementId : orderIncrementId
            }, function(err, carries){
                if (err) {
                    reject(err);
                } else {
                    resolve(carries);
                }
            });
    });
};


/**
 * Add a new tracking number to the order shipment
 *
 * obj = {
 *
 *  shipmentIncrementId : (String) Shipment increment ID
 *  carrier : (String) Carrier Code (ups, usps, dhl, fedex, dhlint)
 *  title : (String) tracking title,
 *  trackNumber : (String) tracking number
 *
 * }
 * */
internal.addTrack = function(obj){
    return new Promise(function(resolve, reject){
        global
            .magento
            .salesOrderShipment
            .addTrack(obj, function(err, trackingId){
                if(err){
                    reject(err);
                } else {
                    resolve(trackingId);
                }
            });
    });
};


/**
 * Add a new comment to the order shipment
 *
 * obj = {
 *
 *  shipmentIncrementId : shipment increment Id,
 *  comment : (String) shipment comment (optional),
 *  email : (String) send email flag (optional),
 *  includeEmail : (String) include comment in email flag (optional)
 *
 * }
 * */
internal.addComment = function(obj){
    return new Promise(function(resolve, reject){
        global
            .magento
            .salesOrderShipment
            .addComment(obj, function(err, isAdded){
                if(err){
                    reject(err);
                } else {
                    resolve(isAdded);
                }
            });
    });
};


/**
 * Controllers
 * */

/**
 * Retrieve All available Shipments available
 *
 * */
exports.getAllShipment = function(req, res){

    internal.getShipmentsList(null)
        .then(function(shipments){
            return res.jsonp(shipments);
        })
        .catch(function(err){
            return res.send(500, {
                message : err.message
            });
        });

};

/**
 * Retrieve the detail of specified shipment
 *
 * */
exports.getShipmentInfo = function(req, res){

    if (req.params.shipmentId){
        internal.getShipmentInfo(req.params.shipmentId)
            .then(function(shipment){
                return res.jsonp(shipment);
            })
            .catch(function(err){
                return res.send(500, {
                    message : err.message
                });
            });
    }else{
        return res.send(400, {
            message : 'Something is missing.'
        });
    }

};

/**
 * Retrieve all of available carries
 *
 * */
exports.getCarries = function(req, res){

    if (req.params.orderId){
        internal.getCarriers(req.params.orderId)
            .then(function(carries){
                return res.jsonp(carries);
            })
            .catch(function(err){
                return res.send(500, {
                    message : err.message
                });
            });
    }else{
        return res.send(400, {
            message : 'Something is missing'
        });
    }

};





