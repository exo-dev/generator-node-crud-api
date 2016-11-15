'use strict';

const jwt = require('./generate-token');
const program = require('commander');
const inquirer = require('inquirer');
const jsonfile = require('jsonfile');
const prompt = [];

program
    .version('1.0.0')
    .option('--issuer <issuer>', 'The issuer got from kong')
    .option('--secret <secret>', 'The secret that will be used to sign the jwt')
    .option('--expires <expires>', 'Expiration time of the jwt')
    .option('--audience <audience>', 'The audience of the jwt')
    .option('--not-before <notBefore>', 'The not before parameter of the jwt')
    .option('--username <username>', 'The name of the user')
    .option('--object <object>', 'Path of jsonfile that contains the user body')
    .parse(process.argv);

if (program.issuer === undefined) {
    prompt.push({
        name   : 'issuer',
        message: 'The issuer got from kong'
    });
}

if (program.secret === undefined) {
    prompt.push({
        name   : 'secret',
        message: 'The secret that will be used to sign the jwt'
    });
}

if (program.expires === undefined) {
    prompt.push({
        name   : 'expires',
        message: 'Expiration time of the jwt',
        default: '2 years'
    });
}

if (program.notBefore === undefined) {
    prompt.push({
        name   : 'notBefore',
        message: 'The not before parameter of the jwt',
        default: '1s'
    });
}

if (program.audience === undefined) {
    prompt.push({
        name   : 'audience',
        message: 'The audience of the jwt',
        default: 'localhost:8000'
    });
}

if (program.username === undefined) {
    prompt.push({
        name   : 'username',
        message: 'The name of the user',
        default: 'JohnDoe'
    });
}

if (program.object === undefined) {
    prompt.push({
        name   : 'object',
        message: 'Path of jsonfile that contains the user body'
    });
}

const dummyObject = {
    scopes: ['admin', 'developer', 'some-model:write', 'other-model:read'],
    name: 'reinaldo',
    mail: 'mostaza@racing.com'
};

inquirer.prompt(prompt)
    .then((answers) => Object.keys(answers).forEach(function(name) {
        program[name] = answers[name];
    }))
    .then(() => program.object? jsonfile.readFileSync(program.object): dummyObject)
    .then((object) => jwt.createUser(object, program.secret, {
        username : program.username,
        audience : program.audience,
        notBefore: program.notBefore,
        expiresIn: program.expires,
        issuer   : program.issuer
    }))
    .then(console.log)
    .catch(console.log);
