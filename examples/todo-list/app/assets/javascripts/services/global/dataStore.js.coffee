"use strict"

angular.module('todoList.services').service 'DataStore', ['$resource', '$q', ($resource, $q) ->

  construct = (constructor) ->
      factoryFunction = constructor.bind.apply(constructor, arguments)
      new factoryFunction();

  root_path = window.root_url

  storeCollection = []

  class Datastore

    @destroy_all: () ->
      store.destroy_all() for store in storeCollection

    @extends: (service) ->

      class AbstractService

        entityName: service.prototype.constructor.name.underscore()
        serviceName: service.prototype.constructor.name.underscore().pluralize()

        objectStore: {}

        resource_options = service.resource_options || {}
        angular.extend resource_options, {
          update:
            method: 'PUT'
            transformRequest: (entity) ->
              object = {}
              if entity.serialize
                object[service::entityName] = entity.serialize()
              else
                object[service::entityName] = entity
              JSON.stringify object
        }

        resource: $resource "#{root_path}#{@::serviceName}/:id/:memberRoute", { id: '@id', memberRoute: '@memberRoute'}, resource_options

        get: (params, callback) ->
          instance = {}
          this.$get params, (entity) ->
            instance = service.build(entity)
            callback(entity) if callback
          instance

        @store: ()   -> @::objectStore
        @first: ()   -> @::objectStore[Object.keys(@::objectStore)[0]]
        @find : (id) -> @::objectStore[id]

        @destroy_all: ()   -> @::objectStore = {}

        @create: (attrs) ->
          deferred = $q.defer();

          entity = {}
          entity[service::entityName] = attrs
          service_entity = new service(entity)
          service_entity.$save ( (entity) ->
            attrs.id = entity.id
            deferred.resolve(attrs)
          ), ( (err) ->
            deferred.reject()
          )

          deferred.promise


        @build: (entity) ->
          instance = @::objectStore[entity.id]
          if instance
            if instance.merge_new_instance
              instance.merge_new_instance(construct(service, entity))
            else
              angular.extend(instance, construct(service, entity))
            delete instance.$$hashkey
          else
            instance = @::objectStore[entity.id] = construct(service, entity)
          instance

        @all: (options) ->
          self = this

          @options || = { params: {}, callback: undefined }
          $.extend(true, @options, options);
          { params, callback } = @options

          delete @options

          results = []
          @::resource.query params, (entities) ->
            angular.forEach entities, (entity) ->
              instance = self.build(entity)
              results.push(instance)
            callback(results) if callback
          results

      angular.extend(service::, AbstractService::)
      angular.extend(service::, service::resource::)
      angular.extend(service, AbstractService)
      storeCollection.push(service)

  window.DataStore = Datastore

]
