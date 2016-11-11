<a href="http://cloudstorm.io"><img src="./doc/images/logo.png" height="100" align="left" hspace="1" vspace="1"></a>
<br /> <br /> <br /> <br />

## Resources
* Project website: [cloudstorm.io](http://cloudstorm.io)  
* [Component documentation](doc/components/components.md)  
* [Advanced reference](doc/components/under_the_hood.md)

## Dependencies
* Sass compiler
* CoffeeScript compiler

## Using CloudStorm

1. Require `cloudstorm/src/cloudstorm.js.coffee` in your app's main JS file
1. Require `cloudstorm/src/cloudstorm.css.scss` in your app's main CSS file
1. Inject `"cloudStorm"` as dependency in your Angular app
1. Enjoy!

#### Data format / required API
CloudStorm uses the [JSON API format](http://jsonapi.org/format/#document-structure) and convetions for client-server communications.

> If you are unsure whether your backed serves data in the right format, there are [dozens of libraries](http://jsonapi.org/implementations/) to choose from which implement JSON API in Node.js, Ruby, PHP, Python, Java, .NET and more!

#### Configuring CloudStorm settings

You can use the angular `module.config` method to provide app-wide defaults.
**Example**
```
angular.module("myApp").config([
  'csSettingsProvider', function(csSettingsProvider) {
    csSettingsProvider.set('date-format', 'yyy-MM-dd');
    csSettingsProvider.set('time-zone-offset', '+0600');
  }
]);
```

See the [list of available options](#cs-settings-provider) for CS Settings Provider

> If an option is set in both a CS Setting and an attribute on the template chain (in either of csWizard -> csForm -> csField), **the attribute option has precedence over the CS Settings value**
