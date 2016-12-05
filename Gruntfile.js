module.exports = function(grunt) {
  /**
   * Load required Grunt tasks. These are installed based on the versions listed
   * in `package.json` when you do `npm install` in this directory.
   */
  // grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-haml2html');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-aws-s3');
  grunt.loadNpmTasks('grunt-karma');

  /**
   * Load in our build configuration file.
   */
  var userConfig = require( './build.config.js' );

  /**
   * Load in our AWS credentials
   */
  var awsConfig = require( './aws.config.js' );

  /**
   * Use port parameter for the http server (defaults to 8000)
   */
  var optionsConfig = {
    port: grunt.option('port') || '8000',
  };

  /**
   * This is the configuration object Grunt uses to give each plugin its
   * instructions.
   */
  var taskConfig = {
    /**
     * We read in our `package.json` file so we can access the package name and
     * version. It's already there, so we don't repeat ourselves here.
     */
    pkg: grunt.file.readJSON("package.json"),

    /**
     * The banner is the comment that is placed at the top of our compiled
     * source files. It is first processed as a Grunt template, where the `<%=`
     * pairs are evaluated based on this very configuration object.
     */
    meta: {
      banner:
        '/**\n' +
        ' * <%= pkg.name %> - v<%= grunt.file.readJSON("package.json").version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * <%= pkg.homepage %>\n' +
        ' *\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        ' * Licensed <%= pkg.license %> \n' +
        ' */\n'
    },

    coffee: {
      source: {
        options: {
          bare: true
        },
        expand: true,
        cwd: '.',
        src: [ '<%= app_files.coffee %>' ],
        dest: '<%= build_dir %>',
        ext: '.js'
      }
    },

    /*
     * http://stackoverflow.com/questions/27494340/how-to-use-grunt-to-recursively-compile-a-directory-of-haml-or-jade
     */
    haml: {
      build: {
        files : [
          { expand: true,
            cwd: '.',
            src: [ '<%= app_files.haml %>' ],
            dest: '<%= build_dir %>',
            ext : '.html'
          }
        ]
      },
    },

    /**
     * HTML2JS is a Grunt plugin that takes all of your template files and
     * places them into JavaScript files as strings that are added to
     * AngularJS's template cache. This means that the templates too become
     * part of the initial payload as one JavaScript file. Neat!
     */
    html2js: {
      build: {
        options: {
          base: 'build/src',
          module: 'cloudStorm.templates'
        },
        src: [ '<%= app_files.template %>' ],
        dest: '<%= build_dir %>/templates.js'
      }
    },

    concat: {
      dist: {
        options: {
          process: function(src, filepath) {
            return  '\n\n' + '// Original: ' + filepath + '\n\n' + src;
          }
        },
        src: [
          '<%= app_files.sass_main %>'
        ],
        dest: '<%= build_dir %>/concat.scss',
      }
    },

    copy: {
      compiled_assets: {
        files: [
          {
            src: [ '**' ],
            cwd: '<%= build_dir %>/assets',
            dest: '<%= compile_dir %>/assets',
            expand: true
          }
        ]
      },
      sample_app: {
        files: [
          {
            src: [ '**'] ,
            cwd: '<%= sample_dir %>',
            dest: '<%= compile_dir %>/',
            expand:true
          }
       ]
      }
    },

    /**
     * `grunt-contrib-sass` handles SCSS compilation.
     * Only the main cloudstorm stylesheet file is included in compilation;
     * all other files must be imported from this file.
     */
    sass: {
      build: {
        options:{
          loadPath: [
            "src"
          ]
        },
        files: {
          '<%= build_dir %>/assets/<%= pkg.name %>.css': '<%= app_files.sass_main %>'
        }
      }
    },

    concat: {
      /**
       * The `compile_js` target is the concatenation of our application source
       * code and all specified vendor source code into a single file.
       */
      compile_js: {
        options: {
          banner: '<%= meta.banner %>',
          sourceMap: true
        },
        src: [
          // 'module.prefix',
          '<%= app_files.built_js %>',
          '<%= html2js.build.dest %>',
          // 'module.suffix'
        ],
        dest: '<%= compile_dir %>/assets/<%= pkg.name %>.js'
      }
    },

    /**
     * The directories to delete when `grunt clean` is executed.
     */
    clean: [
      '<%= build_dir %>',
      '<%= compile_dir %>'
    ],

    exec: {
      say: {
        cmd: function(text) {
          return 'say ' + text;
        }
      },
      start_web: {
        command: 'cd bin && python -m SimpleHTTPServer <%= port %>'
        // command: 'cd bin && python -m SimpleHTTPServer 8000'
      },
      stop_web: {
        command: "kill -9 `ps -ef |grep SimpleHTTPServer |awk '{print $2}'`"
      },
    },

    /**
     * Increments the version number, commits, tags and pushes to origin
     */
    bump: {
      options: {
        files: [
          "package.json",
          "bower.json"
        ],
        commit: true,
        commitMessage: 'Release: v%VERSION%',
        commitFiles: [
          "package.json",
          "bower.json"
        ],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'origin'
      }
    },

    /**
     * Pushes compiled js and css files to CDN (AWS S3)
     */
    aws_s3: {
      options: {
        accessKeyId: '<%= aws.accessKeyId %>',
        secretAccessKey: '<%= aws.secretKey %>'
      },
      dist: {
        options: {
          bucket: '<%= aws.bucketName %>',
          region: '<%= aws.bucketRegion %>'
        },
        files: [
          {
            expand: true,
            cwd: 'bin/assets',
            src: [ '**' ],
            dest: '/'
          }
        ]
      }
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },

    /**
     * Watches
     * LiveReload is added through grunt-coníib-watch
     * User LiveReload with a browser extension or if you prefer to not,
     * then make sure the following is added to the end of the body tag in HTML:
     * <script src="http://localhost:35729/livereload.js"></script>
     */
    watch: {
      /**
       * By default, we want the Live Reload to work for all tasks; this is
       * overridden in some tasks (like this file) where browser resources are
       * unaffected. It runs by default on port 35729, which your browser
       * plugin should auto-detect.
       */
      options: {
        livereload: true
      },

      /**
       * When our CoffeeScript source files change, we want to  lint them and
       * run our unit tests.
       */
      coffeesrc: {
        files: [
          '<%= app_files.coffee %>'
        ],
        tasks: [ 'exec:say:coffee', 'coffee', 'concat:compile_js' ]
        // tasks: [ 'coffeelint:src', 'coffee:source', 'karma:unit:run', 'copy:build_appjs' ]
      },
      hamlsrc: {
        files: [
          '<%= app_files.haml %>'
        ],
        tasks: [ 'exec:say:haml', 'haml', 'html2js', 'concat:compile_js' ]
        // tasks: [ 'coffeelint:src', 'coffee:source', 'karma:unit:run', 'copy:build_appjs' ]
      },
      sasssrc: {
        files: [
          '<%= app_files.sass %>'
        ],
        tasks: [ 'exec:say:sass', 'sass', 'copy:compiled_assets' ]
      },
      sample_app: {
        files: [
          '<%= sample_dir %>/**',
        ],
        tasks: [ 'exec:say:sample', 'copy:sample_app' ]
      },
    },

  };

  grunt.initConfig( grunt.util._.extend( taskConfig, userConfig, awsConfig, optionsConfig ) );

  grunt.registerTask( 'start_web', ['exec:say:web','exec:start_web' ]);

  /**
   * The default task is to build and compile.
   */
  grunt.registerTask( 'default', [ 'build', 'compile', 'start_web' ] );

  grunt.registerTask( 'cdn', 'aws_s3:dist' );

  grunt.registerTask( 'deploy', ['release', 'aws_s3:dist'] );

  grunt.registerTask ('release', function(t) {
    var target = t || 'patch';
    grunt.task.run('bump-only:' + target, 'build', 'compile', 'bump-commit');
  });

  /**
   * The `build` task gets your app ready to run for development and testing.
   */
  grunt.registerTask( 'build', [
    'clean', 'coffee', 'sass', 'haml', 'html2js', 'copy:sample_app'
  ]);

  /**
   * The `compile` task gets your app ready for deployment by concatenating and
   * minifying your code.
   */
  grunt.registerTask( 'compile', [
    'copy:compiled_assets', 'concat:compile_js'
  ]);

};
