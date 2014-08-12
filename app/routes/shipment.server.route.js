/**
 * Created by tebesfinwo on 8/12/14.
 */


'use strict';


module.exports = function(app){

    /**
     * Module Dependencies
     * */
    var shipment = require('../../app/controllers/shipment');

    /**
     * Shipments Routes
     *
     *
     * All of routes below requires authorization
     * */

    /**
     * Retrieve the specified shipment
     * */
    app.route('/shipment/:shipmentId')
        .get(shipment.getShipmentInfo);

    /**
     * Retrieve all shipments
     * */
     app.route('/shipment/all')
        .get(shipment.getAllShipment);

    /**
     * Retrieve carries of the specified shipment
     * */
     app.route('/shipment/carrier/:orderId')
         .get(shipment.getCarries);

};