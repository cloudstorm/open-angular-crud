# CloudStrom Alert 
# Uses default bootstrap types: 'success', 'info', 'warning', 'danger'

"use strict"

app = angular.module('cloudStorm')


# ===== DIRECTIVE =============================================================

app.directive "csAlert", ['csAlertService', (csAlertService) ->

  # ===== COMPILE =============================================================

  compile = ($templateElement, $templateAttributes) ->

    # Only modify the DOM in compile, use (pre/post) link for others
    $templateElement.addClass "cs-alert"

    # Pre-link: gets called for parent first
    pre: (scope, element, attrs, controller) ->
      return
    
    # Post-link: gets called for children recursively after post() traversed the DOM tree
    post: link

  # ===== LINK ================================================================

  link = (scope, element, attrs, controller) ->    
    scope.csAlertService = csAlertService
    return

  # ===== CONFIGURE ===========================================================
  
  return {
    restrict: 'E'
    templateUrl: 'components/cs-alert/cs-alert-template.html'
    compile: compile
  }

]
