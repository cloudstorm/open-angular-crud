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

    // this.$onChanges = function(changesObj) {
    //   console.log('cs-index.onChanges', changesObj);
    // }

    this.$onInit = function() {
      this.csIndexOptions || (this.csIndexOptions = {});

      csDescriptorService.getPromises().then( function() {
        // Load resource and items when not bound (index-only mode)
        if (!vm.resource) {
          vm.resource = ResourceService.get(vm.resourceType);
        }
        if (!vm.items) {
          vm.resource.$index({ include: '*'}).then(function(data) { vm.items = data; });
        }
        vm.collection = vm.items;

        vm.filterValue = ""
        vm.i18n = csSettings.settings['i18n-engine'];

        vm.loadData = function() {
          csDescriptorService.getPromises().then(
            (function() {
              return vm.resource.$index({ include: '*'})
            }).bind(vm)).then( (function(items) {
                return vm.items = items
              }).bind(vm), (function(reason) {
                return vm.items = null
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

      })
    }

   this.pushNewItem = function(item) {
      var newItem;
      newItem = item.constructor.$new();
      newItem.$clone(item);
      this.items.push(newItem);
      // force angular rebind
      this.items = this.items.slice();
    };

    this.listIsEmpty = function() {
      return !this.items || this.items.length == 0;
    };

    this.columnVisible = function(column, index) {
      var length;
      length = this.columns.length;
      if (this.attributeToHide(column.attribute)) {
        return false;
      }
      if (this.viewIsCompressed() && !_.contains([0, 1, 2], index)) {
        return false;
      }
      return true;
    };

    this.attributeToHide = function(attribute) {
      var hiddenAttrs;
      if (hiddenAttrs = this.csIndexOptions['hide-attributes'].index) {
        return hiddenAttrs.indexOf(attribute) > -1;
      }
      return false;
    };

    this.filter = function(filterValue) {
      $scope.$broadcast('filterValue', {filterValue : filterValue})
    };

    this.sidePanelIsVisible = function() {
      if (this.csIndexOptions.selectedItem) {
        return true;
      }
      return false;
    };

    this.viewIsCompressed = function() {
      return this.sidePanelIsVisible() && this.csIndexOptions.condensedView;
    };

    this.selectItem = function(item) {
      return this.csIndexOptions.selectedItem = item;
    };

    this.destroyItem = function($event, item) {
      $event.stopPropagation();
      if (confirm( this.i18n.t('confirm.delete'))) {
        return item.$destroy().then((function(result) {
          var index;
          this.csIndexOptions.selectedItem = null;
          index = this.items.indexOf(item);
          this.items.splice(index, 1);
          // force angular rebind
          this.items = this.items.slice();
          return this.items;
        }).bind(this), (function(reason) {
          var alert = null
          if(reason && reason.data && reason.data.errors && reason.data.errors[0])
            alert = reason.data.errors[0].detail
          return csAlertService.danger("error_happened", alert)
        }).bind(this));
      }
    };

    this.showItem = function(item) {
      if (this.csIndexOptions.selectedItem === null) {
        return csRoute.go("show", {
          resourceType: this.resourceType,
          id: item.attributes.id
        });
      } else {
        return this.selectItem(item);
      }
    };

    this.unselectItem = function() {
      return this.csIndexOptions.selectedItem = null;
    };

    // ===== WIZARD CALLBACKS ============================

    this.getPanelNumber = function(length) {
      if (length > 1) {
        return this.csIndexOptions.condensedView = true;
      } else {
        return this.csIndexOptions.condensedView = false;
      }
    };

    this.refreshIndex = function() {
      this.unselectItem();
      this.loadData();
    };

    this.openNewResourcePanel = function() {
      var modalInstance;
      this.unselectItem();
      this.wizardOptions = {
        "resource-type": this.resourceType,
        "form-item": {},
        "form-mode": "create",
        "reset-on-submit": true,
        "events": {
          'wizard-canceled': (function(resource) {
            modalInstance.close();
            return csAlertService.info('no_resource_created')
          }).bind(this),
          'wizard-submited': (function(resource) {
            this.pushNewItem(resource);
            if (!this.wizardOptions['keep-first']) {
              modalInstance.close();
            }
            return csAlertService.success('new_resource_created')
          }).bind(this)
        }
      };
      angular.merge(this.wizardOptions, this.csIndexOptions);

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
        return this.selected = selectedItem;
      }).bind(this), (function() {
        return console.info('Modal dismissed at: ' + new Date());
      }).bind(this));
    };

  }]
})
