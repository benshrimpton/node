/**
 * Created by tebesfinwo on 8/12/14.
 */

'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    request = require('supertest'),
    _ = require('lodash'),
    assert = require('assert');


describe('Shipment API', function(){


    var url = 'http://localhost:3000';

    /**
     * Test Fail for getting all shipments (of following method)
     * */
//    describe('retrieve all shipment methods', function(){
//        it('should return with status 200', function(done){
//            request(url)
//                .get('/shipment/all')
//                .end(function(err, res){
//                    should.not.exist(err);
//                    res.should.have.status(200);
//                    done();
//                });
//        });
//    });


    describe('retrieve the specified shipment', function(){

        it('should return with status 200 with correct shipmentId', function(done){
            request(url)
                .get('/shipment/100000001')
                .end(function(err, res){
                    should.not.exist(err);
                    res.should.have.status(200);
                    done();
                });
        });

        it('should return with status 500 with wrong shipmentId', function(done){
            request(url)
                .get('/shipment/1000001')
                .end(function(err, res){
                    should.not.exist(err);
                    res.should.not.have.status(200);
                    done();
                });
        });

    });


    describe('retrieve carries for the specified shipment', function(){
        it('should return with status 200 with correct shipmentId', function(done){
            request(url)
                .get('/shipment/carrier/100000006')
                .end(function(err, res){
                    should.not.exist(err);
                    res.should.have.status(200);
                    done();
                });
        });

        it('should return with status 500 with wrong shipmentId', function(done){
            request(url)
                .get('/shipment/carrier/1000001')
                .end(function(err, res){
                    should.not.exist(err);
                    res.should.not.have.status(200);
                    done();
                });
        });
    });


});