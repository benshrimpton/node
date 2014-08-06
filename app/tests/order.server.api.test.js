/**
 * Created by tebesfinwo on 8/6/14.
 */
'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    request = require('supertest'),
    assert = require('assert');


describe('Sales Order API Testing', function(){


    var url = 'http://localhost:3000';

    var salesorderId = null;

    describe('Retrieve Sales Order List', function(){


        it('Should return status 200', function(done){
            request(url)
                .get('/salesorder/all')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .end(function(err, res){
                    if (err) {
                        console.log(err);
                        throw err;
                    } else {
                        res.should.have.status(200);
                        done();
                    }
                });
        });

    });

    describe('Retrieve Sales order detail', function(){
        it('It should return status 200', function(done){

            request(url)
                .get('/salesorder/100000001')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .end(function(err, res){
                    if (err) {
                        console.log(err);
                        throw err;
                    } else {
                        res.should.have.status(200);
                        done();
                    }
                });

        });
    });


//    describe('Hold a product', function(){
//        it('should return status 200', function(done){
//            request(url)
//                .get('/salesorder/hold/100000006')
//                .set('Accept', 'application/json')
//                .expect('Content-Type', /json/)
//                .end(function(err , res){
//                    if(err) {
//                        throw err;
//                    } else {
//                        res.should.have.status(200);
//                        done();
//                    }
//                });
//
//        });
//    });


    describe('unhold a product', function(){
        it('should return status 200', function(){
            request(url)
                .get('/salesorder/unhold/100000006')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .end(function(err , res){
                    if(err) {
                        throw err;
                    } else {
                        res.should.have.status(200);
                    }
                });

        });
    });


    describe('cancel a product', function(){
        it('should return status 200', function(done){
            request(url)
                .get('/salesorder/cancel/100000005')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .end(function(err , res){
                    if(err) {
                        throw err;
                    } else {
                        res.should.have.status(200);
                        done();
                    }
                });

        });
    });



});


