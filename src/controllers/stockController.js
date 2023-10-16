const express = require('express')
const logedMiddleware = require('../middlewares/loged')
const Product = require('../models/product')
const Store = require('../models/store')
const User = require('../models/user')

const { now } = require('mongoose')
const StockInput = require('../models/stockInput')
const Stock = require('../models/stock')
const StockOutput = require('../models/stockOutput')
const PolicyStock = require('../models/policyStock')
const { ConnectionClosedEvent } = require('mongodb')

const router = express.Router()

router.use(logedMiddleware)

router.get('/', async (req, res) => {
    try {
        const userSel = await User.findOne({ _id: req.userId})
        console.log('UserSel--->', userSel)
        // const stock = await Stock.find().populate('cliUser')
        if(!userSel){
            return res.status(400).send({ error: 'List user/store failed' })
        }

        const stockSel = await Stock.find({ idStore: userSel.storeUser})

        return res.send({ stockSel })
    } catch (err) {
        return res.status(400).send({ error: 'List user failed' })
    }
})

// router.get('/:productId', async (req, res) => {
//     try {
//         const { productId } = req.params
//         const product = await Product.findById({ _id: productId })
//         return res.send({ product })
//     } catch (err) {
//         return res.status(400).send({ error: 'Search product failed' })
//     }
// })

router.post('/newStockInput', async (req, res) => {
    try {
        const { idProduct, name, qtd, idStore } = req.body
        if (await Product.findOne({ idProduct }))
            return res.status(400).send({ error: "Product not exists" })
        console.log('Nome Produto--->',req.body)
       
        if (await Store.findOne({ idStore }))
            return res.status(400).send({ error: "Store not exists" })
        const input = await StockInput.create({ ...req.body, cliUser: req.userId, idStore: idStore})

        if(!input){
            return res.status(400).send({ error: "Create move to product failed" })
        }
           
        const prod = await Stock.findOne({ idProduct, idStore})
        console.log('Prod localizado -->', prod)
        if (prod){
            console.log('Stock qtd-->',prod.qtd)
            let idSel = prod._id
            let qtdAtual = Number(prod.qtd) + Number(qtd)
            // const stockSel = await Stock.findByIdAndUpdate({ _id: idSel }, { ...req.body, cliUser: req.userId, idStore: idStore, qtd: qtdAtual })
            const stockSel = await Stock.findByIdAndUpdate({ _id: idSel }, { cliUser: req.userId,  qtd: qtdAtual })
            if (stockSel) {
            await stockSel.save()

            const stockUp = await Stock.findOne({ idProduct, idStore})
            return res.send({ stockUp })
        }          

        }
        const inputStock = await Stock.create({ ...req.body, cliUser: req.userId, idStore: idStore})      
        console.log('Input Novo Produto')
        return res.send({ inputStock })
    } catch (err) {
        return res.status(400).send({ error: 'Create stock failed' })
    }
});

router.post('/newStockOutput', async (req, res) => {
    try {
        const { idProduct, name, qtd, idStore } = req.body
        if (await Product.findOne({ idProduct }))
            return res.status(400).send({ error: "Product not exists" })
        console.log('Nome Produto--->',req.body)
       
        if (await Store.findOne({ idStore }))
            return res.status(400).send({ error: "Store not exists" })
        const input = await StockOutput.create({ ...req.body, cliUser: req.userId, idStore: idStore})

        if(!input){
            return res.status(400).send({ error: "Create move to product failed" })
        }
           
        const prod = await Stock.findOne({ idProduct, idStore})
        console.log('Prod localizado -->', prod)
        if (prod){
            console.log('Stock qtd-->',prod.qtd)
            let idSel = prod._id
            let qtdAtual = Number(prod.qtd) - Number(qtd)
            // const stockSel = await Stock.findByIdAndUpdate({ _id: idSel }, { ...req.body, cliUser: req.userId, idStore: idStore, qtd: qtdAtual })
            const stockSel = await Stock.findByIdAndUpdate({ _id: idSel }, { cliUser: req.userId,  qtd: qtdAtual })
            if (stockSel) {
            await stockSel.save()

            const stockUp = await Stock.findOne({ idProduct, idStore})
            return res.send({ stockUp })
        }          

        }
        const inputStock = await Stock.create({ ...req.body, cliUser: req.userId, idStore: idStore})      
        return res.send({ inputStock })
    } catch (err) {
        return res.status(400).send({ error: 'Create stock failed' })
    }
});

//Policy - Settings
router.post('/policyStock', async (req, res) => {
    try {
        const { idProduct, name, qtd } = req.body
        if (await Product.findOne({ idProduct }))
            return res.status(400).send({ error: "Product not exists" })            
               
        const prod = await PolicyStock.findOne({ idProduct})
        console.log('Prod localizado -->', prod)
        if (prod){            
            let idSel = prod._id
            let qtdAtual = Number(qtd)            
            const policySel = await PolicyStock.findByIdAndUpdate({ _id: idSel }, { cliUser: req.userId,  qtd: qtdAtual })
            if (policySel) {
            await policySel.save()

            const policyUp = await PolicyStock.findOne({ idProduct })
            return res.send({ policyUp })
        }          

        }
        const inputPolicy = await PolicyStock.create({ ...req.body, cliUser: req.userId })      
        return res.send({ inputPolicy })
    } catch (err) {
        return res.status(400).send({ error: 'Create policy stock failed' })
    }
});

router.get('/policyStock', async (req, res) => {
    try {        
        const stockPolicy = await PolicyStock.find()
        if(!stockPolicy){
            return res.status(400).send({ error: 'List policy Stock failed' })
        }      

        return res.send({ stockPolicy })

    } catch (err) {
        return res.status(400).send({ error: 'List policy Stock failed' })
    }
})





// router.post('/newProduct', async (req, res) => {
//     try {
//         const { name } = req.body
//         if (await Product.findOne({ name }))
//             return res.status(400).send({ error: "Product already exists" })

//         const product = await Product.create({ ...req.body, cliUser: req.userId })

//         return res.send({ product })
//     } catch (err) {
//         return res.status(400).send({ error: 'Create product failed' })
//     }
// })

// router.put('/:productId', async (req, res) => {
//     try {
//         const { productId } = req.params
//         console.log('id Prod', productId)
//         const { name } = req.body
//         console.log('Name Prod', name)

//         if (!await Product.findOne({ _id: productId }))
//             return res.status(400).send({ error: "Product not exists" })

//         if (await Product.findOne({ name }))
//             return res.status(400).send({ error: "Product already exists" })

//         const productSel = await Product.findByIdAndUpdate({ _id: productId }, { ...req.body, cliUser: req.userId })
//         if (productSel) {
//             await productSel.save()

//             const productUp = await Product.findOne({ _id: productId })
//             return res.send({ productUp })
//         }

//         return res.status(400).send({ error: 'Update product failed, see mongo' })

//     } catch (err) {
//         return res.status(400).send({ error: 'Update product failed' })
//     }
// })

// router.delete('/:productId', async (req, res) => {
//     try {
//         const { productId } = req.params
//         await Product.findByIdAndRemove({ _id: productId })
//         return res.send()
//     } catch (err) {
//         return res.status(400).send({ error: 'Search product failed' })
//     }
// })

module.exports = app => app.use('/stock', router);