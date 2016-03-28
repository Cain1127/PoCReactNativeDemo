'use strict';

/**
 * @ngdoc function
 * @name HKElementMall.controller:MembernewsdetailController
 * @description
 * # MembernewsdetailController
 `*/
angular.module('HKElementMall')
  .controller('MembernewsdetailController',

  function ($scope, VerifyService, $state, CONFIG, $stateParams, localStorageService, $ionicPopup, $ionicLoading, BaseService,$ionicHistory) {
     $scope.myGoBack = function() {
    $ionicHistory.goBack();
    };

  

     

    
  });