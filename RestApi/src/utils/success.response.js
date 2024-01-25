
const { StatusCodes, ReasonPhrases } = require('./httpStatusCode')

class SuccessResponse {
    constructor(message = ReasonPhrases.OK, statusCode = StatusCodes.OK, reasonPhrases = ReasonPhrases.OK, metadata = {}) {
        this.message = !message ? reasonPhrases : message
        this.status = statusCode
        this.metadata = metadata
    }

    send(res, header = {}) {
        return res.status(this.status).json(this)
    }
}

class SuccessRequest extends SuccessResponse {
    constructor(message, metadata) {
        super(message, metadata)
    }
}

class CreatedRequest extends SuccessResponse {
    constructor(option = {}, message = ReasonPhrases.CREATED, statusCode = StatusCodes.CREATED, reasonPhrases = ReasonPhrases.CREATED, metadata) {
        super(message, statusCode, reasonPhrases, metadata)
        this.option = option
    }
}

module.exports = {
    SuccessRequest,
    CreatedRequest,
}