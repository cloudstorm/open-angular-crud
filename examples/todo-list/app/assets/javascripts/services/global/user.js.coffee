"use strict"

angular.module('todoList.services').service 'User', ['DataStore', '$q', (DataStore, $q) ->

  class User


  DataStore.extends(User)
  window.WindowUser = User

]
