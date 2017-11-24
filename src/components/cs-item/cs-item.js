var app = angular.module('cloudStorm.item', [])

app.component('csItem', {

  bindings : {
    resource : "<",
    item : "<",
    options : "<",
    override : "<",
    deleteItem_ : "&"
  },
  templateUrl : "components/cs-item/cs-item-template.html",
  controller : function($scope, $element, $compile){

    this.fields = this.resource.descriptor.fields;
    this.template = "<" + this.override
                        + " item='$ctrl.item',"
                        + " resource='$ctrl.resource',"
                        + " fields='$ctrl.fields',"
                        + " delete-item='$ctrl.deleteItem(event, item)',"
                        + " options='$ctrl.options'>";

    var innerElement = angular.element($element[0].querySelector(".cs-item-wrapper"))
    innerElement.append($compile(this.template)($scope))

    this.deleteItem = function($event, item){
      this.deleteItem_({ 'event' : $event, 'item' : item })
    }
  }
})
