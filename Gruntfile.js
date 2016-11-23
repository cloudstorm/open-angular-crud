module.exports = function(grunt) {
  /** 
   * Load required Grunt tasks. These are installed based on the versions listed
   * in `package.json` when you do `npm install` in this directory.
   */
  // grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-haml2html');

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
    
    // /**
    //  * The banner is the comment that is placed at the top of our compiled 
    //  * source files. It is first processed as a Grunt template, where the `<%=`
    //  * pairs are evaluated based on this very configuration object.
    //  */
    // meta: {
    //   banner: 
    //     '/**\n' +
    //     ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
    //     ' * <%= pkg.homepage %>\n' +
    //     ' *\n' +
    //     ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
    //     ' * Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>\n' +
    //     ' */\n'
    // },

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
      watch: {
        files : {}
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

    // GRUNT META TASKS

    /**
     * The directories to delete when `grunt clean` is executed.
     */
    clean: [ 
      '<%= build_dir %>', 
      '<%= compile_dir %>'
    ]

  };

  grunt.initConfig( grunt.util._.extend( taskConfig, userConfig ) );
  
  /**
   * The default task is to build and compile.
   */
  grunt.registerTask( 'default', [ 'build', 'compile' ] );
  
  /**
   * Sass should be first concated and then built
   */
  grunt.registerTask('concat_sass', ['concat', 'sass']);

  /**
   * The `build` task gets your app ready to run for development and testing.
   */
  grunt.registerTask( 'build', [
    'clean', 'coffee', 'sass', 'haml'

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
    // 'less:compile', 'copy:compile_assets', 'ngAnnotate', 'concat:compile_js', 'uglify', 'index:compile'
  ]);

};