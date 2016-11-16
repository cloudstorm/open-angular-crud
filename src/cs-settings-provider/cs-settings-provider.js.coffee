"use strict"

# Make sure that the components module is defined only once
try
  # Module already defined, use it
  app = angular.module("cloudStorm")
catch err
  # Module not defined yet, define it
  app = angular.module('cloudStorm', [])

###############################################################################

app.provider 'csSettings', ['csLocalizationProvider', (csLocalizationProvider) ->
  
  defaultSettings = {
    'i18n-engine': csLocalizationProvider.$get()
  }
  
  @settings = defaultSettings

  @set = (option, value) ->
    @settings[option] = value
    return

  @$get = ->
    @

  return

]