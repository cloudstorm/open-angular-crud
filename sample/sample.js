var app = angular.module('cloudStormSample', [
  'cloudStorm',
  'cloudStormSample.resources'
]);

var my_extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

app.controller('MainCtrl', function($scope, csAlertService, csDescriptorService) {
  csDescriptorService.addDescriptor('ItemResourceDescriptor.json');
  //csDescriptorService.registerDescriptor('ItemResourceDescriptor.json');

  csAlertService.addAlert('Welcome to CloudStorm', 'info');
  // Dummy
  $scope.world = 'Worlds';
  $scope.resourceType = 'items';



});

angular.module('cloudStormSample.resources', [
  'cloudStormSample.resources.categories',
  'cloudStormSample.resources.user'
]);

angular.module('cloudStormSample.resources.categories', ['cloudStorm.restApi']).factory('categoriesResource', [
  'ResourceService', 'csRestApi', 'csResource', function(ResourceService, csRestApi, csResource) {
    var Category;
    Category = (function(superClass) {
      my_extend(Category, superClass);

      function Category() {
        return Category.__super__.constructor.apply(this, arguments);
      }

      Category.endpoint = 'api/v1/categories';
      Category.base_url = 'https://demo.cloudstorm.io';

      Category.descriptor = {
        type: 'categories',
        name: 'Category',
        hint: 'list',
        fields: [
          {
            attribute: 'name',
            label: 'name',
            type: 'string',
            cardinality: 'one',
            required: true,
            read_only: false
          }
        ],
        display: {
          name: 'name',
          search: 'name_x_cont'
        }
      };

      return Category;

    })(csResource);
    ResourceService.register(Category.descriptor.type, Category);
    return Category;
  }
]);

angular.module('cloudStormSample.resources.user', ['cloudStorm.restApi']).factory('usersResource', [
  'ResourceService', 'csRestApi', 'csResource', function(ResourceService, csRestApi, csResource) {
    var User;
    User = (function(superClass) {
      my_extend(User, superClass);

      function User() {
        return User.__super__.constructor.apply(this, arguments);
      }

      User.endpoint = 'api/v1/users';
      User.base_url = 'https://demo.cloudstorm.io';

      User.descriptor = {
        type: 'users',
        name: 'User',
        hint: 'list',
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
          name: 'email',
          search: 'email_x_cont'
        }
      };

      return User;

    })(csResource);
    ResourceService.register(User.descriptor.type, User);
    return User;
  }
]);
