## Configuring CloudStorm settings

You can use the angular `module.config` method to provide app-wide settings.
**Example**
```javascript
angular.module("myApp").config([
  'csSettingsProvider', function(csSettingsProvider) {
    csSettingsProvider.set('date-format', 'yyy-MM-dd');
    csSettingsProvider.set('time-zone-offset', '+0600');
  }
]);
```

See the [list of available options](#cs-settings-provider) for CS Settings Provider  

See the defaults in [cloudstorm.js](../src/cloudstorm.js.coffee)

> If an option is set in both a CS Setting and an attribute on the template chain (in either of csWizard -> csForm -> csField), **the attribute option has precedence over the CS Settings value**

## Internationalization

You can override swap the default i18n implementation with a chosen internationalization engine.
> Make sure taht it provides a `t(key)` function, which returns the matching `value` for `key`.
```javascript
angular.module("myApp").config([
  'csSettingsProvider', function(csSettingsProvider) {
    csSettingsProvider.set('i18n-engine', myOwnLocalizationProvider.$get())
  }
]);
```