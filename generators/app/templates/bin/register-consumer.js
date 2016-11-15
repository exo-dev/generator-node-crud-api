'use strict';
const request = require('request-promise');
const crypto = require('crypto');
const base64url = require('base64url');
const program = require('commander');
const inquirer = require('inquirer');
const prompt = [];

program
    .version('1.0.0')
    .option('--kong-url <kongUrl>', 'The url of the api')
    .option('--username <username>', 'The name of the user')
    .option('--secret <secret>', 'The secret of the jwt')
    .parse(process.argv);

if (program.kongUrl === undefined) {
    prompt.push({
        name   : 'kongUrl',
        message: 'The url of the kong api',
        default: 'http://localhost:8001'
    });
}

if (program.secret === undefined) {
    prompt.push({
        name   : 'secret',
        message: 'The secret of the jwt',
        default: base64url(crypto.randomBytes(128))
    });
}

if (program.username === undefined) {
    prompt.push({
        name   : 'username',
        message: 'The name of the user',
        default: 'JohnDoe'
    });
}

const issuer = base64url(crypto.randomBytes(32));

inquirer.prompt(prompt)
    .then((answers) => Object.keys(answers).forEach(function(name) {
        program[name] = answers[name];
    }))
    .then(() => request({
        method: 'POST',
        uri   : `${program.kongUrl}/consumers`,
        body  : {
            username: program.username
        },
        json  : true
    }))
    .then(() => {
        console.log('Consumer created!');
        return request({
            method: 'POST',
            uri   : `${program.kongUrl}/consumers/${program.username}/jwt`,
            body  : {
                key      : issuer,
                algorithm: 'HS256',
                secret   : program.secret
            },
            json  : true
        });
    })
    .then((response) => {
        console.log('Jwt keys created!\n');
        console.log(`Issuer: ${response.key}`);
        console.log(`Secret: ${response.secret}`);
    })
    .catch(console.log);
