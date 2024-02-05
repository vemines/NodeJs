'use strict'

const { SuccessResponse } = require("../utils/success.response");
const UploadService = require("../services/upload.svc");
const { BadRequestError } = require("../utils/error.response");

class UploadController {
    static handleUploadImageFromUrl = async (req, res, next) => {
        new SuccessResponse({
            context: req.baseUrl + req.url,
            message: 'upload successfully',
            metadata: await UploadService.uploadImageFromUrl({
                url: req.body.url,
                folderName: `uploaded/from-url/${req.payload._id}`,
            })
        }).send(res);
    }

    static handleUploadImageFromLocal = async (req, res, next) => {
        const { file } = req
        if (!file) throw new BadRequestError('required file')
        new SuccessResponse({
            context: req.baseUrl + req.url,
            message: 'upload successfully',
            metadata: await UploadService.uploadImageFromLocal({
                file,
                folderName: `uploaded/from-local/${req.payload._id}`,
            })
        }).send(res);
    }

    static handleUploadImagesFromLocal = async (req, res, next) => {
        const { files } = req
        if (!files) throw new BadRequestError('required files')
        new SuccessResponse({
            context: req.baseUrl + req.url,
            message: 'upload successfully',
            metadata: await UploadService.uploadImagesFromLocal({
                files,
                folderName: `uploaded/multi-from-local/${req.payload._id}`,
            })
        }).send(res);
    }

    static handleUploadImageToS3 = async (req, res, next) => {
        const { file } = req
        if (!file) throw new BadRequestError('required file')

        new SuccessResponse({
            context: req.baseUrl + req.url,
            message: 'upload s3 successfully',
            metadata: await UploadService.uploadImageToS3({ file })
        }).send(res);
    }
}

module.exports = UploadController