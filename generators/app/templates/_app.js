'use strict';

require('dotenv').load();
const express        = require('express');
const cors           = require('cors');
const compression    = require('compression');
const bodyParser     = require('body-parser');
const helmet         = require('helmet');
const expressWinston = require('express-winston');
const swaggerTools   = require('swagger-tools');<% if (useModels) { %>
const mongoose       = require('mongoose');

function connectMongoose(settings) {
    const mongoUrl = 'mongodb://' + settings.host + settings.port + '/' + settings.db;
    mongoose.Promise = global.Promise;
    return mongoose.connect(mongoUrl);
}<% } %>

function initialize(logger) {
    const app = express();

    if (process.env.SMART_PARKING_API_IS_BEHIND_PROXY) {
        // http://expressjs.com/api.html#trust.proxy.options.table
        app.enable('trust proxy');
    }

    app.use(helmet.hidePoweredBy());
    app.use(helmet.ieNoOpen());
    app.use(helmet.noSniff());
    app.use(helmet.frameguard());
    app.use(helmet.xssFilter());
    app.use(compression());
    app.use(cors());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(expressWinston.logger({
        winstonInstance: logger,
        expressFormat:   true,
        colorize:        false,
        meta:            false,
        statusLevels:    true
    }));<% if (useModels) { %>

    const buildBaucis    = require('./build-baucis');
    const baucisInstance = buildBaucis();<% } %>
    const swaggerDoc     = require('./swagger/swagger.json');

    return new Promise(function(resolve) {
        swaggerTools.initializeMiddleware(swaggerDoc, function(middleware) {
            app.use(middleware.swaggerMetadata());

            app.use(middleware.swaggerValidator());

            app.use(middleware.swaggerUi());

            //Route validated requests to appropriate controller
            app.use(middleware.swaggerRouter({
                controllers:           './lib/routes',
                ignoreMissingHandlers: true,
                useStubs:              false // Conditionally turn on stubs (mock mode)
            }));<% if (useModels) { %>

            app.use('/api', baucisInstance);<% } %>

            app.use(expressWinston.errorLogger({
                winstonInstance: logger
            }));

            app.use(function(err, req, res, next) {
                if (res.headersSent) {
                    return next(err);
                }

                res.status(err.status || 500);

                const error = {
                    errorCode:   res.statusCode,
                    userMessage: err.message
                };

                if (process.env.NODE_ENV === 'development') {
                    error.stack = err;
                }

                return res.json(error);
            });

            app.use(function(req, res) {
                res.status(404).json({
                    errorCode:   404,
                    userMessage: 'Not found.'
                });
            });

            resolve(app);
        });
    });
}

module.exports = {
    initialize<% if (useModels) { %>,
    connectMongoose<% } %>
};
