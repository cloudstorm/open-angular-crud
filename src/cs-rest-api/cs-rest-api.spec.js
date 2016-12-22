describe('csRestApi', function() {
  var csRestApi;
  var $q;
  //var deferred;
  var $rootScope;
  var $httpBackend;

  beforeEach(angular.mock.module('cloudStorm.restApi'));

  beforeEach(inject(function (_csRestApi_, _$q_, _$rootScope_, _$httpBackend_) {
    csRestApi = _csRestApi_;
    $q = _$q_;
    $rootScope =  _$rootScope_;
    $httpBackend = _$httpBackend_;
  }));

  it('should exist', function() {
    expect(csRestApi).toBeDefined();
  });

  it('should return data for "index"', function() {
    var data;
    var deferred = $q.defer();
    var promise = deferred.promise;
    promise.then(function (response) {
      data = response.success;
    });

    $httpBackend.expect('GET', '/my-backend-endpoint');
    $httpBackend.whenGET('/my-backend-endpoint').respond({
      success: {
        elements: [1, 2, 3]
      }
    });

    csRestApi.index('/my-backend-endpoint', {}).then(function(response) {
      deferred.resolve(response);
    });

    // flush is required for the promise to be resolved
    $httpBackend.flush();

    expect(data).toEqual({ elements: [1, 2, 3] });
  });

  it('should return data for "get"', function() {
    var data;
    var deferred = $q.defer();
    var promise = deferred.promise;
    promise.then(function (response) {
      data = response.success;
    });

    $httpBackend.expect('GET', '/my-backend-endpoint');
    $httpBackend.whenGET('/my-backend-endpoint').respond({
      success: {
        elements: [1, 2, 3]
      }
    });

    csRestApi.get('/my-backend-endpoint', {}).then(function(response) {
      deferred.resolve(response);
    });

    // flush is required for the promise to be resolved
    $httpBackend.flush();

    expect(data).toEqual({ elements: [1, 2, 3] });
  });

  it('should return data for "update"', function() {
    var data;
    var deferred = $q.defer();
    var promise = deferred.promise;
    promise.then(function (response) {
      data = response.success;
    });

    $httpBackend.expect('PATCH', '/my-backend-endpoint');
    $httpBackend.whenPATCH('/my-backend-endpoint').respond({
      success: {
        elements: [1, 2, 3]
      }
    });

    csRestApi.update('/my-backend-endpoint', {}).then(function(response) {
      deferred.resolve(response);
    });

    // flush is required for the promise to be resolved
    $httpBackend.flush();

    expect(data).toEqual({ elements: [1, 2, 3] });
  });

  it('should return data for "create"', function() {
    var data;
    var deferred = $q.defer();
    var promise = deferred.promise;
    promise.then(function (response) {
      data = response.success;
    });

    $httpBackend.expect('POST', '/my-backend-endpoint');
    $httpBackend.whenPOST('/my-backend-endpoint').respond({
      success: {
        elements: [1, 2, 3]
      }
    });

    csRestApi.create('/my-backend-endpoint', {}).then(function(response) {
      deferred.resolve(response);
    });

    // flush is required for the promise to be resolved
    $httpBackend.flush();

    expect(data).toEqual({ elements: [1, 2, 3] });
  });

  it('should return data for "destroy"', function() {
    var data;
    var deferred = $q.defer();
    var promise = deferred.promise;
    promise.then(function (response) {
      data = response.success;
    });

    $httpBackend.expect('DELETE', '/my-backend-endpoint');
    $httpBackend.whenDELETE('/my-backend-endpoint').respond({
      success: {
        elements: [1, 2, 3]
      }
    });

    csRestApi.destroy('/my-backend-endpoint', {}).then(function(response) {
      deferred.resolve(response);
    });

    // flush is required for the promise to be resolved
    $httpBackend.flush();

    expect(data).toEqual({ elements: [1, 2, 3] });
  });

  it('should signal error for "index" when http call fails', function() {
    var data;
    var deferred = $q.defer();
    var promise = deferred.promise;
    promise.then(function (response) {
      data = response;
    });

    $httpBackend.expect('GET', '/my-backend-endpoint');
    $httpBackend.whenGET('/my-backend-endpoint').respond(500, { error: 'message' });

    csRestApi.index('/my-backend-endpoint', {}).catch(function(response) {
      deferred.resolve(response);
    });

    // flush is required for the promise to be resolved
    $httpBackend.flush();

    expect(data).toEqual({ error: 'message' });
  });

  it('should signal error for "get" when http call fails', function() {
    var data;
    var deferred = $q.defer();
    var promise = deferred.promise;
    promise.then(function (response) {
      data = response;
    });

    $httpBackend.expect('GET', '/my-backend-endpoint');
    $httpBackend.whenGET('/my-backend-endpoint').respond(500, { error: 'message' });

    csRestApi.get('/my-backend-endpoint', {}).catch(function(response) {
      deferred.resolve(response);
    });

    // flush is required for the promise to be resolved
    $httpBackend.flush();

    expect(data).toEqual({ error: 'message' });
  });

  it('should signal error for "update" when http call fails', function() {
    var data;
    var deferred = $q.defer();
    var promise = deferred.promise;
    promise.then(function (response) {
      data = response;
    });

    $httpBackend.expect('PATCH', '/my-backend-endpoint');
    $httpBackend.whenPATCH('/my-backend-endpoint').respond(500, { error: 'message' });

    csRestApi.update('/my-backend-endpoint', {}).catch(function(response) {
      deferred.resolve(response);
    });

    // flush is required for the promise to be resolved
    $httpBackend.flush();

    expect(data).toEqual({ data: { error: 'message' }, status: 500 });
  });

  it('should signal error for "create" when http call fails', function() {
    var data;
    var deferred = $q.defer();
    var promise = deferred.promise;
    promise.then(function (response) {
      data = response;
    });

    $httpBackend.expect('POST', '/my-backend-endpoint');
    $httpBackend.whenPOST('/my-backend-endpoint').respond(500, { error: 'message' });

    csRestApi.create('/my-backend-endpoint', {}).catch(function(response) {
      deferred.resolve(response);
    });

    // flush is required for the promise to be resolved
    $httpBackend.flush();

    expect(data).toEqual({ data: { error: 'message' }, status: 500 });
  });

  it('should signal error for "destroy" when http call fails', function() {
    var data;
    var deferred = $q.defer();
    var promise = deferred.promise;
    promise.then(function (response) {
      data = response;
    });

    $httpBackend.expect('DELETE', '/my-backend-endpoint');
    $httpBackend.whenDELETE('/my-backend-endpoint').respond(500, { error: 'message' });

    csRestApi.destroy('/my-backend-endpoint', {}).catch(function(response) {
      deferred.resolve(response);
    });

    // flush is required for the promise to be resolved
    $httpBackend.flush();

    expect(data).toEqual({ data: { error: 'message' }, status: 500 });
  });
});
