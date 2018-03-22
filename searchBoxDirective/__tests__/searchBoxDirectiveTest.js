require('../../node_modules/angular/angular.min.js');
require('../../node_modules/angular-mocks/angular-mocks.js');
_ = require('../../node_modules/lodash/lodash.min.js');
require('../../translateFilter/translateFilter.js');
require('../searchBoxDirective.js');

describe('searchBoxDirectiveTest', function(){

    beforeEach(
        angular.mock.module('translateFilter')
    );
    beforeEach(
        angular.mock.module('searchBoxDirective')
    );

    var element, controllersScope, filter;

    beforeEach(
        inject(function($rootScope, $compile, $httpBackend, $filter, languages){
            filter = $filter;
            var scope = $rootScope.$new();
            $rootScope.text = "testtext";
            $rootScope.currentLanguage = languages[0];
            scope.currentLanguage = languages[0];
            $rootScope.searchFunction = mockSearchFunction1;
            $httpBackend.when('GET', 'resources/EN.json').respond();
            $httpBackend.when('GET', 'resources/DE.json').respond();
            element = $compile(angular.element('<search-box search-function="searchFunction" text="text" search-trigger="1" color="\'green\'"></search-box>'))(scope);
            scope.$digest();
            controllersScope = element.scope().$$childHead;
        })
    );

    it('should compile the directive and html is not empty', function(){
        expect(element.html()).not.toBe('');
    });

    it('should set the color correctly', function(){
        expect(controllersScope.color).toBe('green');
    });

    it('should set the search-trigger correctly', function(){
        expect(controllersScope.searchTrigger).toBe(1);
    });

    it('should set the text correctly', function(){
        expect(controllersScope.text).toBe("testtext");
    });

    it('should set the searchFunction correctly', function(){
        return controllersScope.searchFunction().then(function (data) {
            expect(data[0]).toBe("testtext1");
            expect(data[1]).toBe("testtext2");
        });
    });

    it('should suggest the results of searchFunction', function(done){
        controllersScope.onChange().then(function (data) {
            expect(data.length).toBe(2);
            expect(data[0].text).toBe('testtext1');
            expect(data[1].text).toBe('testtext2');
            done();
        });
    });

    it('should highlight the search text in the suggestions', function(done){
        controllersScope.onChange().then(function (data) {
            expect(data.length).toBe(2);
            expect(data[0].highlighted).toBe('<span>testtext</span>1');
            expect(data[1].highlighted).toBe('<span>testtext</span>2');
            done();
        });
    });

    function mockSearchFunction1(text) {
        return Promise.resolve(['testtext1', 'testtext2']);
    }

});