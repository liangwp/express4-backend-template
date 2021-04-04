'use strict';

const logging = require('./logging.js');
var logger = logging.getLogger('Application');
logger.info('Application starting');

var app = require('./express_app_decorator')(); // refer to express_app_decorator/index.js
var listen_port = process.env['LISTEN_PORT'];

// define and insert routes as separate files
var test_routes = require('./routes/test_routes');

app.get('/', (req, res, next) => {
    res.send('hello world');
    next();
});

app.use('/test', test_routes);


// MUST be called after adding in all the routes
// start() will add in more logging middleware on the bottom of the middleware stack
app.start(listen_port)
.then(() => {
    logger.info('Application closing');
});
