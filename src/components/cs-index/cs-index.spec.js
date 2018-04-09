describe('csIndex', function(){

  var csIndex;
  var $compile;
  var $rootScope;
  var csLoaderController;
  var testFunctionSpy;
  var indexController;
  var loadDataSpy;
  var controller;
  var deferred;
  var $uibModal;

  var element;

  var inj = {
    "uibModal" : null,
  }

  //beforeEach(module("$uibModal"))

  beforeEach(angular.mock.module('hamlTemplates'));
  beforeEach(angular.mock.module('ui.bootstrap'))

  beforeEach(angular.mock.module('cloudStorm.localizationProvider'));
  beforeEach(angular.mock.module('cloudStorm.resource'))
  beforeEach(angular.mock.module('cloudStorm.alertService'));
  beforeEach(angular.mock.module('cloudStorm.restApi'));
  beforeEach(angular.mock.module('cloudStorm.dataStore'));
  beforeEach(angular.mock.module('cloudStorm.settings'));
  beforeEach(angular.mock.module('cloudStorm.descriptorService'))
  beforeEach(angular.mock.module('cloudStorm.resourceService'))
  //beforeEach(angular.mock.module('cloudStorm.routeProvider'))
  beforeEach(angular.mock.module('cloudStorm.index'));

  var civilizationRaw = "{\"name\":\"Civilization\",\"type\":\"civilizations\",\"hint\":\"list\",\"base_url\":\"http://web.csnodeapptemplate.docker\",\"endpoint\":\"api/v1/civilizations\",\"fields\":[{\"attribute\":\"id\",\"cardinality\":\"one\",\"label\":\"Identifier\",\"read_only\":true,\"required\":false,\"type\":\"integer\"},{\"attribute\":\"name\",\"cardinality\":\"one\",\"label\":\"Name\",\"read_only\":false,\"required\":true,\"type\":\"string\"},{\"attribute\":\"kardashev_scale\",\"cardinality\":\"one\",\"label\":\"Kardashev Scale\",\"read_only\":false,\"required\":false,\"type\":\"string\"},{\"attribute\":\"data\",\"cardinality\":\"one\",\"label\":\"Data\",\"read_only\":false,\"required\":false,\"type\":\"code\"},{\"attribute\":\"planets\",\"cardinality\":\"many\",\"label\":\"Planets\",\"read_only\":false,\"required\":false,\"relationship\":\"planets\",\"resource\":\"planets\",\"type\":\"resource\"},{\"attribute\":\"home_planet_id\",\"cardinality\":\"one\",\"label\":\"Home Planet\",\"read_only\":false,\"required\":false,\"relationship\":\"home_planet\",\"resource\":\"planets\",\"type\":\"resource\"},{\"attribute\":\"created_at\",\"cardinality\":\"one\",\"label\":\"Created at\",\"read_only\":false,\"required\":false,\"type\":\"datetime\"},{\"attribute\":\"updated_at\",\"cardinality\":\"one\",\"label\":\"Updated at\",\"read_only\":false,\"required\":false,\"type\":\"datetime\"},{\"attribute\":\"deleted_at\",\"cardinality\":\"one\",\"label\":\"Deleted at\",\"read_only\":false,\"required\":false,\"type\":\"datetime\"}],\"attributes_to_hide\":{\"create\":[\"id\",\"created_at\",\"updated_at\",\"deleted_at\"],\"edit\":[\"id\",\"created_at\",\"updated_at\",\"deleted_at\"],\"index\":[\"deleted_at\"],\"show\":[]},\"display\":{\"name\":\"name\"}}";

  var civilization = JSON.parse(civilizationRaw)

  var myService, ResourceService;
  var csDescriptorService;

  beforeEach(inject(function($q, _$uibModal_, _csDescriptorService_, _ResourceService_){

    inj.uibModal = _$uibModal_
    csDescriptorService = _csDescriptorService_
    csDescriptorService.registerDescriptor(civilization)

    ResourceService = _ResourceService_
    var data = ['something', 'on', 'success'];
    deferred = $q.defer()
    deferred.resolve(data);
    spyOn(csDescriptorService, 'getPromises').and.returnValue(deferred.promise);
  }))

  //Test injected modules
  for(key in inj){
    it(key + " is defined", function(){
      expect(inj[key]).toBeDefined()
    })
  }

  it('ResourceService defined', function(){
    expect(ResourceService).toBeDefined()
  })

  it('DescriptorService defined', function(){
    expect(csDescriptorService).toBeDefined()
  })

  beforeEach(inject(function(_$compile_, _$rootScope_, $componentController){

    // loadDataSpy = jasmine.createSpy('loadData');
    // var scope = _$rootScope_.$new()
    // indexController = $componentController("csIndex", {
    //   scope : scope
    // }, null);
    //
    // // loadDataSpy = jasmine.createSpy('loadData');
    // // indexController = _$componentController_("csIndex", null, {
    // //   loadData : loadDataSpy
    // // });
    // csDescriptorService.registerDescriptor(civilization)

    //scope = _$rootScope_.$new();
    //element = angular.element('<cs-index resource="resource"></cs-index>');
    //element = _$compile_(element)(scope);

    // //Setting scope variables
    //scope.resourceType = "civilizations" //= ResourceService.get("civilizations")
    //scope.resourceType = ResourceService.get("civilizations")
    //scope.$apply();
    // controller = element.controller('csFilterRow');
  }))

  //Index component controller
  // beforeEach(inject(function($rootScope, $componentController, $uibModal, $compile){
  //
  //   uibModal = $uibModal
  //   scope = $rootScope.$new()
  //   csIndex = $componentController('csIndex', {
  //     $scope: scope,
  //     csDescriptorService: csDescriptorService,
  //     $uibModal : inj.uibModal,
  //     //ResourceService: ResourceService,
  //     $element: angular.element('<div></div>')
  //       }, {
  //     resourceType: "civilizations"
  //   });
  //   csIndex.$onInit()
  // }))


  beforeEach(inject(function($compile, $rootScope, $componentController){

    scope = $rootScope.$new();
    element = angular.element('<cs-index resource="resource"></cs-index>');
    //angular.extend(scope, _$uibModal_)
    element = $compile(element)(scope);

    //Setting scope variables
    scope.resource = ResourceService.get("civilizations")
    scope.$apply();
    controller = element.controller('csIndex');
  }))

  it('csIndex controller', function(){
    expect(controller).toBeDefined()
  })

  it('Header text', function(){
    expect(element.html()).toContain("Civilization");
  })

  // it('refresh button', function(){
  //   element[0].querySelector('#refreshButton').click()
  // })

  // it('index controller', function(){
  //   expect(indexController).toBeDefined()
  // })

  //   it('csIndex existlist', function(){
  //     expect(csIndex).toBeDefined()
  //   it('csIndex contains filter row header', function(){
  //     expect(element.html()).toContain("Civilization");
  //    })
  //
  //   it('loadData runs', function(){
  //     expect(loadDataSpy).toHaveBeenCalled()
  //   })
  //   // it('loadData runs', function(){
  //   //   expect(loadDataSpy).toHaveBeenCalled()
  //   // })


})
