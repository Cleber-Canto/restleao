const express = require('express')
const jwt = require('jsonwebtoken')
const authHash = require('../config/auth.json')

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader)
        return res.status(401).send({ error: 'No token receveid' })

    const parts = authHeader.split(' ');

    if (!parts.length === 2)
        return res.status(401).send({ error: 'Token error' })

    const [scheme, token] = parts

    if (!/^Bearer$/i.test(scheme))
        return res.status(401).send({ error: 'Token bad formatted' })

    jwt.verify(token, authHash.secret, (err, decoded) => {
        if (err) return res.status(401).send({ error: 'Token invalid' })

        req.userId = decoded.id

        return next()

    })




}