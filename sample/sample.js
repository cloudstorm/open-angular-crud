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
  'cloudStormSample.resources.item'
])

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

var resourceModule = angular.module('cloudStormSample.resources.item', ['cloudStorm.restApi']);

resourceModule.factory('itemsResource', [ 'ResourceService', 'csRestApi', 'csResource', function(ResourceService, csRestApi, csResource) {
    var Item = (function(superClass) {
      extend(Item, superClass);

      function Item() {
        return Item.__super__.constructor.apply(this, arguments);
      }

      Item.endpoint = 'api/v1/items';

      Item.member_endpoint = 'api/v1/items/{id}';

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