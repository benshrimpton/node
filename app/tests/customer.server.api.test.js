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



describe('Customer API', function(){

    var url = 'http://localhost:3000';

    describe('Retrieve a customer list', function(){
        it('should return status 200', function(done){
            request(url)
                .get('/customer/all')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .end(function(err, res){
                    if (err) {
                        throw err;
                    } else {
                        res.should.have.status(200);
                        done();
                    }
                });
        });
    });

});