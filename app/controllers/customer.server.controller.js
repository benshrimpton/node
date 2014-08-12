/**
 * Created by tebesfinwo on 7/28/14.
 */

/**
 * Will update to rendering page instead of respond in JSON.
 * */

'use strict';

var Async = require('async'),
    Mongoose = require('mongoose'),
    Crypto = require('crypto'),
    Validator = require('validator'),
    Country = Mongoose.model('Country'),
    CustomerGroup = Mongoose.model('CustomerGroup'),
    MagentoStore = Mongoose.model('Store');


/**
 * Authenticate the customer.
 * */
var authenticate = function(password, hash, callback){
    if (typeof hash !== 'string') {
        callback(new Error('The type of the hashed password is invalid'));
    } else {
        var passwordArr = hash.split(':');
        if ( typeof callback === 'function' ) {
            return callback(null, Crypto.createHash('md5').update(passwordArr[1]+password).digest('hex') === passwordArr[0]);
        } else {
            return Crypto.createHash('md5').update(passwordArr[1]+password).digest('hex') === passwordArr[0]
        }
    }
};

/**
 * Synchronize customer group.
 * */
exports.syncCustomerGroup = function(req, res){
    CustomerGroup.find({}).remove().exec(function(err){
        if (err) {
            return res.send(500, {
                message  : err.message
            });
        }

        global
            .magento
            .customerGroup
            .list(function(err, customerGroups){

                if (err) {
                    return res.send(500, {
                        message : err.message
                    })
                }

                for(var i = 0; i < customerGroups.length; i++){
                    var customerGroup = new CustomerGroup(customerGroups[i]);
                    customerGroup.save(function(err){
                        if (err) {
                            return res.send(500, {
                                message  : err.message
                            });
                        }
                    });
                }

                return res.send(200, {
                    message  : 'It has been sync'
                });

            });

    });
};

/**
 * Create a customer using MagentoAPI when a customer sign up on the page.
 * Beware with the group id in the future.
 * */
exports.createCustomer = function(req, res){

    if ( req.session.customer ) {
        return res.redirect('/');
    }

    if ( req.body.password !== req.body.passwordConfirm ){
        req.flash('error', 'Password does not match');
        res.redirect('/customer/signup');
    } else {

        /*
         * Obtain the active store configuration.
         * Maybe need to change in the future.
         * */
        MagentoStore.findOne({ 'store.is_active' : 1 }).exec(function(err, activeStore){
            if (err) {
                return res.send(500, {
                    message  : err.message
                });
            } else {


                var customer = {};

                customer = req.body;

                customer.website_id = activeStore.store[0].website_id;
                customer.store_id = activeStore.store[0].store_id;
                customer.group_id = activeStore.store[0].group_id;

                global
                    .magento
                    .customer
                    .create({
                        customerData : customer
                    }, function(err, customerId){
                        if (err) {
                            req.flash('error', err.message);
                            res.redirect('/customer/signup');
                        } else {
                            delete customer['password'];
                            req.session.customer = {};
                            req.session.customer.id = customerId;
//                            return res.send(200,{
//                                customer : customer
//                            });
                            res.redirect('/customer/profile');
                        }
                    });
            }
        });
    }
};

/**
 * Create an address for a customer.
 * */
exports.createCustomerAddress = function(req, res){

    var customerId = req.session.customer.customer_id || req.session.customer.id;

    global
        .magento
        .customerAddress
        .create({
            customerId : customerId,
            addressData : req.body
        }, function(err, customerAddressIds){
            if (err) {
                console.log(err);
                return res.send(500, {
                    message : err.message
                });
            } else {
                req.flash('successMsg', 'Your address has been created');
                return res.redirect('/customer/profile');
            }
        });
};

/**
 * Delete customer's address.
 * */
exports.removeCustomerAddress = function(req, res){

    global
        .magento
        .customerAddress
        .delete({
            addressId : req.params.addressId
        }, function(err, isDeleted){
            if (err) {
                return res.send(500, {
                   message : err.message
                });
            } else {
                var key = (isDeleted) ? 'successMsg' : 'failMsg';
                var msg = (isDeleted) ? 'The address has been deleted.' : 'The address fails to be deleted';
                req.flash( key, msg );
                return res.redirect('/customer/profile');
            }
        });

};

