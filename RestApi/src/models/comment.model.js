'use strict'

const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'comment'
const COLLECTION_NAME = 'comments'

const commentSchema = new Schema({
    comment_prod_id: { type: Types.ObjectId, ref: 'product', require: true },
    comment_usr_id: { type: String, require: true },
    comment_content: { type: String, default: "" },
    comment_left: { type: Number, default: 0 },
    comment_right: { type: Number, default: 0 },
    comment_parent_id: { type: Types.ObjectId, ref: DOCUMENT_NAME },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, commentSchema)
