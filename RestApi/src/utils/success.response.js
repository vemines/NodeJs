'use strict'

const { StatusCodes, ReasonPhrases } = require('../../../HttpStatusCode')

class SuccessRes {
    constructor(message = ReasonPhrases.OK, statusCode = StatusCodes.OK, reasonPhrases = ReasonPhrases.OK, metadata = {}) {
        this.message = !message ? reasonPhrases : message
        this.status = statusCode
        this.metadata = metadata
    }

    send(res, header = {}) {
        return res.status(this.status).json(this)
    }
}

class SuccessResponse extends SuccessRes {
    constructor(message, metadata) {
        super(message, metadata)
    }
}

class CreatedResponse extends SuccessRes {
    constructor(message = ReasonPhrases.CREATED, statusCode = StatusCodes.CREATED, reasonPhrases = ReasonPhrases.CREATED, metadata) {
        super(message, statusCode, reasonPhrases, metadata)
        this.metadata = metadata
    }
}

module.exports = {
    SuccessResponse,
    CreatedResponse,
}