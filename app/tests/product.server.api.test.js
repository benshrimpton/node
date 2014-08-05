/**
 * Created by tebesfinwo on 8/5/14.
 */

'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    request = require('supertest'),
    assert = require('assert'),
    mongoose = require('mongoose');


describe('Product API testing', function(){

    var url = 'http://localhost:3000';

//    describe('Create Product', function(){
//        it('should return 200 if it was created successfully', function(done){
//
//            var product = {
//                productType : 'simple',
//                productAttributeType : '4',
//                sku : 'Super Mega 123  74185',
//                name : 'Super Mega Bag',
//                description : 'This is super mega bag',
//                short_description : 'Super mega bag is awesome',
//                weight : '10',
//                status : '1'
//            };
//
//
//            request(url)
//                .post('/magento/product/new')
//                .send(product)
//                .expect(200)
//                .end(function(err, res){
//                    if (err) {
//                        throw err;
//                    }
//                    console.log(res.body);
//                    done();
//                });
//        });
//    });


    describe('Create Product' , function(){
        it('should return 500 if it was created with the same SKU', function(done){

            this.timeout(50000);

            var product = {
                productType : 'simple',
                productAttributeType : '4',
                sku : 'Super Mega 123  faifhfhffihfus',
                name : 'Super Mega Bag',
                description : 'This is super mega bag',
                short_description : 'Super mega bag is awesome',
                weight : '10',
                status : '1'
            };

            request(url)
                .post('/magento/product/new')
                .send(product)
                .end(function(err, res){
                    if (err) {
                        throw err;
                    } else {
                        res.should.have.status(500);
                        done();
                    }
                });
        });
    });


    describe('Delete Product', function(){
        it('should return a 404 after product has been deleted', function(done){
            request(url)
                .get('/magento/product/delete/fafsfsffsfsafsfsfsdfasfsafsfsd')
                .end(function(err, res){
                    if (err) {
                        throw err;
                    } else {
                        res.should.have.status(404);
                        done();
                    }
                });
        });
    });


    describe('Delete product', function(){
        it('should return 200 after product has been deleted', function(done){
            request(url)
                .get('/magento/product/delete/dddd-Medium')
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

