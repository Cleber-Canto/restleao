const { Double } = require('mongodb');
const mongoose = require('../database').default


var SchemaTypes = mongoose.Schema.Types;
const StockSchema = new mongoose.Schema({

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
    idStore: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        require: true,
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

StockSchema.pre('save', function (next) {
    now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
});

const Stock = mongoose.model('Stock', StockSchema)

module.exports = Stock;