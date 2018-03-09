describe('ResourceService - TODO: rename to csResourceService?', function() {

  var csResourceService;
  var csResourceOperation;

  beforeEach(angular.mock.module('cloudStorm.resourceService'));
  beforeEach(angular.mock.module('cloudStorm.resourceOperation'));
  beforeEach(angular.mock.module('cloudStorm.restApi'));

  beforeEach(module(function($provide) {
  $provide.value("userResource", { data: 'test' });
  }));

  beforeEach(inject(function (_ResourceService_){ // _csResourceOperation_) {
    csResourceService = _ResourceService_;
    //csResourceOperation = _csResourceOperation_;
  }));

  it('should exist', function() {
    expect(csResourceService).toBeDefined();
  });

  it('should return the registered resource service object', function() {
    expect(csResourceService).toBeDefined();
    csResourceService.register('name', 'resource service object');
    expect(csResourceService.get('name')).toEqual('resource service object');
  });

  it('should throw error when it cannot auto-infer the resource service', function() {
    expect(csResourceService).toBeDefined();
    expect(function() { csResourceService.get('name'); }).toThrowError(/CS-001:/);
  });

  it('should auto-infer the resource service from name', function() {
    expect(csResourceService).toBeDefined();
    expect(csResourceService.get('user')).toEqual({ data: 'test' });
  });
});
