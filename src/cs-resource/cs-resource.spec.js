describe('csResource', function() {
  var csResource;
  var $q;
  var $httpBackend;
  var csDataStore;
  var User;

  // extend function: TODO: should be part of cloudstorm? More like part of the resource generator service, which can turn JSON files into angular resources...
  const extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; }, hasProp = {}.hasOwnProperty;
  const registerUserResource = function () {
    User = (function(superClass) {
      extend(User, superClass);

      function User() {
        return User.__super__.constructor.apply(this, arguments);
      }

      User.endpoint = 'api/v1/users';
      User.base_url = '/base';

      User.descriptor = {
        type: 'users',
        name: 'User',
        fields: [
          {
            attribute: 'email',
            label: 'email',
            type: 'string',
            cardinality: 'one',
            required: false,
            read_only: false
          }
        ],
        display: {
          name: 'email'
        }
      };

      return User;

    })(csResource);
  };
  const users = {
    data: [
      {
        attributes: {
          email: 'test1',
          id: 1
        },
        id: '1',
        links: {
          self: {
            href: '/api/v1/users/1'
          }
        },
        type: 'users'
      },
      {
        attributes: {
          email: 'test2',
          id: 2
        },
        id: '2',
        links: {
          self: {
            href: '/api/v1/users/2'
          }
        },
        type: 'users'
      }
    ]
  }
  const scopedUsers = {
    data: [
      {
        attributes: {
          email: 'test1',
          id: 1
        },
        id: '1',
        links: {
          self: {
            href: '/api/v1/users/1'
          }
        },
        type: 'users'
      }
    ]
  }

  beforeEach(angular.mock.module('cloudStorm.resourceService'));
  beforeEach(angular.mock.module('cloudStorm.restApi'));
  beforeEach(angular.mock.module('cloudStorm.dataStore'));
  beforeEach(angular.mock.module('cloudStorm.localizationProvider'));
  beforeEach(angular.mock.module('cloudStorm.dataOpsProvider'));
  beforeEach(angular.mock.module('cloudStorm.settings'));
  beforeEach(angular.mock.module('cloudStorm.resource'));

  beforeEach(inject(function (_csResource_, _ResourceService_, _$q_, _$httpBackend_, _csDataStore_) {
    csResource = _csResource_;
    $q = _$q_;
    $httpBackend = _$httpBackend_;
    csDataStore = _csDataStore_;
  }));

  it('should exist', function() {
    expect(csResource).toBeDefined();
  });

  it('should return a list of resources for "$index" - global datastore', function() {
    registerUserResource();
    var data;
    var deferred = $q.defer();
    var promise = deferred.promise;
    promise.then(function (response) {
      data = response;
    });

    $httpBackend.whenGET('/base/api/v1/users').respond(users);

    // get index from User resource
    User.$index(undefined, {datastore: csDataStore.global()}).then(function(response) {
      deferred.resolve(response);
    });

    // flush is required for the promise to be resolved
    $httpBackend.flush();

    // check if users are retrieved
    expect(data[0].id).toEqual('1');
    expect(data[0].type).toEqual('users');
    expect(data[0].attributes).toEqual({email: 'test1', id: 1});

    expect(data[1].id).toEqual('2');
    expect(data[1].type).toEqual('users');
    expect(data[1].attributes).toEqual({email: 'test2', id: 2});

    // Users should be available in global datastore
    expect(data[0]).toEqual(csDataStore.global().get('users', 1));
    expect(data[1]).toEqual(csDataStore.global().get('users', 2));
  });

  it('should return a list of resources for "$index" ', function() {
    registerUserResource();
    var data;
    var deferred = $q.defer();
    var promise = deferred.promise;
    promise.then(function (response) {
      data = response;
    });

    $httpBackend.expectGET('/base/api/v1/users/only-the-first?a=n&include=*');
    $httpBackend.whenGET('/base/api/v1/users/only-the-first?a=n&include=*').respond(scopedUsers);

    // get index from User resource
    User.$index({include: '*'}, {scope: 'only-the-first', query: {a: 'n'}}).then(function(response) {
      deferred.resolve(response);
    });

    // flush is required for the promise to be resolved
    $httpBackend.flush();

    // check if users are retrieved
    expect(data[0].id).toEqual('1');
    expect(data[0].type).toEqual('users');
    expect(data[0].attributes).toEqual({email: 'test1', id: 1});
    expect(data[1]).not.toBeDefined();
  });

});
