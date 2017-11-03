describe('csErrorFactory', function(){

  var csErrorFactory;
  var csErrorMessages;

  beforeEach(angular.mock.module('cloudStorm.errorFactory'))
  beforeEach(angular.mock.module('cloudStorm.errorMsgProvider'))

  beforeEach(inject(function(_csErrorFactory_, _csErrorMessages_){
    csErrorFactory = _csErrorFactory_
    csErrorMessages = _csErrorMessages_
  }))

  it('getParam()', function(){

    var tests = [
      {
        def: "{{0}}",
        params: null,
        result: csErrorMessages.errorPrefix + "'params' parameter is null!"
      },{
        def: "{{abc}}",
        params: "X",
        result: csErrorMessages.errorPrefix + "'abc' is not an integer. Please revise the error msg definition"
      },{
        def: "{{0|array}}",
        params: ['X'],
        result: csErrorMessages.errorPrefix + "Input param 0 is not an array"
      },{
        def: "{{0}}",
        params: "X",
        result: "X"
      },{
        def: "{{0|array}}",
        params: [["X", "Y", "Z"]],
        result: '[X, Y, Z]',
      }]

    tests.forEach(function(test){
      expect(csErrorFactory.getParam(test.def, test.params)).toEqual(test.result)
    })
  })

  it('get()', function() {

    var tests = [
      {
        component : "test",
        type: "1",
        params : [["X", "Y", "Z"]],
        result: 'ABCDEF : [X, Y, Z]'
      }]

    tests.forEach(function(test){
      expect(csErrorFactory.get(test.component, test.type, test.params)).toEqual(test.result)
    })
  });
})
