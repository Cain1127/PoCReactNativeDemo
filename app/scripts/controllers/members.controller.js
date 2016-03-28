/**
 * Created by apple on 15/11/3.
 */
/**
 * Created by MinyuLiang on 10/29/15.
 */
'use strict';

/**
 * @ngdoc function
 * @name HKElementMall.controller:LoginController
 * @description
 * # LoginController
 */
angular.module('HKElementMall')
  .controller('MembersController',
    function ($scope, VerifyService, $state, CONFIG, $stateParams, localStorageService, $ionicPopup, $ionicLoading, BaseService) {

      /**
       *  "ResultCode" : "0",
       *   "MemCode" : "100",
       *   "MemNameEng" : "Hello1",
       *   "MemNameTChi" : "Hello1",
       *   "ModDate" : "(時間戳:2015/08/01 09:00:00)",
       *   "ExpDate" : "(時間戳:2020/08/01 09:00:00)",
       *   "MemPtBal" : "50",
       *   "MsgEng" : "Hello1",
       *   "MsgTChi" : "Hello1",
       *   "MsgSChi" : "Hello1",
       *   "MemTierCode" : "1"//级别
       */

        ///会员默認基本信息
      $scope.MemCode = localStorageService.get('member.MemCode');
      $scope.MemNameEng = localStorageService.get('member.MemNameEng');
      $scope.MemNameTChi = localStorageService.get('member.MemNameTChi');
      $scope.ModDate = localStorageService.get('member.ModDate');
      expdate();
      $scope.MemPtBal = localStorageService.get('member.MemPtBal');
      $scope.MsgEng = localStorageService.get('member.MsgEng');
      $scope.MsgTChi = localStorageService.get('member.MsgTChi');
      $scope.MsgSChi = localStorageService.get('member.MsgSChi');
      $scope.MemTierCode = localStorageService.get('member.MemTierCode');
      reftime();


      //時間戳信息转换方法
      function expdate() {
        var timestamp = localStorageService.get('member.ExpDate');
        //console.log(timestamp);
        var expdate = new Date(timestamp * 1000);
        //console.log(expdate+"expdate");
        $scope.ExpDate =
          expdate.getFullYear()
          + '.' +
          ('0' + (expdate.getMonth() + 1)).slice(-2)
          + '.' +
          ('0' + expdate.getDate()).slice(-2)
      }

      //refresh_time信息

      function reftime() {
        var currentDate = new Date();
        $scope.fresh_time =
          currentDate.getFullYear()
          + '.' +
          ('0' + (currentDate.getMonth() + 1)).slice(-2)
          + '.' +
          ('0' + currentDate.getDate()).slice(-2)
          + " " +
          ('0' + currentDate.getHours()).slice(-2)
          + ":" +
          ('0' + currentDate.getMinutes()).slice(-2)
      }

      ///請求用戶信息
      $scope.refresh_member_info = function () {

        var loginName = localStorageService.get('login.account');
        var loginPassword = localStorageService.get('login.password');

        if (!loginName || 4 >= loginName.length) {

          ///加載默認信息
          console.log('Login account is invalid, can not refresh');
          return;

        }

        if (!loginPassword || 4 >= loginPassword.length) {

          ///打印提示信息
          console.log('Login password invalid, can not refresh.');
          return;

        }

        ///重新獲取用戶數據
        VerifyService
          .login(loginName, loginPassword)
          .then(function (result) {

            if (result.ResultCode === '0') {

              ///刷新頁面
              $scope.refleshMemberInfo(result);

            }

          })
          .catch(function (error) {

            $scope.showMsg('internal service error, please try again.', 'ok');

          });

      }

      ///請求最新消息數據
      $scope.requestPromotionNews = function () {
        VerifyService.getPromotionNewsList().then(function (result) {

          ///請求成功:隱藏HUD/刷新界面
          var resultString = JSON.stringify(result);
          var resultHttpString = resultString.replace(/&&&&/ig, '//');
          var resultEnterString = resultHttpString.replace(/#/ig, '\\n');

          ///最後的數據對象
          $scope.promotionNews = JSON.parse(resultEnterString);
          //console.log('promotion news resultJSON : ' + JSON.stringify($scope.promotionNews));
          // console.log($scope.promotionNews.promotions);
          $scope.newstext1 = $scope.promotionNews.promotions[0].nameTw.substr(0, 10) + ".....";
          $scope.newstext2 = $scope.promotionNews.promotions[1].nameTw.substr(0, 20) + ".....";
          $scope.newstext3 = $scope.promotionNews.promotions[2].nameTw.substr(0, 10) + ".....";
          $scope.newstext4 = $scope.promotionNews.promotions[3].nameTw.substr(0, 10) + ".....";

          ///隐藏HUD
          hideHUD();

        }).catch(function (error) {

          ///請求失敗:隱藏HUD/提示請求失敗/打印失敗log
          console.log('request promotion news fail : ' + error);

          ///隐藏HUD
          hideHUD();

        });

      }

      $scope.refleshMemberInfo = function (memberInfo) {
        $scope.MemCode = memberInfo.MemCode;
        $scope.MemNameEng = memberInfo.MemNameEng;
        $scope.MemNameTChi = memberInfo.MemNameTChi;
        $scope.ModDate = memberInfo.ModDate;
        // $scope.ExpDate = memberInfo.ExpDate;
        expdate();
        $scope.MemPtBal = memberInfo.MemPtBal;
        $scope.MsgEng = memberInfo.MsgEng;
        $scope.MsgTChi = memberInfo.MsgTChi;
        $scope.MsgSChi = memberInfo.MsgSChi;
        $scope.MemTierCode = memberInfo.MemTierCode;

        ///更新時間
        $scope.refresh_time();

      }


      $scope.refresh_time = function () {
        reftime();
      }

      //loding动画效果显示与隐藏
      $scope.showHUD = function () {
        $ionicLoading.show({
          template: '<div style="height:50px; width:52px; position:relative;"><ion-spinner icon="ios" style=" width: 19%"></ion-spinner><i style="position:absolute;right:0px; top:35px;">Loading</i></div>',
          // duration:5000
        });
      };
      var hideHUD = function () {
        $ionicLoading.hide();
      };

        //会员级别样式调整
      $scope.members_cardcolor = function(){
      if (localStorageService.get('member.MemTierCode') == '4') {
        $scope.font_color = "-4";
      } else
      {$scope.font_color = "";}
    }

      ///跳轉到設置頁面
      $scope.membersSettingButtonAction = function () {

        $state.go('setting', {parentpage: 'main.members'});

      }

      ///跳轉到消息列表
      $scope.membersNewsButtonAction = function () {

        ///
        $state.go('news', {parentpage: 'main.members'});

      }

      ///跳转到会员尊享页面
      $scope.membersVIPDescription = function(){
        $state.go('member_vip_description', {parentpage: 'main.members'});
    };
      //跳转到最新消息页面
      $scope.promotion_news_detail = function (newsIndex) {
        $state.go('promotion_news_detail', {promotion_news_detailjson: $scope.promotionNews.promotions[newsIndex]});
      }

    //   $scope.getIconSRC = function (i,promotionNews) {

    //   return "images/localImages/promotionNews" + promotionNews.promotions[i].proHighImgTw.substring(promotionNews.promotions[i].proHighImgTw.lastIndexOf("/")+1);

    // }

    });
