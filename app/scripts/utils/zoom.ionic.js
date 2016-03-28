"use strict";

angular.module('HKElementMall')
  .directive('ionScale', ['CONFIG', '$timeout', function (CONFIG, $timeout) {
    return {
      restrict: 'E',
      link    : function ($scope, $element) {
        //这里做全局缩放，并非采用响应式代码
        var targetWith = CONFIG.DESIGN_SCREEN,//设计图的环境是IPHONE6
            scale = $(window).width() / targetWith,//与设备取得比例
            targetHeight = scale > 1 ? scale + 0.03 : scale === 1 ? 1 : (1 + (1 - scale)) + 0.03;
        // a nav view element is a container for numerous views
        $element.css({
          'width'                   : targetWith + 'px',
          'height'                  : (targetHeight * 100) + '%',
          'transform'               : 'scale(' + scale + ')',
          '-webkit-transform'       : 'scale(' + scale + ')',
          'transform-origin'        : '0px 0px',
          '-webkit-transform-origin': '0px 0px',
          'position'                : 'absolute'
        });
      }
    };
  }]);
