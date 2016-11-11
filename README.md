# [CloudStorm](http://cloudstorm.io)
:octocat: We are currently looking for contributors and beta testers

<a href="http://cloudstorm.io"><img src="./docs/images/logo.png" height="140" align="right"></a>

## Philosophy
Devagement  
Opinionated framework

## Resources
* [Reference](docs/README.md)  
* [Releases](../../releases)
* Examples
* Tutorial

## Getting started

1. Require `cloudstorm/src/cloudstorm.js.coffee` in your app's main JS file
1. Require `cloudstorm/src/cloudstorm.css.scss` in your app's main CSS file
1. Inject `"cloudStorm"` as dependency in your Angular app
1. Enjoy!

#### Dependencies
* Sass compiler
* CoffeeScript compiler

#### Data format / required API
CloudStorm uses the [JSON API format](http://jsonapi.org/format/#document-structure) and convetions for client-server communications.

> If you are unsure whether your backed serves data in the right format, there are [dozens of libraries](http://jsonapi.org/implementations/) to choose from which implement JSON API in Node.js, Ruby, PHP, Python, Java, .NET and more!

#### Configuring CloudStorm settings

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


## License
See the [LICENSE](./LICENSE.txt) file.
