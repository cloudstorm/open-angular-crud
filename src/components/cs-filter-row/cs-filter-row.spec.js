describe('csFilterRow', function(){

  var compile, $rootScope, $component, controller, csFilterRow;

  beforeEach(angular.mock.module('hamlTemplates'));

  beforeEach(angular.mock.module('cloudStorm.localizationProvider'));
  beforeEach(angular.mock.module('cloudStorm.resourceService'));
  beforeEach(angular.mock.module('cloudStorm.resource'))
  beforeEach(angular.mock.module('cloudStorm.restApi'));
  beforeEach(angular.mock.module('cloudStorm.dataStore'));
  beforeEach(angular.mock.module('cloudStorm.settings'));
  beforeEach(angular.mock.module('cloudStorm.descriptorService'))


  beforeEach(inject(function($compile, _$rootScope_, $controller){
    // $component, $controller){
    compile = $compile
    rootScope = $rootScope
    // component = $component
    controller = $controller
  }))

  it('$compile defined', function(){
    expect(compile).toBeDefined()
  })

  it('controller defined', function(){
    expect(controller).toBeDefined()
  })

})
