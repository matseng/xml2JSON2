/*global module:false*/
module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      src: ['Gruntfile.js', 'src/app/**/*.js', 'src/config.js', 'tests/app/**/*.js'],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          require: true,
          define: true,
          requirejs: true,
          describe: true,
          expect: true,
          it: true
        }
      }
    },

    watchit: {
      jshint: {
        files: '<%= jshint.src %>',
        tasks: ['jshint']
      },
      other : {
        files: ['src/**/*.js', 'lib/**/*js', 'tests/**/*Spec.js'],
        tasks: ['mocha']
      }
    },
    
    mocha: {
      all: ['lib/xml2json/tests/testRunner.html'],
      options: {
        run: true,
        bail: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha');

  // We want to build it before we watch, so can one-line it:
  grunt.renameTask('watch', 'watchit');

  grunt.registerTask('default', 'jshint');
  grunt.registerTask('test', 'mocha');
  grunt.registerTask('watch', ['mocha', 'watchit']);

};