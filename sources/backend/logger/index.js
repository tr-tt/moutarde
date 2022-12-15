const winston = require('winston')
require('winston-daily-rotate-file')
const path = require('path')

const logger = winston.createLogger(
{
    level: process.env.LOG_LEVEL,
    format: winston.format.combine(
        winston.format.timestamp(
            {
                format: 'DD/MM/YYYY HH:mm:ss',
            }),
        winston.format.json()
    ),
    transports:
    [
        //
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `debug` or less to `debug.log`
        //
        new winston.transports.Console(),
        new winston.transports.DailyRotateFile(
            {
                filename: path.resolve('_logs', `error_%DATE%.log`),
                datePattern: 'YYYY-MM-DD-HH',
                level: 'error',
                maxFiles: '2d'
            }), 
        new winston.transports.DailyRotateFile(
            {
                filename: path.resolve('_logs', `moutarde_%DATE%.log`),
                datePattern: 'YYYY-MM-DD-HH',
                maxFiles: '2d'
            }),
    ],
    exceptionHandlers:
    [
        new winston.transports.DailyRotateFile(
            {
                filename: path.resolve('_logs', `exceptions_%DATE%.log`),
                datePattern: 'YYYY-MM-DD-HH',
                maxFiles: '2d'
            })
    ],
    rejectionHandlers:
    [
        new winston.transports.DailyRotateFile(
            {
                filename: path.resolve('_logs', `rejections_%DATE%.log`),
                datePattern: 'YYYY-MM-DD-HH',
                maxFiles: '2d'
            })
    ]
})

// By default, winston will exit after logging an uncaughtException.
logger.exitOnError = false

module.exports = logger