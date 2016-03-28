"use strict";
angular.module('HKElementMall')
  .factory('VerifyService', ['$q', '$log', 'BaseService',
    function ($q, $log, BaseService) {
      var exports = {};
      /**
       * 登录
       * @param MemEmail  用户名
       * @param Pwd       密码
       * @returns {deferred.promise|*}
       */
      exports.login = function (username, password) {
        var deferred = $q.defer();
        BaseService.getConnection('/login.action', {

          MemEmail: username,
          Pwd: password

        }, 'POST').then(function (result) {

          deferred.resolve(result.data);

        }, function (error) {

          console.log('verify error : ' + error);
          $log.error(JSON.stringify(error));
          deferred.reject('请求链接异常，请重试。');

        });

        return deferred.promise;

      };

      /**
       * 重置密碼：首次登錄時必須重置密碼
       * @param MemEmail 用户名
       * @param oldPwd 舊密码
       * @param newPwd 新密碼
       * @returns {deferred.promise|*}
       */
      exports.resetpassword = function (username, newpassword, oldpassword) {
        var deferred = $q.defer();
        BaseService.getConnection('/MemChgPasswd.action', {

          MemEmail: username,
          oldPwd: oldpassword,
          newPwd: newpassword

        }, 'POST').then(function (result) {

          deferred.resolve(result.data);

        }, function (error) {

          $log.error(JSON.stringify(error));
          deferred.reject('请求链接异常，请重试。');

        });

        return deferred.promise;

      };

      /**
       * 獲取美食餐廳列表
       * @returns {deferred.promise|*}
       */
      exports.getFoodStoreList = function () {

        var deferred = $q.defer();
        BaseService.getConnection('/getshops.action', {

          maincategory_cid: "2"

        }, 'POST').then(function (result) {

          deferred.resolve(result.data);

        }, function (error) {

          $log.error(JSON.stringify(error));
          deferred.reject('请求链接异常，请重试。');

        });

        return deferred.promise;

      };

      /**
       * 獲取商铺列表
       * @returns {deferred.promise|*}
       */
      exports.getStoreList = function () {

        var deferred = $q.defer();
        BaseService.getConnection('/getshops.action', {

          maincategory_cid: "3"

        }, 'POST').then(function (result) {

          deferred.resolve(result.data);

        }, function (error) {

          $log.error(JSON.stringify(error));
          deferred.reject('请求链接异常，请重试。');

        });

        return deferred.promise;

      };

      /**
       * 獲取最新消息列表
       * @returns {deferred.promise|*}
       */
      exports.getPromotionNewsList = function () {

        var deferred = $q.defer();
        BaseService.getConnection('/promotionNews.action', {

          ///補充參數

        }, 'POST').then(function (result) {

          deferred.resolve(result.data);

        }, function (error) {

          $log.error(JSON.stringify(error));
          deferred.reject('请求链接异常，请重试。');

        });

        return deferred.promise;

      };

      return exports;

    }]);



