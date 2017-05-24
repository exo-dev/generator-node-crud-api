'use strict';

const baucis = require('baucis');
const models = require('./lib/models');<% if (useDecorators) { %>
const decorators = require('./lib/decorators');<% } %>

function buildBaucis() {<% if (useDecorators) { %>
    if (decorators.All) {
        baucis.Controller.decorators(decorators.All);
    }<% } %><% if (!useDecorators) { %>
    Object.keys(models).forEach((key) => baucis.rest(models[key]));<% } %><% if (useDecorators) { %>
    Object.keys(models).forEach((modelName) => {
        const controller = baucis.rest(models[modelName]);
        if (decorators.hasOwnProperty(modelName)) {
            decorators[modelName](controller);
        }
    });<% } %>

    return baucis();
}

module.exports = buildBaucis;
