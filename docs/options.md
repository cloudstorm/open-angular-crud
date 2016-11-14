## Configuring CloudStorm settings

You can use the angular `module.config` method to provide app-wide defaults.
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

> If an option is set in both a CS Setting and an attribute on the template chain (in either of csWizard -> csForm -> csField), **the attribute option has precedence over the CS Settings value**

