var app = angular.module("cloudStorm.itemList", [])

app.component("csItemList", {

  bindings : {
    field : "<",
    itemList : "<",
    key : "<",
    many : "<",
    uiConfig : "<",
    formMode : "<",
  },

  templateUrl : "components/cs-item-list/cs-item-list-template.html",
  controller : function(csRoute, csSettings, csInputBase){

    csInputBase(this)
    this.i18n = csSettings.settings['i18n-engine']

    this.$onInit = function(){
      this.cnt = 0;
      this.remainingSpace = 200;
      this.padding = 3;
      this.margin = 5;
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
