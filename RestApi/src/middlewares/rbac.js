'use strict';

const { roleList } = require('../services/rbac.service');
const { AuthFailureError } = require('../utils/error.response');
const rbac = require('./role.middleware')

const grantAccess = (action, resource) => {
    return async (req, res, next) => {
        try {
            rbac.setGrants(await roleList())
            const rol_name = req.query.role;
            const permission = rbac.can(rol_name)[action](resource);
            if (!permission.granted) {
                throw new AuthFailureError('you dont have permissions...')
            }
            next()
        } catch (error) {
            next(error);
        }
    }
}

module.exports = {
    grantAccess
}