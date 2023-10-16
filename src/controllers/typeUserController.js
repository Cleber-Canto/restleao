const express = require('express')
const logedMiddleware = require('../middlewares/loged')
const TypeUser = require('../models/typeUser')
const { now } = require('mongoose')

const router = express.Router()


router.use(logedMiddleware)

router.get('/', async (req, res) => {
    try {
        const tuser = await TypeUser.find()
        return res.send({ tuser })
    } catch (err) {
        return res.status(400).send({ error: 'List type user failed' })
    }
})

// router.get('/:storeId', async (req, res) => {
//     try {
//         const { storeId } = req.params
//         const store = await Store.findById({ _id: storeId })
//         return res.send({ store })
//     } catch (err) {
//         return res.status(400).send({ error: 'Search store failed' })
//     }
// })

router.post('/newTypeUser', async (req, res) => {
    try {
        const { name } = req.body
        if (await TypeUser.findOne({ name }))
            return res.status(400).send({ error: "Type user already exists" })

        const tuser = await TypeUser.create({ ...req.body, cliUser: req.userId })

        return res.send({ tuser })
    } catch (err) {
        return res.status(400).send({ error: 'Create type user failed' })
    }
})

// router.put('/:storeId', async (req, res) => {
//     try {
//         const { storeId } = req.params
//         console.log('id Store', storeId)
//         const { name } = req.body
//         console.log('Name Store', name)

//         if (!await Store.findOne({ _id: storeId }))
//             return res.status(400).send({ error: "Store not exists" })

//         if (await Store.findOne({ name }))
//             return res.status(400).send({ error: "Store already exists" })

//         const storeSel = await Store.findByIdAndUpdate({ _id: storeId }, { ...req.body, cliUser: req.userId })
//         if (storeSel) {
//             await storeSel.save()

//             const storeUp = await Store.findOne({ _id: storeId })
//             return res.send({ storeUp })
//         }

//         return res.status(400).send({ error: 'Update store failed, see mongo' })

//     } catch (err) {
//         return res.status(400).send({ error: 'Update store failed' })
//     }
// })

// router.delete('/:storeId', async (req, res) => {
//     try {
//         const { storeId } = req.params
//         await Store.findByIdAndRemove({ _id: storeId })
//         return res.send()
//     } catch (err) {
//         return res.status(400).send({ error: 'Search store failed' })
//     }
// })

module.exports = app => app.use('/typeuser', router)