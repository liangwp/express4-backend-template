'use strict';

const log4js = require('log4js');

// ref: https://github.com/log4js-node/log4js-node/blob/master/docs/layouts.md

var logpattern_req_stdout = '%[[%d] [%p] %c-%X{req_id} -%] %m'; // coloured stdout logs
var logpattern_req_file = logpattern_req_stdout.replace('%[', '').replace('%]', ''); // non-coloured file logs
var logpattern_stdout = logpattern_req_stdout.replace('-%X{req_id}', '');
var logpattern_file = logpattern_req_file.replace('-%X{req_id}', '');

var logsize_max = 10 * 1024 * 1024;
var logbackups = 10;
var logfile = '/workspace/logs/application.log';

log4js.configure({
    appenders: {
        stdout: { type: 'stdout', layout: {
            type: 'pattern',
            pattern: logpattern_stdout
        } },
        file: {
            type: 'file',
            layout: {
                type: 'pattern',
                pattern: logpattern_file
            },
            filename: logfile,
            maxLogSize: logsize_max,
            backups: logbackups
        },
        stdout_req: { type: 'stdout', layout: {
            type: 'pattern',
            pattern: logpattern_req_stdout
        } },
        file_req: {
            type: 'file',
            layout: {
                type: 'pattern',
                pattern: logpattern_req_file
            },
            filename: logfile,
            maxLogSize: logsize_max,
            backups: logbackups
        },
    },
    categories: {
        default: { appenders: [ 'stdout', 'file' ], level: 'debug' },
        req: { appenders: [ 'stdout_req', 'file_req' ], level: 'debug' }
    }
});

module.exports = log4js; // configured log4js
