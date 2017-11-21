var app = angular.module("cloudStorm.itemList", [])

app.component("csItemList", {

  bindings : {
    field : "<",
    itemList : "<",
    key : "<",
    many : "<",
    uiConfig : "<",
    formMode : "<",
    modalMode : "<",
  },

  templateUrl : "components/cs-item-list/cs-item-list-template.html",
  controller : function($scope, $element, $uibModal, csRoute, csSettings, csInputBase){

    this.$onInit = function() {
      $element.addClass('cs-item-list')
    }

    csInputBase(this)
    this.i18n = csSettings.settings['i18n-engine'];

    this.hiddenFlag = false;
    this.modalMode = this.modalMode || false

    this.styleMap = {}

    this.CL = {}
    this.CL.itemContainer = this.modalMode ? 'row-container' : ''

    //Text on UI for the UI
    this.UI = {}
    this.UI.fieldName = this.field ? this.field.attribute : ""
    this.UI.noItem = this.i18n.t('alert.no_linked_resource') + " " + this.UI.fieldName
    this.UI.clickText = "..."
    //Display conditions
    this.display = {}
    this.display.noItem = (this.itemList.length == 0 && !this.mode('tableView'))

    var modalTemplate = `
      <cs-item-list-container
        modal-instance="$ctrl.modalInstance",
        item="$ctrl.item",
        item-list="$ctrl.itemList",
        field="$ctrl.field",
        many="$ctrl.many",
        modal-mode="true",
        form-mode="$ctrl.formMode",
        key="$ctrl.key">
      </cs-item-list-container>`;

    this.showItems = function(){

      this.modalInstance = $uibModal.open({
        scope: $scope,
        keyboard: false,
        backdrop: 'static',
        //windowTopClass: 'modal-wizard',
        template: modalTemplate,
        resolve: {
          dummy: function() {
            return $scope.dummy;
          }
        }
      })
    }

    this.i18n = csSettings.settings['i18n-engine']

    this.hidden = function(num){
      console.log(this.hiddenFrom  + "   " + num)
      return this.hiddenFrom <= num
    }

    this.click = function(item){
      csRoute.go("show", {resourceType : item.type, id : item.attributes.id})
    }

    this.testValue = function(){
        return "test"
    }

    this.process = function(text){

      this.cnt++;
      var textLength = this.textLength(text)
      if(this.remainingSpace <= textLength){
        if(this.cnt == 1){
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
    }

    this.getLength = function(text){
      //This is just an approximation
      return this.margin + 2 * this.paddding + text.length * 3
    }

    this.getShortenedText = function(text){
      var diff = text.length - this.remainingSpace.length;
      return text.substring(0, text.length - (diff + 2))
    }

  }
})
