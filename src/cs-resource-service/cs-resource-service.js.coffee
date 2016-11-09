"use strict"

# ===== SETUP =================================================================

# Make sure that the components module is defined only once
try
  # Module already defined, use it
  app = angular.module("cloudStorm")
catch err
  # Module not defined yet, define it
  app = angular.module('cloudStorm', [])
####################################################################################################

app.factory 'ResourceService', ['$injector', ($injector) -> 


  ##################################################################################################
  camelCase = do ->
    DEFAULT_REGEX = /[-_]+(.)?/g

    toUpper = (match, group1) ->
      if group1 then group1.toUpperCase() else ''

    return (str, delimiters) ->
      str.replace(DEFAULT_REGEX, toUpper)

  ##################################################################################################

  resources    = {}
  lookup_table = {}

  ##################################################################################################

  class ResourceService
    
    register: (name, resource) -> 
      resources[name] = resource

    register_dynamic_name = (name, service_name) ->
      lookup_table[name] = service_name

    get: (name) ->
      resource = resources[name]

      unless resource
        moduleName = lookup_table[name] || "#{camelCase(name)}Resource"
        resource = $injector.get(moduleName)
        
        if resource
          @register(name, resource)
        else
          throw "CS-001: cannot auto-inject #{name}"

      return resource

  ##################################################################################################

  return new ResourceService
]
