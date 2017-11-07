describe('csDescriptorFactory', function(){

  var csDescriptorPropagationSettings;
  var csDescriptorFactory;

  beforeEach(angular.mock.module('cloudStorm.descriptorFactory'));
  beforeEach(angular.mock.module('cloudStorm.errorFactory'));
  beforeEach(angular.mock.module('cloudStorm.layoutSettings'));
  beforeEach(angular.mock.module('cloudStorm.descriptorPropagationSettings'));
  beforeEach(angular.mock.module('cloudStorm.csHashService'));
  beforeEach(angular.mock.module('cloudStorm.errorMsgProvider'));

  beforeEach(inject(function (_csDescriptorFactory_, _csDescriptorPropagationSettings_, _csErrorFactory_) {
    csDescriptorFactory = _csDescriptorFactory_;
    csErrorFactory = _csErrorFactory_;
    csDescriptorPropagationSettings = _csDescriptorPropagationSettings_;
  }));

  it('should exist', function() {
    expect(csDescriptorFactory).toBeDefined();
  });

  it('process', function(){

    var scope = {
      formMode : "create",
    }

    var tests = [{
      type : "switch",
      base : ["formMode"],
      target : ["csField", "style", "alignment"],
      rule : {
        create : "vertical",
        edit : "horizontal",
        show : "horizontal",
      }
    }, {
      type : "copy",
      base : ["formMode"],
      target : ["childDescriptors", "csField", "fieldMode"],
    }]


  })

  it('getBase() - error', function(){

    var errorTests = [
      {
        scope : {},
        keys : ["a"],
        error : csErrorFactory.error('csDescriptorFactory', 'baseNotDefined', [["a"]])
      }, {
        scope : {},
        keys : ["a", "b"],
        error : csErrorFactory.error('csDescriptorFactory', 'baseNotDefined', [["a", "b"]])
      }, {
        scope : { a : "b" },
        keys : ["a", "b"],
        error : csErrorFactory.error('csDescriptorFactory', 'intermediate', [["a", "b"], "b"])
      }
    ]

    errorTests.forEach(function(test){
      expect(function() {
        csDescriptorFactory.getBase(test.scope, test.keys)
      }).toThrow(test.error);
    })
  })

  it('getBase() - run', function(){

    var tests = [
      {
        scope : { a : "b"},
        keys : ["a"],
        result : "b"
      }, {
        scope : { a : {b : { c : "X" }}},
        keys : ["a", "b", "c"],
        result : "b"
      }
    ]

    tests.forEach(function(test){
      expect(csDescriptorFactory.getBase(test.scope, test.keys)).toEqual(test.result);
    })
  })
  it('prepareTarget() - error_1', function(){

    //This is an other type of overlap
    var scope = { a : { b : { c : "c_value" }}};
    var keys = ["a", "b"]
    var value = "d_value"

  })

  it('prepareTarget() - error_1', function(){

    //This is an other type of overlap
    var scope = { a : { b : "b_val"}};
    var keys = ["a", "c"]

  })


  it('prepareTarget() - error', function(){
    var errorTests = [
      {
        scope : { a : "b"},
        target : ["a"],
        error : csErrorFactory.error('csDescriptorFactory', 'overlap', [["a"]])
      }, {
        scope : { a : { b : "c" }},
        target : ["a", "b"],
        error : csErrorFactory.error('csDescriptorFactory', 'overlap', [["a", "b"]])
      }
    ]

    errorTests.forEach(function(test){
      expect(function() {
        csDescriptorFactory.prepareTarget(test.scope, test.target)
      }).toThrow(test.error);
    })
  })

  it('prepareTarget() - run', function(){
    var tests = [
      {
        scope : { a : { b : "e"}},
        keys : ["a", "c"],
        result : [{b : "e"}, ["c"]],
      }, {
        scope : { a : { b : { c : "e"}}},
        keys : ["a", "b", "d"],
        result : [{c : "e"}, ["d"]],
      }, {
        scope : { a : { b : "e"}},
        keys : ["c", "e", "d"],
        result : [{ a : { b : "e"}}, ["c", "e", "d"]],
      },{
        scope : { a : { b : {}}},
        keys : ["a", "b", "c"],
        result : [{}, ["c"]],
      }]
  })

  it('setTarget() - error', function(){

  })

   it('setTarget() - run', function(){

    var scope = {}
    const value = "val"
    var tests = [
      {
        scope : scope,
        keys: ["a"],
        value: value,
        input : function(){
          return scope.a
        }
      }, {
        scope : scope,
        keys: ["a", "b"],
        value: value,
        input : function(){
          return scope.a.b
        }
      }, {
        scope : scope,
        keys: ["a", "b", "c"],
        value: value,
        result: value,
        input : function(){
          return scope.a.b.c
        }
      }]

      tests.forEach(function(test){
        csDescriptorFactory.setTarget(test.scope, test.keys, test.value);
        expect(test.input()).toEqual(test.value);
      })

      var scope = { a : {  b : value }}
      var tests = [{
        scope : scope,
        keys : ["a", "c"],
        value : value,
        input : function(){
          return scope.a.c
        }
      }, {
        scope : scope,
        keys : ["c"],
        value : value,
        input : function(){
          return scope.c
        }
      }]

    tests.forEach(function(test){
      csDescriptorFactory.setTarget(test.scope, test.keys, test.value);
      expect(test.input()).toEqual(test.value);
    })
  })

  it('getObject() - run', function(){

    var tests = [
      {
        key: "key",
        object : "value",
        result: { key : "value"},
      }, {
        key: "key",
        object : { key : "value"},
        result: "value",
      }, {
        key: "key",
        object : { key : { key : "value"}},
        result:  { key : "value"},
      }
    ]

    tests.forEach(function(test){
      expect(csDescriptorFactory.getObject(test.key, test.object)).toEqual(test.result);
    })
  })

  it('propagate() - run', function(){
    var formScope = {
      descriptor : {
        name : "csForm_t",
      },
      formMode : "create",
    }

    var tests = [{
      scope : formScope,
      descriptor : {
        type : "switch",
        base : ["formMode"],
        target : ["childDescriptors", "csField", "layout"],
        rule : {
          create : "create_result",
        }},
      resultVar : function(){
        return formScope.formMode
      },
      result : "create_result"
    }]

    tests.forEach(function(test){

      csDescriptorFactory.propagate(test.scope, test.descriptor);
      expect(test.resultVar()).toEqual(test.result);
    })

    /*
    csDescriptorPropagationSettings.addCase('csForm_t', {
      type : "switch",
      base : ["formMode"],
      target : ["childDescriptors", "csField", "layout"],
      rule : {
        create : "create_result",
      }
    })
    */

    /*
    csDescriptorPropagationSettings.addCase('csForm_t', {
      type : "copy",
      base : ["formMode"],
      target : ["childDescriptors", "csField", "mode"],
    }) */

    //csDescriptorFactory.processData(formScope);
    //expect(formScope.childDescriptors.csField.layout).toEqual("create_result");
    //expect(formScope.childDescriptors.csField.mode).toEqual("create");
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
