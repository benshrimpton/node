/**
 * Created by tebesfinwo on 7/28/14.
 */

'use strict';

module.exports = function(app){
    var Customer = require('../../app/controllers/customer');

    /*
    *
    * Need tp implement the authorization middleware later on in the development process.
    * **/

    /*
    * Synchronize the customer group.
    * */
    app
        .route('/customergroup/sync')
        .get(Customer.syncCustomerGroup);


    /*
    * Customer Sign up & customer sign up page
    * **/
    app
        .route('/customer/signup')
        .get(Customer.signUp)
        .post(Customer.createCustomer);

    /*
    * Customer Log in & log in page
    * **/
    app
        .route('/customer/signin')
        .get(Customer.signin)
        .post(Customer.customerSignin);


    /*
    * Retrieve customer list
    * **/
    app
        .route('/customer/all')
        .get(Customer.customerList);


    /*
    * Customer Profile Page
    * **/
    app
        .route('/customer/profile')
        .get(Customer.hasAuthorization, Customer.profile);

    /*
    * Customer Address page.
    * **/
    app
        .route('/customer/address/new')
        .get(Customer.hasAuthorization, Customer.customerAddressCreatePage)
        .post(Customer.hasAuthorization, Customer.createCustomerAddress);

    /*
    * Retrieve the customer's addresses
    * **/
    app
        .route('/customer/address')
        .get(Customer.hasAuthorization, Customer.customerAddressList);


    /*
    * Retrieve the specified address of the customer
    * Update the specified address of the customer
    * **/
    app
        .route('/customer/address/:addressId')
        .get(Customer.hasAuthorization, Customer.customerAddressDetail)
        .post(Customer.hasAuthorization, Customer.updateCustomerAddress);


    /*
    * Delete the specified user's account.
    * **/
    app
        .route('/customer/address/delete/:addressId')
        .get(Customer.hasAuthorization, Customer.removeCustomerAddress);


    /*
    * Customer Logout Page
    * **/
    app
        .route('/customer/signout')
        .get(Customer.signout);



};