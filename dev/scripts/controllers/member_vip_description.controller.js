'use strict';

/**
 * @ngdoc function
 * @name HKElementMall.controller:Member_vip_descriptionController
 * @description
 * # Member_vip_descriptionController
 `*/
angular.module('HKElementMall')
  .controller('Member_vip_descriptionController',

    function ($scope, VerifyService, $state, CONFIG, $ionicHistory) {
      $scope.myGoBack = function () {
        $ionicHistory.goBack();
      };

    });
