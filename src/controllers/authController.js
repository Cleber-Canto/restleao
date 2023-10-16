const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authHash = require('../config/auth.json')

const router = express.Router()

function generateToken(params = {}) {
    return jwt.sign(params, authHash.secret, {
        expiresIn: 86400,
    })
}

//Cadastro de usuario
router.post('/register', async (req, res) => {
    try {
        const {name, email, password } = req.body
        if (await User.findOne({ email }))
            return res.status(400).send({ error: "User already exists" })

        //trouxe do Schema, era hasheado la
        const hash = await bcrypt.hash(password, 10)
        newPass = hash
        data = {
            name,
            email,
            password : newPass
        }

        console.log('req.body ---------->', req.body)
        console.log('data ---------->', data)

        // const user = await User.create(req.body)
        const user = await User.create(data)

        //apos criar - tratr a pass pra não mostrar no return
        // user.password = undefined //setei direto no Schema
        return res.send({
            user,
            token: generateToken({ id: user.id }),
        })
    } catch (err) {
        return res.status(400).send({ error: 'Registration failed' })
    }
})

router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params
        const user = await User.findById({ _id: userId })
        return res.send({ user })
    } catch (err) {
        return res.status(400).send({ error: 'Search user failed' })
    }
})
router.get('/', async (req, res) => {
    try {        
        const user = await User.find()
        return res.send({ user })
    } catch (err) {
        return res.status(400).send({ error: 'Search user failed' })
    }
})


//Login do user
router.post('/login', async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email }).select('+password')

    if (!user)
        return res.status(400).send({ error: 'user not found' })

    if (!await bcrypt.compare(password, user.password))
        return res.status(400).send({ error: 'Invalid password' })


    //uso de JWT
    // const token = jwt.sign({ id: user.id }, authHash.secret, {
    //     expiresIn: 86400,
    // })

    res.send({
        user,
        token: generateToken({ id: user.id, idStore: user.storeUser }),
    })
})
//Alteracao do user tela do Gerente
router.patch('/:userId', async (req, res) => {
    const { userId } = req.params
    if (!await User.findOne({ _id: userId }))
            return res.status(400).send({ error: "User not exists" })

    try {   
    
    //  const userSel = await User.findByIdAndUpdate({ _id: userId }, { ...req.body, storeUser: req.storeUser })
     const userSel = await User.findByIdAndUpdate({ _id: userId }, { ...req.body })
    //  console.log('req.body----->', req.body)
    //  console.log('userSel----->', userSel)
        if (userSel) {
            await userSel.save()

            const userUp = await User.findOne({ _id: userId })
            return res.send({ userUp })
        }

        return res.status(400).send({ error: 'Update user failed, see mongo' })

    } catch (err) {
        console.log(err)
        return res.status(400).send({ error: 'Update user failed' })
    }        

    // db.users.update({_id  : ObjectId(id)}, {$set: updateObject});

});

module.exports = app => app.use('/auth', router)