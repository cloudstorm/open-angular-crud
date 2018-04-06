describe('csFilterRow', function(){

  var compile, $rootScope, $component, controller, csFilterRow;

  var ResourceService;
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

  var civilizationRaw = "{\"name\":\"Civilization\",\"type\":\"civilizations\",\"hint\":\"list\",\"base_url\":\"http://web.csnodeapptemplate.docker\",\"endpoint\":\"api/v1/civilizations\",\"fields\":[{\"attribute\":\"id\",\"cardinality\":\"one\",\"label\":\"Identifier\",\"read_only\":true,\"required\":false,\"type\":\"integer\"},{\"attribute\":\"name\",\"cardinality\":\"one\",\"label\":\"Name\",\"read_only\":false,\"required\":true,\"type\":\"string\"},{\"attribute\":\"kardashev_scale\",\"cardinality\":\"one\",\"label\":\"Kardashev Scale\",\"read_only\":false,\"required\":false,\"type\":\"string\"},{\"attribute\":\"data\",\"cardinality\":\"one\",\"label\":\"Data\",\"read_only\":false,\"required\":false,\"type\":\"code\"},{\"attribute\":\"planets\",\"cardinality\":\"many\",\"label\":\"Planets\",\"read_only\":false,\"required\":false,\"relationship\":\"planets\",\"resource\":\"planets\",\"type\":\"resource\"},{\"attribute\":\"home_planet_id\",\"cardinality\":\"one\",\"label\":\"Home Planet\",\"read_only\":false,\"required\":false,\"relationship\":\"home_planet\",\"resource\":\"planets\",\"type\":\"resource\"},{\"attribute\":\"created_at\",\"cardinality\":\"one\",\"label\":\"Created at\",\"read_only\":false,\"required\":false,\"type\":\"datetime\"},{\"attribute\":\"updated_at\",\"cardinality\":\"one\",\"label\":\"Updated at\",\"read_only\":false,\"required\":false,\"type\":\"datetime\"},{\"attribute\":\"deleted_at\",\"cardinality\":\"one\",\"label\":\"Deleted at\",\"read_only\":false,\"required\":false,\"type\":\"datetime\"}],\"attributes_to_hide\":{\"create\":[\"id\",\"created_at\",\"updated_at\",\"deleted_at\"],\"edit\":[\"id\",\"created_at\",\"updated_at\",\"deleted_at\"],\"index\":[\"deleted_at\"],\"show\":[]},\"display\":{\"name\":\"name\"}}";

  var civilization = JSON.parse(civilizationRaw)

  var myService;
  var csDescriptorService;

  beforeEach(inject(function($q, _csDescriptorService_, _ResourceService_){
    deferred = $q.defer()
    csDescriptorService = _csDescriptorService_
    csDescriptorService.registerDescriptor(civilization)

    ResourceService = _ResourceService_
    //spyOn(csDescriptorService, '$onInit').and.callThrough();
    var data = ['something', 'on', 'success'];
    deferred.resolve(data);
    spyOn(csDescriptorService, 'getPromises').and.returnValue(deferred.promise);
  }))

  it("descriptorService", function(){
    expect(csDescriptorService).toBeDefined()
  })

  beforeEach(inject(function($rootScope, $componentController, $compile){

    scope = $rootScope.$new()

    csFilterRow = $componentController('csFilterRow', {
      $scope: scope,
      csDescriptorService: csDescriptorService,
      $element: angular.element('<div></div>')
        }, {
      resourceType: "civilizations"
    });
    csFilterRow.$onInit()
  }))

  it('getPromises called', function(){
    expect(csDescriptorService.getPromises).toHaveBeenCalled();
  })

  it('csFilterRow controller exists', function(){
    expect(csFilterRow).toBeDefined();
  })

  beforeEach(inject(function(){
    //This line makes the csDescriptorService.getPromises promise to run
    deferred.resolve();
    //The csFilterRow controller runs the $onInit()
    scope.$digest();
  }))

  it('csFilterRow resource exists', function(){
    //It is set in the $onInit
    expect(csFilterRow.resource).toBeDefined()
  })

  it('csFilterRow resource type matches', function(){
    expect(csFilterRow.resource.descriptor.type).toBe("civilizations")
  })

  /*
   * Component testing
   */
   var controller;
  beforeEach(inject(function($rootScope, $compile){

    scope = $rootScope.$new();
    element = angular.element('<cs-filter-row resource="resource", ></cs-filterRow>');
    element = $compile(element)(scope);

    //Setting scope variables
    scope.resource = ResourceService.get("civilizations")
    scope.$apply();
    //
    // scope.ctrl = {
    //   callback: jasmine.createSpy('callback')
    // };


  }))


  it('Header text', function(){
    expect(element.html()).toContain("Civilization");
  })

  var refreshButton
  it('Find refresh button text', function(){
    refreshButton = element[0].querySelector('#refreshButton')
    expect(refreshButton).toBeDefined();
  })
  //

  it('Find refresh button text II', function(){
    controller = element.controller('csFilterRow');
    console.log("Controller", controller)
    //controller.refreshIndexII = jasmine.createSpy('refreshIndexII')

    spyOn(controller, "refreshIndexII")
    scope.$digest()
    element[0].querySelector('#refreshButton').click()

    expect(controller.refreshIndexII).toHaveBeenCalled();
  })



})
