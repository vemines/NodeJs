'use strict'

const lodash = require('lodash')
const crypto = require('crypto')
const { Types } = require('mongoose')

const toObjectIdMongo = (id) => new Types.ObjectId(id)

// Return Json with picked fields from object
const getInfoData = ({ fields = [], object = {} }) => {
    return lodash.pick(object, fields)
}

// Convert Array ['a','b'] to Object { 'a': 1, 'b': 1 }
const getSelectData = ({ select = [] }) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}
// Convert Array ['a','b'] to Object { 'a': 0, 'b': 0 }
const getUnSelectData = ({ unSelect = [] }) => {
    return Object.fromEntries(unSelect.map(el => [el, 0]))
}

const randomString = () => crypto.randomBytes(16).toString('hex')

const removeUndefinedObject = obj => {
    Object.keys(obj).forEach(k => {
        if (obj[k] == null) {
            delete obj[k]
        }
    })
    return obj
}

// { 'a': 1, 'b': { 'c': 2, 'd': 3 }} -> {'a': 1,'b.c': 2,'b.d': 3}
const updateNestedObjectParser = object => {
    const final = {};

    Object.keys(object || {}).forEach(key => {
        if (typeof object[key] === 'object' && !Array.isArray(object[key])) {
            const response = updateNestedObjectParser(object[key]);

            Object.keys(response || {}).forEach(a => {
                final[`${key}.${a}`] = response[a];
            });
        } else {
            final[key] = object[key];
        }
    });
    return final;
}

function getFieldsNotUndefinedFromObject({ object, fields = [] }) {
    const updateFields = {};
    fields.forEach(field => {
        if (object[field] !== null && object[field] !== undefined) {
            updateFields[field] = object[field];
        }
    });
    return updateFields;
}

module.exports = {
    toObjectIdMongo,
    getInfoData,
    getSelectData,
    getUnSelectData,
    removeUndefinedObject,
    updateNestedObjectParser,
    randomString,
    getFieldsNotUndefinedFromObject
}   
