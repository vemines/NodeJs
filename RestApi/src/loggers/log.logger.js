'use strict'

const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const { v4: uuidv4 } = require('uuid');

class AppLogger {
    constructor() {
        const formatPrint = format.printf(({
            level, message, context, requestId, timestamp, metadata
        }) => {
            return `${timestamp}::${level}::${context}::${requestId}::${message}::${JSON.stringify(metadata)}`
        })

        this.logger = createLogger({
            format: format.combine(
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                formatPrint
            ),
            transports: [
                new transports.Console(),
                new transports.DailyRotateFile({
                    dirname: "RestApi/src/logs",
                    filename: 'application-%DATE%.info.log',
                    datePattern: 'YYYY-MM-DD-HH-mm',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d',
                    format: format.combine(
                        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                        formatPrint
                    ),
                    level: 'info'
                }),
                new transports.DailyRotateFile({
                    dirname: "RestApi/src/logs",
                    filename: 'application-%DATE%.error.log',
                    datePattern: 'YYYY-MM-DD-HH-mm',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d',
                    format: format.combine(
                        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                        formatPrint
                    ),
                    level: 'error'
                }),
            ]
        })
    }

    log({ message, context, requestId = uuidv4(), metadata }) {
        const logObject = Object.assign({ message }, { context, requestId, metadata })
        this.logger.info(logObject)
    }

    error({ message, context, requestId = uuidv4(), metadata }) {
        const logObject = Object.assign({ message }, { context, requestId, metadata })
        this.logger.error(logObject)
    }
}

module.exports = new AppLogger()