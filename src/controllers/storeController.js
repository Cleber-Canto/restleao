const express = require('express')
const logedMiddleware = require('../middlewares/loged')
const Store = require('../models/store')
const { now } = require('mongoose')

const router = express.Router()


router.use(logedMiddleware)

router.get('/', async (req, res) => {
    try {
        const store = await Store.find().populate('cliUser')
        return res.send({ store })
    } catch (err) {
        return res.status(400).send({ error: 'List store failed' })
    }
})

router.get('/:storeId', async (req, res) => {
    try {
        const { storeId } = req.params
        const store = await Store.findById({ _id: storeId })
        return res.send({ store })
    } catch (err) {
        return res.status(400).send({ error: 'Search store failed' })
    }
})

router.post('/newStore', async (req, res) => {
    try {
        const { name } = req.body
        if (await Store.findOne({ name }))
            return res.status(400).send({ error: "Store already exists" })

        const store = await Store.create({ ...req.body, cliUser: req.userId })

        return res.send({ store })
    } catch (err) {
        return res.status(400).send({ error: 'Create store failed' })
    }
})

router.put('/:storeId', async (req, res) => {
    try {
        const { storeId } = req.params
        console.log('id Store', storeId)
        const { name } = req.body
        console.log('Name Store', name)

        if (!await Store.findOne({ _id: storeId }))
            return res.status(400).send({ error: "Store not exists" })

        if (await Store.findOne({ name }))
            return res.status(400).send({ error: "Store already exists" })

        const storeSel = await Store.findByIdAndUpdate({ _id: storeId }, { ...req.body, cliUser: req.userId })
        if (storeSel) {
            await storeSel.save()

            const storeUp = await Store.findOne({ _id: storeId })
            return res.send({ storeUp })
        }

        return res.status(400).send({ error: 'Update store failed, see mongo' })

    } catch (err) {
        return res.status(400).send({ error: 'Update store failed' })
    }
})

router.delete('/:storeId', async (req, res) => {
    try {
        const { storeId } = req.params
        await Store.findByIdAndRemove({ _id: storeId })
        return res.send()
    } catch (err) {
        return res.status(400).send({ error: 'Search store failed' })
    }
})

module.exports = app => app.use('/store', router)