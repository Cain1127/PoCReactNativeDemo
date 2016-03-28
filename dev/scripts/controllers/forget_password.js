'use strict';
/**
 * Created by apple on 15/11/18.
 */
angular.module('HKElementMall')
  .controller('ForgetPasswordController',
    function ($scope, localStorageService, CONFIG, $state, $ionicHistory) {

      $scope.forgetPasswordTurnBackButtonAction = function () {
        $ionicHistory.goBack();
        // $state.go('login');
      }

    });
