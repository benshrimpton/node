/**
 * Created by tebesfinwo on 8/9/14.
 */

'use strict';

var Promise = require('bluebird'),
    _ = require('lodash');

/**
 * Experimenting with Bluebird
 * */

var internal = {};

/**
 * Get all available invoices
 *
 * @params obj filters
 *
 * */
internal.getInvoiceList = function(filters){

    if( filters && typeof filters === 'function'){
        throw new Error('wrong type');
    }

    return new Promise(function(resolve, reject){
        global
            .magento
            .salesOrderInvoice
            .list({
                filters : filters
            }, function(err, invoiceLists){
                if (err){
                    reject(err);
                } else {
                    resolve(invoiceLists);
                }
            });
    });

};

/**
 * Get Invoice Detail based on invoice id
 *
 * @param String invoiceIncrementId
 *
 * */
internal.getInvoiceInfo = function(invoiceIncrementId){
    return new Promise(function(resolve, reject){
        global
            .magento
            .salesOrderInvoice
            .info({
                invoiceIncrementId : invoiceIncrementId
            }, function(err, invoiceInfo){
                if(err) {
                    reject(err);
                } else {
                    resolve(invoiceInfo);
                }
            });
    });
};


/**
 * Create an invoice
 *
 * @param obj
 *
 * obj = {
 *
 *  orderIncrementId : Order Increment Id,
 *  itemsQty : quantity of items to invoice,
 *  comment : Invoice comment (optional),
 *  email : send invoice on email (optional),
 *  includeComment : Include comments in email (optional)
 *
 * }
 *
 * */
internal.createInvoice = function(invoice){

    return new Promise(function(resolve, reject){
        global
            .magento
            .salesOrderInvoice
            .create(invoice, function(err, createdInvoiceId){
                console.log(invoice);
                if (err) {
                    reject(err);
                } else {
                    resolve(createdInvoiceId);
                }
            });
    });

};

/**
 * Cancel Invoice
 *
 * @param String invoiceId
 * */
internal.cancelInvoice = function(invoiceId){

    return new Promise(function(resolve, reject){
        global
            .magento
            .salesOrderInvoice
            .cancel({
                invoiceIncrementId : invoiceId
            }, function(err, isCancelled){
                if (err) {
                    reject(err);
                } else {
                    resolve(isCancelled);
                }
            });
    });

};


/**
 * Add new comment to the order invoice
 *
 * @params object obj
 *
 * obj = {
 *
 *  invoiceIncrementId : invoice id (require)
 *  comment : invoice comment (optional)
 *  email : send invoice on email flag (optional) 0 - false; 1 - true
 *  includeComment : include comment in email flag (optional) 0 - false; 1 - true
 *
 * }
 * */
internal.addComment = function(obj){

    return new Promise(function(resolve, reject){
        global
            .magento
            .salesOrderInvoice
            .addComment({
                invoiceIncrementId : obj.invoiceId,
                comment : obj.comment,
                email : obj.email,
                includeComment : obj.includeComment
            }, function(err, isAdded){
                if (err) {
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
 * Create Invoice
 * */
exports.createInvoice = function(req, res){

//    var itemsQty = [];
//
//    _.forEach(req.body.orderItemId, function(orderItemId, index, arr){
//        itemsQty.push({
//            order_item_id : orderItemId,
//            qty : (req.body.qty[index])
//        });
//    });

    var invoice = {
        orderIncrementId : req.body.orderId,
        itemsQty : req.body.itemsQty,
        comment : (req.body.comment) ? req.body.comment : null ,
        email : (req.body.email) ? req.body.email : null,
        includeComment : (req.body.includeComment) ? req.body.includeComment : null
    };

    internal.createInvoice(invoice)
        .then(function(createdInvoiceId){
            console.log("^&^&^^&"+createdInvoiceId+"^&^&^&^");
            return internal.getInvoiceInfo(createdInvoiceId)
        })
        .then(function(invoiceDetail){
            return res.jsonp(invoiceDetail);
        })
        .catch(function(err){
            return res.send(500, {
                message : err.message
            });
        });

};

/**
 * Retrieve all of the invoice available
 * */
exports.getInvoiceList = function(req, res){

    /*
    * Getting all invoices using null filter (will need to add filters in the future)
    * */
    internal.getInvoiceList(null)
        .then(function(invoices){
            return res.jsonp(invoices);
        }).catch(function(err){
            return res.send(500, {
                message : err.message
            });
        });

};


/**
 * Retrieve specified invoice
 * */
exports.getInvoiceInfo = function(req, res){

    internal.getInvoiceInfo(req.params.invoiceId)
        .then(function(retrievedInvoice){
            return res.jsonp(retrievedInvoice);
        })
        .catch(function(err){
            return res.send(500, {
                message : err.message
            });
        });
};


/**
 * Remove specified invoice
 * */
exports.cancelInvoice = function(req, res){

    if (req.params.invoiceId) {
        internal.cancelInvoice(req.params.invoiceId)
            .then(function(isCancelled){
                return res.jsonp({ isCancelled : isCancelled});
            })
            .catch(function(err){
                return res.send(500, {
                    message : err.message
                });
            });
    } else {
        return res.send(400, {
            message : 'Ops, not able to locate your invoice ID'
        });
    }

};

/**
 * Add comment to the order
 * */
exports.addComment = function(req, res){

    if(req.body.invoiceId){
        internal.addComment(req.body)
            .then(function(isAdded){
                return res.jsonp({isAdded : isAdded});
            })
            .catch(function(err){
                return res.send(500, {
                    message : err.message
                });
            });
    } else {
        return res.send(400, {
            message : 'Ops, not able to locate your invoice ID'
        });
    }

};


