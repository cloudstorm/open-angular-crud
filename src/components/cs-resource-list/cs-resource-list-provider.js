var app = angular.module('cloudStorm.resourceListProvider', [])

app.provider('csResourceList', ['csDataOps', function(csDataOps){

  var defaultHeader = "cs-table-header"

  this.getTemplate = function(scope){

    if(!scope.listDescriptor){
      //This is the table
      return this.defaultTemplate
    }
    csDataOps.check(scope, listDescriptor)
  }

  this.defaultTemplate = function(){
    return this.prepareTable(this.tableHeader() + this.tableRow())
    return this.tableRow()
  }

  this.prepareTable = function(content){
    return "<div class=\"table-responsive\"><div class=\"tTable table table-striped table-hover\">\n" +
        content + "<div></div>";
  }

  this.getHeader = function(directive){

    csDataOps.init(directive, defaultHeader)
    return '' +
    "<" + directive +
      "columns = '$ctrl.columns'," +
      "options = '$ctrl.options['header']'" +
      "rs-event = '$ctrl.rsEvent(object)'>" +
    "</" + directive + ">";
  }

  this.rowTemplate = function(scope){

    var descriptor = scope.listDescriptor.lists
    var directive = "cs-table-row"
    if(scope.listDescriptor.list){

    }
    if(this.descriptor.list){
      switch(descriptor.list.type){
        case "directive-override":
          directive = descriptor.list.directive
          break;
        case "template-override":
          csDataOps.object(scope.options, 'row')
          csDataOps.object(scope.options.row, 'override')
          csDataOps.check(descriptor.options)

          scope.options.row.override = {
            type : 'template-override',
            url : descriptor.list.url
          }
          break;
      }
    }

    var component =
      "<" + directive +
        " ng-repeat = 'item in $ctrl.collection track by $index'," +
        " ng-class = '{'selected-row' : $ctrl.selected(item)}'," +
        " item = 'item'," +
        " columns = '$ctrl.columns'," +
        " options = '$ctrl.options['row']'," +
        " rs-event = '$ctrl.rsEvent(object)'>";

    if(descriptor.type == "table"){
      return null
    } else {
      return component
    }
  }

  this.$get = function(){
    return this;
  }

}])