/**
 * Render out all of the customer addresses
 * */
exports.customerAddressList = function(req, res){

    var customerId = req.session.customer.customer_id | req.session.customer.id;

    global
        .magento
        .customerAddress
        .list({
            customerId : customerId
        }, function(err, customerAddresses){
            if (err) {
                return res.send(500, {
                    message : err.message
                });
            } else {
                return res.render('customerAddresses', {
                    customerAddresses : customerAddresses
                });
            }
        });
};

/**
 * Render out customer detail
 * */
exports.customerAddressDetail = function(req, res){

    Async.parallel({
        countries : function(callback){
            Country
                .find({})
                .sort('name')
                .exec(function(err, countries){
                    callback(err, countries);
                });
        },
        address : function(callback){
            global
                .magento
                .customerAddress
                .info({
                    addressId : req.params.addressId
                }, function(err, customerAddreses){
                    customerAddreses.street = customerAddreses.street.split('\n');
                    callback(err, customerAddreses);
                });
        }
    }, function(err, results){
        if (err) {
            return res.send(500, {
                message : err.message
            });
        } else {
            return res.render('theme/customer/customerAddressForm', {
                address : results.address,
                countries : results.countries,
                actionURL : '/customer/address/'+req.params.addressId
            });
        }
    });


};

/**
 * Render out a new customer address form page
 * */
exports.customerAddressCreatePage = function(req, res){
    Country
        .find({})
        .sort('name')
        .exec(function(err, countries){
            if (err) {
                return res.send(500, {
                    message : err.message
                });
            } else {
                res.render('theme/customer/customerAddressForm', {
                    customer : req.session.customer,
                    countries : countries,
                    actionURL : '/customer/address/new'
                });
            }
        });
}

/**
 * Update the customer detail.
 * */
exports.updateCustomerAddress = function(req, res){

    console.log(req.body);
    console.log(req.params.addressId);

    global
        .magento
        .customerAddress
        .update({
            addressId : req.params.addressId,
            addressData : [req.body]
        }, function(err, isUpdated){
            if (err) {
                return res.send(500, {
                    message : err.message
                });
            } else {
                var key = (isUpdated) ? 'successMsg' : 'failMsg';
                var msg = (isUpdated) ? 'The address has been updated.' : 'The address fails to update';
                req.flash( key, msg );
                console.log(isUpdated);
                return res.redirect('/customer/profile');
            }
        });

};



/**
 * Obtain customer detail using customer id.
 * */
exports.customerDetail = function(req, res){
    global
        .magento
        .customer
        .info({ customerId : req.params.id }, function(err, customers){
            if (err) {
                return res.send(500, {
                    message  : err.message
                });
            } else {

                delete customers[0].password_hash;
//                delete customers[0].confirmation;
//                delete customers[0].rp_token;
//                delete customers[0].rp_token_created_at;

                return res.send(200, {
                    customer : customers[0]
                })
            }
        });
};

/**
 * Obtain the a list of customers
 * Only available to admin. Suspended temporarily for development purposes.
 * */
exports.customerList = function(req, res){
    global
        .magento
        .customer
        .list({
            filters : (req.params.filter) | null
        }, function(err, customers){
            if (err) {
                return res.send(500, {
                    message : err.message
                });
            } else {
                res.format({
                    text : function(){
                        return res.send(200, {
                            customers: customers
                        });
                    },
                    html : function(){
                        return res.send(200, {
                            customers: customers
                        });
                    },
                    json : function(){
                        return res.jsonp(customers);
                    }
                });
            }
        });
};

/**
 * Update the customer detail
 *
 * Need to revise the following the method !!!!!!!! Like Access Level
 * */
exports.updateCustomer = function(req, res){
    global
        .magento
        .update({
            customerId : req.body.id,
            customerData : req.body
        }, function(err , isUpdated){
            if (err) {
                return res.send(500, {
                    message  : err.message
                });
            } else {
                return res.send(200, {
                    isUpdated : isUpdated
                });
            }
        });
};

