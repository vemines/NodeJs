'use strict'

const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3")

const credentials = {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY,
}

const s3Config = {
    region: 'ap-southeast-1',
    credentials,
}

const s3 = new S3Client(s3Config)

// async function testConnect() {
//     const params = {
//         Bucket: process.env.AWS_S3_BUCKET_NAME,
//         // file name already upload,
//         Key: 'sample.jpeg',
//     }

//     const cmd = new GetObjectCommand(params)

//     return await s3.send(cmd, (err, data) => {
//         if (err) console.error(err)
//         if (data) console.log(data)
//     })
// }

// testConnect()



module.exports = {
    s3,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
}