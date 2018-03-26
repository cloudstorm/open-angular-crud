describe('csLoader', function(){

  var csLoaderController;
  var testFunctionSpy;

  beforeEach(angular.mock.module('cloudStorm.inputBase'));
  beforeEach(angular.mock.module('cloudStorm.loader'));

  beforeEach(inject(function(_$componentController_){

      testFunctionSpy = jasmine.createSpy('testFunction');
      csLoaderController = _$componentController_("csLoader", null, {
        testFunction : testFunctionSpy
      });
      //console.log(csLoaderController.x)
      csLoaderController.testFunction()
  }))

  it('should exist and have no messages', function() {
    expect(csLoaderController).toBeDefined();
  });

  it('only one test', function(){

    csLoaderController.testFunction();
    expect(testFunctionSpy).toHaveBeenCalled();

  })
})
