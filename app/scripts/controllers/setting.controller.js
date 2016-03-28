'use strict';

/**
 * @ngdoc function
 * @name Iaccenturer.controller:ProfileController
 * @description
 * # ProfileController
 */
angular.module('HKElementMall')
  .controller('SettingController',
    function ($scope,  CONFIG, $state,$stateParams) {

    	$scope.parentpage = $stateParams.parentpage || 'welcome';
	      $scope.settingCloseButtonAction = function () {
	        $state.go($scope.parentpage);
	      }

      $scope.language = "語言";
      $scope.eng = "English";
      $scope.fchinese = "繁體中文";
      $scope.jchinese = "简体中文";
      $scope.diliverNews = "傳送通知";
      $scope.teacher = "教學";
      $scope.useitem = "使用條款";
      $scope.cancel = "登出";
      $scope.newspic = "images/ele_club_setting_glod_button_on.png";
      $scope.languagepic = "images/ele_club_setting_tick.png";
      $scope.show1 = "none";
      $scope.show2 = "block";
      $scope.show3 = "none";


    $scope.change2English = function(){
        $scope.language = "Language";
          $scope.eng = "English";
          $scope.fchinese = "繁體中文";
          $scope.jchinese = "简体中文";
          $scope.diliverNews = "Push Notification";
          $scope.teacher = "Tutorial";
          $scope.useitem = "Terms of Use";
          $scope.cancel = "Log out";
          $scope.show1 = "block";
          $scope.show2 = "none";
          $scope.show3 = "none";
    }

    $scope.change2Jchinese = function(){
        $scope.language = "语言";
          $scope.eng = "English";
          $scope.fchinese = "繁體中文";
          $scope.jchinese = "简体中文";
          $scope.diliverNews = "传送通知";
          $scope.teacher = "教学";
          $scope.useitem = "使用条款";
          $scope.cancel = "注销";
          $scope.show1 = "none";
          $scope.show2 = "none";
          $scope.show3 = "block";
    }

    $scope.change2Fchinese = function(){
        $scope.language = "語言";
          $scope.eng = "English";
          $scope.fchinese = "繁體中文";
          $scope.jchinese = "简体中文";
          $scope.diliverNews = "傳送通知";
          $scope.teacher = "教學";
          $scope.useitem = "使用條款";
          $scope.cancel = "登出";
          $scope.show1 = "none";
          $scope.show2 = "block";
          $scope.show3 = "none";
    }

     $scope.newsButton = function(){
       if($scope.newspic === 'images/ele_club_setting_glod_button_on.png'){
           $scope.newspic = 'images/ele_club_setting_gray_button_off.png';
       }else{
         $scope.newspic = 'images/ele_club_setting_glod_button_on.png';
       }
     }

});
