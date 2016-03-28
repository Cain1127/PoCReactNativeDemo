'use strict';

/**
 * @ngdoc function
 * @name HKElementMall.controller:Promotion_news_detailController
 * @description
 * # Promotion_news_detailController
 `*/
angular.module('HKElementMall')
  .controller('PromotionNewsDetailController',
  function ($scope, VerifyService, $state, CONFIG, $stateParams, $ionicHistory ) {
     
     ///
     $scope.promotion_news_detailjson = $stateParams.promotion_news_detailjson || {};
     var tempImageAddress = "images/localImages/promotionNews/" + $scope.promotion_news_detailjson.proHighImgTw.substring($scope.promotion_news_detailjson.proHighImgTw.lastIndexOf("/")+1);
      $scope.promotion_news_detailjson.proHighImgTw = tempImageAddress;

     ///
     $scope.promotionNewsBackButtonAction = function() {

    	$ionicHistory.goBack();

    };
    
  });