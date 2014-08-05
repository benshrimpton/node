/**
 * Created by tebesfinwo on 7/21/14.
 */
'use strict';

angular.module('products').controller('ProductsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Products',
    function($scope, $stateParams, $location, Authentication, Products) {
        $scope.authentication = Authentication;
    	var products = {};

    	// View list of all products
        $scope.find = function() {
            $scope.products = Products.query();
            products = $scope.products;
        };

        // Single product view
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

		// Create a single product
		$scope.create = function() {
			var product = new Products({
				name: this.name,
				description: this.description
			});
			product.$save(function(response) {
				$location.path('products/' + response.productSKU);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			this.title = '';
			this.content = '';
		};

		/*
		var orderBy = $filter('orderBy');
    $scope.friends = [
      { name: 'John',    phone: '555-1212',    age: 10 },
      { name: 'Mary',    phone: '555-9876',    age: 19 },
      { name: 'Mike',    phone: '555-4321',    age: 21 },
      { name: 'Adam',    phone: '555-5678',    age: 35 },
      { name: 'Julie',   phone: '555-8765',    age: 29 }
    ];
    $scope.order = function(predicate, reverse) {
      $scope.friends = orderBy($scope.friends, predicate, reverse);
    };
    $scope.order('-age',false); */

    }
]);