describe('csLoader', function(){

  var $compile;
  var $rootScope;
  var csLoaderController;
  var testFunctionSpy;

  beforeEach(angular.mock.module('hamlTemplates'));
  beforeEach(angular.mock.module('cloudStorm.inputBase'));
  beforeEach(angular.mock.module('cloudStorm.loader'));

  beforeEach(inject(function(_$compile_, _$rootScope_, _$componentController_){

      $compile = _$compile_
      $rootScope = _$rootScope_

      testFunctionSpy = jasmine.createSpy('testFunction');
      csLoaderController = _$componentController_("csLoader", null, {
        testFunction : testFunctionSpy
      });
      //console.log(csLoaderController.x)
      //csLoaderController.testFunction()
  }))

  it('should exist and have no messages', function() {
    expect(csLoaderController).toBeDefined();
  });

  it('functionCall test', function(){
    csLoaderController.testFunction();
    expect(testFunctionSpy).toHaveBeenCalled();
  })

  it('compile test', function(){

    var html = '<cs-loader enabled="true"></cs-loader>';
    var element = angular.element(html);
    var compiled = $compile(element)($rootScope);
    $rootScope.$digest();

    

  })

})
