angular.module('todoList.resources.user', ['cloudstorm.rest-api'])

####################################################################################################
.factory 'usersResource', ['ResourceService', 'csRestApi', 'csResource', (ResourceService, csRestApi, csResource) ->
####################################################################################################

  class User extends csResource

  ##################################################################################################

    @endpoint = 'api/v1/users'
    @member_endpoint = 'api/v1/users/{id}'

  ##################################################################################################

    @descriptor = {
      type: 'users'
      name: 'User'
      hint: 'list'

      fields: [
        { attribute: 'email', label: 'email', type: 'string', cardinality: 'one', required: false, read_only: false }
      ]

      display: {
        name:   'email'
        search: 'email_x_cont'
      }

    }

  ##################################################################################################

  ResourceService.register(User.descriptor.type, User)

  ##################################################################################################

  return User

]
