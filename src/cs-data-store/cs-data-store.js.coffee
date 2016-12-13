"use strict"

app = angular.module('cloudStorm.dataStore', [])

####################################################################################################
app.factory 'csDataStore', [ ->
####################################################################################################

  class DataStore

    ################################################################################################
    # Opts are
    # (global)   If not parent is given the global datastore is used
    # (child)    If a datastore is given then the repository of the given store will be the prototypical parent of the repository
    # (isolated) If an empty object is given, then it will be the prototypical parent of the repository
    # (generic)  If {parent: object} is given, then `object` will be the prototypical parent of the repository. Could be any type

    constructor: (opts) ->
      if !opts
        parent = global
      else if opts.repository
        parent = opts.repository
      else if opts == {}
        parent = {}
      else
        parent = opts.parent || global

      parent_repository = parent.repository || parent
      @repository = Object.create(parent_repository)

    ################################################################################################

    fork: () -> new DataStore(@)

    ################################################################################################

    @global: () -> global
    global:  () -> global

    ################################################################################################

    put: (type, id, object) ->
      @repository[type] ||= {}
      @repository[type][id] = object

    get: (type, id, object) ->
      return null unless @repository[type]
      return @repository[type][id]


  ##################################################################################################

  global = new DataStore(parent: {})

  ##################################################################################################

  return DataStore

  ##################################################################################################
]
