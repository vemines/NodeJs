'use strict'

const productModel = require('../models/product.model')
const clothingModel = require('../models/product-subclass/clothing.product.model')
const electronicModel = require('../models/product-subclass/electronic.product.model.')

const { BadRequestError } = require('../utils/error.response')
const { findAllDrafts,
    publishProduct,
    findAllPublish,
    unPublishProduct,
    searchProduct,
    findAllProducts,
    findProduct,
    updateProductById,
} = require('../models/repositories/product.repo')
const { updateNestedObjectParser, getUnSelectData } = require('../utils')
// const { insertInventory } = require('../../../course/models/repositories/inventory.repo')
// const { pushNotiToSystem } = require('../../../course/services/notification.service')


class ProductService {
    static productRegistry = {} // key-class

    static registerProductType(type, classRef) {
        ProductService.productRegistry[type] = classRef
    }

    static async createProductByShop(type, payload) {
        const productClass = ProductService.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid Product Types ${type}`)
        return await new productClass(payload).createProduct()
    }

    static async updateProductByShop(type, prod_id, payload) {
        const productClass = ProductService.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid Product Types ${type}`)
        return await new productClass(payload).updateProduct(prod_id)
    }

    static async publishProductByShop({ prod_shop, prod_id }) {
        return await publishProduct(prod_shop, prod_id)
    }

    static async unPublishProductByShop({ prod_shop, prod_id }) {
        return await unPublishProduct(prod_shop, prod_id)
    }

    static async getAllDraftsByShop({ prod_shop, limit = 50, skip = 0 }) {
        const query = { prod_shop, prod_is_draft: true }
        return await findAllDrafts(query, limit, skip)
    }

    static async getAllPublishByShop({ prod_shop, limit = 50, skip = 0 }) {
        const query = { prod_shop, prod_is_published: true }
        return await findAllPublish(query, limit, skip)
    }

    static async searchProductByUser(keySearch) {
        return await searchProduct(keySearch)
    }

    static async findAllProductsByUser({
        limit = 50, sort = 'ctime', page = 1,
        filter = { prod_is_published: true },
        select = ['prod_name', 'prod_price', 'prod_thumb', 'prod_shop', 'prod_slug']
    }) {
        return await findAllProducts(limit, sort, page, filter, select)
    }

    static async productDetailByUser({ prod_id }) {
        return await findProduct({ prod_id, unSelect: getUnSelectData(['__v']) })
    }
}

class Product {
    constructor({
        prod_name,
        prod_thumb,
        prod_price,
        prod_type,
        prod_shop,
        prod_attributes,
        prod_quantity
    }) {
        this.prod_name = prod_name
        this.prod_thumb = prod_thumb
        this.prod_price = prod_price
        this.prod_type = prod_type
        this.prod_shop = prod_shop
        this.prod_attributes = prod_attributes
        this.prod_quantity = prod_quantity
    }
    // create new product
    async createProduct(prod_id) {

        const newProduct = await productModel.create({ ...this, _id: prod_id })
        // if (newProduct) {
        //     // add prod_stock in inventory collection 
        //     await insertInventory({
        //         prod_id: newProduct._id,
        //         shopId: this.prod_shop,
        //         stock: this.prod_quantity,
        //     })
        //     pushNotiToSystem({
        //         type: 'SHOP-001',
        //         receivedId: 1,
        //         senderId: this.prod_shop,
        //         noti_content: '@@@@ Product Created By Shop @@@@',
        //         options: {
        //             prod_name: this.prod_name,
        //             shop_name: this.prod_shop
        //         }
        //     })
        //         .then(res => console.log(res))
        //         .catch(err => console.error(err))
        // }

        return newProduct
    }


    // update Product
    async updateProduct(prod_id, bodyUpdate) {
        return await updateProductById({ prod_id, bodyUpdate, model: productModel })
    }
}

// Define sub-class for different product types Clothes
class ClothingProduct extends Product {
    async createProduct() {
        const newProduct = await super.createProduct()
        if (!newProduct) throw new BadRequestError('create new Product error')

        const newClothing = await clothingModel.create({
            ...this.prod_attributes,
            _id: newProduct._id,
            prod_shop: newProduct.prod_shop
        })
        if (!newClothing) throw new BadRequestError('create new Clothing error')

        return {
            newProduct,
            newClothing
        };
    }

    async updateProduct(prod_id) {
        const objectParams = this
        const updateProduct = await super.updateProduct(prod_id, updateNestedObjectParser(objectParams))

        if (objectParams.prod_attributes) {
            const updatedClothing = await updateProductById({
                prod_id,
                bodyUpdate: updateNestedObjectParser(objectParams.prod_attributes),
                model: clothingModel,
            })
        }

        return updateProduct;
    }
}

// Define sub-class for different product types Electronics
class ElectronicProduct extends Product {
    async createProduct() {
        const newProduct = await super.createProduct()
        if (!newProduct) throw new BadRequestError('create new Product error')

        const newElectronic = await electronicModel.create({
            ...this.prod_attributes,
            _id: newProduct._id,
            prod_shop: newProduct.prod_shop
        })
        if (!newElectronic) throw new BadRequestError('create new Electronic error')

        return newProduct;
    }

    async updateProduct(prod_id) {
        const objectParams = this
        if (objectParams.prod_attributes) {
            await updateProductById({
                prod_id,
                bodyUpdate: updateNestedObjectParser(objectParams),
                model: electronicModel
            })
        }
        const updateProduct = await super.updateProduct(prod_id, updateNestedObjectParser(objectParams))

        return updateProduct
    }
}

// register product types
ProductService.registerProductType('Electronic', ElectronicProduct)
ProductService.registerProductType('Clothing', ClothingProduct)

module.exports = ProductService