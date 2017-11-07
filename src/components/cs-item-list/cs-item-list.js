var app = angular.module("cloudStorm.itemList", [])

app.component("csItemList", {

  bindings : {
    itemList : "<",
    key : "<",
    uiConfig : "<",
  },
  templateUrl : "components/cs-item-list/cs-item-list-template.html",
  controller : function(csRoute, csSettings){

    this.i18n = csSettings.settings['i18n-engine']

    this.click = function(item){
      csRoute.go("show", {resourceType : item.type, id : item.attributes.id})
    }
  }
})
