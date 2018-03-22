angular.module('searchBoxDirective', [])
    .directive('searchBox', [function () {
        console.log('entered directive');
        return {
            scope: {
                text: '=',
                searchFunction: '=',
                searchTrigger: '=',
                color: '='
            },
            restrict: 'E',
            template: '<div class="search-box">\n' +
            '    <input title="Search box"\n' +
            '           class="form-control"\n' +
            '           placeholder="{{ \'ENTER_TEXT\' | translate }}"\n' +
            '           ng-model="text"\n' +
            '           ng-change="onChange()"\n' +
            '    />\n' +
            '    <div class="suggestion-list" ng-if="suggestions.length">\n' +
            '        <p ng-repeat="suggestion in suggestions" ng-click="onSuggestionClick(suggestion)">\n' +
            '            <b ng-bind-html="suggestion.highlighted"></b>\n' +
            '        </p>\n' +
            '    </div>\n' +
            '</div>',
            controller: ['$scope', function ($scope) {
                console.log('entered controller');

                updateColors();

                $scope.onChange = function () {
                    return new Promise(function (resolve, reject) {
                        if (!$scope.text || $scope.text.length < $scope.searchTrigger) {
                            $scope.suggestions = [];
                            return;
                        }
                        $scope.searchFunction($scope.text).then(function (data) {
                            $scope.suggestions = [];
                            _.forEach(data, function (result) {
                                $scope.suggestions.push({
                                    highlighted: result.split($scope.text).join('<span>' + $scope.text + '</span>'),
                                    text: result
                                });
                            });
                            resolve($scope.suggestions);
                        }, function (e) {
                            console.log('search function failed ' + e);
                            reject();
                        });
                    });
                };

                $scope.onSuggestionClick = function(suggestion) {
                    $scope.text = suggestion.text;
                    $scope.suggestions = [];
                };

                function updateColors() {
                    var style = document.createElement('style');
                    style.type = 'text/css';
                    style.appendChild(
                        document.createTextNode(
                            '.search-box .suggestion-list b span {\n' +
                            '    background-color: ' + $scope.color + ';\n' +
                            '}'));
                    document.getElementsByTagName('head')[0].appendChild(style);
                }
            }]
        };
    }]);