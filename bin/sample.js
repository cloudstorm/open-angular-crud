var app = angular.module('cloudStormSample', [
  'cloudStorm',
  'cloudStormSample.resources'
]);

app.controller('MainCtrl', function($scope, csAlertService) {
  csAlertService.addAlert('Welcome to CloudStorm', 'info');
  // Dummy
  $scope.world = 'Worlds';
  $scope.resourceType = 'items';
});

angular.module('cloudStormSample.resources', [
  'cloudStormSample.resources.item',
  'cloudStormSample.resources.categories',
  'cloudStormSample.resources.user'
]);

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

angular.module('cloudStormSample.resources.item', ['cloudStorm.restApi']).factory('itemsResource', [ 'ResourceService', 'csRestApi', 'csResource', function(ResourceService, csRestApi, csResource) {
    var Item = (function(superClass) {
      extend(Item, superClass);

      function Item() {
        return Item.__super__.constructor.apply(this, arguments);
      }

      Item.endpoint = 'api/v1/items';
      Item.base_url = 'http://demo.cloudstorm.io';

      Item.descriptor = {
        type: 'items',
        name: 'Item',
        hint: 'list',
        fields: [
          {
            attribute: 'title',
            label: 'title',
            type: 'string',
            cardinality: 'one',
            required: true,
            read_only: false
          }, {
            attribute: 'description',
            label: 'description',
            type: 'string',
            cardinality: 'one',
            required: false,
            read_only: false
          }, {
            attribute: 'due_date',
            label: 'due_date',
            type: 'date',
            cardinality: 'one',
            required: true,
            read_only: false
          }, {
            attribute: 'done',
            label: 'done',
            type: 'boolean',
            cardinality: 'one',
            required: false,
            read_only: false,
            "default": false
          }, {
            attribute: 'categories',
            label: 'categories',
            type: 'resource',
            resource: 'categories',
            cardinality: 'many',
            relationship: 'categories',
            read_only: false
          }, {
            attribute: 'user_id',
            label: 'User',
            type: 'resource',
            resource: 'users',
            cardinality: 'one',
            relationship: 'user',
            read_only: true
          }
        ],
        attributes_to_hide: {
          index: ['user_id'],
          create: ['user_id'],
          edit: ['user_id']
        },
        display: {
          name: 'title',
          search: 'title_x_cont'
        }
      };

      return Item;

    })(csResource);
    ResourceService.register(Item.descriptor.type, Item);
    return Item;
  }
]);

angular.module('cloudStormSample.resources.categories', ['cloudStorm.restApi']).factory('categoriesResource', [
  'ResourceService', 'csRestApi', 'csResource', function(ResourceService, csRestApi, csResource) {
    var Category;
    Category = (function(superClass) {
      extend(Category, superClass);

      function Category() {
        return Category.__super__.constructor.apply(this, arguments);
      }

      Category.endpoint = 'api/v1/categories';
      Category.base_url = 'http://demo.cloudstorm.io';

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
      extend(User, superClass);

      function User() {
        return User.__super__.constructor.apply(this, arguments);
      }

      User.endpoint = 'api/v1/users';
      User.base_url = 'http://demo.cloudstorm.io';

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
