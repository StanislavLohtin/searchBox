angular.module('translateFilter', [])
    .constant('languages', [
        'EN',
        'DE'
    ])
    .filter('translate', ['$rootScope', '$http', 'languages',
        function($rootScope, $http, languages) {

            // region loading languages from the resource files

            var languageList = {};

            _.forEach(languages, function (language) {
                $http.get('resources/' + language + '.json').then(function (data) {
                    if (!data || !data.data) {
                        console.error('error loading language ' + language);
                    }
                    languageList[language] = data.data;
                }, function (e) {
                    console.error('error loading language ' + language + ' (' + e + ')');
                });
            });

            // endregion

            function translateFilter(langVariable) {
                if (!languageList[$rootScope.currentLanguage]) {
                    return;
                }
                return languageList[$rootScope.currentLanguage][langVariable];
            }
            translateFilter.$stateful = true;

            return translateFilter;
        }]);