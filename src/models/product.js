const { Double } = require('mongodb');
const mongoose = require('../database').default

const ProductSchema = new mongoose.Schema({

    name: {
        type: String,
        require: true,
    },
    barCode: {
        type: String,
    },       
    cliUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    // createdAt: {
    //     type: Date,
    //     dafault: Date.now,
    // },
    created_at: {
        type: Date
    },
    updated_at: {
        type: Date
    },
})

ProductSchema.pre('save', function (next) {
    now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
});

const Product = mongoose.model('Product', ProductSchema)

module.exports = Product;