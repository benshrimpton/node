/**
 * Created by tebesfinwo on 7/21/14.
 */
'use strict';

//Products service used for communicating with the articles REST endpoints
angular.module('products').factory('Products', ['$resource',
    function($resource) {
        return $resource('magento/product/:productId', {
            articleId: '@_id'
        });
    }
]);