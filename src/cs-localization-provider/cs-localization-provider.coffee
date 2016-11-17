angular.module('cloudStorm')

####################################################################################################
# A simple key-value lookup base translation service

.provider 'csLocalization', [ () ->
  
####################################################################################################

  defaultTranslations = {
    'false': 'Yes'
    'true': 'No'
    'new': 'New'
    'create_another': 'Create another'
    'validation_text': 'Some required fields (marked *) are not yet set'
    'buttons.cancel': 'Cancel'
    'buttons.close': 'Close'
    'buttons.submit': 'Submit'
    'alert.nothing_changed': 'Nothing changed'
    'alert.changes_saved': 'Changes saved'
    'alert.error_happened': 'An error happened'
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