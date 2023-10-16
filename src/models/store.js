const mongoose = require('../database').default

const StoreSchema = new mongoose.Schema({

    name: {
        type: String,
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

StoreSchema.pre('save', function (next) {
    now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
});

const Store = mongoose.model('Store', StoreSchema)

module.exports = Store;