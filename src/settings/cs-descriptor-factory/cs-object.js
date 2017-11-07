
class _Object_ {

  constructor(key, value){

    this.key = key
    this.value = value
  }

  get(object){

    if((typeof object) != 'object'){
      throw new Error("overlap")
    } else {
      object[this.key] = this.getValue(object)
      return object
    }
  }

  getValue(object){
    var toPass = object[this.key]
    return this.value.get(toPass || {})
  }
}

class _Value_ extends _Object_ {

  getValue(object){
    return this.value
  }

}

var scope = {
  a : {
     b : "Y",
  },
  b : {
    c : "X",
  }
}


var keys = [ "a", "c", "d", "e"]
var val = "Z"

var obj1 = new _Value_("c", val)
var obj2 = new _Object_("a", obj1)

//processData
var process = function(_keys_, value){

  var lastKey = _keys_.pop()
  var keys = _keys_.reverse()
  var object = new _Value_(lastKey, value)
  keys.forEach(function(key){
    object = new _Object_(key, object);

  })
  return object;
}

var object = process(keys, val);
scope = object.get(scope)


var keys = [ "a", "c", "d", "k"]
var val = "YOOO"

object = process(keys, val);
scope = object.get(scope)
console.log("Scope YOOOO")
console.log(scope)
