'use strict';

/**
 * @ngdoc function
 * @name Iaccenturer.controller:ProfileController
 * @description
 * # ProfileController
 */
angular.module('HKElementMall')
  .controller('WelcomeController',
  function ($scope, localStorageService, CONFIG, $state, $ionicPopup, $ionicLoading) {

    ///判斷是否是第一次裝應用，如果是，則彈出使用知須
    //var isFirstLaunch = LocalDriverProvider.get('isFirstLaunch');
    //if (!isFirstLaunch || isFirstLaunch !== '1') {
    //
    //  $ionicPopup.prompt();
    //
    //}

    $scope.toLogin = function () {
      $state.go('login');
    }
    $scope.toSetting = function () {
      $state.go('setting', {parentpage: 'welcome'});
    }
    $scope.toNews = function () {
      $state.go('news', {parentpage: 'welcome'});
    }

    $scope.showHUD = function() {
    $ionicLoading.show({
      template: '<div style="height:50px; width:52px; position:relative;"><ion-spinner icon="ios" style=" width: 19%"></ion-spinner><i style="position:absolute;right:0px; top:35px;">Loading</i></div>'
        });
    };

    $scope.hideHUD = function(){
      $ionicLoading.hide();
    };

  });
