const express = require('express')
const logedMiddleware = require('../middlewares/loged')
const Order = require('../models/order')


const router = express.Router()

router.use(logedMiddleware)
router.get('/order', async (req, res) => {
    try {
        const order = await Order.find()
        return res.send({ order })
    } catch (err) {
        return res.status(400).send({ error: 'List order failed' })
    }
})

router.post('/order', async (req, res) => {
    try {
        const { name } = req.body        
        const order = await Order.create(req.body)

        return res.send({ order })
    } catch (err) {
        return res.status(400).send({ error: 'Create pedido failed' })
    }
})

module.exports = app => app.use('/order', router);