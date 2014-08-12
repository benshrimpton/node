/**
 * Created by tebesfinwo on 8/12/14.
 */

'use strict';


module.exports = function(app){

    /**
     * Module Dependencies
     * */
    var creditMemo = require('../../app/controllers/creditMemo');


    /**
     * Credit Memo Routes
     *
     *
     * all of the following methods require authorization middleware.
     * Add the middleware in the future.
     * */

    /**
     * Retrieve all credit memo
     * */
    app.route('/creditmemo/all')
        .get(creditMemo.getAllCreditMemo);

    /**
     * Retrieve detail of the specified credit memo
     * */
    app.route('/creditmemo/:creditMemoId')
        .get(creditMemo.getCreditMemoDetail);

};