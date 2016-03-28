'use strict';

/**
 * @ngdoc function
 * @name Iaccenturer.controller:ProfileController
 * @description
 * # ProfileController
 */
angular.module('HKElementMall')
  .controller('LoginController',
    function ($scope, localStorageService, VerifyService, CONFIG, $state, $ionicPopup) {

      $scope.verify = {};

      $scope.showMsg = function (message) {
        $ionicPopup.prompt({
          cssClass: 'login-dialog',
          template: message,
          okText: 'ok'
        })
      };

      $scope.showMsg = function (message, btnText) {
        $ionicPopup.alert({
          cssClass: 'login-dialog',
          template: message,
          okText: btnText ? btnText : 'cancel',
          okType: 'button-clear button-positive'
        })
      };

      ///返回按钮事件
      $scope.loginTurnbackButtonAction = function () {
        $state.go('welcome');
      }

      ///忘記密碼事件
      $scope.forgetPasswordButtonAction = function () {
        $state.go('forgetpassword');
      }

      /**
       * @ngdoc 登錄事件
       *
       */
      $scope.loginButtonAction = function () {

        //校驗數據
        var userName = $scope.verify.username;
        var password = $scope.verify.password;

        if (!userName || 4 >= userName.length) {
          $scope.showMsg('請輸入帳號', 'ok');
          return;
        }

        if (!password || 4 >= password.length) {
          $scope.showMsg('請輸入有效的密碼', 'ok');
          return;
        }

        $scope.loading = true;
        VerifyService
          .login(userName, password)
          .then(function (result) {

            if (result.ResultCode === '0') {

              //登陆成功:不需要提示
              //$scope.showMsg('Login successful.');

              ///登錄數據保存
              localStorageService.set('login.account', userName);
              localStorageService.set('login.password', password);
              localStorageService.set('member.MemCode', result.MemCode);
              localStorageService.set('member.MemNameEng', result.MemNameEng);
              localStorageService.set('member.MemNameTChi', result.MemNameTChi);
              localStorageService.set('member.ModDate', result.ModDate);
              localStorageService.set('member.ExpDate', result.ExpDate);
              localStorageService.set('member.MemPtBal', result.MemPtBal);
              localStorageService.set('member.MsgEng', result.MsgEng);
              localStorageService.set('member.MsgTChi', result.MsgTChi);
              localStorageService.set('member.MsgSChi', result.MsgSChi);
              localStorageService.set('member.MemTierCode', result.MemTierCode);

              $state.go('main');

            } else {

              //密码错误或其他
              $scope.showMsg('username or password incorrect.', 'ok');

            }

            $scope.loading = false;

          })
          .catch(function (error) {
            $scope.showMsg('internal service error, please try again.', 'ok');
            $scope.loading = false;

          });

      }

    });
