"use strict"

####################################################################################################
# Make sure that the components module is defined only once
try
  # Module already defined, use it
  app = angular.module("cloudStorm")
catch err
  # Module not defined yet, define it
  app = angular.module('cloudStorm', [])

####################################################################################################
app.factory 'csResource', [ 'csRestApi', 'csDataStore', 'ResourceService', '$q', (csRestApi, csDataStore, ResourceService, $q) ->
####################################################################################################

  member_endpoint_url = (resource, id) ->
    member_endpoint_template = urltemplate.parse(resource.member_endpoint)
    return member_endpoint_template.expand(id: id)

####################################################################################################  

  class Resource

    ################################################################################################

    constructor: (value_object, opts = {}) ->
      # Setup datastore based in different scenarios
      if opts.datastore 
        # If datastore is given in options, use that
        @.$datastore = opts.datastore
      else if opts.datastore_parent
        # If datastore_parent is given in options, the new datastore prototypically inherits given datastore
        @.$datastore = new csDataStore(opts.datastore_parent)
      else if value_object && value_object.$datastore
        # If there is an existing object (eg in 'edit' form), let's clone it
        @.$datastore = new csDataStore(value_object.$datastore)
      else
        # Isolate datastore created if no option is given
        @.$datastore = new csDataStore({})
      @.$assign(value_object)
      @.$datastore.put(@type, @id, @) if @type && @id

    ################################################################################################

    @$new: (opts = {}) -> 
      if opts.value 
        value_object = opts.value
        value_object.relationships ||= {}
        value_object.attributes ||= {} 
        value_object.type ||= @descriptor.type
      else
        value_object = { relationships: {}, attributes: {}, type: @descriptor.type }
      return new @(value_object, opts)

    ################################################################################################

    @$index: (params, options = {}) ->
      index_params = angular.copy(params)
      actual_endpoint = options.endpoint || @.endpoint

      if options.scope
        scoped_endpoint = "#{actual_endpoint}/#{options.scope}"
        actual_endpoint = scoped_endpoint

      if options.query
        angular.merge index_params, options.query

      datastore = {}

      if options.datastore 
        # If datastore is given in options, use that
        datastore = options.datastore
      else if options.datastore_parent
        # If datastore_parent is given in options, the new datastore prototypically inherits given datastore
        datastore = new csDataStore(options.datastore_parent)
      else
        # Isolate datastore created if no option is given
        datastore = new csDataStore({})        

      csRestApi.index(actual_endpoint, index_params).then(        
        (data) =>  # successCallback                    
          objects   = _.map data.data, ((i) => new @(i, datastore: datastore))
          included  = _.map data.included, (i) => 
            resource = ResourceService.get(i.type)
            return new resource(i, datastore: datastore)
          return objects  
        (reason) => # errorCallback
          return $q.reject(reason);
        (value) =>  # notifyCallback
      )

    ################################################################################################

    @$search: (query, options = {}) ->
      if typeof query is "object"
        return @$index(q: {query}, options)
      else
        search_params = {}
        search_params[@descriptor.display.search] = query
        return @$index(q: search_params, options)
      
    ################################################################################################

    @$get: (id, params) ->
      csRestApi.get(member_endpoint_url(@, id), params).then(        
        (data) =>  # successCallback
          object = new @(data.data)
          included = _.map data.included, (i) => 
            resource = ResourceService.get(i.type)
            return new resource(i, datastore: object.$datastore)
          return object      
        (reason) => # errorCallback
          return $q.reject(reason);
        (value) =>  # notifyCallback
      )

    ################################################################################################

    $reload: () -> 
      endpoint = @links.self.href || member_endpoint_url(@.constructor, @id)

      csRestApi.get(endpoint, {}).then(        
        (data) =>  # successCallback
          return @.$assign(data.data)          
        (reason) => # errorCallback
          return $q.reject(reason);
        (value) =>  # notifyCallback
      )

    ################################################################################################

    $create: (params = {}, options = {}) -> 
      throw "The id of the object is provided, but PUT is not yet supported. (Did you mean to use $save?)" if @id

      endpoint = options.endpoint || @.constructor.endpoint      
      endpoint = "#{endpoint}/#{options.scope}" if options.scope

      entity   = _.pick(@, "type", "attributes", "relationships")

      for rel, data of entity.relationships
        if angular.isArray(data)
          delete entity.relationships[rel]
          entity.relationships[rel] = { data: _.map(data, (o) -> o.data) }

      csRestApi.create(endpoint, entity).then(        
        (data) =>  # successCallback
          return @.$assign(data.data)
        (reason) => # errorCallback
          return $q.reject(reason);
        (value) =>  # notifyCallback
      )        

    ################################################################################################

    $save: (params = {}, options = {}) -> 
      throw "Object is not yet persisted into the DB, use $create. (Did you forget to provide its id?)" unless @id
      
      endpoint = options.endpoint || @links.self.href || member_endpoint_url(@.constructor, @id)    
      endpoint = "#{endpoint}/#{options.scope}" if options.scope

      entity   = _.pick(@, "id", "type", "attributes", "relationships")

      csRestApi.update(endpoint, entity, params).then(        
        (data) =>  # successCallback
          object = @.$assign(data.data)  
          included = _.map data.included, (i) => 
            resource = ResourceService.get(i.type)
            return new resource(i, datastore: object.$datastore)    
          return object              
        (reason) => # errorCallback
          return $q.reject(reason);
        (value) =>  # notifyCallback
      )       

    ################################################################################################

    $destroy: () -> 
      endpoint = @links.self.href || member_endpoint_url(@.constructor, @id)

      csRestApi.destroy(endpoint).then(        
        (data) =>  # successCallback
          return @.$assign(data.data)          
        (reason) => # errorCallback
          return $q.reject(reason);
        (value) =>  # notifyCallback
      )

    ################################################################################################

    $assign: (value_object) -> 
      # this = value_object, while keeping the existing attributes if they exist
      delete @relationships
      angular.merge(@, _.pick(value_object, "id", "type", "attributes", "relationships", "links"))

      if value_object.$datastore
        for name, rel of @relationships
          if angular.isArray(rel.data)
            for item in rel.data
              assoc = value_object.$relationship(item)
              if assoc
                @.$datastore.put item.type, item.id, assoc
          else
            assoc = value_object.$relationship(rel.data)
            if assoc
              @.$datastore.put rel.data.type, rel.data.id, assoc
      return @

    ################################################################################################

    $clone: (value_object) -> 
      # this should be 100% equal to value_object
      delete @id
      delete @type
      delete @attributes
      delete @relationships
      delete @links
      angular.merge(@, _.pick(value_object, "id", "type", "attributes", "relationships", "links"))      
      @.$datastore = new csDataStore(value_object.$datastore)

    ################################################################################################
    # TODO: $relationship and $relationships should be merged and $assign_association should use the unified

    $relationship: (rel, opts = {}) -> 
      return null unless rel
      if opts.datastore 
        opts.datastore.get(rel.type, rel.id)
      else
        @.$datastore.get(rel.type, rel.id)

    $relationships: (rel, opts = {}) -> 
      return null unless rel
      actual_datastore = opts.datastore || @.$datastore
      _.map rel, (item) => actual_datastore.get(item.type, item.id)

    $association: (field, opts = {}) -> 
      rel = @relationships && @relationships[field.relationship]      
      if rel
        if angular.isArray(rel.data)
          _.map rel.data, (item) => @.$relationship(item, opts)
        else
          return @.$relationship(rel.data, opts)

    $association_by_name: (relationship, opts = {}) -> 
      rel = @relationships && @relationships[relationship]      
      if rel
        if angular.isArray(rel.data)
          _.map rel.data, (item) => @.$relationship(item, opts)
        else
          return @.$relationship(rel.data, opts)          

    $assign_association: (field, value, opts = {}) -> 
      @relationships ||= {}
      if value
        if angular.isArray(value)
          @relationships[field.relationship] = { 
            data: (_.map value, ((o) -> _.pick(o, "id", "type") ) )
          }
          _.each value, (o) => @.$datastore.put(o.type, o.id, o)
        else
          @relationships[field.relationship] = { data: _.pick(value, "id", "type") }
          @.$datastore.put(value.type, value.id, value)
      else        
        if field.cardinality is 'one'        
          @relationships[field.relationship] = { data: null }
        else
          @relationships[field.relationship] = { data: [] }

    $assign_association_by_name: (relationship, value, opts = {}) -> 
      if value
        if angular.isArray(value)
          @relationships[relationship] = { 
            data: (_.map value, ((o) -> _.pick(o, "id", "type") ) )
          }
          _.each value, (o) => @.$datastore.put(o.type, o.id, o)
        else
          @relationships[relationship] = { data: _.pick(value, "id", "type") }
          @.$datastore.put(value.type, value.id, value)
      else
        field = _.find(@.constructor.descriptor.fields, { relationship: relationship })
        if field.cardinality is 'one'        
          @relationships[field.relationship] = { data: null }
        else
          @relationships[field.relationship] = { data: [] }

    ################################################################################################

    $display_name: () ->
      instance_name = if @.constructor.descriptor.display && @.constructor.descriptor.display.name
        @attributes[@.constructor.descriptor.display.name]
      else
        @attributes['name']  # Best effort guess

      instance_name || @.constructor.descriptor.name

    ################################################################################################

  ##################################################################################################

  return Resource

  ##################################################################################################
]
