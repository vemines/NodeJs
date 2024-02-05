'use strict'

const ProductService = require('../services/product.svc')
const { toObjectIdMongo } = require('../utils')
const { SuccessResponse, CreatedResponse } = require('../utils/success.response')
const slugify = require('slugify');

class ProductController {
    static handleCreateProductByShop = async (req, res, next) => {
        new CreatedResponse({
            message: 'Create new Product Success',
            metadata: await ProductService.createProductByShop({
                type: req.body.prod_type,
                payload: {
                    ...req.body,
                    prod_shop: toObjectIdMongo(req.shop_id),
                }
            }),
        }).send(res)
    }

    static handleUpdateProductByShop = async (req, res, next) => {
        new SuccessResponse({
            context: req.baseUrl + req.url,
            message: 'Update Product Success',
            metadata: await ProductService.updateProductByShop({
                type: req.body.prod_type,
                prod_id: req.params.productId,
                payload: {
                    ...req.body,
                    prod_shop: toObjectIdMongo(req.shop_id),
                }
            }),
        }).send(res)
    }

    static handlePublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            context: req.baseUrl + req.url,
            message: 'Published Product Success',
            metadata: await ProductService.publishProductByShop({
                prod_id: req.params.productId,
                prod_shop: req.shop_id,
            }),
        }).send(res)
    }

    static handleUnPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            context: req.baseUrl + req.url,
            message: 'UnPublished Product Success',
            metadata: await ProductService.unPublishProductByShop({
                prod_id: req.params.productId,
                prod_shop: req.shop_id,
            }),
        }).send(res)
    }

    static handleGetAllDraftsByShop = async (req, res, next) => {
        new SuccessResponse({
            context: req.baseUrl + req.url,
            message: 'Get list Draft success!',
            metadata: await ProductService.getAllDraftsByShop({
                prod_shop: req.shop_id,
            })
        }).send(res)
    }

    static handleGetAllPublishByShop = async (req, res, next) => {
        new SuccessResponse({
            context: req.baseUrl + req.url,
            message: 'Get list Publish success!',
            metadata: await ProductService.getAllPublishByShop({
                prod_shop: req.shop_id,
            })
        }).send(res)
    }

    static handleSearchProdctByUser = async (req, res, next) => {
        new SuccessResponse({
            context: req.baseUrl + req.url,
            message: 'Search Product Result',
            metadata: await ProductService.searchProductByUser({
                keySearch: slugify(req.params.keySearch, { lower: true })
            }),
        }).send(res)
    }

    static handleFindAllProductsByUser = async (req, res, next) => {
        new SuccessResponse({
            context: req.baseUrl + req.url,
            message: 'Get all Products success!',
            metadata: await ProductService.findAllProductsByUser({
                limit: 50, page: 1, sort: 'ctime',
                unSelectField: ['__v']
            })
        }).send(res)
    }

    static handleProductDetailByUser = async (req, res, next) => {
        new SuccessResponse({
            context: req.baseUrl + req.url,
            message: 'Get Product success!',
            metadata: await ProductService.productDetailByUser({
                prod_id: req.params.productId
            })
        }).send(res)
    }
}

module.exports = ProductController