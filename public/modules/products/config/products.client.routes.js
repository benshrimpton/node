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
                url: '/magento/product',
                templateUrl: 'modules/products/views/list-product.client.view.html'
            }).
            state('viewProduct', {
                url: '/magento/product/:productId',
                templateUrl: 'modules/products/views/view-product.client.view.html'
            });
    }
]);