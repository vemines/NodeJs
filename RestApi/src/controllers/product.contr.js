'use strict'

const ProductService = require('../services/product.svc')
const { toObjectIdMongo } = require('../utils')
const { SuccessResponse, CreatedResponse } = require('../utils/success.response')
const slugify = require('slugify');

class ProductController {
    handleCreateProductByShop = async (req, res, next) => {
        new CreatedResponse({
            message: 'Create new Product Success',
            metadata: await ProductService.createProductByShop(
                req.body.prod_type,
                {
                    ...req.body,
                    prod_shop: toObjectIdMongo(req.shop_id),
                }
            ),
        }).send(res)
    }

    handleUpdateProductByShop = async (req, res, next) => {

        new SuccessResponse({
            message: 'Update Product Success',
            metadata: await ProductService.updateProductByShop(
                req.body.prod_type, req.params.productId, {
                ...req.body,
                prod_shop: toObjectIdMongo(req.shop_id),
            }),
        }).send(res)
    }

    handlePublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Published Product Success',
            metadata: await ProductService.publishProductByShop({
                prod_id: req.params.productId,
                prod_shop: req.shop_id,
            }),
        }).send(res)
    }

    handleUnPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'UnPublished Product Success',
            metadata: await ProductService.unPublishProductByShop({
                prod_id: req.params.productId,
                prod_shop: req.shop_id,
            }),
        }).send(res)
    }



    handleGetAllDraftsByShop = async (req, res, next) =>
        new SuccessResponse({
            message: 'Get list Draft success!',
            metadata: await ProductService.getAllDraftsByShop({
                prod_shop: req.shop_id,
            })
        }).send(res)

    handleGetAllPublishByShop = async (req, res, next) =>
        new SuccessResponse({
            message: 'Get list Publish success!',
            metadata: await ProductService.getAllPublishByShop({
                prod_shop: req.shop_id,
            })
        }).send(res)

    handleSearchProdctByUser = async (req, res, next) => {
        new SuccessResponse({
            message: 'Search Product Result',
            metadata: await ProductService.searchProductByUser(slugify(req.params.keySearch, { lower: true })),
        }).send(res)
    }

    handleFindAllProductsByUser = async (req, res, next) =>
        new SuccessResponse({
            message: 'Get all Products success!',
            metadata: await ProductService.findAllProductsByUser({})
        }).send(res)

    handleProductDetailByUser = async (req, res, next) =>
        new SuccessResponse({
            message: 'Get Product success!',
            metadata: await ProductService.productDetailByUser({ prod_id: req.params.productId })
        }).send(res)
}

module.exports = new ProductController()