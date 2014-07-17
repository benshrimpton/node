/**
 * Created by tebesfinwo on 7/11/14.
 */
'use strict';

/**
 * Module Dependencies
 * */
var should = require('should'),
    Magento = require('magento'),
    mongoose = require('mongoose'),
    Product = mongoose.model('Product');


var magento;


/**
 * Unit testing
 * */
describe('Magento Model & Magento API unit testing', function(){

    beforeEach(function(done){
        magento = new Magento({
            host : 'kikavargas.blackandblackcloud.com',
            port : 80,
            path : '/api/xmlrpc',
            login : 'tebesfinwo',
            pass : '5U{us6fe=0F8f7}]fA_?n37Rb4FlVk'
        });
    });

    describe('able to retrieve information', function(){
        it('should be able to retrieve information from magento server', function(done){
            magento.catalogProduct.list(function(storeView){
                console.log(storeView);
                storeView.should.be.json;
                done();
            });
        });
    });


});