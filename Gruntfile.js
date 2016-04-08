"use strict";

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                bitwise: true, 
                eqeqeq: true, 
                esversion: 6, 
                futurehostile: true, 
                strict: true, 
                undef: true, 
                unused: true, 
                node: true
            },
            all: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js']
        },
        simplemocha: {
            options: {
                globals: ['describe', 'it'],
                timeout: 3000,
                ignoreLeaks: false,
                //grep: '*tests',
                ui: 'bdd',
                reporter: 'tap'
            },
            all: { src: ['./test/test.js'] }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-simple-mocha');

    // grunt.registerTask('default', ['jshint', 'simplemocha']);
    grunt.registerTask('default', ['jshint']);
};