angular.module('searchBoxApp', ['ngSanitize', 'searchBoxDirective', 'translateFilter'])
    .controller('searchBoxCtrl', ['$scope', '$rootScope', '$http', '$q', 'languages',
        function ($scope, $rootScope, $http, $q, languages) {

            // region initialization

            $scope.languages = [];
            _.forEach(languages, function (language, index) {
                $scope.languages.push({
                    id: index,
                    label: language
                });
            });
            $rootScope.currentLanguage = languages[0];
            $scope.selectedLanguage = $scope.languages[0];
            $scope.text = '';

            // endregion

            // rootScope is used here to communicate with the filter
            $scope.changeLanguage = function () {
                $rootScope.currentLanguage = $scope.selectedLanguage.label
            };

            /**
             * Example search function to be given to the directive
             * @param text to be searched for
             * @returns a promise with the search results
             */
            $scope.searchFunction = function (text) {
                var deferred = $q.defer();

                $http.get('resources/search.json').then(function (data) {
                    if (!data || !data.data || !data.data.results) {
                        deferred.reject();
                    }
                    deferred.resolve(_.filter(data.data.results, function (result) {
                        return result.indexOf(text) !== -1;
                    }));
                }, function (e) {
                    deferred.reject();
                });

                return deferred.promise;
            };
        }])
;