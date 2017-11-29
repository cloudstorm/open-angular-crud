describe('csResourceListProvider', function(){

  var csResourceList;
  beforeEach(angular.mock.module('cloudStorm.resourceListProvider'));
  beforeEach(angular.mock.module('cloudStorm.resourceListProvider'));

  beforeEach(inject(function (_csResourceList_) {
    csResourceList = _csResourceList_
  }));

  /*
  it("tableHeader", function(){

    var headerTemplate =  "" +
     "<cs-table-header " +
       "columns = '$ctrl.columns', " +
       "options = '$ctrl.options['header']', " +
       "rs-event = '$ctrl.rsEvent(object)'>" +
     "</cs-table-header"

    expect(csResourceListProvider.getHeader()).toEqual(headerTemplate)
  })
  */
  /*
  var defaultTemplate =
     "<div class="table-responsive">
      <div class="tTable table table-striped table-hover">
        <div class="tBody">
          <cs-table-header
               columns = "$ctrl.columns",
               options = "$ctrl.options['header']",
               rs-event = "$ctrl.rsEvent(object)">
          </cs-table-header>
        </div>
        <div class="tBody">
          <cs-table-row
              ng-repeat = "item in $ctrl.collection track by $index",
              ng-class = "{'selected-row' : $ctrl.selected(item)}",
              item = "item",
              columns = "$ctrl.columns",
              options = "$ctrl.options['row']",
              rs-event = $ctrl.rsEvent(object)">
          </cs-table-row>
        </div>
      </div>
    </div> ";

    it('default', function(){
      var scope = {}
      expect(csResourceListProvider.getTemplate(scope)).toEqual(defaultTemplate);
    })

    it('index', function(){

      var scope = {
        listDescriptor : {
          type : "table",
          list : {
            type : "template-override",
            url : "components/overrides/cs-table-row-index/cs-table-row-index-template.html",
          }
        }
      }
      var template = csResourceListProvider.getTemplate(scope)
      expect(template).toEqual(defaultTemplate);
      expect(scope.options.row.override.type).toEqual('template-override');
      expect(scope.options.row.override.url).toEqual(scope.listDescriptor.list.url);
    })
    */
})
