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
    * Customer Profile Page
    * **/
    app
        .route('/customer/profile')
        .get(Customer.hasAuthorization, Customer.profile);


    /*
    * Customer Logout Page
    * **/
    app
        .route('/customer/signout')
        .get(Customer.signout);



};