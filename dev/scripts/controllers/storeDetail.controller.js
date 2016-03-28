'use strict';

/**
 * @ngdoc function
 * @name Iaccenturer.controller:ProfileController
 * @description
 * # ProfileController
 */
angular.module('HKElementMall')
  .controller('StoreDetailController',
    function ($scope, localStorageService, CONFIG, $state, $stateParams) {

    	$scope.storeDetailInfo = $stateParams.storeDetailInfo || {};
    	var tempImageAddress = "images/localImages/storeList/detail/" + $scope.storeDetailInfo.tenant_photo_1.substring($scope.storeDetailInfo.tenant_photo_1.lastIndexOf("/")+1);
    	$scope.storeDetailInfo.tenant_photo_1 = tempImageAddress;


      $scope.toFood = function () {

        $state.go('main.store');

      }

});
