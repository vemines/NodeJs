'use strict';

const { findInitTempById } = require('../models/repositories/init.temp.repo')

class InitTempService {
    static findById = async (id) => {
        return findInitTempById(id)
    }
}

module.exports = InitTempService