'use strict'

const model = require('../discount.model')
class DiscountRepository {
    static find = async ({ filter, projection, options, sort, skip, limit }) => {
        let query = model.find(filter, projection, options)
        if (skip !== undefined) query = query.skip(skip)
        if (limit !== undefined) query = query.limit(limit)
        if (sort !== undefined) query = query.sort(sort)
        return query.exec()
    }

    static findOne = async ({ filter, projection, options }) => {
        return await model.findOne(filter, projection, options)
    }
    static findOneAndDelete = async ({ filter, options }) => {
        return await model.findOneAndDelete(filter, options)
    }

    static create = async ({ payload }) => {
        return await model.create(payload)
    }
}
const findAllDiscountCodesUnselect = async ({
    page = 1, limit = 50, sort = 'ctime',
    filter, unSelect
}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }

    const documents = await discountModel.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getUnselectData(unSelect))
        .lean()

    return documents
}

const findAllDiscountCodesSelect = async ({
    page = 1, limit = 50, sort = 'ctime',
    filter, select
}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }

    const documents = await discountModel.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData({ fields: select }))
        .lean()

    return documents
}

const checkDiscountExists = async ({ filter }) => {
    return await discountModel.findOne(filter).lean()
}


module.exports = DiscountRepository