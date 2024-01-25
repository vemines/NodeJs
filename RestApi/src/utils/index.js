'use strict'

const lodash = require('lodash')
const crypto = require('crypto')

// use pick field in json to small json with picked fields
const getInfoData = ({ fileds = [], object = {} }) => {
    return lodash.pick(object, fileds)
}

// convert Array ['a','b'] to Object { 'a': 1, 'b': 1 }
const getSelectData = ({ select = [] }) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}
// convert Array ['a','b'] to Object { 'a': 0, 'b': 0 }
const getUnSelectData = ({ select = [] }) => {
    return Object.fromEntries(select.map(el => [el, 0]))
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

module.exports = {
    getInfoData,
    getSelectData,
    getUnSelectData,
    removeUndefinedObject,
    updateNestedObjectParser,
    randomString,
}   
