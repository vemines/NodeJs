'use strict'

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'user'
const COLLECTION_NAME = 'users'

const userSchema = new Schema(
    {
        usr_slug: { type: String, required: true },       // id that show to user
        usr_name: { type: String, default: '' },
        usr_password: { type: String, default: '' },
        usr_salt: { type: String, default: '' },        // for password hash
        usr_email: { type: String, required: true },
        usr_phone: { type: String, default: '' },
        usr_sex: { type: String, default: '' },
        usr_avatar: { type: String, default: '' },
        usr_date_of_birth: { type: Date, default: null },
        // usr_role: { type: Schema.Types.ObjectId, ref: 'Role' },
        usr_status: { type: String, default: 'pending', enum: ['pending', 'active', 'block'] }
    }, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, userSchema)