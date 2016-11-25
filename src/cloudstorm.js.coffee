
app = angular.module('cloudStorm', ['ui.bootstrap'])

# TODO: Remove / refactor module override. 
# See GitHub issue https://github.com/cloudstorm/cloudstorm/issues/63
do (angular) ->
  origMethod = angular.module
  alreadyRegistered = {}

  ###*
  # Register/fetch a module.
  #
  # @param name {string} module name.
  # @param reqs {array} list of modules this module depends upon.
  # @param configFn {function} config function to run when module loads (only applied for the first call to create this module).
  # @returns {*} the created/existing module.
  ###

  angular.module = (name, reqs, configFn) ->
    reqs = reqs or []
    module = null
    if name == 'ng'
      module = origMethod(name)
    else if alreadyRegistered[name]
      module = origMethod(name)
      module.requires.push.apply module.requires, reqs
    else
      module = origMethod(name, reqs, configFn)
      alreadyRegistered[name] = module
    module

  return
