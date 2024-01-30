"use strict";

const { PutObjectCommand, s3, GetObjectCommand, DeleteObjectCommand } = require('../configs/s3.config');
const cloudinary = require("../configs/cloudinary.config");

const { getSignedUrl } = require("@aws-sdk/cloudfront-signer");
const { randomString } = require('../utils');
const { BadRequestError } = require('../utils/error.response');


class UploadService {
    // upload to S3
    static uploadImageToS3 = async ({ file }) => {
        const imageName = randomString()

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: imageName,
            Body: file.buffer,
            ContentType: 'image/jpeg'
        })
        const result = await s3.send(command)

        const url = getSignedUrl({
            url: `${process.env.AWS_CLOUD_FRONT}/${imageName}`,
            keyPairId: process.env.AWS_CLOUD_FRONT_KEY_PAIR_ID,
            dateLessThan: new Date(Date.now() + 1000 * 60),     // link valid 60s
            privateKey: process.env.AWS_CLOUD_FRONT_PRIVATE_KEY,
        });

        return {
            url,
            result: result
        }

    }

    // upload from url image
    static uploadImageFromUrl = async ({ url, folderName }) => {
        const result = await cloudinary.uploader.upload(url, {
            public_id: randomString(),
            folder: folderName
        })

        return {
            image_url: result.secure_url,
            thumb_url: cloudinary.url(result.public_id, {
                width: 100, height: 100, format: 'jpg'
            })
        }

    }

    // upload one file from local to cloudinary
    static uploadImageFromLocal = async ({ file, folderName }) => {
        const result = await cloudinary.uploader.upload(file.path, {
            public_id: randomString(),
            folder: folderName
        })

        return {
            image_url: result.secure_url,
            thumb_url: cloudinary.url(result.public_id, {
                width: 100, height: 100, format: 'jpg'
            })
        }

    }

    // upload multi file from local to cloudinary
    static uploadImagesFromLocal = async ({ files, folderName, }) => {
        if (!files.length) throw new BadRequestError("files is empty")

        const uploadedUrls = []
        for (const file of files) {
            const result = await cloudinary.uploader.upload(file.path, {
                public_id: randomString(),
                folder: folderName,
            })
            uploadedUrls.push({
                image_url: result.secure_url,
                thumb_url: cloudinary.url(result.public_id, {
                    width: 100, height: 100, format: 'jpg'
                })
            })
        }
        return uploadedUrls
    }
}

module.exports = UploadService