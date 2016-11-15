'use strict';

const baucis = require('baucis');
const models = require('./lib/models');

function buildBaucis() {
    Object.keys(models).forEach((key) => baucis.rest(models[key]));
    return baucis();
}

module.exports = buildBaucis;
