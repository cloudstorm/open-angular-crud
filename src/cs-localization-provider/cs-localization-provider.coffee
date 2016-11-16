angular.module('cloudStorm')

####################################################################################################
# A simple key-value lookup base translation service

.provider 'csLocalization', [ () ->
  
####################################################################################################

  defaultTranslations = {
    'false': 'Yes'
    'true': 'No'
    'buttons.cancel': 'Cancel'
    'buttons.close': 'Close'
  }
  
  translations = defaultTranslations

  ##################################################################################################

  Localization = {
    add: (string, translation) -> translations[string] = translation
    t:   (key) -> translations[key] || key
  }

  ##################################################################################################

  $get: -> Localization

####################################################################################################

]