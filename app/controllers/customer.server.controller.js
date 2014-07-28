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
    CustomerGroup = Mongoose.model('CustomerGroup'),
    MagentoStore = Mongoose.model('Store');

/*
* Need to obtain the customer group from the Magento.
* */
var getCustomerGroupId = function(groupName){
    switch (groupName) {
        case 'NOT LOGGED IN':
            return 0;
        case 'General' :
            return 1;
        case 'Wholesale' :
            return 2;
        case 'Retailer' :
            return 3;
    }
};

/**
 * Authenticate the customer.
 * */
var authenticate = function(password, hash, callback){
    if (typeof hash !== 'string') {
        callback(new Error('The type of the hashed password is invalid'));
    } else {
        var passwordArr = hash.split(':');
        return callback(null, Crypto.createHash('md5').update(passwordArr[1]+password).digest('hex') === passwordArr[0]);
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
                return res.send(200, {
                    message : err.message
                });
            } else {
                return res.send(200, {
                    customers : customers
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
    if (req.session.customer === null) {
        if ( Validator.isEmail(req.body.email) === false ){
            return res.send(400, {
                message  : req.body.email + ' is not a proper email addess'
            });
        } else {

            var filter = {
                'key' : 'email',
                'value' : {
                    'key' : 'eq',
                    'email' : req.body.email
                }
            };

            global
                .magento
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
                        console.log(customers);
                        if ( authenticate(req.body.password, customers[0].password_hash ) === true ) {
                            delete customers[0].password_hash;
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
exports.logout = function(req, res){
    delete req.session.customer;
    return res.redirect('/');
};

/**
 * Render user a signup page
 * */
exports.signUp = function(req, res){
    res.render('theme/customerSignUp', { errorMsg : req.flash('error') });
};

/**
 * Render user a sigin page
 * */
exports.signin = function(req, res){
    res.render('theme/customerSignIn', { errorMsg : req.flash('error') });
};

/**
 * Customer Profile Page
 * */
exports.profile = function(req, res){
    global
        .magento
        .customer
        .info({
            customerId : req.session.customer.customer_id | req.session.customer.id
        }, function(err, customers){
            if (err) {
                return res.send(500, {
                    message : err.message
                })
            } else {

                delete customers.password_hash;
                delete customers.confirmation;
                delete customers.rp_token;
                delete customers.rp_token_created_at;


                res.render('theme/customerProfile', {
                    customer : customers
                });
            }
        });
};

/**
 * Customer middleware
 *
 * It needs to be called later in the development
 * */
exports.hasAuthorization = function(req, res, next){
    if ( ! req.session.customer ) {
        return res.send(403, {
            message : 'User is forbidden'
        });
    }
    next();
};


