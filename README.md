# [CloudStorm](http://cloudstorm.io)
Welcome to CloudStorm - the open-source enterprise software framework for web developers

If this is your first time hearing about CloudStorm, we recommend starting with the [CloudStorm website](http://cloudstorm.io).
## What is CloudStorm?
CloudStorm creates all data manipulation screens and forms for you

:octocat: We are currently looking for contributors and beta testers  

<a href="http://cloudstorm.io"><img src="./docs/images/logo.png" height="140" align="right"></a>

## Philosophy
Devagement  
Opinionated framework

## What does it do?

## Resources
* [How-to](docs/basics.md)
* [Reference](docs/README.md)  
* [Releases](../../releases)
* Examples
* Tutorial

## Getting started
1. Install via Bower `bower install cloudstorm`
1. Require `cloudstorm/src/cloudstorm.js.coffee` in your app's main JS file
1. Require `cloudstorm/src/cloudstorm.css.scss` in your app's main CSS file
1. Inject `"cloudStorm"` as dependency in your Angular app
1. Enjoy! or read [the How-To](docs/basics.md)

#### Dependencies
* Sass compiler
* CoffeeScript compiler

#### Data format / required API
CloudStorm uses the [JSON API format](http://jsonapi.org/format/#document-structure) and convetions for client-server communications.

> If you are unsure whether your backed serves data in the right format, there are [dozens of libraries](http://jsonapi.org/implementations/) to choose from which implement JSON API in Node.js, Ruby, PHP, Python, Java, .NET and more!

## Run Demo
To run a demo app do the following:  
```
$ git clone git@github.com:cloudstorm/cloudstorm.git
$ cd cloudstorm

```

## License
See the [LICENSE](./LICENSE.txt) file.
