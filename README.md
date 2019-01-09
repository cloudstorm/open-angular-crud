## What is Open Angular Crud?
It creates all administration and data manipulation screens and forms for any resource in a database.
The following are automatically generated for You:
* Index pages with in-place editing
* Resource creation forms
* Resource edit forms

* Wizards -> forms within forms to create related resources in-place
## Resources
This is the main source of documentation for **developers** working with (or contributing to) the project.
* [Basic How-To](docs/basics.md)
* [Reference](docs/README.md)
* [Releases](../../releases)
* [Example Rails Apps](https://github.com/cloudstorm/rails-examples)

## Getting started
#### Installation
1. Install via Bower `bower install cloudstorm`
1. Require `cloudstorm/src/cloudstorm.js.coffee` in your app's main JS file
1. Require `cloudstorm/src/cloudstorm.css.scss` in your app's main CSS file
1. Inject `"cloudStorm"` as dependency in your Angular app
1. Enjoy! or read [the Basics](docs/basics.md)

#### Dependencies
* A JSON API serializer for the backend.
  _There are dozens of libraries to choose from, see the [Basic How-to](docs/basics.md) for more info._

## Bugs and Feedback
For bugs, questions and discussions please use [Github Issues](../../issues).

## License
See the [LICENSE](./LICENSE.txt) file.
