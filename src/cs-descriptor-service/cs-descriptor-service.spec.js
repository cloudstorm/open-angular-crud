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


  var civilization = {
    "name": "civilization",
    "attributes": [
      { "name": "name", "type": "string", "required": true },
      { "name": "kardashev_scale", "type": "string" },
      { "name": "data", "type": "jsonb" }
    ],
    "relationships": [
      { "name": "planets", "type": "has_many", "target": "planet", "foreign_key": "civilization_id" },
      { "name": "home_planet", "type": "belongs_to", "target": "planet", "foreign_key": "home_planet_id" }
    ],
    "options": {
      "paranoid": true
    }
  }
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

})
