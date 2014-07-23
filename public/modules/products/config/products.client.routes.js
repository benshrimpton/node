/**
 * Created by tebesfinwo on 7/21/14.
 */
'use strict';

// Setting up route
angular.module('products').config(['$stateProvider',
    function($stateProvider) {
        // Products state routing
        $stateProvider.
            state('listProducts', {
                url: '/products',
                templateUrl: 'modules/products/views/list-product.client.view.html'
            }).
            state('viewProduct', {
                url: '/products/:productId',
                templateUrl: 'modules/products/views/view-product.client.view.html'
            });
    }
]);