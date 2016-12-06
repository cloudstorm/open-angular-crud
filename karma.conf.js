module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      //Setup:
      './node_modules/underscore/underscore-min.js',                    // underscore
      './node_modules/angular/angular.js',                             // angular
      './node_modules/angular-mocks/angular-mocks.js',                 // loads our modules for tests
      './bin/assets/cloudstorm.js',                                    //  cloudstorm itself
      // if you wanna load template files in nested directories, you must use this:
      './src/**/*.haml',

      // Tests:
      './src/components/cs-alert/cs-alert-service.spec.js',
      './src/components/cs-alert/cs-alert.spec.js'
    ],

    // list of files to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      '**/*.haml': ['ng-haml2js']
    },

    ngHaml2JsPreprocessor: {
      stripPrefix: 'public/',
      prependPrefix: 'served/',
      cacheIdFromPath: function(filepath) {
        // remove 'src/' from the start of the filename so the template cache works:
        return filepath.substring(4);
      },
      moduleName: 'hamlTemplates'
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
