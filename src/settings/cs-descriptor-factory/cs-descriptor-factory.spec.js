describe('csDescriptorFactory', function(){

  var csDescriptorPropagationSettings;
  var csDescriptorFactory;

  beforeEach(angular.mock.module('cloudStorm.layoutSettings'));
  beforeEach(angular.mock.module('cloudStorm.descriptorPropagationSettings'));
  beforeEach(angular.mock.module('cloudStorm.descriptorFactory'));
  beforeEach(angular.mock.module('cloudStorm.csHashService'));

  beforeEach(inject(function (_csDescriptorFactory_, _csDescriptorPropagationSettings_) {
    csDescriptorFactory = _csDescriptorFactory_;
    csDescriptorPropagationSettings = _csDescriptorPropagationSettings_;
  }));

  it('should exist', function() {
    expect(csDescriptorFactory).toBeDefined();
  });

  var scope = {}
  var keys = ["a", "b", "c"]
  const value = "val"

  it('setTarget_1', function(){

    csDescriptorFactory.setTarget(scope, keys, value);
    expect(scope.a.b.c).toEqual("val");
  })

  it('setTarget_2', function(){

    keys = ["a", "b"]
    csDescriptorFactory.setTarget(scope, keys, value);
    expect(scope.a.b).toEqual("val");
  })

  it('setTarget_3', function(){

    keys = ["a"]
    csDescriptorFactory.setTarget(scope, keys, value);
    expect(scope.a).toEqual("val");
  })

  it('propagate', function(){
    var formScope = {
      descriptor : {
        name : "csForm_t",
      },
      formMode : "create",
    }
    csDescriptorPropagationSettings.addCase('csForm_t', {
      type : "switch",
      base : ["formMode"],
      target : ["childDescriptors", "csField", "layout"],
      rule : {
        create : "abcdef",
      }
    })

    csDescriptorFactory.processData(formScope);
    expect(formScope.childDescriptors.csField.layout).toEqual("abcdef");
  })

  /* Output
  var formScope = {
    descriptor = {
      name : "csForm"
    }
    formMode = "create"
  }
  */


})
