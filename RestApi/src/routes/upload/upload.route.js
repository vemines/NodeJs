'use strict'

const express = require('express')
const router = express.Router()

const UploadController = require('../../controllers/upload.contr')

const asyncHandler = require('../../utils/async.handler.util');
const { uploadDisk, uploadMemory } = require('../../configs/multer.config')
const { authenticationUser } = require('../../middlewares/auth.midware');

router.post('/from-url', authenticationUser,
    asyncHandler(UploadController.handleUploadImageFromUrl)
)
router.post('/from-local', authenticationUser, uploadDisk.single('file'),
    asyncHandler(UploadController.handleUploadImageFromLocal)
)
router.post('/multi-from-local', authenticationUser, uploadDisk.array('files'),
    asyncHandler(UploadController.handleUploadImagesFromLocal)
)
router.post('/to-s3', authenticationUser, uploadMemory.single('file'),
    asyncHandler(UploadController.handleUploadImageToS3)
)

module.exports = router