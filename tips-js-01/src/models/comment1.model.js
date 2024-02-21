'use strict'

const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'comment1'
const COLLECTION_NAME = 'comments1'

const commentSchema = new Schema({
    author: { type: Object }, // userid, nickname, avt... 
    discuss_id: { type: String }, // id of a post 34033389
    posted: { type: Date }, // time post
    text: { type: String }, // content comment
    parent_slug: { type: String }, // comment parent if have, default = ''
    score: { type: Date }, // score
    slug: { type: String }, // id of a comment - 34033750
    comment_likes: Array,
    comment_like_num: { type: Date },
    full_slug: { type: String }, // combine by posted + slug
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

module.exports = model(DOCUMENT_NAME, commentSchema)