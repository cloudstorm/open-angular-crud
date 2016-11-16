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
      hint: 'BLANK'

      fields: [
        { attribute: 'title', label: 'title', type: 'string', cardinality: 'one', required: true, read_only: false }
        { attribute: 'description', label: 'description', type: 'string', cardinality: 'one', required: false, read_only: false }
        { attribute: 'due_date', label: 'due_date', type: 'date', cardinality: 'one', required: true, read_only: false }
        { attribute: 'done', label: 'done', type: 'boolean', cardinality: 'one', required: false, read_only: false, default: false }
        { attribute: 'categories', label: 'categories', type: 'resource', resource: 'categories',  cardinality: 'many', relationship: 'categories', read_only: false }

      ]

    }

  ##################################################################################################

  ResourceService.register(Item.descriptor.type, Item)

  ##################################################################################################

  return Item

]
