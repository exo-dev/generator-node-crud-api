'use strict';

var yeoman = require('yeoman-generator');
var chalk  = require('chalk');
var yosay  = require('yosay');
var path   = require('path');
var mkdirp = require('mkdirp');

module.exports = yeoman.generators.Base.extend({
    prompting: function() {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the fantastic ' + chalk.red('EXO') + ' CRUD API generator!'
        ));

        var prompts = [
            {
                name:     'projectName',
                message:  'Project Name',
                default:  'awesome-api',
                validate: function(input) {
                    var regex = new RegExp(/^[a-z0-9/-]+$/);
                    if (!regex.test(input)) {
                        return 'The project name must contain only lowercase alphanumeric characters and -'
                    }
                    return true;
                }
            },
            {
                type:    'confirm',
                name:    'useModels',
                message: 'Will you use models?',
                default: 'Y'
            },
            {
                type:    'confirm',
                name:    'useDecorators',
                message: 'Will you use decorators?',
                default: 'Y'
            },
            {
                type:    'confirm',
                name:    'likeInstallDependencies',
                message: 'Do you want me to install the npm dependencies?',
                default: 'Y'
            }
        ];

        this.prompt(prompts, function(props) {
            this.useModels     = props.useModels;
            this.useDecorators = props.useDecorators;
            this.projectName   = props.projectName;
            this.uppercaseName = props.projectName
                .split('-')
                .map(function(name) {
                    return name.toUpperCase();
                })
                .join('_');
            this.likeInstallDependencies = props.likeInstallDependencies;
            done();
        }.bind(this));
    },

    writing: {
        app: function() {
            mkdirp(this.projectName);
            mkdirp(path.join(this.projectName, 'docs'));
            mkdirp(path.join(this.projectName, 'bin'));
            mkdirp(path.join(this.projectName, 'lib'));
            mkdirp(path.join(this.projectName, 'lib', 'routes'));
            mkdirp(path.join(this.projectName, 'lib', 'hello-world'));
            mkdirp(path.join(this.projectName, 'swagger'));

            //docs folder
            this.template(path.join('docs', '_index.md'),
                path.join(this.projectName, 'docs', 'index.md'));

            //lib/hello-world
            this.fs.copy(this.templatePath(path.join('lib', 'hello-world', 'index.js')),
                this.destinationPath(path.join(this.projectName, 'lib', 'hello-world', 'index.js')));

            //lib/routes
            this.fs.copy(this.templatePath(path.join('lib', 'routes', 'hello-world.js')),
                this.destinationPath(path.join(this.projectName, 'lib', 'routes', 'hello-world.js')));

            //lib/logger.js
            this.template(path.join('lib', '_logger.js'),
                path.join(this.projectName, 'lib', 'logger.js'));

            //swagger/user.yaml
            this.fs.copy(this.templatePath(path.join('swagger', 'user.yaml')),
                this.destinationPath(path.join(this.projectName, 'swagger', 'user.yaml')));

            //bin
            this.fs.copy(this.templatePath(path.join('bin', 'sign-jwt.js')),
                this.destinationPath(path.join(this.projectName, 'bin', 'sign-jwt.js')));
            this.fs.copy(this.templatePath(path.join('bin', 'register-api.js')),
                this.destinationPath(path.join(this.projectName, 'bin', 'register-api.js')));
            this.fs.copy(this.templatePath(path.join('bin', 'register-consumer.js')),
                this.destinationPath(path.join(this.projectName, 'bin', 'register-consumer.js')));
            this.fs.copy(this.templatePath(path.join('bin', 'generate-token.js')),
                this.destinationPath(path.join(this.projectName, 'bin', 'generate-token.js')));

            if (this.useModels) {
                //lib/models
                mkdirp(path.join(this.projectName, 'lib', 'models'));
                this.fs.copy(this.templatePath(path.join('lib', 'models', 'index.js')),
                    this.destinationPath(path.join(this.projectName, 'lib', 'models', 'index.js')));
                this.fs.copy(this.templatePath(path.join('lib', 'models', 'vegetable.js')),
                    this.destinationPath(path.join(this.projectName, 'lib', 'models', 'vegetable.js')));
            }

            //Other files
            this.template('_package.json',
                path.join(this.projectName, 'package.json'));
            this.template('_env',
                path.join(this.projectName, '.env'));
            this.template('_gitignore',
                path.join(this.projectName, '.gitignore'));
            this.template('_mkdocs.yml',
                path.join(this.projectName, 'mkdocs.yml'));
            this.template('_index.js',
                path.join(this.projectName, 'index.js'));
            this.template('_app.js',
                path.join(this.projectName, 'app.js'));
            this.template('_Gruntfile.js',
                path.join(this.projectName, 'Gruntfile.js'));
            this.template('_docker-compose.yml',
                path.join(this.projectName, 'docker-compose.yml'));
            this.template('_build-baucis.js',
                path.join(this.projectName, 'build-baucis.js'));
            this.fs.copy(this.templatePath(path.join('.esformatter')),
                this.destinationPath(path.join(this.projectName, '.esformatter')));
            this.fs.copy(this.templatePath(path.join('.eslintrc')),
                this.destinationPath(path.join(this.projectName, '.eslintrc')));
            this.fs.copy(this.templatePath(path.join('.tern-project')),
                this.destinationPath(path.join(this.projectName, '.tern-project')));
            this.fs.copy(this.templatePath(path.join('.dockerignore')),
                this.destinationPath(path.join(this.projectName, '.dockerignore')));
            this.fs.copy(this.templatePath(path.join('Dockerfile')),
                this.destinationPath(path.join(this.projectName, 'Dockerfile')));
            this.fs.copy(this.templatePath(path.join('unit.sh')),
                this.destinationPath(path.join(this.projectName, 'unit.sh')));
        },

        end: function() {
            if (this.likeInstallDependencies) {
                process.chdir(this.projectName);
                this.installDependencies({
                    npm:   true,
                    bower: false
                });
            } else {
                this.log(yosay('Execute ' + chalk.blue('npm install') + ' to install dependencies'));
            }
        }
    }
});
