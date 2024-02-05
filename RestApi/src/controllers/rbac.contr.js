'use strict';
const { SuccessResponse } = require("../utils/success.response");
const RbacService = require("../services/rbac.svc");

class RbacController {
    static handleCreateRole = async (req, res, next) => {
        new SuccessResponse({
            context: req.baseUrl + req.url,
            message: 'created role success',
            metadata: await RbacService.createRole({
                ...req.body, usr_id: req.payload._id
            })
        }).send(res)
    }

    static handleCreateResource = async (req, res, next) => {
        new SuccessResponse({
            context: req.baseUrl + req.url,
            message: 'created resource success',
            metadata: await RbacService.createResource({
                ...req.body, usr_id: req.payload._id
            })
        }).send(res)
    }

    static handleGetListRoles = async (req, res, next) => {
        new SuccessResponse({
            context: req.baseUrl + req.url,
            message: 'get list roles success',
            metadata: await RbacService.roleList({})
        }).send(res)
    }

    static handleGetListRoleGrants = async (req, res, next) => {
        new SuccessResponse({
            context: req.baseUrl + req.url,
            message: 'get list roles success',
            metadata: await RbacService.roleGrantsFormated()
        }).send(res)
    }

    static handleGetListResources = async (req, res, next) => {
        new SuccessResponse({
            context: req.baseUrl + req.url,
            message: 'get list resource success',
            metadata: await RbacService.resourceList({})
        }).send(res)
    }
}

module.exports = RbacController