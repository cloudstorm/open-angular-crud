"use strict"

app = angular.module("cloudStorm")

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