/**
 * Customer Login
 * */
exports.customerSignin = function(req, res){
    if (!req.session.customer) {
        if ( Validator.isEmail(req.body.email) === false ){
            return res.send(400, {
                message  : req.body.email + ' is not a proper email addess'
            });
        } else {

            var filter = {
                email : {
                    eq : req.body.email
                }
            };

            var complexFilter = [{
                complex_filter : [{
                    key : 'email' ,
                    value : [{
                        key : 'eq',
                        value : req.body.email
                    }]
                }]
            }];


            global
                .magento
                .customer
                .list({
                    filters : filter
                }, function(err, customers){
                    if (err) {
                        return res.send(500, {
                            message : err.message
                        });
                    } else if ( customers.length === 0 ) {
//                        return res.send(404,{
//                            message  : req.body.email + ' is not found'
//                        });
                        req.flash('errorMsg', req.body.email + 'is not found');
                        res.redirect('/customer/login');
                    } else {
                        if ( authenticate(req.body.password, customers[0].password_hash ) === true ) {
                            delete customers[0].password_hash;
                            req.customer = customers[0];
                            req.session.customer = customers[0];
//                            return res.send(200,{
//                                message  : 'Login Successfully'
//                            });
                            /*
                            * After customer has logged in successfully, redirect to the previous page that the customer
                            * visited.
                            * However, for now, it will be redirect to user profile page instead.
                            * **/
                            res.redirect('/customer/profile');
                        } else {
//                            return res.send(200, {
//                                message : 'Login Failed'
//                            })
                            req.flash('errorMsg', 'Please check your email or password');
                            res.redirect('/customer/login');
                        }
                    }
                });
        }
    } else {
//        return res.send(200, {
//            message : 'Already Login'
//        });
        return res.redirect('/customer/profile')
    }
};

/**
 * Logout the customer.
 * */
exports.signout = function(req, res){
    delete req.session.destroy();
    return res.redirect('/');
};

/**
 * Render user a signup page
 * */
exports.signUp = function(req, res){
    res.render('theme/customer/customerSignUp', { errorMsg : req.flash('error') });
};

/**
 * Render user a sigin page
 * */
exports.signin = function(req, res){
    res.render('theme/customer/customerSignIn', { errorMsg : req.flash('error') });
};

/**
 * Customer Profile Page
 * */
exports.profile = function(req, res){
    var customerId = (typeof req.session.customer.customer_id !== 'undefined' ) ? req.session.customer.customer_id : req.session.customer.id;
    console.log(customerId);

    Async.parallel({
        customer : function(callback){
            global
                .magento
                .customer
                .info({
                    customerId : customerId
                }, function(err, customer){
                    if (err) {
                        return callback(err);
                    } else {

                        delete customer.password_hash;
                        delete customer.confirmation;
                        delete customer.rp_token;
                        delete customer.rp_token_created_at;

                        return callback(null, customer);
                    }
                });
        },
        addresses : function(callback){
            global
                .magento
                .customerAddress
                .list({
                    customerId : customerId
                }, function(err, addresses){
                    if (err) {
                        return callback(err);
                    } else {
                        console.log(addresses)
                        return callback(null, addresses);
                    }
                });
        }
    }, function(err, results){
        if (err) {
            return res.send(500, {
                message : err.message
            });
        } else {
            res.render('theme/customer/customerProfile', {
                customer : results.customer,
                addresses : results.addresses,
                successMsg : req.flash('successMsg'),
                failMsg : req.flash('failMsg')
            });
        }
    });
};

/**
 * Custom Customer Middlewares
 * */

/**
 * Check whether the use is authorized to access this page
 * */
exports.hasAuthorization = function(req, res, next){
    if ( ! req.session.customer ) {
        return res.send(403, {
            message : 'User is forbidden'
        });
    }
    next();
};


/**
 * Expose customer thoroughout the template
 * */
exports.customer = function(req, res, next){
    res.locals.customer = (typeof req.session.customer === 'undefined') ? null : req.session.customer;
    next();
};



