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


describe('Checkout', function(){

    var url = 'http://localhost:3000';

    describe('Cart', function(){

        var productObj;

        before(function(){
            request(url)
                .get('/magento/product')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .end(function(err,products){
                    if (err) {
                        throw err;
                    } else {
                        productObj = products.text;
                    }
                });
        });

        it('should expect to return status 400 since there is cart in the session ', function(){
            request(url)
                .get('/cart/products')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .end(function(err, res){
                    console.log(productObj);
                    res.should.have.status(400);
                });
        });


        it('should expect to return 200 after an item has been added to the cart', function(){


            var obj = {
//                sku : productObj.sku,
                qty : 1
            };

            request(url)
                .post('/cart/add')
                .send(obj)
                .end(function(err, res){
                    res.should.have.status(200);
                });
        });

    });

});
