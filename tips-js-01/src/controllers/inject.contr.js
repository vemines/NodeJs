'use strict';

const { SuccessResponse } = require('../utils/success.response');
const InjectService = require('../services/inject.svc')

class InjectController {
    static handleCreateUser = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create user successfully',
            metadata: await InjectService.createUser({ ...req.body })
        }).send(res)
    }

    static handleLogin = async (req, res, next) => {
        new SuccessResponse({
            message: 'Login Success',
            metadata: await InjectService.login({ ...req.body })
        }).send(res)
    }
    static handleLogin2 = async (req, res, next) => {
        new SuccessResponse({
            message: 'Login Success',
            metadata: await InjectService.login2({ ...req.body })
        }).send(res)
    }
}

module.exports = InjectController