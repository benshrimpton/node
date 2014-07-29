/**
 * Created by tebesfinwo on 7/21/14.
 */
'use strict';

angular.module('products').controller('ProductsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Products',
    function($scope, $stateParams, $location, Authentication, Products) {
        $scope.authentication = Authentication;
    	var products = {};

        $scope.find = function() {
            $scope.products = Products.query();
            products = $scope.products;
        };

		$scope.findOne = function() {
			$scope.product = Products.get({
				productSKU: $stateParams.productSKU
			});
	
			// for(var i = 0; i < products.length; i++){
			// 	if ( products[i].sku ===  $stateParams.productSKU) {
			// 		$scope.product = products[i];
			// 		console.log($scope.product);
			// 		return; 
			// 	}
			// }
		};

    }
]);