const express = require('express')
const logedMiddleware = require('../middlewares/loged')
const Product = require('../models/product')
const { now } = require('mongoose')

const router = express.Router()

router.use(logedMiddleware)

router.get('/', async (req, res) => {
    try {
        const product = await Product.find().populate('cliUser')
        return res.send({ product })
    } catch (err) {
        return res.status(400).send({ error: 'List product failed' })
    }
})

router.get('/:productId', async (req, res) => {
    try {
        const { productId } = req.params
        const product = await Product.findById({ _id: productId })
        return res.send({ product })
    } catch (err) {
        return res.status(400).send({ error: 'Search product failed' })
    }
})

router.post('/newProduct', async (req, res) => {
    try {
        const { name } = req.body
        if (await Product.findOne({ name }))
            return res.status(400).send({ error: "Product already exists" })

        const product = await Product.create({ ...req.body, cliUser: req.userId })

        return res.send({ product })
    } catch (err) {
        return res.status(400).send({ error: 'Create product failed' })
    }
})

router.put('/:productId', async (req, res) => {
    try {
        const { productId } = req.params
        console.log('id Prod', productId)
        const { name } = req.body
        console.log('Name Prod', name)

        if (!await Product.findOne({ _id: productId }))
            return res.status(400).send({ error: "Product not exists" })

        if (await Product.findOne({ name }))
            return res.status(400).send({ error: "Product already exists" })

        const productSel = await Product.findByIdAndUpdate({ _id: productId }, { ...req.body, cliUser: req.userId })
        if (productSel) {
            await productSel.save()

            const productUp = await Product.findOne({ _id: productId })
            return res.send({ productUp })
        }

        return res.status(400).send({ error: 'Update product failed, see mongo' })

    } catch (err) {
        return res.status(400).send({ error: 'Update product failed' })
    }
})

router.delete('/:productId', async (req, res) => {
    try {
        const { productId } = req.params
        await Product.findByIdAndRemove({ _id: productId })
        return res.send()
    } catch (err) {
        return res.status(400).send({ error: 'Search product failed' })
    }
})

module.exports = app => app.use('/product', router)