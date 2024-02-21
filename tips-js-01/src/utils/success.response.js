'use strict'

const { StatusCodes, ReasonPhrases } = require('../../../HttpStatusCode')

class SuccessRes {
    constructor(message = ReasonPhrases.OK, metadata = {}, context = "unknown", statusCode = StatusCodes.OK, reasonPhrases = ReasonPhrases.OK) {
        this.message = !message ? reasonPhrases : message
        this.status = statusCode
        this.metadata = metadata
    }

    send(res, header = {}) {
        return res.status(this.status).json(this)
    }
}

class SuccessResponse extends SuccessRes {
    constructor({ message, metadata, context }) {
        super(message, metadata, context)
    }
}

class CreatedResponse extends SuccessRes {
    constructor({ message = ReasonPhrases.CREATED, metadata, context, statusCode = StatusCodes.CREATED, reasonPhrases = ReasonPhrases.CREATED }) {
        super(message, metadata, context, statusCode, reasonPhrases)
    }
}

module.exports = {
    SuccessResponse,
    CreatedResponse,
}