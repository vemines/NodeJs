'use strict';

const ResourceRepository = require('../models/repositories/resource.repo')
const RoleRepository = require('../models/repositories/role.repo')
const { BadRequestError, NotFoundError } = require('../utils/error.response')

class RbacService {
    static createResource = async ({
        name, slug, description, usr_id
    }) => {
        // Check name or slug exists
        const existingResource = await ResourceRepository.findOne({
            filter: { $or: [{ src_name: name }, { src_slug: slug }] }
        })
        if (existingResource) throw new BadRequestError('Resource with the same name or slug already exists')

        const payload = {
            src_name: name,
            src_slug: slug,
            src_description: description,
            src_created_by: usr_id
        }
        // new resource
        const resource = await ResourceRepository.create({
            payload
        })
        return resource
    }

    static resourceList = async ({
        limit = 30, page = 1
    }) => {
        // get list of resource
        const skip = (page - 1) * limit
        const resources = await ResourceRepository.find({
            filter: {}, skip, limit
        })
        return resources
    }

    static createRole = async ({
        name, slug, description, grants = [], usr_id
    }) => {
        //  check role exists
        const existingRole = await RoleRepository.findOne({
            filter: { $or: [{ role_name: name }, { role_slug: slug }] }
        })
        if (existingRole) throw new BadRequestError('Role with the same name or slug already exists')
        // new role
        const payload = {
            role_name: name,
            role_slug: slug,
            role_status: 'active',
            role_description: description,
            role_created_by: usr_id,
            role_grants: grants
        }
        const role = await RoleRepository.create({
            payload
        })
        return role
    }

    static roleGrantsFormated = async () => {
        const roles = await RoleRepository.aggregate({
            pipeline: [
                { $unwind: '$role_grants' },
                {
                    $lookup: {     // start join collection, allways return array
                        from: 'resources',  // collection need join
                        localField: 'role_grants.resource', // field of repo need join
                        foreignField: '_id',  // field of resource need join
                        as: 'resource'  // name of join result
                    }
                },
                { $unwind: '$resource' },
                // select field for format role grant   
                {
                    $project: {
                        role: '$role_name',
                        resource: '$resource.src_name',
                        action: '$role_grants.actions',
                        attributes: '$role_grants.attributes'
                    }
                },
                { $unwind: '$action' },
                {
                    $project: {
                        _id: 0,
                        role: 1,
                        resource: 1,
                        action: '$action',
                        attributes: 1
                    }
                },
            ]
        })
        return roles
    }

    static roleList = async ({ limit = 30, page = 1 }) => {
        const skip = (page - 1) * limit
        const roles = await RoleRepository.find({
            filter: {}, skip, limit
        })
        // List Roles
        return roles
    }
}

module.exports = RbacService