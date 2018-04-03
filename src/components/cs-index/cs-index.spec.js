describe('csIndex', function(){

  var csIndex;
  var $compile;
  var $rootScope;
  var csLoaderController;
  var testFunctionSpy;
  var indexController;
  var loadDataSpy;

  beforeEach(angular.mock.module('hamlTemplates'));

  beforeEach(angular.mock.module('cloudStorm.localizationProvider'));
  beforeEach(angular.mock.module('cloudStorm.resourceService'));
  beforeEach(angular.mock.module('cloudStorm.resource'))
  beforeEach(angular.mock.module('cloudStorm.alertService'));
  beforeEach(angular.mock.module('cloudStorm.restApi'));
  beforeEach(angular.mock.module('cloudStorm.dataStore'));
  beforeEach(angular.mock.module('cloudStorm.settings'));
  beforeEach(angular.mock.module('cloudStorm.descriptorService'))
  beforeEach(angular.mock.module('cloudStorm.ResourceService'))
  beforeEach(angular.mock.module('cloudStorm.index'));

  beforeEach(inject(function(_$compile_, _$rootScope_, _$componentController_){
    loadDataSpy = jasmine.createSpy('loadData');
    indexController = _$componentController_("csIndex", null, {
      loadData : loadDataSpy
    });
  }))

  it('csIndex existlist', function(){
    expect(csIndex).toBeDefined()
  })

  it('loadData runs', function(){
    expect(loadDataSpy).toHaveBeenCalled()
  })

})
