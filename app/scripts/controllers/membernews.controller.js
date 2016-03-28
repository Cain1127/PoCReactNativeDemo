'use strict';

/**
 * @ngdoc function
 * @name HKElementMall.controller:MembernewsController
 * @description
 * # MembernewsController
 `*/
angular.module('HKElementMall')
  .controller('MembernewsController',
  function ($scope, CONFIG, $ionicHistory) {
     $scope.myGoBack = function() {
    $ionicHistory.goBack();
    };
    
  });