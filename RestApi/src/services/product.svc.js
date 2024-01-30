'use strict'

const productModel = require('../models/product.model')
const clothingModel = require('../models/product-types/clothing.model')
const electronicModel = require('../models/product-types/electronic.model.')

const { BadRequestError, NotFoundError } = require('../utils/error.response')
const { ProductRepository,
    findAllDrafts,
    publishProduct,
    findAllPublish,
    unPublishProduct,
    searchProduct,
    findAllProducts,
    findProduct,
    updateProductById,
} = require('../models/repositories/product.repo')

const ElectronicRepository = require('../models/repositories/product-types-repo/electronic.model')
const ClothingRepository = require('../models/repositories/product-types-repo/clothing.repo')
const { updateNestedObjectParser, getUnSelectData, getSelectData } = require('../utils')
// const { insertInventory } = require('../../../course/models/repositories/inventory.repo')
// const { pushNotiToSystem } = require('../../../course/services/notification.service')


class ProductService {
    static productRegistry = {} // key-class

    static registerProductType(type, classRef) {
        ProductService.productRegistry[type] = classRef
    }

    static async createProductByShop({ type, payload }) {
        const productClass = ProductService.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid Product Types ${type}`)
        const newProduct = await new productClass(payload).createProduct()
        return newProduct
    }

    static async updateProductByShop({ type, prod_id, payload }) {
        const productClass = ProductService.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid Product Types ${type}`)
        const updateProduct = await new productClass(payload).updateProduct(prod_id)
        return updateProduct
    }

    static async publishProductByShop({ prod_shop, prod_id }) {
        const updateProduct = await ProductRepository.findOneAndUpdate({
            filter: { prod_id, prod_shop },
            update: { prod_is_draft: false, prod_is_published: true },
            options: { new: true }
        })
        return updateProduct;
    }

    static async unPublishProductByShop({ prod_shop, prod_id }) {
        const updateProduct = await ProductRepository.findOneAndUpdate({
            filter: { prod_id, prod_shop },
            update: { prod_is_draft: true, prod_is_published: false },
            options: { new: true }
        })
        return updateProduct;
    }

    static async getAllDraftsByShop({ prod_shop, limit = 50, page = 1 }) {
        const skip = (page - 1) * limit;
        const foundProducts = await ProductRepository.find({
            filter: { prod_shop, prod_is_draft: true },
        }).skip(skip).limit(limit)

        return foundProducts
    }

    static async getAllPublishByShop({ prod_shop, limit = 50, page = 1 }) {
        const skip = (page - 1) * limit;
        const foundProducts = await ProductRepository.find({
            filter: { prod_shop, prod_is_published: true },
        }).limit(limit).skip(skip)

        return foundProducts
    }

    static async searchProductByUser({ keySearch }) {
        const regexSearch = new RegExp(keySearch)

        const results = await ProductRepository.find({
            filter: {
                prod_is_published: true,
                $text: { $search: regexSearch }
            },
        }, { score: { $meta: 'textScore' } })    // score is special feature of $text search
            .sort({ score: { $meta: 'textScore' } })
            .lean()
        return results;
    }

    static async findAllProductsByUser({
        limit = 50, page = 1, sort = 'ctime',
        filter = { prod_is_published: true },
        unSelectField = ['__v']
    }) {
        const skip = (page - 1) * limit;
        const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }

        const products = await ProductRepository.find({
            filter,
            projection: getUnSelectData({ select: unSelectField })
        }).sort(sortBy).skip(skip).limit(limit).lean()

        return products
    }

    static async productDetailByUser({
        prod_id,
        unSelectField = ['__v']
    }) {
        const product = await ProductRepository.findById({
            prod_id,
            projection: getUnSelectData({ unSelect: unSelectField })
        })
        if (!product) throw new NotFoundError('Not found Product')
        return product
    }
}

class Product {
    constructor({
        prod_name, prod_thumb, prod_price, prod_type,
        prod_shop, prod_attributes, prod_quantity
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
    async createProduct() {
        const payload = this
        const newProduct = await ProductRepository.create({ payload })
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
    async updateProduct({ prod_id, payload }) {
        return await ProductRepository.findByIdAndUpdate({
            prod_id, update: payload, options: { new: true }
        })
    }
}

// Define sub-class for different product types Clothes
class ClothingProduct extends Product {
    async createProduct() {
        const newProduct = await super.createProduct()
        if (!newProduct) throw new BadRequestError('create new Product error')

        const payload = {
            ...this.prod_attributes,
            _id: newProduct._id,
            prod_shop: newProduct.prod_shop
        }
        const newClothing = await ClothingRepository.create({ payload })
        if (!newClothing) throw new BadRequestError('create new Clothing Product error')

        return { product: newProduct };
    }

    async updateProduct(prod_id) {
        // this: Product inherit contructor
        const payload = updateNestedObjectParser(this)
        const updateProduct = await super.updateProduct({ prod_id, payload })

        if (this.prod_attributes) {
            const update = updateNestedObjectParser(this.prod_attributes)
            await ProductRepository.findByIdAndUpdate(
                { prod_id, update, options: { new: true } }
            )
        }
        return updateProduct;
    }
}

// Define sub-class for different product types Electronics
class ElectronicProduct extends Product {
    async createProduct() {
        const newProduct = await super.createProduct()
        if (!newProduct) throw new BadRequestError('create new Product error')

        const payload = {
            ...this.prod_attributes,
            _id: newProduct._id,
            prod_shop: newProduct.prod_shop
        }
        const newElectronic = await ElectronicRepository.create({ payload })
        if (!newElectronic) throw new BadRequestError('create new Electronic Product error')

        return { product: newProduct };
    }

    async updateProduct(prod_id) {
        const payload = updateNestedObjectParser(this)
        const updateProduct = await super.updateProduct({ prod_id, payload })

        if (this.prod_attributes) {
            const update = updateNestedObjectParser(this.prod_attributes)
            await ProductRepository.findByIdAndUpdate(
                { prod_id, update, options: { new: true } }
            )
        }
        return updateProduct;
    }
}

// register product types
ProductService.registerProductType('Electronic', ElectronicProduct)
ProductService.registerProductType('Clothing', ClothingProduct)

module.exports = ProductService