'use strict';

/**
 * @ngdoc overview
 * @name Iaccenturer
 * @description
 * # Initializes main application and routing
 *
 * Main module of the application.
 */

angular.module('HKElementMall', ['ionic', 'ngCordova', 'ngResource', 'commonServiceModule', 'LocalStorageModule', 'nya.bootstrap.select'])
  .constant('CONFIG', {
    'LOGIN_TOKEN': 'user.token',
    'DESIGN_SCREEN': 375
  })
  .run(function ($ionicPlatform, $state, $window, localStorageService, CONFIG) {
    $ionicPlatform.ready(function () {


    });

  })

  .config(function ($httpProvider, $stateProvider, $urlRouterProvider, localStorageServiceProvider) {

    localStorageServiceProvider.setPrefix('HKElementMall');

    // Application routing
    $stateProvider
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/master.html',
        controller: 'MasterController'
      })
      .state('welcome', {
        url: '/welcome',
        cache: false,
        views: {
          'viewContent': {
            templateUrl: 'templates/views/verify/welcome.html',
            controller: 'WelcomeController'
          }
        }
      })
      .state('tnc_en', {
        url: '/tnc_en',
        abstract: false,
        templateUrl: 'templates/views/verify/tnc_en.html'
      })
      .state('tnc_hans', {
        url: '/tnc_hans',
        abstract: false,
        templateUrl: 'templates/views/verify/tnc_hans.html'
      })
      .state('tnc_hant', {
        url: '/tnc_hant',
        abstract: false,
        templateUrl: 'templates/views/verify/tnc_hant.html'
      })
      .state('login', {
        url: '/login',
        cache: true,
        views: {
          'viewContent': {
            templateUrl: 'templates/views/verify/login.html',
            controller: 'LoginController'
          }
        }
      })
      .state('setting', {
        url: '/setting',
        cache: false,
        params: {
          parentpage: null
        },
        views: {
          'viewContent': {
            templateUrl: 'templates/views/verify/setting.html',
            controller: 'SettingController'
          }
        }
      })
      .state('news', {
        url: '/news',
        cache: false,
        params: {
          parentpage: null
        },
        views: {
          'viewContent': {
            templateUrl: 'templates/views/verify/news.html',
            controller: 'NewsController'
          }
        }
      })
      .state('forgetpassword', {
        url: '/forgetpassword',
        cache: false,
        views: {
          'viewContent': {
            templateUrl: 'templates/views/verify/forget_password.html',
            controller: 'ForgetPasswordController'
          }
        }
      })
      .state('main', {
        url: '/main',
        cache: true,
        views: {
          'viewContent': {
            templateUrl: 'templates/views/verify/main.html',
            controller: 'MainController'
          }
        }
      })
      .state('main.members', {
        url: '/members',
        cache: true,
        views: {
          'vipcenter': {
            templateUrl: 'templates/views/verify/members.html',
            controller: 'MembersController'
          }
        }
      })
      .state('main.food', {
        url: '/food',
        cache: true,
        views: {
          'deliciousfood': {
            templateUrl: 'templates/views/verify/food.html',
            controller: 'FoodController'
          }
        }
      })
      .state('main.store', {
        url: '/store',
        cache: true,
        views: {
          'stores': {
            templateUrl: 'templates/views/verify/store.html',
            controller: 'StoreController'
          }
        }
      })
      .state('storeDetail', {
        url: '/storeDetail',
        cache: false,
        params: {
          storeDetailInfo: null
        },
        views: {
          'viewContent': {
            templateUrl: 'templates/views/verify/storeDetail.html',
            controller: 'StoreDetailController'
          }
        }
      })

      .state('main.contact_us', {
        url: '/contact_us',
        cache: true,
        views: {
          'contactus': {
            templateUrl: 'templates/views/verify/contact_us.html',
            controller: 'ContactUsController'
          }
        }
      })
      .state('foodDetail', {
        url: '/foodDetail',
        cache: false,
        params: {
          foodDetailInfo: null
        },
        views: {
          'viewContent': {
            templateUrl: 'templates/views/verify/foodDetail.html',
            controller: 'FoodDetailController'
          }
        }
      })

      .state('promotion_news_detail', {
        url: '/promotion_news_detail',
        cache: false,
        params: {
          promotion_news_detailjson: null
        },
        views: {
          'viewContent': {
            templateUrl: 'templates/views/verify/promotion_news_detail.html',
            controller: 'PromotionNewsDetailController'
          }
        }
      })
      .state('member_vip_description', {
        url: '/member_vip_description',
        cache: false,

        views: {
          'viewContent': {
            templateUrl: 'templates/views/verify/member_vip_description.html',
            controller: 'Member_vip_descriptionController'
          }
        }
      });

    // redirects to default route for undefined routes
    $urlRouterProvider.otherwise('/welcome');

  });
