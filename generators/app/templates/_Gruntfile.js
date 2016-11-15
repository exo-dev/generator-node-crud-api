module.exports = function(grunt) {
    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        env: {
            dev: {
                XUNIT_FILE: 'results/xunit.xml'
            }
        },

        mochaTest: {
            test: {
                options: {
                    reporter         : 'spec',
                    captureFile      : 'results/results.txt',
                    quiet            : false,
                    clearRequireCache: false
                },
                src    : ['./tests/**/*.js']
            }
        },

        eslint: {
            jenkins: {
                options: {
                    format    : './node_modules/eslint-formatter-checkstyle-relative-paths',
                    outputFile: 'eslint.xml'
                },
                src    : ['./lib/**/*.js']
            },
            dev    : {
                options: {
                    format: 'stylish'
                },
                src    : ['./lib/**/*.js']
            },
            watch  : {
                options: {
                    format: 'stylish'
                },
                src    : ['./lib/**/*.js']
            }
        },

        watch: {
            scripts: {
                files  : ['./lib/**/*.js', './tests/**/*.js'],
                tasks  : ['eslint:watch', 'mochaTest'],
                options: {
                    event: ['added', 'changed', 'deleted']
                }
            }
        },

        mocha_istanbul   : {
            src    : "tests/**/*.js",
            options: {
                coverage       : true,
                excludes       : ['node_modules/**', 'tests/**', 'results/**', 'main.js'],
                istanbulOptions: ['--include-all-sources=true'],
                root           : './lib',
                coverageFolder : 'results',
                reporter       : 'xunit-file',
                reportFormats  : ['cobertura', 'lcovonly', 'html'],
                quiet          : false
            }
        },
        convert          : {
            options : {
                explicitArray: false
            },
            yml2json: {
                src : ['./swagger/user.yaml'],
                <% if (useModels) { %>
                dest: './swagger/user.json'
                <% } else {%>
                dest: './swagger/swagger.json'
                <% } %>
            }
        }<% if (useModels) { %>,
        'baucis-swagger2': {
            main: {
                src : './lib/models',
                dest: './swagger/baucis.json'
            }
        },
        'merge-json'     : {
            swagger: {
                src : ['./swagger/baucis.json', './swagger/user.json'],
                dest: './swagger/swagger.json'
            }
        }
        <% } %>
    });

    grunt.registerTask('test', [
        'env:dev', 'eslint:jenkins', 'mocha_istanbul'
    ]);
    <% if (useModels) { %>
    grunt.registerTask('build', ['baucis-swagger2', 'convert', 'merge-json']);
    <% } else { %>
    grunt.registerTask('build', ['convert']);
    <% } %>
};
