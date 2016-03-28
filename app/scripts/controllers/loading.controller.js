'use strict';

/**
 * @ngdoc function
 * @name Iaccenturer.controller:ProfileController
 * @description
 * # ProfileController
 */
angular.module('HKElementMall')
  .controller('LoadingController',
  function ($scope, CONFIG, $ionicLoading) {
    
    $scope.showHUD = function() {
    $ionicLoading.show({
      template: '<div style="height:50px; width:52px; position:relative;"><ion-spinner icon="ios" style=" width: 19%"></ion-spinner><i style="position:absolute;right:0px; top:35px;">Loading</i></div>'
        });
    };
    
    $scope.hideHUD = function(){
      $ionicLoading.hide();
    };

  });