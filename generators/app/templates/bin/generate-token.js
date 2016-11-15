'use strict';

const jwt = require('jsonwebtoken');

module.exports.createUser = function createUser(object, secret, options) {
    const jwtOptions = {
        algorithm: 'HS256',
        expiresIn: options.expiresIn,
        notBefore: options.notBefore,
        audience : options.audience,
        issuer   : options.issuer, //This is due to a bug in kong: https://github.com/Mashape/kong/issues/1512
        jwtid    : options.username,
        subject  : options.username
    };

    return jwt.sign(object, secret, jwtOptions);
};
