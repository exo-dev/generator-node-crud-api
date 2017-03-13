module.exports = function(grunt) {
    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        env: {
            dev: {
                MOCHAWESOME_REPORTDIR:    'results/mochawesome-reports',
                MOCHAWESOME_INLINEASSETS: true
            }
        },

        mochaTest: {
            test: {
                options: {
                    reporter:          'spec',
                    quiet:             false,
                    clearRequireCache: false
                },
                src: ['./tests/**/*.js']
            }
        },

        eslint: {
            jenkins: {
                options: {
                    format:     'html',
                    outputFile: 'results/eslint/index.html'
                },
                src: ['./lib/**/*.js']
            },
            dev: {
                options: {
                    format: 'stylish'
                },
                src: ['./lib/**/*.js']
            }
        },

        plato: {
            ci: {
                options: {
                    eslintrc: './.eslintrc'
                },
                files: {
                    'results/plato': ['lib/**/*.js']
                }
            }
        },

        mocha_istanbul: {
            src:     'tests/**/*.js',
            options: {
                coverage:       true,
                excludes:       ['node_modules/**', 'tests/**', 'results/**', 'app.js', 'lib/logger.js'],
                root:           './lib',
                coverageFolder: 'results/istanbul',
                reporter:       'mochawesome',
                reportFormats:  ['cobertura', 'lcovonly', 'html'],
                quiet:          false
            }
        },

        watch: {
            scripts: {
                files  : ['./lib/**/*.js', './tests/**/*.js'],
                tasks  : ['eslint:dev', 'mochaTest'],
                options: {
                    event: ['added', 'changed', 'deleted']
                }
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
