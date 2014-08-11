/**
 * Created by tebesfinwo on 8/11/14.
 */

'use strict';


module.exports = function(app){

    /**
     * Module Dependencies
     * */
    var invoice = require('../../app/controllers/invoice')

    /**
     * authorization needs to be added to each route
     * */


    /**
     * Retrieve all invoices
     * */
     app.route('/invoice/all')
        .get(invoice.getInvoiceList);


    /**
     * Retrieve specified invoice
     * */
    app.route('/invoice/:invoiceId')
        .get(invoice.getInvoiceInfo);


    app.route('/invoice/new')
        .post(invoice.createInvoice);

    /**
     * Remove specified invoice
     * */
    app.route('/invoice/remove/:invoiceId')
        .get(invoice.cancelInvoice);

    /**
     * Add comment to specified invoice
     * */
    app.route('/invoice/comment')
        .post(invoice.addComment);

};