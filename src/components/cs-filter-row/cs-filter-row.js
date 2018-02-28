'use string'

var app = angular.module('cloudStorm.filterRow', [])

app.component('csFilterRow', {

  bindings : {
    resource : "<",
    filterValue : "<",
    filter : "&",
    openNewResourcePanel : "&",
    refreshIndex : "&",
  },

  templateUrl : "components/cs-filter-row/cs-filter-row-template.html",

  controller : [ '$element','csSettings', 'csDescriptorService', function($element, csSettings, csDescriptorService) {

    var vm = this;

    this.$onInit = function() {
      csDescriptorService.getPromises().then( function() {
        $element.addClass('cs-filter-row');
        vm.filterVal = "";
        if (vm.resource) {
          vm.header  = vm.resource.descriptor.name;
          vm.subHeader  = vm.resource.descriptor.hint;
          vm.createDisabled = vm.resource.descriptor.create_disabled;
        }
      });
    };

    this.i18n = csSettings.settings['i18n-engine'];

    this.changeInFilter = function() {
      this.filter({ filterValue : this.filterValue })
    };

    this.openNewResourcePanel_ = function() {
      this.openNewResourcePanel();
    };

    this.refreshIndex_ = function() {
      // console.log("CS-FILTER-ROW: refreshIndex()")
      this.refreshIndex();
    };

    this.$onChanges = function (changesObj) {
      if (vm.resource) {
        vm.header  = vm.resource.descriptor.name;
        vm.subHeader  = vm.resource.descriptor.hint;
        vm.createDisabled = vm.resource.descriptor.create_disabled;
      }
    };
  }]
});
