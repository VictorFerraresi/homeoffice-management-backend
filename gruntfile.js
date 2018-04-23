'use strict';

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.initConfig({
        jshint: {
          all: ['Gruntfile.js', 'index.js', 'app/**/*.js'],
          options : {
            jshintrc : '.jshintrc'
          }
        }
    });

    grunt.registerTask('default', ['jshint']);
};
