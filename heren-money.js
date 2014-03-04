/**
 * @ngdoc directive
 * @name moneyModule.directive:money
 * @element
 * @restrict A
 * @function
 *
 * @description
 *
 * input输入数字自动变为三位小数
 *
 * @example
 <example module="money">
 <file name="index.html">
 <input type="text" class="input-small text-align-right" ng-model="newPrice" money>
 </file>
 </example>
 */
var moneyModule = angular.module('money', []);
moneyModule.directive('money', function() {
    'use strict';

    var NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;
    function isUndefined(value) {
        return typeof value == 'undefined';
    }
    function isEmpty(value) {
        return isUndefined(value) || value === '' || value === null || value !== value;
    }

    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, el, attr, ctrl) {
            /** @function*/
            function round(num) {
                return Math.round(num * 1000) / 1000;
            }

            var min = parseFloat(attr.min) || 0;

            // Returning NaN so that the formatter won't render invalid chars
            ctrl.$parsers.push(function(value) {
                // Handle leading decimal point, like ".5"
                if (value === '.') {
                    ctrl.$setValidity('number', true);
                    return 0;
                }

                // Allow "-" inputs only when min < 0
                if (value === '-') {
                    ctrl.$setValidity('number', false);
                    return (min < 0) ? -0 : NaN;
                }

                var empty = isEmpty(value);
                if (empty || NUMBER_REGEXP.test(value)) {
                    ctrl.$setValidity('number', true);
                    return value === '' ? null : (empty ? value : parseFloat(value));
                } else {
                    ctrl.$setValidity('number', false);
                    return NaN;
                }
            });
            ctrl.$formatters.push(function(value) {
                return isEmpty(value) ? '' : '' + value;
            });

            var minValidator = function(value) {
                if (!isEmpty(value) && value < min) {
                    ctrl.$setValidity('min', false);
                    return undefined;
                } else {
                    ctrl.$setValidity('min', true);
                    return value;
                }
            };
            ctrl.$parsers.push(minValidator);
            ctrl.$formatters.push(minValidator);

            if (attr.max) {
                var max = parseFloat(attr.max);
                var maxValidator = function(value) {
                    if (!isEmpty(value) && value > max) {
                        ctrl.$setValidity('max', false);
                        return undefined;
                    } else {
                        ctrl.$setValidity('max', true);
                        return value;
                    }
                };

                ctrl.$parsers.push(maxValidator);
                ctrl.$formatters.push(maxValidator);
            }

            // Round off to 2 decimal places
            ctrl.$parsers.push(function (value) {
                return value ? round(value) : value;
            });
            ctrl.$formatters.push(function (value) {
                return value ? parseFloat(value).toFixed(3) : value;
            });

            el.bind('blur', function () {
                var value = ctrl.$modelValue;
                if (value) {
                    ctrl.$viewValue = round(value).toFixed(3);
                    ctrl.$render();
                }
            });
        }
    };
});
