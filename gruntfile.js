/* global module, require  */
module.exports = function (grunt) {
    'use strict';

    var SRC_DIR = 'src/',
        SRC_FILES = [
            SRC_DIR + 'chip8.js',
            SRC_DIR + 'chip8-cpu.js',
            SRC_DIR + 'chip8-is.js',
            SRC_DIR + 'chip8-keyboard.js',
            SRC_DIR + 'chip8-screen.js',
            SRC_DIR + 'chip8-audio.js'
        ],
        TEST_DIR = 'test/',
        SPEC_FILES = [
            TEST_DIR + 'spec/audio.spec.js',
            TEST_DIR + 'spec/screen.spec.js',
            TEST_DIR + 'spec/keyboard.spec.js',
            TEST_DIR + 'is.helpers.js',
            TEST_DIR + 'spec/is.spec.js'
        ],
        BUILD_DIR = 'build/',
        DOC_DIR = 'doc',
        BUILD_TARGET = 'chip8.min.js';

    grunt.initConfig({
        _TARGET: BUILD_DIR + BUILD_TARGET,

        concat: {
            dist: {
                src: SRC_FILES,
                dest: '<%= _TARGET %>'
            }
        },

        closurecompiler: {
            minify: {
                files: {
                    "<%= _TARGET %>": '<%= _TARGET %>'
                },
                options: {
                    "compilation_level": "SIMPLE_OPTIMIZATIONS",
                    "banner": '/*\n' + require('fs').readFileSync('LICENSE', { encoding: 'utf8' }) + '*/'
                }
            }
        },

        umd: {
            build: {
                options: {
                    src: '<%= _TARGET %>',
                    dest: '<%= _TARGET %>',
                    objectToExport: 'chip8',
                    template: 'umd.hbs'
                }
            }
        },

        jasmine: {
            dev: {
                src: SRC_FILES,
                options: {
                    specs: SPEC_FILES
                }
            },
            prod: {
                src: '<%= _TARGET %>',
                options: {
                    specs: SPEC_FILES
                }
            }
        },

        jshint: {
            src: [ 'gruntfile.js', SRC_FILES, SPEC_FILES ],
            options: {
                jshintrc: true
            }
        },

        jsdoc : {
            dist : {
                src: SRC_FILES.concat('README.md'),
                options: {
                    configure: 'jsdoc.conf.json',
                    destination: DOC_DIR,
                    private: false,
                    template : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template"
                }
            }
        },

        clean: [ BUILD_DIR, DOC_DIR ]
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-closurecompiler');
    grunt.loadNpmTasks('grunt-umd');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('dist', ['build', 'jsdoc']);
    grunt.registerTask('build', ['concat', 'umd:build', 'closurecompiler:minify']);
    grunt.registerTask('test:prod', ['jasmine:prod']);
    grunt.registerTask('test:dev', ['jasmine:dev']);
    grunt.registerTask('test', ['test:dev']);
    grunt.registerTask('default', ['build']);
};