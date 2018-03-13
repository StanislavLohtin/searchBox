if (app !== undefined
    && app !== null) {
    app.directive('searchBox', [function () {
        return {
            scope: {
                text: '=',
                searchFunction: '=',
                searchTrigger: '=',
                color: '='
            },
            restrict: 'E',
            templateUrl: 'searchBoxDirective/searchBoxTemplate.html',
            controller: ['$scope', function ($scope) {
                $scope.text = '';

                updateColors();

                $scope.onChange = function () {
                    if (!$scope.text || $scope.text.length < $scope.searchTrigger) {
                        $scope.suggestions = [];
                        return;
                    }
                    search();
                };

                $scope.onSuggestionClick = function(suggestion) {
                    $scope.text = suggestion.text;
                    $scope.suggestions = [];
                };

                function search() {
                    $scope.searchFunction($scope.text).then(function (data) {
                        $scope.suggestions = [];
                        _.forEach(data, function (result) {
                            $scope.suggestions.push({
                                highlighted: result.split($scope.text).join('<span>' + $scope.text + '</span>'),
                                text: result
                            });
                        });
                    }, function (e) {
                        console.log('search function failed ' + e);
                    });
                }

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
}