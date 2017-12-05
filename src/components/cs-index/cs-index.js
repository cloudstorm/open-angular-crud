'use strict'

var app = angular.module('cloudStorm.index', [])

app.component('csIndex', {

  bindings : {
    csIndexOptions: '=',
    resourceType: '=',
    itemId : '=',
    items : "<",
    resource : "<",
  },

  templateUrl : 'components/cs-index/cs-index-template.html',
  controller : ['$scope','ResourceService','csSettings','$uibModal','csAlertService','csDescriptorService','csRoute', function($scope, ResourceService, csSettings, $uibModal, csAlertService, csDescriptorService, csRoute){
    var vm = this;
    this.$onInit = function() {
      csDescriptorService.getPromises().then( function() {

        // Load resource and items when not bound (index-only mode)
        if (!vm.resource) {
          vm.resource = ResourceService.get(vm.resourceType);
        }
        if (!vm.items) {
          vm.resource.$index({ include: '*'}).then(function(data) { vm.collection = vm.items = data; });
        } else {
          vm.collection = vm.items;
        }

        vm.filterValue = ""
        vm.i18n = csSettings.settings['i18n-engine'];

        vm.loadData = function() {
          csDescriptorService.getPromises().then(
            (function() {
              return vm.resource.$index({ include: '*'})
            }).bind(vm)).then( (function(items) {
                return vm.collection = items
              }).bind(vm), (function(reason) {
                return vm.collection = null
              }).bind(vm)
            )
        };
        vm.loadData();

        vm.header = vm.resource.descriptor.name

        var defaultOptions, indexOptions, sortField;

        sortField = void 0;

        defaultOptions = {
          'selectedItem': null,
          'sortAttribute': vm.resource.descriptor.fields[0].attribute,
          'filterValue': "",
          'sortReverse': false,
          'condensedView': false,
          'hide-actions': false,
          'hide-attributes': vm.resource.descriptor.attributes_to_hide || {}
        };

        vm.csIndexOptions || (vm.csIndexOptions = {});

        indexOptions = angular.copy(vm.csIndexOptions);

        angular.copy({}, vm.csIndexOptions);

        angular.merge(vm.csIndexOptions, defaultOptions, indexOptions);

        vm.columns = vm.resource.descriptor.fields;

        // ===== SORT =========================================

        vm.filter = function(filterValue) {
          $scope.$broadcast('filterValue', {filterValue : filterValue})
        };

        // ===== GETTERS =========================================

        vm.listIsEmpty = function() {
          return vm.collection === null;
        };

        vm.columnVisible = function(column, index) {
          var length;
          length = vm.columns.length;
          if (vm.attributeToHide(column.attribute)) {
            return false;
          }
          if (vm.viewIsCompressed() && !_.contains([0, 1, 2], index)) {
            return false;
          }
          return true;
        };

        vm.attributeToHide = function(attribute) {
          var hiddenAttrs;
          if (hiddenAttrs = vm.csIndexOptions['hide-attributes'].index) {
            return hiddenAttrs.indexOf(attribute) > -1;
          }
          return false;
        };

        vm.sidePanelIsVisible = function() {
          if (vm.csIndexOptions.selectedItem) {
            return true;
          }
          return false;
        };

        vm.viewIsCompressed = function() {
          return vm.sidePanelIsVisible() && vm.csIndexOptions.condensedView;
        };

        // ===== SETTERS =========================================

        vm.selectItem = function(item) {
          return vm.csIndexOptions.selectedItem = item;
        };

        vm.destroyItem = function($event, item) {
          $event.stopPropagation();
          if (confirm( vm.i18n.t('confirm.delete'))) {
            return item.$destroy().then((function(result) {
              var index;
              vm.csIndexOptions.selectedItem = null;
              index = vm.collection.indexOf(item);
              return vm.collection.splice(index, 1);
            }).bind(vm), (function(reason) {
              var alert = null
              if(reason && reason.data && reason.data.errors && reason.data.errors[0])
                alert = reason.data.errors[0].detail
              return csAlertService.danger("error_happened", alert)
            }).bind(vm));
          }
        };

        vm.showItem = function(item) {
          if (vm.csIndexOptions.selectedItem === null) {
            return csRoute.go("show", {
              resourceType: vm.resourceType,
              id: item.attributes.id
            });
          } else {
            return vm.selectItem(item);
          }
        };

        vm.unselectItem = function() {
          return vm.csIndexOptions.selectedItem = null;
        };

        // ===== WIZARD CALLBACKS ============================

        vm.getPanelNumber = function(length) {
          if (length > 1) {
            return vm.csIndexOptions.condensedView = true;
          } else {
            return vm.csIndexOptions.condensedView = false;
          }
        };

        // ===== UX HANDLES ======================================

        var pushNewItem;

        vm.refreshIndex = function() {
          vm.unselectItem();
          vm.loadData();
        };

        vm.testEvent = function(test) {
          return alert(test);
        };

        vm.openNewResourcePanel = function() {
          var modalInstance;
          vm.unselectItem();
          vm.wizardOptions = {
            "resource-type": vm.resourceType,
            "form-item": {},
            "form-mode": "create",
            "reset-on-submit": true,
            "events": {
              'wizard-canceled': (function(resource) {
                modalInstance.close();
                return csAlertService.info('no_resource_created')
              }).bind(vm),
              'wizard-submited': (function(resource) {
                vm.pushNewItem(vm.collection, resource);
                if (!vm.wizardOptions['keep-first']) {
                  modalInstance.close();
                }
                return csAlertService.success('new_resource_created')
              }).bind(vm)
            }
          };
          angular.merge(vm.wizardOptions, vm.csIndexOptions);

          var scp = $scope
          modalInstance = $uibModal.open({
            scope: $scope,
            keyboard: false,
            backdrop: 'static',
            windowTopClass: 'modal-wizard',
            template: "<div cs-wizard cs-wizard-options=$ctrl.wizardOptions></div>",
            resolve: {
              dummy: function() {
                return $scope.dummy;
              }
            }
          });
          return modalInstance.result.then((function(selectedItem) {
            return vm.selected = selectedItem;
          }).bind(vm), (function() {
            return console.info('Modal dismissed at: ' + new Date());
          }).bind(vm));
        };

        vm.pushNewItem = function(collection, item) {
          var newItem;
          newItem = item.constructor.$new();
          newItem.$clone(item);
          return collection.push(newItem);
        };

      })
    }
  }]
})
