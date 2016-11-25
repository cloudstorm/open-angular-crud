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

  /**
   * Load in our build configuration file.
   */
  var userConfig = require( './build.config.js' );

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
        ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * <%= pkg.homepage %>\n' +
        ' *\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        ' * Licensed <%= pkg.license %> \n' +
        ' */\n'
    },

    // uglify: {
    //   options: {
    //     banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
    //   },
    //   build: {
    //     src: 'src/<%= pkg.name %>.js',
    //     dest: 'build/<%= pkg.name %>.min.js'
    //   }
    // },
    
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
          '<%= vendor_files.css %>',
          '<%= app_files.sass %>',
        ],
        dest: '<%= build_dir %>/concat.scss',
      }
    },
    
    copy: {
      compile_assets: {
        files: [
          {
            src: [ '**' ],
            cwd: '<%= build_dir %>/assets',
            dest: '<%= compile_dir %>/assets',
            expand: true
          },
          {
            cwd: '.',
            src: [ '<%= vendor_files.css %>' ],
            dest: '<%= compile_dir %>/',
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
            "vendor/bootstrap-sass/assets/stylesheets",
            "src"
          ]
        },
        files: {
          '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css': '<%= app_files.sass %>'
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
          banner: '<%= meta.banner %>'
        },
        src: [ 
          // '<%= vendor_files.js %>', 
          // 'module.prefix', 
          '<%= app_files.built_js %>',
          '<%= html2js.build.dest %>', 
          // 'module.suffix' 
        ],
        dest: '<%= compile_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.js'
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
        command: 'cd bin && python -m SimpleHTTPServer 8000'
        // command: 'cd bin && python -m SimpleHTTPServer 8000'
      },
      stop_web: {
        command: "kill -9 `ps -ef |grep SimpleHTTPServer |awk '{print $2}'`"
      },
    },

    /** 
     * Watches
     * LiveReload is added through grunt-contrib-watch
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

      sample_app: {
        files: [ 
          '<%= sample_dir %>/**',
        ],
        tasks: [ 'exec:say:sample', 'copy:sample_app' ]
      },
    },

  };

  grunt.initConfig( grunt.util._.extend( taskConfig, userConfig ) );
  
  grunt.registerTask( 'start_web', ['exec:say:web','exec:start_web' ]);

  // *
  //  * In order to make it safe to just compile or copy *only* what was changed,
  //  * we need to ensure we are starting from a clean, fresh build. So we rename
  //  * the `watch` task to `delta` (that's why the configuration var above is
  //  * `delta`) and then add a new task called `watch` that does a clean build
  //  * before watching for changes.
   
  // grunt.renameTask( 'watch', 'delta' );
  // grunt.registerTask( 'watch', [ 
  //   'build', 'delta' 
  //   // 'build', 'karma:unit', 'delta' 
  // ]);

  /**
   * The default task is to build and compile.
   */
  grunt.registerTask( 'default', [ 'build', 'compile', 'start_web' ] );
  
  /**
   * The `build` task gets your app ready to run for development and testing.
   */
  grunt.registerTask( 'build', [
    'clean', 'coffee', 'sass', 'haml', 'html2js', 'copy:sample_app'

    // 'clean', 'html2js', 'jshint', 'coffeelint', 'coffee', 'less:build',
    // 'concat:build_css', 'copy:build_app_assets', 'copy:build_vendor_assets',
    // 'copy:build_appjs', 'copy:build_vendorjs', 'copy:build_vendorcss', 'index:build', 'karmaconfig',
    // 'karma:continuous' 
  ]);

  /**
   * The `compile` task gets your app ready for deployment by concatenating and
   * minifying your code.
   */
  grunt.registerTask( 'compile', [
    'copy:compile_assets', 'concat:compile_js'
    // 'less:compile', 'copy:compile_assets', 'ngAnnotate', 'concat:compile_js', 'uglify', 'index:compile'
  ]);

};