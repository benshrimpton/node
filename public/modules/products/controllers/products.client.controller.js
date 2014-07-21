/**
 * Created by tebesfinwo on 7/21/14.
 */
'use strict';

angular.module('products').controller('ProductsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Products',
    function($scope, $stateParams, $location, Authentication, Products) {
        $scope.authentication = Authentication;

        $scope.find = function() {
            $scope.products = Products.query();
        };
    }
]);