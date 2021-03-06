var app = angular.module("cloudStorm.itemList", [])

app.component("csItemList", {

  bindings : {
    field : "<",
    itemList : "<",
    key : "<",
    many : "<",
    uiConfig : "<",
    cMode : "<",
    modalMode : "<",
  },

  templateUrl : "components/cs-item-list/cs-item-list-template.html",
  controller : [ '$scope','$element','$uibModal','csRoute','csSettings','csInputBase', function($scope, $element, $uibModal, csRoute, csSettings, csInputBase) {


    this.$onChanges = function(changesObj) {
      this.init();
    }

    this.init = function() {
      this.i18n = csSettings.settings['i18n-engine'];
      $element.addClass('cs-item-list');

      csInputBase(this);

      this.cMode = this.cMode || this.formMode;
      this.modalMode = this.modalMode || false;

      this.CL = {};

      switch(this.cMode) {
        case "show":
          this.CL.itemContainer = "show-mode";
          this.CL.item = "item-show";
          if (!this.many) {
            this.CL.itemContainer += " singe-item-container";
          }
          break;
        case "tableView":
          this.CL.itemContainer = "row-mode";
          this.CL.item = "item-table";
          break;
        case "modal":
          this.CL.itemContainer = "column-mode";
          this.CL.item = "item-table";
          break;
      }

      //Text on UI for the UI
      this.UI = {};
      this.UI.fieldName = this.field ? this.field.label : "";
      if (this.many) {
        this.UI.noItem = this.i18n.t('alert.no_linked_resources') + " " + this.UI.fieldName;
      } else {
        this.UI.noItem = this.i18n.t('alert.no_linked_resource') + " " + this.UI.fieldName;
      }
      this.UI.clickText = "...";

      //Display conditions
      this.condition = {};
      this.condition.noItem = !this.itemList || (this.itemList.length == 0 && this.cMode != 'tableView');
      this.condition.tableMode = this.cMode == 'tableView';

      // console.log(this.itemList);
      // console.log('noItem',this.condition.noItem);
    }

    this.$onInit = function() {
      this.init();
    };

    this.showItems = function() {
      var modalTemplate = "" +
        "<cs-item-list-container  " +
          "modal-instance=\"$ctrl.modalInstance\", " +
          "item=\"$ctrl.item\", " +
          "item-list=\"$ctrl.itemList\", " +
          "field=\"$ctrl.field\", " +
          "many=\"$ctrl.many\", " +
          "c-mode=\"'modal'\", " +
          "key=\"$ctrl.key\">  " +
        " </cs-item-list-container>";

      this.modalInstance = $uibModal.open( {
        scope: $scope,
        keyboard: true,
        backdrop: 'static',
        //windowTopClass: 'modal-wizard',
        template: modalTemplate,
        resolve: {
          dummy: function() {
            return $scope.dummy;
          }
        }
      });
      // Ignore 'Possibly unhandled rejection: escape key press' error
      this.modalInstance.result.finally(angular.noop).then(angular.noop, angular.noop);
    };

    this.hidden = function(num) {
      // console.log(this.hiddenFrom  + "   " + num)
      return this.hiddenFrom <= num;
    };

    this.selectSingle = function() {
        this.select(this.itemList);
    };

    this.select = function(item) {
      csRoute.go("show", { resourceType : item.type, id : item.attributes.id } );
    };

    this.process = function(text) {
      this.cnt++;
      var textLength = this.textLength(text)
      if(this.remainingSpace <= textLength){
        if(this.cnt == 1) {
          return {
            text : this.getShortenedText(text),
            state : 'shortened',
          }
        } else {
          return {
            text : text,
            state : 'hidden',
          }
        }
      } else {
        return {
          text : text,
          state : 'normal',
        }
      }
    };

    this.getLength = function(text) {
      //This is just an approximation
      return this.margin + 2 * this.paddding + text.length * 3;
    };

    this.getShortenedText = function(text) {
      var diff = text.length - this.remainingSpace.length;
      return text.substring(0, text.length - (diff + 2));
    };
  }]
})
