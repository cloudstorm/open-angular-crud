describe('csFilterRow', function(){

  var compile, $rootScope, $component, controller, csFilterRow;

  var csResourceService;
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
  var deferred;
  var csDescriptorService;

  beforeEach(inject(function($q, _csDescriptorService_, _ResourceService_){
    deferred = $q.defer()
    csDescriptorService = _csDescriptorService_
    csDescriptorService.registerDescriptor(civilization)

    csResourceService = _ResourceService_
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
      $element: angular.element('<cs-filter-row></cs-filter-row>'),
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

  it('set Descriptor setting', function(){
    var data = ['something', 'on', 'success'];
    deferred.resolve(data);
    scope.$digest();
    expect(csFilterRow.resource).toBeDefined()
    //expect(csFilterRow.resource.descriptor.type).toBe("civilizations")
  })

  // beforeEach(inject(function($rootScope, $componentController, $compile){
  //
  //   scope = $rootScope.$new()
  //   csFilterRow = $componentController('csFilterRow', {
  //     $scope: scope,
  //     csDescriptorService: csDescriptorService,
  //     $element: angular.element('<cs-filter-row></cs-filter-row>'),
  //   }, {
  //
  //   });
  //   csFilterRow.$onInit()
  // }))

  it('create resource', function(){

    //expect(csFilterRow.x).toBe("x")
    civResource = csDescriptorService.registerDescriptor(civilization)
    //expect(csResourceService.get("civilizations").descriptor.type).toEqual(civilization.type)
  })




  // var element, rootScope;
  // beforeEach(inject(function($rootScope, $compile){
  //
  //   rootScope = $rootScope
  //   scope = $rootScope.$new();
  //   element = angular.element('<cs-filter-row resource="inputresource"></cs-filter-row>');
  //   //element = angular.element('<cs-filter-row></cs-filter-row>');
  //   element = $compile(element)(scope);
  //   scope.outside = '1.5';
  //
  //   scope.inputresource = {
  //     descriptor : {
  //       name : "Kutya"
  //     }
  //   }
  //   scope.$apply();
  //
  // }));
  //
  // it('UI test', function(){
  //   rootScope.$digest()
  //   expect(element.html()).toContain("Kutya");
  // })
})
