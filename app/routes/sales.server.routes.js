/**
 * Created by tebesfinwo on 8/6/14.
 */

'use strict';


module.exports = function(app){

    /**
     * Module Dependencies
     * */
   var salesOrder = require('../../app/controllers/order');


    /**
     * Sales orders
     * */
    app.route('/salesorder/all')
      .get(salesOrder.getAllOrders);

    app.route('/salesorder/cancel/:id')
       .get(salesOrder.cancelOrder);

    app.route('/salesorder/hold/:id')
       .get(salesOrder.holdOrder);

    app.route('/salesorder/unhold/:id')
       .get(salesOrder.unholdOrder);

    app.route('/salesorder/:id')
       .get(salesOrder.getOrderDetail);


};