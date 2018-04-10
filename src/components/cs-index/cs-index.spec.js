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
  var scope;
  var element;

  var inj = {
    "uibModal" : null,
  }

  //beforeEach(module("$uibModal"))

  beforeEach(angular.mock.module('hamlTemplates'));
  beforeEach(angular.mock.module('ui.bootstrap'))
  beforeEach(angular.mock.module('ui.router'))

  beforeEach(angular.mock.module('cloudStorm.log'));
  beforeEach(angular.mock.module('cloudStorm.localizationProvider'));
  beforeEach(angular.mock.module('cloudStorm.resource'))
  beforeEach(angular.mock.module('cloudStorm.alertService'));
  beforeEach(angular.mock.module('cloudStorm.restApi'));
  beforeEach(angular.mock.module('cloudStorm.dataStore'));

  beforeEach(angular.mock.module('cloudStorm.settings'));
  beforeEach(angular.mock.module('cloudStorm.routeProvider'))

  beforeEach(angular.mock.module('cloudStorm.descriptorService'))
  beforeEach(angular.mock.module('cloudStorm.resourceService'))
  beforeEach(angular.mock.module('cloudStorm.index'));

  var civilizationRaw = "{\"name\":\"Civilization\",\"type\":\"civilizations\",\"hint\":\"list\",\"base_url\":\"http://web.csnodeapptemplate.docker\",\"endpoint\":\"api/v1/civilizations\",\"fields\":[{\"attribute\":\"id\",\"cardinality\":\"one\",\"label\":\"Identifier\",\"read_only\":true,\"required\":false,\"type\":\"integer\"},{\"attribute\":\"name\",\"cardinality\":\"one\",\"label\":\"Name\",\"read_only\":false,\"required\":true,\"type\":\"string\"},{\"attribute\":\"kardashev_scale\",\"cardinality\":\"one\",\"label\":\"Kardashev Scale\",\"read_only\":false,\"required\":false,\"type\":\"string\"},{\"attribute\":\"data\",\"cardinality\":\"one\",\"label\":\"Data\",\"read_only\":false,\"required\":false,\"type\":\"code\"},{\"attribute\":\"planets\",\"cardinality\":\"many\",\"label\":\"Planets\",\"read_only\":false,\"required\":false,\"relationship\":\"planets\",\"resource\":\"planets\",\"type\":\"resource\"},{\"attribute\":\"home_planet_id\",\"cardinality\":\"one\",\"label\":\"Home Planet\",\"read_only\":false,\"required\":false,\"relationship\":\"home_planet\",\"resource\":\"planets\",\"type\":\"resource\"},{\"attribute\":\"created_at\",\"cardinality\":\"one\",\"label\":\"Created at\",\"read_only\":false,\"required\":false,\"type\":\"datetime\"},{\"attribute\":\"updated_at\",\"cardinality\":\"one\",\"label\":\"Updated at\",\"read_only\":false,\"required\":false,\"type\":\"datetime\"},{\"attribute\":\"deleted_at\",\"cardinality\":\"one\",\"label\":\"Deleted at\",\"read_only\":false,\"required\":false,\"type\":\"datetime\"}],\"attributes_to_hide\":{\"create\":[\"id\",\"created_at\",\"updated_at\",\"deleted_at\"],\"edit\":[\"id\",\"created_at\",\"updated_at\",\"deleted_at\"],\"index\":[\"deleted_at\"],\"show\":[]},\"display\":{\"name\":\"name\"}}";

  var civilization = JSON.parse(civilizationRaw)

  var myService, ResourceService;
  var csDescriptorService;

  beforeEach(inject(function($q, _$state_, _$uibModal_, _csDescriptorService_, _ResourceService_){

    var $state = _$state_
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

  //Load some data into the cs-index
  // beforeEach(inject(function($q){
  //
  //   //Create mock for the loadData promise
  //
  //   scope.resource = ResourceService.get('civilizations')
  //
  //
  //   var deferred = $q.defer()
  //
  //   var data = ['something', 'on', 'success'];
  //   deferred.resolve(data);
  //   spyOn(resource, '$index').and.returnValue(deferred.promise);
  //   //The Resource function gets a mock
  //
  // }))

  beforeEach(inject(function($rootScope, $componentController, $uibModal, $compile){

    uibModal = $uibModal
    scope = $rootScope.$new()
    csIndex = $componentController('csIndex', {
      $scope: scope,
      csDescriptorService: csDescriptorService,
      $uibModal : inj.uibModal,
      //ResourceService: ResourceService,
      $element: angular.element('<div></div>')
        }, {
      resourceType: "civilizations"
    });
    csIndex.$onInit()
  }))

  it('csIndex controller existist', function(){
    expect(csIndex).toBeDefined()
  })

  it('csIndex controller existist', function(){
    expect(csIndex.kutya).toBeDefined()
  })

  it('csIndex controller existist', function(){
    expect(csIndex.kutya).toBe("Mutya")
  })

  beforeEach(inject(function($q, $compile, $rootScope, $componentController){

    scope = $rootScope.$new();
    element = angular.element('<cs-index resource="resource"></cs-index>');
    element = $compile(element)(scope);

    //Setting scope variables
    scope.resource = ResourceService.get("civilizations")
    //spyOn(scope.resource, '$index')
    scope.$apply();
    controller = element.controller('csIndex');

    //controller.service("csDescriptorService", csDescriptorService)
    // descriptorService.registerDescriptor(civilization)
    // var def = $q.defer()
    // def.resolve("someThing");
    // spyOn(descriptorService, 'getPromises').and.returnValue(def.promise);
    //contoller['inject'] = [csDescriptorService]

  }))

  it('csIndex controller', function(){
    expect(controller).toBeDefined()
  })

  it('csIndex element', function(){
    expect(element).toBeDefined()
  })

  it('Header text', function(){
    expect(element.html()).toContain("Civilization");
  })

  // it('call $onInit', function(){
  //   spyOn(controller, 'loadData')
  //   scope.$digest()
  //   controller.injector("csDescriptorService", [csDescriptorService])
  //   controller.$onInit()
  //   expect(controller.loadData).toHaveBeenCalled()
  // })

  it('call controller function', function(){
    spyOn(controller, 'openNewResourcePanel')
    scope.$digest()
    controller.openNewResourcePanel()
    expect(controller.openNewResourcePanel).toHaveBeenCalled()
  })

  it('call show function', function(){

  })

  // var indexClickTests = {
  //   "testClick": "openNewResourcePanel"
  // }
  //
  //
  // var xElement = element
  // var xController = controller
  // for(buttonID in indexClickTests){
  //
  //   console.log(angular.isArray(element))
  //   it('#' + buttonID + " - exists!", function(){
  //     expect(xElement[0].querySelector('#' + buttonID)).toBeDefined();
  //   })
  //
  //   var indexFcn = indexClickTests[buttonID]
  //   it('#' + buttonID + ' - click works!', function(){
  //     spyOn(controller, indexFcn)
  //     scope.$digest()
  //     xElement[0].querySelector('#' + buttonID).click()
  //     expect(xController[indexFcn]).toHaveBeenCalled();
  //   })
  // }

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
