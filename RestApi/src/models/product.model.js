'use strict'

const { model, Schema } = require('mongoose');
const slugify = require('slugify');
const DOCUMENT_NAME = 'product'
const COLLECTION_NAME = 'products'

const productSchema = new Schema({
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_slug: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true, enum: ['Electronic', 'Clothing', 'Furniture'] },
    product_shop: { type: Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, required: true },
    product_ratings: { type: Array, default: [] },
    product_ratingsAverage: {
        type: Number, default: 0,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be above 5.0'],
        // 4.345 => 4.3
        set: (val) => Math.round(val * 10) / 10
    },
    // product_variations: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false }
}, {
    collection: COLLECTION_NAME,
    timestamps: true,
})

// Create index for product
productSchema.index({ product_name: 'text', product_description: 'text' })

// Document middleware: runs before .save() and .create()...
productSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, { lower: true })
    next()
})

//Export the model
module.exports = model(DOCUMENT_NAME, productSchema)

