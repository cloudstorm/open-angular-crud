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

    this.loading = true
    this.$onChanges = function(changesObj) {
      // console.log("cs-index.onChanges", changesObj);
      if (changesObj.items && changesObj.items.currentValue && changesObj.items.previousValue != changesObj.items.currentValue) {
        vm.items = changesObj.items.currentValue;
      }
      if (changesObj.resource && changesObj.resource.currentValue && changesObj.resource.previousValue != changesObj.resource.currentValue) {
        vm.columns = changesObj.resource.currentValue.descriptor.fields;
      }
    }

    this.$onInit = function() {

      // console.log('CS-INDEX:onInit()');
      var defaultOptions, indexOptions;
      defaultOptions = {
        'selectedItem': null,
        'sortAttribute': vm.resource ? vm.resource.descriptor.fields[0].attribute : {},
        'filterValue': "",
        'sortReverse': false,
        'condensedView': false,
        'hide-actions': false,
        'hide-attributes': vm.resource ? vm.resource.descriptor.attributes_to_hide : {}
      };

      vm.csIndexOptions || (vm.csIndexOptions = {});
      indexOptions = angular.copy(vm.csIndexOptions);
      angular.copy({}, vm.csIndexOptions);
      angular.merge(vm.csIndexOptions, defaultOptions, indexOptions);

      csDescriptorService.getPromises().then( function() {
        // Load resource and items when not bound (index-only mode)
        if (!vm.resource) {
          vm.resource = ResourceService.get(vm.resourceType);
          vm.csIndexOptions['hide-attributes'] = vm.resource.descriptor.attributes_to_hide || {}
          vm.csIndexOptions['sortAttribute'] = vm.resource.descriptor.fields[0].attribute
        }
        if (!vm.items) {
          vm.resource.$index({ include: '*'}).then(function(data) {
            vm.items = data;
            vm.loading = false
          });
        }
        vm.collection = vm.items;

        vm.filterValue = ""
        vm.i18n = csSettings.settings['i18n-engine'];

        vm.loadData = function() {
          // console.log("INDEX: loadData()")
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
        // I feel this is not required, as it leads to two index queries...
        //vm.loadData();

        vm.header = vm.resource.descriptor.name
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
      if (this.csIndexOptions['hide-attributes']) {
        if (hiddenAttrs = this.csIndexOptions['hide-attributes'].index) {
          return hiddenAttrs.indexOf(attribute) > -1;
        }
      } else {
        console.log('CS-INDEX:attributeToHide called when this.csIndexOptions is undefined...')
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
      if (confirm( item.$display_name() + '\n\n' + this.i18n.t('confirm.delete'))) {
        return item.$destroy().then((function(result) {
          this.csIndexOptions.selectedItem = null;
          var index = this.items.indexOf(result);
          if (index == -1) {
            console.log('Warning: Destroyed item not found in collection, retry search with type and id check.');
            index = this.items.findIndex(function(i) { return (i.id === result.id && i.type === result.type); } );
            console.log('Index:', index);
          }
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
      // console.log("CS-INDEX: refreshIndex()")
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
