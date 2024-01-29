// Require the cloudinary library
const cloudinary = require('cloudinary').v2;

// Return "https" URLs by setting secure: true
cloudinary.config({
    cloud_name: 'vemines-test',
    api_key: '323149996442226',
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Log the configuration
module.exports = cloudinary