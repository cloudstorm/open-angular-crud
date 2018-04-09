describe('csLoader', function(){

  var $compile;
  var $rootScope;
  var csLoaderController;
  var testFunctionSpy;
  var compController;
  var csLoader;

  beforeEach(angular.mock.module('hamlTemplates'));
  beforeEach(angular.mock.module('cloudStorm.loader'));
  beforeEach(angular.mock.module('cloudStorm.inputBase'));

  beforeEach(inject(function(_$compile_, _$rootScope_, _$componentController_){

      $compile = _$compile_
      $rootScope = _$rootScope_
      compController = _$componentController_
      // testFunctionSpy = jasmine.createSpy('testFunction');
      // csLoaderController = _$componentController_("csLoader", null, {
      //   testFunction : testFunctionSpy
      // });
      //console.log(csLoaderController.x)
      //csLoaderController.testFunction()
  }))

  it('functionCall test', function(){
    //csLoaderController.testFunction();
  })

  it('compile test', function(){

    var html = '<cs-loader enabled="true"></cs-loader>';
    //testFunctionSpy = jasmine.createSpy('testFunction');
    var scope = $rootScope.$new();

    var element = angular.element(html);
    console.log("1")
    var compiled = $compile(element)(scope);

    var csLoaderController = element.controller('csLoader');
    scope.$apply()

    console.log("csLoaderController")
    console.log(csLoaderController)

    //csLoaderController = compController("csLoader", {$scope : $rootScope})
    //  , {
    //   testFunction : testFunctionSpy
    // });

    //csLoaderController.testFunction = jasmine.createSpy('testFunction')

    //spyOn(csLoaderController, 'testFunction')

    //expect(csLoaderController.testFunction).toHaveBeenCalled();
    expect(csLoaderController.testFunction).toBeDefined();

  })

})
