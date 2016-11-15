'use strict';

const request = require('request-promise');
const program = require('commander');
const inquirer = require('inquirer');
const prompt = [];

program
    .version('1.0.0')
    .option('--kong-url <kongApiUrl>', 'The url of the kong api')
    .option('--api-name <apiName>', 'The name of the api')
    .option('--upstream-url <upstreamUrl>', 'The url of the api')
    .parse(process.argv);

if (program.kongUrl === undefined) {
    prompt.push({
        name   : 'kongUrl',
        message: 'The url of the kong api',
        default: 'http://localhost:8001'
    });
}

if (program.apiName === undefined) {
    prompt.push({
        name   : 'apiName',
        message: 'The name of the api',
        default: 'hello'
    });
}

if (program.upstreamUrl === undefined) {
    prompt.push({
        name   : 'upstreamUrl',
        message: 'The url of the api',
        default: 'http://api:3000'
    });
}

inquirer.prompt(prompt)
    .then((answers) => Object.keys(answers).forEach(function(name) {
        program[name] = answers[name];
    }))
    .then(() => request({
        method: 'POST',
        uri   : program.kongUrl + '/apis/',
        body  : {
            upstream_url      : program.upstreamUrl,
            name              : program.apiName,
            request_path      : '/',
            strip_request_path: true
        },
        json  : true
    }))
    .then(() => request({
        method: 'POST',
        uri   : program.kongUrl + '/apis/' + program.apiName + '/plugins',
        body  : {
            name  : 'jwt',
            config: {
                uri_param_names : 'jwt',
                claims_to_verify: 'exp, nbf',
                key_claim_name  : 'iss',
                secret_is_base64: false
            }
        },
        json  : true
    }))
    .catch(console.log);
