/**
 * Created by tebesfinwo on 8/6/14.
 */

'use strict';

/**
 * Module Dependencies
 * */
var Async = require('async');

var internal = {};

/**
 * Magneto default Order Status
 *
 * Processing
 * Pending Payment
 * Suspected Fraud
 * Payment Review
 * Pending
 * On Hold
 * Complete
 * Closed
 * Canceled
 * Pending PayPal
 * */

/**
 *
 * Magento default Order State
 *
 * New
 * Pending Payment
 * Complete
 * Closed
 * Canceled
 * On Hold
 * Payment Review
 *
 * */

/**
 * Retrieve Sales order from Magento.
 *
 * */
internal.getSalesOrderList = function(filter, callback){

    if (typeof filter === 'function' || typeof filter === 'undefined'){
        throw new Error('wrong parameter');
    }

    global
        .magento
        .salesOrder
        .list({
            filters : filter
        }, function(err, salesOrders){
            callback(err, salesOrders);
        });

};

/**
 * Retrieve Sales Order Info (Detail) from Magento
 *
 * */
internal.getSalesOrderInfo = function(incrementId, callback){

    global
        .magento
        .salesOrder
        .info({
            orderIncrementId : incrementId
        }, function(err, salesOrderDetail){
            callback(err, salesOrderDetail);
        });

};

/**
 * Add comment to the order
 *
 * @return boolean true if it has been added
 * */
internal.addCommentToOrder = function(args, callback){

    if (typeof args === 'function' || typeof args === 'undefined' || typeof args === 'null' ) {
        throw new Error('wrong type for args');
    }

    var obj = {
        orderIncrementId : args.orderIncrementId,
        status : args.status,
        comment : (args.comment) ? args.comment : null,
        notify : (args.notify) ? args.notify : null
    };

    global
        .magento
        .salesOrder
        .addComment(obj, function(err, isAdded){
            callback(err, isAdded);
        });

};

/**
 * Cancel an order
 *
 * @return boolean true if it is cancelled
 * */
internal.cancelOrder = function(orderIncrementId, callback){

    if(typeof orderIncrementId === 'function' || typeof orderIncrementId ===  'undefined'){
        throw new Error('wrong type for orderIncrementId');
    }

    global
        .magento
        .salesOrder
        .cancel({
            orderIncrementId : orderIncrementId
        }, function(err, isCancelled){
            callback(err, isCancelled);
        });

};

/**
 * Hold an order
 *
 * @return boolean true if it is on hold
 *
 * */
internal.holdOrder = function(orderIncrementId, callback){

    if(typeof orderIncrementId === ('function' ||  'undefined')){
        throw new Error('wrong type for orderIncrementId');
    }

    global
        .magento
        .salesOrder
        .hold({
            orderIncrementId : orderIncrementId
        }, function(err, isOnHold){
            callback(err, isOnHold);
        });
};


/**
 * Unhold an order
 *
 * @return boolean true if it is 'unhold'
 *
 * */
internal.unholdOrder = function(orderIncrementId, callback){

    if(typeof orderIncrementId === ('function' ||  'undefined')){
        throw new Error('wrong type for orderIncrementId');
    }

    global
        .magento
        .salesOrder
        .unhold({
            orderIncrementId : orderIncrementId
        }, function(err, isUnhold){
            callback(err, isUnhold);
        });

};


/**
 * Return all Orders in JSON
 * */
exports.getAllOrders = function(req, res){

    /*
    * In future, we need to be able to filter out the orders
    * **/

    internal.getSalesOrderList(null, function(err, list){
        if (err) {
            console.log(err);
            return res.send(500, {
                message : err.message
            });
        } else {
            return res.jsonp(list);
        }
    });

};

/**
 * Get Order detail
 * */
exports.getOrderDetail = function(req,res){

    internal.getSalesOrderInfo(req.params.id, function(err, orderInfo){
        if (err) {
            console.log(err);
            return res.send(500, {
                message : err.message
            });
        } else {
            return res.jsonp(orderInfo);
        }
    });

};

/**
 * Cancel an order
 * */
exports.cancelOrder = function(req, res){

    internal.cancelOrder(req.params.id, function(err, isCancelled){
        if (err) {
            console.log(err);
            return res.send(500, {
                message : err.message
            });
        } else {
            return res.jsonp(200, {
               isCancelled : isCancelled
            });
        }
    });

};

/**
 * Hold an order
 * */
exports.holdOrder = function(req, res){

    internal.holdOrder(req.params.id, function(err, isHold){
        if (err) {
            console.log(err);
            return res.send(500, {
                message : err.message
            });
        } else {
            return res.jsonp(200, {
                isHold : isHold
            });
        }
    });

};

/**
 * unhold an order
 * */
exports.unholdOrder = function(req, res){

    internal.unholdOrder(req.params.id, function(err, isUnhold){
        if (err) {
            console.log(err);
            return res.send(500, {
                message : err.message
            });
        } else {
            return res.jsonp(200, {
                isUnhold : isUnhold
            });
        }
    });

};
