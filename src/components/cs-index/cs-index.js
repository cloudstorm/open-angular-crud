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
  controller : function($scope, ResourceService, csSettings, $uibModal, csAlertService, csDescriptorService, csRoute){

    var loadData, resource;
    this.$onInit = function(){
      this.filterValue = ""
    }

    this.i18n = csSettings.settings['i18n-engine'];

    this.collection = this.items;
    this.header  = this.resource.descriptor.name

    resource = this.resource;

    loadData = function() {
      return csDescriptorService.getPromises().then(function() {
        return this.resource.$index({
          include: '*'
        }).then(function(items) {}, this.collection = items, function(reason) {
          this.collection = null;
          return function() {};
        });
      });
    };

    var defaultOptions, indexOptions, sortField;

    sortField = void 0;

    defaultOptions = {
      'selectedItem': null,
      'sortAttribute': resource.descriptor.fields[0].attribute,
      'filterValue': "",
      'sortReverse': false,
      'condensedView': false,
      'hide-actions': false,
      'hide-attributes': resource.descriptor.attributes_to_hide || {}
    };

    this.csIndexOptions || (this.csIndexOptions = {});

    indexOptions = angular.copy(this.csIndexOptions);

    angular.copy({}, this.csIndexOptions);

    angular.merge(this.csIndexOptions, defaultOptions, indexOptions);

    this.columns = resource.descriptor.fields;

    // ===== SORT =========================================

    this.filter = function(filterValue) {
      $scope.$broadcast('filterValue', {filterValue : filterValue})
    };

    // ===== GETTERS =========================================

    this.listIsEmpty = function() {
      return this.collection === null;
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

    this.sidePanelIsVisible = function() {
      if (this.csIndexOptions.selectedItem) {
        return true;
      }
      return false;
    };

    this.viewIsCompressed = function() {
      return this.sidePanelIsVisible() && this.csIndexOptions.condensedView;
    };

    // ===== SETTERS =========================================

    this.selectItem = function(item) {
      return this.csIndexOptions.selectedItem = item;
    };

    this.destroyItem = function($event, item) {
      var ref;
      $event.stopPropagation();
      if (confirm((ref = this.i18n) != null ? ref.t('confirm.delete') : void 0)) {
        return item.$destroy().then((function(result) {
          var index;
          this.csIndexOptions.selectedItem = null;
          index = this.collection.indexOf(item);
          return this.collection.splice(index, 1);
        }).bind(this), (function(reason) {
          var alert, ref1, ref2;
          alert = (ref1 = reason.data) != null ? ref1.errors[0].detail : void 0;
          return csAlertService.addAlert(alert || ((ref2 = this.i18n) != null ? ref2.t('alert.error_happened') : void 0), 'danger');
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

    // ===== UX HANDLES ======================================

    var pushNewItem;

    this.refreshIndex = function() {
      this.unselectItem();
      return loadData();
    };

    this.testEvent = function(test) {
      return alert(test);
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
          'wizard-canceled': function(resource) {
            var ref;
            modalInstance.close();
            return csAlertService.addAlert(((ref = this.i18n) != null ? ref.t('alert.no_resource_created') : void 0) || 'translation missing', 'info');
          },
          'wizard-submited': (function(resource) {
            var ref;
            this.pushNewItem(this.collection, resource);
            if (!this.wizardOptions['keep-first']) {
              modalInstance.close();
            }
            return csAlertService.addAlert(((ref = this.i18n) != null ? ref.t('alert.new_resource_created') : void 0) || 'translation missing', 'success');
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
      }), function() {
        return console.info('Modal dismissed at: ' + new Date());
      });
    };

    this.pushNewItem = function(collection, item) {
      var newItem;
      newItem = item.constructor.$new();
      newItem.$clone(item);
      return collection.push(newItem);
    };
  }
})
