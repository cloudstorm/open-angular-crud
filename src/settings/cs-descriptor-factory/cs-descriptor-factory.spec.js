describe('csDescriptorFactory', function(){

  var csDescriptorPropagationSettings;
  var csDescriptorFactory;

  beforeEach(angular.mock.module('cloudStorm.layoutSettings'));
  beforeEach(angular.mock.module('cloudStorm.descriptorPropagationSettings'));
  beforeEach(angular.mock.module('cloudStorm.descriptorFactory'));

  beforeEach(inject(function (_csDescriptorFactory_) {
    csDescriptorFactory = _csDescriptorFactory_;
  }));

  it('should exist', function() {
    expect(csDescriptorFactory).toBeDefined();
  });

  const formScope = {
    descriptor : {
      name : "csForm",
    },
    formMode : "create",
  }

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

    /*
    console.log(formScope)
    csDescriptorFactory.processData(formScope);
    expect(formScope.descriptors.csField.layout).toEqual("horizontal");
    */



  /* Output
  var formScope = {
    descriptor = {
      name : "csForm"
    }
    formMode = "create"

  }
  */


})
