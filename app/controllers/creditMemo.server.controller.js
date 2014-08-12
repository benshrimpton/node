/**
 * Created by tebesfinwo on 8/11/14.
 */

'use strict';


var Promise = require('bluebird'),
    _ = require('lodash');


var internal = {};


/**
 * retrieve all credit memos
 *
 * @params obj filters
 *
 * */
internal.getCreditMemoList = function(filters){

    return new Promise(function(resolve, reject){
        global
            .magento
            .salesOrderCreditMemo
            .list({
                filters : filters
            },function(err, creditMemos){
                if(err) {
                    reject(err);
                } else {
                    resolve(creditMemos);
                }
            });
    });

};




/**
 * retrieve a credit memo
 *
 * @params String creditmemoIncrementId
 *
 * */
internal.getCreditMemoInfo = function(creditmemoIncrementId){
    return new Promise(function(resolve, reject){
        global
            .magento
            .salesOrderCreditMemo
            .info({
                creditmemoIncrementId : creditmemoIncrementId
            }, function(err, creditMemo){
                if (err) {
                    reject(err);
                } else {
                    resolve(creditMemo);
                }
            });
    });
};


/**
 * Create credit memo
 *
 * obj = {
 *  orderIncrementId : (String) order increment ID (required) ,
 *  creditMemoData : (Array) Array of salesOrderCreditMemo (optional),
 *  comment : (String) comment text (optional),
 *  notifyCustomer : (int) notify customer by email flag (optional),
 *  includeComment : (int) include comment text into an email notification (optional)
 *  refundToStoreCreditAmount : (String) payment amount to be refunded to the customer store credit (optional)
 * }
 *
 * */
internal.createCreditMemo = function(obj){
    return new Promise(function(resolve, reject){
        global
            .magento
            .salesOrderCreditMemo
            .create(obj, function(err, creditMemoIncrementId){
                if (err) {
                    reject(err);
                } else {
                    resolve(creditMemoIncrementId);
                }
            });
    });
};

/**
 * Cancel credit memo
 *
 * @param String creditMemoIncrementId
 *
 * */
internal.cancelCreditMemo = function(creditmemoIncrementId){
    return new Promise(function(resolve, reject){
        global
            .magento
            .salesOrderCreditMemo
            .cancel({
                creditmemoIncrementId  : creditmemoIncrementId
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
 * Add comment to credit memo
 *
 * obj = {
 *  creditmemoIncrementId : (String) credit memo increment ID (optional),
 *  comment : (String) comment text (optional),
 *  notifyCustomer : (int) notify customer by email flag (optional),
 *  includeCustomer : (int) include comment text into the email notification (optional)
 * }
 * */
internal.addComment = function(obj){
    return new Promise(function(resolve, reject){
        global
            .salesOrderCreditMemo
            .addComment(obj, function(err, isAdded){
                if (err){
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
 * Retrieve all available credit memos
 * */
exports.getAllCreditMemo = function(req,res){
    internal.getCreditMemoList(null)
        .then(function(creditMemos){
            return res.jsonp(creditMemos);
        })
        .catch(function(err){
            return res.send(500, {
                message : err.message
            });
        });
};

/**
 * Retrieve the detail of the specified credit memo
 * */
exports.getCreditMemoDetail = function(req, res){
    if (req.params.creditMemoId) {
        internal.getCreditMemoInfo(req.params.creditMemoId)
            .then(function(creditMemo){
                return res.jsonp(creditMemo)
            })
            .catch(function(err){
                return res.send(500, {
                    message : err.message
                });
            });
    } else {
        return res.send(400, {
            message : 'Ops, something is missing'
        });
    }
};
