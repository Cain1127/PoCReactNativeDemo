'use strict';

/**
 * @ngdoc function
 * @name Iaccenturer.controller:ProfileController
 * @description
 * # ProfileController
 */
angular.module('HKElementMall')
  .controller('FoodDetailController', 
    function ($scope, localStorageService, CONFIG, $state, $stateParams) {

    	///Get food store detail info
    	$scope.foodDetailInfo = $stateParams.foodDetailInfo || {};
    	var tempImageAddress = "images/localImages/foodList/detail/" + $scope.foodDetailInfo.tenant_photo_1.substring($scope.foodDetailInfo.tenant_photo_1.lastIndexOf("/")+1);
    	$scope.foodDetailInfo.tenant_photo_1 = tempImageAddress;

    	$scope.foodDetailBackButtonActoin = function () {
    		$state.go('main.food');
      }
  
});