# Decorates scope with common functionality shared between CS input directives
# NB! introduces coupling which is bad
# Coupling's bad m`kay?!

"use strict"

# ===== SETUP =================================================================

# Make sure that the components module is defined only once
try
  # Module already defined, use it
  app = angular.module("cloudStorm")
catch err
  # Module not defined yet, define it
 app = angular.module('cloudStorm', [])


# ===== DIRECTIVE =============================================================

app.factory "CSInputBase", [ ->

  build = ($scope) ->

    $scope.fieldDisabled = () ->
      $scope.field.read_only && $scope.formMode != 'create'

    $scope.fieldRequired = () ->
      $scope.field.required

    $scope.createDisabled = () ->
      $scope.field.create_disabled

  return build

]
