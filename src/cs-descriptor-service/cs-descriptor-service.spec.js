describe('csDescriptorService', function(){

  var csDescriptorService, csResourceService;
  var $q, $http;

  beforeEach(angular.mock.module('cloudStorm.localizationProvider'));
  beforeEach(angular.mock.module('cloudStorm.resourceService'));
  beforeEach(angular.mock.module('cloudStorm.resource'))
  beforeEach(angular.mock.module('cloudStorm.restApi'));
  beforeEach(angular.mock.module('cloudStorm.dataStore'));
  beforeEach(angular.mock.module('cloudStorm.settings'));
  beforeEach(angular.mock.module('cloudStorm.descriptorService'))

  var civilizationRaw = "{\"name\":\"Civilization\",\"type\":\"civilizations\",\"hint\":\"list\",\"base_url\":\"http://web.csnodeapptemplate.docker\",\"endpoint\":\"api/v1/civilizations\",\"fields\":[{\"attribute\":\"id\",\"cardinality\":\"one\",\"label\":\"Identifier\",\"read_only\":true,\"required\":false,\"type\":\"integer\"},{\"attribute\":\"name\",\"cardinality\":\"one\",\"label\":\"Name\",\"read_only\":false,\"required\":true,\"type\":\"string\"},{\"attribute\":\"kardashev_scale\",\"cardinality\":\"one\",\"label\":\"Kardashev Scale\",\"read_only\":false,\"required\":false,\"type\":\"string\"},{\"attribute\":\"data\",\"cardinality\":\"one\",\"label\":\"Data\",\"read_only\":false,\"required\":false,\"type\":\"code\"},{\"attribute\":\"planets\",\"cardinality\":\"many\",\"label\":\"Planets\",\"read_only\":false,\"required\":false,\"relationship\":\"planets\",\"resource\":\"planets\",\"type\":\"resource\"},{\"attribute\":\"home_planet_id\",\"cardinality\":\"one\",\"label\":\"Home Planet\",\"read_only\":false,\"required\":false,\"relationship\":\"home_planet\",\"resource\":\"planets\",\"type\":\"resource\"},{\"attribute\":\"created_at\",\"cardinality\":\"one\",\"label\":\"Created at\",\"read_only\":false,\"required\":false,\"type\":\"datetime\"},{\"attribute\":\"updated_at\",\"cardinality\":\"one\",\"label\":\"Updated at\",\"read_only\":false,\"required\":false,\"type\":\"datetime\"},{\"attribute\":\"deleted_at\",\"cardinality\":\"one\",\"label\":\"Deleted at\",\"read_only\":false,\"required\":false,\"type\":\"datetime\"}],\"attributes_to_hide\":{\"create\":[\"id\",\"created_at\",\"updated_at\",\"deleted_at\"],\"edit\":[\"id\",\"created_at\",\"updated_at\",\"deleted_at\"],\"index\":[\"deleted_at\"],\"show\":[]},\"display\":{\"name\":\"name\"}}";

  var civilization = JSON.parse(civilizationRaw)

  console.log("Civilization I")
  console.log(JSON.stringify(civilization))

  // beforeEach(inject(function (_ResourceService_) {
  //   csResourceService = _ResourceService_;
  // }));
  //
  // it('should exist', function() {
  //   expect(csResourceService).toBeDefined();
  // });


  beforeEach(inject(function(_csDescriptorService_, _ResourceService_){
    //console.log(_csDescriptorService_)
    csResourceService = _ResourceService_
    csDescriptorService = _csDescriptorService_
  }))

  // beforeEach(inject(function(){
  //   //console.log(_csDescriptorService_)
  //   csResourceService = _csResourceService_
  // }))

  it('csDescriptorService exists', function(){
    expect(csDescriptorService).toBeDefined();
  })

  it('resourceService exists', function(){
    expect(csResourceService).toBeDefined();
  })

  it('registerTestDescriptor', function(){
    var civResource = csDescriptorService.registerDescriptor(civilization)
    expect(csResourceService.get("civilizations").descriptor.type).toEqual(civilization.type)
  })

})
