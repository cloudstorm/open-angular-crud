describe('csFilterRow', function(){

  var compile, $rootScope, $component, controller, csFilterRow;

  var element;
  var scope;

  beforeEach(angular.mock.module('hamlTemplates'));

  beforeEach(angular.mock.module('cloudStorm.localizationProvider'));
  beforeEach(angular.mock.module('cloudStorm.resourceService'));
  beforeEach(angular.mock.module('cloudStorm.resource'))
  beforeEach(angular.mock.module('cloudStorm.restApi'));
  beforeEach(angular.mock.module('cloudStorm.dataStore'));
  beforeEach(angular.mock.module('cloudStorm.settings'));
  beforeEach(angular.mock.module('cloudStorm.descriptorService'))

  beforeEach(angular.mock.module('cloudStorm.filterRow'))

  // beforeEach(inject(function($compile, _$rootScope_, $controller){
  //   // $component, $controller){
  //   compile = $compile
  //   _$rootScope = _$rootScope_
  //   // component = $component
  //   controller = $controller
  // }))
  //
  // it('$compile defined', function(){
  //   expect(compile).toBeDefined()
  // })
  //
  // it('controller defined', function(){
  //   expect(controller).toBeDefined()
  // })

  var element, rootScope;
  beforeEach(inject(function($rootScope, $compile){

    rootScope = $rootScope
    scope = $rootScope.$new();
    element = angular.element('<cs-filter-row resource="{{inputresource}}"></cs-filter-row>');
    //element = angular.element('<cs-filter-row></cs-filter-row>');
    element = $compile(element)(scope);
    scope.outside = '1.5';

    scope.inputresource = {
      descriptor : {
        name : "Kutya"
      }
    }
    scope.$apply();

  }));

  it('UI test', function(){
    rootScope.$digest()
    expect(element.html()).toContain("Kutya");
  })
})
