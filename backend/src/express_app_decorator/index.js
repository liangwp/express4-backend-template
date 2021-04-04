'use strict';

/**
 * module that exports a function to return an express app, decorated with the following:
 * 1. start() in lieu of listen()
 * 2. `req` logger attached to express req object
 * 3. route logging with shortened uuid and timing information, when using the `req` logger
 * 4. custom 404 and 500 error handling (returns json instead of plain text)
 * 5. clean-exit handler
 * 
 */
const express = require('express');
const killable = require('killable');
const logging = require('../logging');
const uuidv4 = require('uuid').v4;
const Promise = require('bluebird');

var logger = logging.getLogger('server');

function setupReqLogger(req, res, next) {
    req.logger = logging.getLogger('req');
    var req_id = uuidv4().slice(0, 8);
    req.logger.addContext('req_id', req_id);
    next();
}

function requestStartLog(req, res, next) {
    req.logger.debug(`HTTP ${req.method} ${req.originalUrl}`);
    req.starttime = new Date().getTime();
    next();
}

function notFoundHandler(req, res, next) {
    if (!res.headersSent) {
        res.status(404).json({
            status: 'Not Found'
        });
    }
    next();
}

function errHandler(err, req, res, next) {
    req.logger.error(err);
    res.status(500).json({
        status: 'Internal Server Error'
    });
    next();
}

function requestEndLog(req, res, next) {
    req.endtime = new Date().getTime();
    if (req.starttime) {
        req.logger.debug(`HTTP ${res.statusCode}: response time ${req.endtime - req.starttime} ms`);
    }
    next();
}

module.exports = () => {
    var app = express();
    app.use(setupReqLogger);
    app.use(requestStartLog);

    // Add a start() function that then calls listen(), AND attaches the close listener, AND returns a Promise THAT resolves when server closes
    app.start = (port) => {
        app.use(notFoundHandler);
        app.use(errHandler);
        app.use(requestEndLog);
        
        return new Promise((resolve, reject) => {
            var app_server = app.listen(port, () => {
                logger.info(`======== Server listening on port ${port} ========`);
                killable(app_server);
    
                logger.debug(`close handler listening on SIGTERM`);
                process.on('SIGTERM', () => {
                    logger.info(`======== Closing server, killing any keep-alive connections ========`);
                    app_server.kill(resolve);
                });
            });
        })
    };
    return app;
};
