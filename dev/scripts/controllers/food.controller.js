'use strict';

/**
 * @ngdoc function
 * @name Iaccenturer.controller:ProfileController
 * @description
 * # ProfileController
 */
angular.module('HKElementMall')
  .controller('FoodController',
    function ($scope, localStorageService, CONFIG, $state, VerifyService, $timeout) {

  
      ///當前是否正在請求列表數據狀態表往
      var isRequestFoodStoreListData = false;
      $scope.keyword = {};

    	// $scope.list = [
    	// {"shopname":"Boulangerie Bo-LoGNE"},
    	// {"shopname":"hotdog"},
    	// {"shopname":"dasdsadasda"},
    	// ];


        $scope.searchin = "none";
        $scope.searchout = "display";

    	$scope.toSearch = function(){
    		$scope.searchin = "display";
            $scope.searchout = "none";
    	}

        $scope.cancleSearch = function(){
            $scope.searchin = "none";
            $scope.searchout = "display";
            $scope.keyword.outletname_en = "";
        }

      $scope.foodSettingButtonAction = function () {

        $state.go('setting', {parentpage: 'main.food'});

      }

      $scope.foodToDetailButtonAction = function (foodIndex) {
        console.log(foodIndex.tenant_photo_1.substring(foodIndex.tenant_photo_1.lastIndexOf("/")+1));
        // s.substring(s.lastIndexOf("/")+1, s.lastIndexOf("/")+4)
        $state.go('foodDetail' , {foodDetailInfo: foodIndex});

      }

      $scope.form = [
        {
          type:'所有種類',
          value:undefined
        },
        {
          type:'亞洲美食',
          value:undefined
        },
        {
          type:'面包西餅',
          value:undefined
        },
        {
          type:'咖啡及輕便美食',
          value:undefined
        },
        {
          type:'中式佳餚',
          value:undefined
        },
        {
          type:'國際美饌',
          value:undefined
        },
        {
          type:'超市市場及美食',
          value:undefined
        },
        {
          type:'甜點總匯',
          value:undefined
        },
       {
          type:'甜點總匯',
          value:undefined
        },
      ];

       $scope.category = {
        name:'所有種類',
          value:undefined
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


      var requestFoodStoreList = function () {

        ///判斷當前是否正在請求
        if (isRequestFoodStoreListData) {

          console.log('當前正在請求，不再發起新請求');
          return;

        }

        ///修改請求狀態為正在請求中
        isRequestFoodStoreListData = true;

        ///發起請求
        VerifyService.getFoodStoreList()
          .then (function (result) {

          ///數據轉換
          var resultString = JSON.stringify(result);
          var resultHttpString = resultString.replace(/&&&&/ig, '//');
          var resultEnterString = resultHttpString.replace(/#/ig, '\\n');

          ///最後的數據對象
          var resultJSON = JSON.parse(resultEnterString);
          // console.log('promotion news resultJSON : ' + JSON.stringify(resultJSON));
          // console.log(resultJSON[38].outletname_hant);


          $scope.resultJSON = resultJSON;

          // for(var i=0; i<resultJSON.length; i++){
          //    console.log(resultJSON[i].outletname_hant);
          // }


         
          ///提示獲取信息成功，隱藏HUD/結束頭部刷新動畫

          ///恢復請求狀態為未請求
          isRequestFoodStoreListData = false;

        })
          .catch (function (error) {

          ///提示獲取信息失敗，隱藏HUD/結束著頭部刷新動畫
          console.log ('request food list data fail: ' + error);

          ///恢復請求狀態為未請求
          isRequestFoodStoreListData = false;

        });

      };

      requestFoodStoreList();


      $scope.doRefresh = function() {  
      
            $timeout( function() {  
              
              requestFoodStoreList();
              
              $scope.$broadcast('scroll.refreshComplete');  
              
            }, 500);  
                
          };

    $scope.getIconSRC = function (foodDetail) {

      return "images/localImages/foodList/icon/" + foodDetail.logo.substring(foodDetail.logo.lastIndexOf("/")+1);

    }

});
