"use strict"

angular.module('cloudStorm.restApi', [])

####################################################################################################
.factory 'csRestApi', [ '$q', '$http', ($q, $http) ->
####################################################################################################

  # TODO: Check unused code 'transform_params'
  transform_params = (params) ->
    angular.forEach params, (value, key) ->
      return if (value == null || angular.isUndefined(value))
      if angular.isObject(value)
        params_object = {}
        params_object[key] = value
        delete params[key]
        angular.extend(params, $.param(params_object))
    params


##################################################################################################

  index = (endpoint, query) ->
    deferred = $q.defer()
    request =
      method: 'GET'
      url: endpoint
      headers:
        'Content-Type': 'application/vnd.api+json'
        'Accept': 'application/vnd.api+json'
      params: query
      paramSerializer: '$httpParamSerializerJQLike'

    $http(request).then( (response) =>
      deferred.resolve(response.data)
    ).catch( (response) =>
      deferred.reject(response.data)
    )
    return deferred.promise

  ##################################################################################################

  get = (endpoint, query) ->
    deferred = $q.defer()

    request =
      method: 'GET'
      url: endpoint
      headers:
        'Content-Type': 'application/vnd.api+json'
        'Accept': 'application/vnd.api+json'
      params: query
      paramSerializer: '$httpParamSerializerJQLike'

    $http(request).then( (response) =>
      deferred.resolve(response.data)
    ).catch( (response) =>
      deferred.reject(response.data)
    )

    return deferred.promise

  ##################################################################################################

  update = (endpoint, object, query) ->
    deferred = $q.defer()

    request =
      method: 'PATCH'
      url: endpoint
      headers:
        'Content-Type': 'application/vnd.api+json'
        'Accept': 'application/vnd.api+json'
      data: object
      params: query

    $http(request).then( (response) =>
      deferred.resolve(response.data)
    ).catch( (response) =>
      deferred.reject({data: response.data, status: response.status})
    )

    return deferred.promise

  ##################################################################################################

  create = (endpoint, object) ->
    deferred = $q.defer()

    request =
      method: 'POST'
      url: endpoint
      headers:
        'Content-Type': 'application/vnd.api+json'
        'Accept': 'application/vnd.api+json'
      data: object

    $http(request).then( (response) =>
      deferred.resolve(response.data)
    ).catch( (response) =>
      deferred.reject({data: response.data, status: response.status})
    )

    return deferred.promise

  ##################################################################################################

  destroy = (endpoint) ->
    deferred = $q.defer()

    request =
      method: 'DELETE'
      url: endpoint
      headers:
        'Content-Type': 'application/vnd.api+json'
        'Accept': 'application/vnd.api+json'

    $http(request).then( (response) =>
      deferred.resolve(response.data)
    ).catch( (response) =>
      deferred.reject({data: response.data, status: response.status})
    )

    return deferred.promise

  ##################################################################################################

  return {
    index: index
    get: get
    update: update
    create: create
    destroy: destroy
  }

  ##################################################################################################
]

  # ##################################################################################################

  #   to_json: () ->
  #     object = {}
  #     object[Resource.descriptor.type] = _.pick(@, _.map(Resource.descriptor.fields, ((field) -> field.attribute)))
  #     return object

  # ##################################################################################################
