'use strict'

const { StatusCodes, ReasonPhrases } = require('../../../HttpStatusCode')

class SuccessRes {
    constructor(message = ReasonPhrases.OK, metadata = {}, statusCode = StatusCodes.OK, reasonPhrases = ReasonPhrases.OK) {
        this.message = !message ? reasonPhrases : message
        this.status = statusCode
        this.metadata = metadata
    }

    send(res, header = {}) {
        return res.status(this.status).json(this)
    }
}

class SuccessResponse extends SuccessRes {
    constructor({ message, metadata }) {
        super(message, metadata)
    }
}

class CreatedResponse extends SuccessRes {
    constructor({ message = ReasonPhrases.CREATED, metadata, statusCode = StatusCodes.CREATED, reasonPhrases = ReasonPhrases.CREATED }) {
        super(message, metadata, statusCode, reasonPhrases)
        this.metadata = metadata
    }
}

module.exports = {
    SuccessResponse,
    CreatedResponse,
}