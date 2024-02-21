'use strict'

const santinize = require('mongo-sanitize')

const InjectRepository = require('../models/repositories/inject.repo')


class InjectService {
    static createUser = async ({ username, password }) => {
        const payload = { username, password }
        InjectRepository.create({ payload })
    }

    static login = async ({ username, password }) => {
        const user = await InjectRepository.findOne({
            filter: { username, password }
        })
        return user
    }

    static login2 = async ({ username, password }) => {
        const user = await InjectRepository.findOne({
            filter: santinize({ username, password })
        })
        if (!user) return null
        return user
    }
}

module.exports = InjectService