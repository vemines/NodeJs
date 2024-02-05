'use strict';

const RbacService = require('../services/rbac.svc');
const { ForbiddenError } = require('../utils/error.response');
const ac = require('./access.control.midware')

const grantAccess = ({ action, resource }) => {
    return async (req, res, next) => {
        const role_grants = await RbacService.roleGrantsFormated()
        ac.setGrants(role_grants)
        const rol_name = req.query.role
        try {
            const permission = ac.can(rol_name)[action](resource);
            if (!permission.granted) next(new ForbiddenError('you dont have permissions 1...'))
            return next()
        } catch (error) {
            console.log(error)
            return next(new ForbiddenError('you dont have permissions 2...'))
        }
    }
}

module.exports = grantAccess
