# Decorates scope with common functionality shared between CS input directives
# NB! introduces coupling which is bad
# Coupling's bad m`kay?!

"use strict"

app = angular.module('cloudStorm.inputBase', [])

# ===== DIRECTIVE =============================================================

app.factory "csInputBase", [ ->

  build = ($scope) ->

    $scope.fieldDisabled = () ->
      $scope.field.read_only && $scope.formMode != 'create'

    $scope.fieldRequired = () ->
      $scope.field.required

    $scope.createDisabled = () ->
      $scope.field.create_disabled

    $scope.mode = (mode) ->
      return $scope.formMode == mode

    $scope.style = (name) ->
      return $scope.styleMap[name]

  return build

]
