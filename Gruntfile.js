module.exports = function(grunt) {

    'use strict';

    // Project configuration.
    grunt.initConfig({
      watch: {
        files:['scss/*.scss'],
        tasks: ['sass']
      },
      sass: {
        dist: {
          options: {
            style: 'expanded',
            lineNumbers: true,
            sourcemap: 'none'
          },
          files: [{
            expand: true,
            cwd: 'scss/',
            src: ['*.scss'],
            dest: './',
            ext: '.css'
          }]
        }
      }

    });

    require('load-grunt-tasks')(grunt);

    // Default task(s).
    grunt.registerTask('default', []);

};
