describe('csErrorMsgs', function(){

  var csErrorMsgs;

  beforeEach(angular.mock.module('cloudStorm.errorMsgProvider'));
  beforeEach(inject(function (_csErrorMsgs_) {
    csErrorMsgs = _csErrorMsgs_;
  }));

  it('getParam()', function() {

    var tests = [
      {
        def: "{{0}}",
        params: null,
        result: csErrorMsgs.errorPrefix + "'params' parameter is null!"
      },{
        def: "{{abc}}",
        params: "X",
        result: csErrorMsgs.errorPrefix + "'abc' is not an integer. Please revise the error msg definition"
      },{
        def: "{{0|array}}",
        params: ['X'],
        result: csErrorMsgs.errorPrefix + "Input param 0 is not an array"
      },{
        def: "{{0}}",
        params: ["X"],
        result: "X"
      },{
        def: "{{0|array}}",
        params: [["X", "Y", "Z"]],
        result: "X\tY\tZ\t",
      }]

    tests.forEach(function(test){
      expect(csErrorMsgs.getParam(test.def, test.params)).toEqual(test.result)
    })
  });

})
