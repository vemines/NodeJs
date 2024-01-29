"use strict";

const { PutObjectCommand, s3, GetObjectCommand, DeleteObjectCommand } = require('../configs/s3.config');
const cloudinary = require("../configs/cloudinary.config");

const { getSignedUrl } = require("@aws-sdk/cloudfront-signer");
const { randomString } = require('../utils');


class UploadService {
    // upload to S3
    static uploadImageToS3 = async ({ file }) => {
        try {
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
        } catch (error) {
            console.error('Error uploading image::', error);
        }
    }

    // upload from url image
    static uploadImageFromUrl = async ({ url, folderName, fileName }) => {
        try {
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
        } catch (error) {
            console.error(error)
        }
    }

    // upload one file from local
    static uploadImageFromLocal = async ({ path, folderName }) => {
        try {
            const result = await cloudinary.uploader.upload(path, {
                public_id: randomString(),
                folder: folderName
            })

            return {
                image_url: result.secure_url,
                thumb_url: cloudinary.url(result.public_id, {
                    width: 100, height: 100, format: 'jpg'
                })
            }
        } catch (error) {
            console.error('Error uploading image::', error);
        }
    }

    // upload multi file from local
    static uploadImagesFromLocal = async ({
        files,
        folderName,
    }) => {
        try {
            if (!files.length) return
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
        } catch (error) {
            console.error('Error uploading image::', error);
        }
    }
}

module.exports = UploadService