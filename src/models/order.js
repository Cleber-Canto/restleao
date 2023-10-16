const { Double } = require('mongodb');
const mongoose = require('../database')


var SchemaTypes = mongoose.Schema.Types;
const OrderSchema = new mongoose.Schema({

    idProduct: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        require: true,
    },
    nameproduct: {
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
     idStore: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        require: false,
    },
    nameStore: {
        type: String,
        require: true,
    },
    status: {
        type: String,
        require: true,
    },
    created_at: {
        type: Date
    },
    updated_at: {
        type: Date
    },
    // status: {
    //     type: String,
    //     require: true,
    // },
})

OrderSchema.pre('save', function (next) {
    now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
});



const Order = mongoose.model('Order', OrderSchema)

module.exports = Order;