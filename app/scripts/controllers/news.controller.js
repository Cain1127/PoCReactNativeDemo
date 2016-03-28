'use strict';

/**
 * @ngdoc function
 * @name Iaccenturer.controller:ProfileController
 * @description
 * # ProfileController
 */
angular.module('HKElementMall')
  .controller('NewsController',
    function ($scope, localStorageService, CONFIG, $state, $stateParams) {

      $scope.parentpage = $stateParams.parentpage || 'welcome';
      $scope.tip = "没有讯息";

			$scope.newsCloseButtonAction=function(){
			    $state.go($scope.parentpage);
			}

});
