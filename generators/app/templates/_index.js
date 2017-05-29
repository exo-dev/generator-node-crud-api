'use strict';

require('dotenv').load();

if (process.env.NODE_ENV !== 'production') {
    require('@glimpse/glimpse').init();
}

const app    = require('./app');
const logger = require('./lib/logger');
<% if (useModels) { %>
const mongoSettings = {
    host:     process.env.<%= uppercaseName%>_MONGODB_HOST,
    port:     process.env.<%= uppercaseName%>_MONGODB_PORT,
    db:       process.env.<%= uppercaseName%>_MONGODB_DB
};


Promise.all([app.initialize(logger), app.connectMongoose(mongoSettings)])
    .then(([application]) => {
        application.listen(process.env.<%= uppercaseName%>_SERVER_PORT);
        logger.info('Your server is listening on port ' + process.env.<%= uppercaseName%>_SERVER_PORT);
    })
    .catch(logger.error);<% } %><% if (!useModels) { %>
app.initialize(logger)
    .then((application) => {
        application.listen(process.env.<%= uppercaseName%>_SERVER_PORT);
        logger.info('Your server is listening on port ' + process.env.<%= uppercaseName%>_SERVER_PORT);
    })
    .catch(logger.error);<% } %>
