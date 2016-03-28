'use strict';

/**
 * @ngdoc function
 * @name Iaccenturer.controller:ProfileController
 * @description
 * # ProfileController
 */
angular.module('HKElementMall')
  .controller('ContactUsController', ['$scope', 'localStorageService', 'CONFIG', '$state',
    function ($scope, localStorageService, CONFIG, $state) {

    //$scope.category_img ="clickCategory"

      $scope.model2 = ['b', 'c'];
      $scope.categories = [
        {
          name:'壹般查詢'
        },
        {
          name:'會員服務查詢'
        },
        {
          name:'推廣優惠查詢'
        }
      ];
      $scope.category = undefined;

      $scope.toSetting = function () {

        $state.go('setting', {parentpage: 'main.contact_us'});

      }

}]);
