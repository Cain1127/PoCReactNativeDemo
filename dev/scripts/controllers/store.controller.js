'use strict';

/**
 * @ngdoc function
 * @name Iaccenturer.controller:ProfileController
 * @description
 * # ProfileController
 */
angular.module('HKElementMall')
  .controller('StoreController',
    function ($scope, localStorageService, CONFIG, $state, VerifyService, $timeout) {
      $scope.keyword = {};
      ///當前是否正在請求商店數據
      var isRequestStoreListData = false;
     //     	$scope.list = [
    	// {"shopname":"Boulangerie Bo-LoGNE"},
    	// {"shopname":"hotdog"},
    	// {"shopname":"dasdsadasda"},
    	// ];

        $scope.searchin = "none";
        $scope.searchout = "display";

    	$scope.toSearch= function(){
    		$scope.searchin = "display";
            $scope.searchout = "none";
    	}

        $scope.cancleSearch= function(){
            $scope.searchin = "none";
            $scope.searchout = "display";
            $scope.keyword.outletname_en = "";
        }

      $scope.storeSettingButtonAction = function () {

        $state.go('setting', {parentpage: 'main.store'});

      }

      $scope.storeToDetailButtonAction = function (storeIndex) {

        $state.go('storeDetail', {storeDetailInfo: storeIndex});

      }

      $scope.form = [
        {
          type:'所有種類'
        },
        {
          type:'運動服飾及體育用品'
        },
        {
          type:'家庭布置及飾物'
        },
        {
          type:'手袋及旅行用品'
        },
        {
          type:'影音器材及家庭用品'
        },
        {
          type:'時尚服飾'
        },
        {
          type:'珠寶及配飾'
        },
        {
          type:'兒童服飾及玩具'
        },
        {
          type:'美容及護理'
        },
        {
          type:'貼心服務'
        },
        {
          type:'娛樂'
        },
        {
          type:'娛樂'
        }
      ];

       $scope.category = {
        name:'所有種類'
      };

     $scope.range = [
        {
          place:'所有區域',
          value:undefined
        },
        {
          place:'金',
          value:'金'
        },
        {
          place:'木',
          value:'木'
        },
        {
          place:'水',
          value:'水'
        },
        {
          place:'火',
          value:'火'
        },
        {
          place:'土',
          value:'土'
        },
        {
          place:'土',
          value:'土'
        }
      ];

      $scope.selectPlace = {
        name:'所有區域',
          value:undefined
      };

      $scope.$watch('selectPlace',function(){
          $scope.keyword.zone_hant = $scope.selectPlace.value;
      });

      ///請求商店數據
      var requestStoreList = function () {

        console.log("發起起請求");

        ///判斷當前是否正在請求
        if (isRequestStoreListData) {

          console.log('當前正在請求，不再發起新請求');
          return;

        }

        ///修改請求狀態為正在請求中
        isRequestStoreListData = true;

        ///發起請求
        VerifyService.getStoreList()
          .then (function (result) {

          ///數據轉換
          var resultString = JSON.stringify(result);
          var resultHttpString = resultString.replace(/&&&&/ig, '//');
          var resultEnterString = resultHttpString.replace(/#/ig, '\\n');

          ///最後的數據對象
          var resultJSON = JSON.parse(resultEnterString);
          // console.log('promotion news resultJSON : ' + JSON.stringify(resultJSON));
          $scope.resultJSON = resultJSON;

          ///恢復請求狀態為未請求
          isRequestStoreListData = false;

        })
          .catch (function (error) {

          ///提示獲取信息失敗，隱藏HUD/結束著頭部刷新動畫
          console.log ('request store list data fail: ' + error);

          ///恢復請求狀態為未請求
          isRequestStoreListData = false;

        });

      };
      requestStoreList();

      $scope.doRefresh = function() {

            $timeout( function() {

              requestStoreList();

              $scope.$broadcast('scroll.refreshComplete');

            }, 500);

          };

      $scope.getIconSRC = function (storeDetail) {

      return "images/localImages/storeList/icon/" + storeDetail.logo.substring(storeDetail.logo.lastIndexOf("/")+1);

    }

    });
