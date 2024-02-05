'use strict'

const express = require('express')
const router = express.Router()

const RbacController = require('../../controllers/rbac.contr')
const ProfileController = require('../../controllers/rbac.profile.contr')

const asyncHandler = require('../../utils/async.handler.util');
const { authenticationUser } = require('../../middlewares/auth.midware');
const grantAccess = require('../../middlewares/rbac.midware');


router.post('/create-role', authenticationUser, asyncHandler(RbacController.handleCreateRole))
router.get('/list-roles', asyncHandler(RbacController.handleGetListRoles))
router.get('/list-role-grants', asyncHandler(RbacController.handleGetListRoleGrants))

router.post('/create-resource', authenticationUser, asyncHandler(RbacController.handleCreateResource))
router.get('/list-resources', asyncHandler(RbacController.handleGetListResources))

// admin
router.get('/viewAny', grantAccess({ action: 'readAny', resource: 'profile' }), ProfileController.allProfiles)
// shop
router.get('/viewOwn', grantAccess({ action: 'readOwn', resource: 'profile' }), ProfileController.profile)

module.exports = router