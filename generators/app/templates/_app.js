'use strict';

require('dotenv').load();
const express = require('express');
const app = express();
const cors = require('cors');
const compression = require('compression');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const logger = require('./lib/logger');
const expressWinston = require('express-winston');
const swaggerTools = require('swagger-tools');

if (process.env.<%= uppercaseName%>_IS_BEHIND_PROXY) {
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
    expressFormat  : true,
    colorize       : false,
    meta           : false,
    statusLevels   : true
}));<% if (useModels) { %>

//Baucis configuration
const mongoose = require('mongoose');
mongoose.connect('mongodb://' + process.env.<%= uppercaseName%>_MONGODB_HOST + ':' + process.env.<%= uppercaseName%>_MONGODB_PORT + '/' + process.env.<%= uppercaseName%>_MONGODB_DB);
const buildBaucis = require('./build-baucis');
const baucisInstance = buildBaucis();<% } %>

//Configure swagger-tools
const swaggerDoc = require('./swagger/swagger.json');
swaggerTools.initializeMiddleware(swaggerDoc, function(middleware) {
    // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
    app.use(middleware.swaggerMetadata());

    // Validate Swagger requests
    app.use(middleware.swaggerValidator());

    //Enables Swagger Ui on /docs
    app.use(middleware.swaggerUi());

    // Route validated requests to appropriate controller
    app.use(middleware.swaggerRouter({
        controllers          : './lib/routes',
        ignoreMissingHandlers: true,
        useStubs             : false // Conditionally turn on stubs (mock mode)
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
        let error = {
            errorCode  : res.statusCode,
            userMessage: err.message
        };

        if (process.env.NODE_ENV === 'development') {
            error.stack = err;
        }

        return res.json(error);
    });

    app.use(function(req, res) {
        res.status(404).json({
            errorCode  : 404,
            userMessage: 'Not found.'
        });
    });

    // Start the server
    app.listen(process.env.<%= uppercaseName%>_SERVER_PORT, process.env.<%= uppercaseName%>_SERVER_HOST);
    logger.info('Your server is listening on port %d (http://%s:%d)', process.env.<%= uppercaseName%>_SERVER_PORT, process.env.<%= uppercaseName%>_SERVER_HOST,
        process.env.<%= uppercaseName%>_SERVER_PORT);
});
