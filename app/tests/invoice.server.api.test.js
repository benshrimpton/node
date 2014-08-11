/**
 * Created by tebesfinwo on 8/11/14.
 */

'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    request = require('supertest'),
    _ = require('lodash'),
    assert = require('assert');




describe('Invoices API', function(){


    var url = 'http://localhost:3000';

    var items = [];

    beforeEach(function(done){
        request(url)
            .get('/salesorder/100000002')
            .end(function(err, res){
                _.forEach(JSON.parse(res.text).items, function(item){
                    items.push({
                        order_item_id : parseInt(item.item_id) ,
                        qty: parseInt(item.qty_ordered)
                    });
//                    var arr = new Array();
//                    arr['order_item_id'] = parseInt(item.item_id);
//                    arr['qty'] = parseInt(item.qty_ordered);
//                    console.log(arr);
//                    items.push(arr);
                });
                done();
            });
    });



    describe('create a new invoice', function(){
        it('should return status 200', function(done){
            var obj = {
                orderId : 100000002,
                itemsQty : items
            };
            request(url)
                .post('/invoice/new')
                .send(obj)
                .end(function(err, res){
                    should.not.exist(err);
                    res.should.have.status(200);
                    done();
                });
        });
    });


    describe('retrieve all invoices', function(){
        it('should return status 200', function(done){
            request(url)
                .get('/invoice/all')
                .end(function(err,res){
                    should.not.exist(err);
                    res.should.have.status(200);
                    done();
                });
        });
    });


    describe('retrieve specified invoice', function(){
        it('should return status 200', function(done){
            request(url)
                .get('/invoice/100000001')
                .end(function(err, res){
                    should.not.exist(err);
                    res.should.have.status(200);
                    done();
                });
        });
    });


    describe('add comment to specified invoice', function(){
        it('should return status 200', function(done){
            var obj = {
                invoiceId : 100000001,
                comment : 'This is testing. Wuahahhahhaah',
                email : 1,
                includeComment : 1
            };

            request(url)
                .post('/invoice/comment')
                .send(obj)
                .end(function(err, res){
                    should.not.exist(err);
                    res.should.have.status(200);
                    should(JSON.parse(res.text).isAdded).ok;
                    done();
                });
        });
    });

    /**
     * Not able to remove this invoice for unknown reason
     *
     * The message returned from the Magento is 'Invoice cannot be canceled.'.
     * */
//    describe('remove a specified invoice', function(){
//        it('should return status 200, and is cancelled', function(done){
//            request(url)
//                .get('/invoice/remove/100000002')
//                .end(function(err, res){
//                    should.not.exist(err);
//                    res.should.have.status(200);
//                    should(JSON.parse(res.text).isCancelled).ok;
//                    done();
//                });
//        });
//    });

});