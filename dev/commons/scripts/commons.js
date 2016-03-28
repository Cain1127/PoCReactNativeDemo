"use strict";

angular.module('commonProviderModule', [])
  .constant('ENVIRONMENT', true)
  .constant('API_ENDPOINT', function (ENVIRONMENT) {
    return ENVIRONMENT ? {
      host     : 'http://10.202.115.84',
      port     : 8080,
      path     : '/elementsMall-server',
      needsAuth: false,
      username : 'whatever',
      password : 'foobar'
    } : {
      host     : 'http://localhost',
      port     : 8080,
      path     : '/',
      needsAuth: false
    };
  })
  .provider('BaseData', function (ENVIRONMENT, API_ENDPOINT) {
    this.$get = function () {
      return  API_ENDPOINT(ENVIRONMENT);
    };
  });

angular.module('commonServiceModule', ['commonProviderModule'])
  .factory('BaseService', ['$window', '$http', 'BaseData', '$log',
    function ($window, $http, BaseData, $log) {
      $log.info(JSON.stringify(BaseData));
      var _api = BaseData;
      var endpoint = _api.port ? (_api.host + ':' + _api.port + _api.path) : (_api.host + _api.path);

      // activate for basic auth
      if (_api.needsAuth) {
        $http.defaults.headers.common.Authorization = 'Basic ' + $window.btoa(_api.username + ':' + _api.password);
      }

      $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

      /**
       * The workhorse; converts an object to x-www-form-urlencoded serialization.
       * @param {Object} obj
       * @return {String}
       */
      var param = function (obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

        for (name in obj) {
          value = obj[name];

          if (value instanceof Array) {
            for (i = 0; i < value.length; ++i) {
              subValue = value[i];
              fullSubName = name + '[' + i + ']';
              innerObj = {};
              innerObj[fullSubName] = subValue;
              query += param(innerObj) + '&';
            }
          }
          else if (value instanceof Object) {
            for (subName in value) {
              subValue = value[subName];
              fullSubName = name + '[' + subName + ']';
              innerObj = {};
              innerObj[fullSubName] = subValue;
              query += param(innerObj) + '&';
            }
          }
          else if (value !== undefined && value !== null)
            query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

        return query.length ? query.substr(0, query.length - 1) : query;
      };

      // Override $http service's default transformRequest
      $http.defaults.transformRequest = [function (data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
      }];

      $http.defaults.useXDomain = true;
      delete $http.defaults.headers.common['X-Requested-With'];

      // public accentureR-server
      return {
        /**
         * 获取加密链接
         * @param path 子路径
         * @param data 链接时候需要附带的数据
         * @param method 访问链接的 METHOD
         * @returns {*} HTTP对象
         */
        getConnection: function (path, data, method) {
          $log.info(path, JSON.stringify(data), method);
          return $http({
            url   : endpoint + path,
            data  : data,
            method: method ? method : 'GET'
          });
        }
      };

    }]);
