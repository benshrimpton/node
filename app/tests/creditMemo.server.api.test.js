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



describe('Credit Memo API Testing', function(){

    var url = 'http://localhost:3000';

    describe('retrieve all of credit memos', function(){
        it('should return status 200', function(done){
            request(url)
                .get('/creditmemo/all')
                .end(function(err, res){
                    should.not.exist(err);
                    res.should.have.status(200);
                    done();
                });
        });
    });


    describe('retrieve the specified credit memo', function(){

        it('should return status 200 with the correct id', function(done){
            request(url)
                .get('/creditmemo/100000001')
                .end(function(err, res){
                    should.not.exist(err);
                    res.should.have.status(200);
                    done();
                });
        });

        it('should not return status 200 with the correct id', function(done){
            request(url)
                .get('/creditmemo/1000001')
                .end(function(err, res){
                    should.not.exist(err);
                    res.should.not.have.status(200);
                    done();
                });
        });

    });


});