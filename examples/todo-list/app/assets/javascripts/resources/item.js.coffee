angular.module('todoList.resources.item', ['cloudstorm.rest-api'])

####################################################################################################
.factory 'itemsResource', ['ResourceService', 'csRestApi', 'csResource', (ResourceService, csRestApi, csResource) ->
####################################################################################################

  class Item extends csResource

  ##################################################################################################

    @endpoint = 'api/v1/items'
    @member_endpoint = 'api/v1/items/{id}'

  ##################################################################################################

    @descriptor = {
      type: 'items'
      name: 'Item'
      hint: 'list'

      fields: [
        { attribute: 'title', label: 'title', type: 'string', cardinality: 'one', required: true, read_only: false }
        { attribute: 'description', label: 'description', type: 'string', cardinality: 'one', required: false, read_only: false }
        { attribute: 'due_date', label: 'due_date', type: 'date', cardinality: 'one', required: true, read_only: false }
        { attribute: 'done', label: 'done', type: 'boolean', cardinality: 'one', required: false, read_only: false, default: false }
        { attribute: 'categories', label: 'categories', type: 'resource', resource: 'categories',  cardinality: 'many', relationship: 'categories', read_only: false }
        { attribute: 'user_id', label: 'User', type: 'resource', resource: 'users', cardinality: 'one', relationship: 'user', read_only: true }
      ]

      attributes_to_hide: {
        index:  ['user_id']
        create: ['user_id']
        edit:   ['user_id']
      }

      display: {
        name:   'title'
        search: 'title_x_cont'
      }

    }

  ##################################################################################################

  ResourceService.register(Item.descriptor.type, Item)

  ##################################################################################################

  return Item

]
