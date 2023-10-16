const { Double } = require('mongodb');
const mongoose = require('../database').default


var SchemaTypes = mongoose.Schema.Types;
const PolicyStockSchema = new mongoose.Schema({

    idProduct: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        require: true,
    },
    name: {
        type: String,
        require: true,
    },
    qtd: {
        type:mongoose.Types.Decimal128
    },        
    cliUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    created_at: {
        type: Date
    },
    updated_at: {
        type: Date
    },
})

PolicyStockSchema.pre('save', function (next) {
    now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
});



const PolicyStock = mongoose.model('PolicyStock', PolicyStockSchema)

module.exports = PolicyStock;