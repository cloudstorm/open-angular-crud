angular.module('todoList.resources.categories', ['cloudstorm.rest-api'])

####################################################################################################
.factory 'categoriesResource', ['ResourceService', 'csRestApi', 'csResource', (ResourceService, csRestApi, csResource) ->
####################################################################################################

  class Category extends csResource

  ##################################################################################################

    @endpoint = 'api/v1/categories'
    @member_endpoint = 'api/v1/categories/{id}'

  ##################################################################################################

    @descriptor = {
      type: 'categories'
      name: 'Category'
      hint: 'list'

      fields: [
        { attribute: 'name', label: 'name', type: 'string', cardinality: 'one', required: true, read_only: false }
      ]

      display: {
        name:   'name'
        search: 'name_x_cont'
      }

    }

  ##################################################################################################

  ResourceService.register(Category.descriptor.type, Category)

  ##################################################################################################

  return Category

]
