
const { Schema, model, Types } = require('mongoose')

const DOCUMENT_NAME = 'role'
const COLLECTION_NAME = 'roles'

const roleSchema = new Schema({
    role_name: { type: String, default: 'user001', enum: ['user001', 'shop001', 'admin001'] },
    role_slug: { type: String, required: true },      // 000001 show for user
    role_status: { type: String, default: 'active', enum: ['active', 'block', 'pending'] },
    role_description: { type: String, default: '' },
    role_created_by: { type: Types.ObjectId, required: true, ref: 'user' },
    role_grants: [{
        resource: { type: Types.ObjectId, ref: 'resource', required: true },
        actions: [{ type: String, required: true }],
        attributes: { type: String, default: '*' }
    }],
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})
module.exports = model(DOCUMENT_NAME, roleSchema)