/**
 * @ngdoc directive
 * @name baseFrameApp.directive:currentDateTimeClock
 * @element
 * @restrict E
 * @function 
 *
 * @description
 *
 * 每隔1秒自动刷新当前时间
 *
 *
 * @example
 <example module="baseFrameApp">
 <file name="index.html">
    <current-date-time-clock/>
 </file>
 </example>
 */
angular.module('baseFrameApp', []).directive("currentDateTimeClock", ["$filter", function ($filter) {//
    return {
        restrict: "E",
        replace: true,
        template: "<span></span>",
        link: function (scope, element, attrs) {
            function _updateCurrentDateTime() {
                element.text($filter("date")(new Date(), "yyyy年MM月dd日 HH:mm:ss"));
                setTimeout(_updateCurrentDateTime, 1000);
            }

            _updateCurrentDateTime();
        }
    };
}]);