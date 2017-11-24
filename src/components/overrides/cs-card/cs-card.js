'use strict'

var app = angular.module('cloudStorm.card', [])

app.component('csCard', {

  bindings : {
    item: '<',
    resource: "<",
    fields: '<',
    options: '=',
    deleteItem : "&",
  },
  templateUrl : "components/overrides/cs-card/cs-card-template.html",
  controller : function(csRoute, $element){

    this.$onInit = function(){
      $element.addClass('cs-card')
    }

    this.overrideClass = function(){
      return 'flex-horizontal'
    }

    this.jumpEvent = (function(){
      csRoute.go("show", {
        resourceType: this.item.type,
        id: this.item.attributes.id
      });
    }).bind(this)

    this.editEvent = (function(){
      csRoute.go("cmd", {
        resourceType: this.item.type,
        id: this.item.attributes.id,
        cmd : 'edit'
      });
    }).bind(this)

    this.deleteEvent = (function($event){
      this.deleteItem({'event' : $event, 'item' : this.item })
    }).bind(this)
  }

})
