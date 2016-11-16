# TODO: remove this, as it is now included in cloudstorm
angular.module('todoList.localization')

# A simple key-value lookup base translation service
.provider 'localization', [ () ->

  translations = []

  Localization = {
    add: (string, translation) -> translations[string] = translation
    t:   (key) -> translations[key] || key
  }

  $get: -> Localization

]
